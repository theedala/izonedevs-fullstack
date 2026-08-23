#!/usr/bin/env python3
"""One-way daily export from the iZonehub SQLite database to Google Sheets."""

import json
import os
import sqlite3
import subprocess
import sys
import uuid
from datetime import datetime, timezone
from pathlib import Path

SPREADSHEET_ID = os.environ.get('IZONEHUB_SHEETS_ID', '15URqD2d7Qgs86F6cg3xElKj9_Buz2s0DFyNvW8rPEXc')
DB_PATH = Path(os.environ.get('IZONEHUB_DB_PATH', '/home/ubuntu/izonedevs-fullstack/backend/izonedevs.db'))


def gws(service_args, payload=None):
    command = ['gws', *service_args]
    if payload is not None:
        command.extend(['--json', json.dumps(payload, ensure_ascii=False)])
    result = subprocess.run(command, text=True, capture_output=True)
    if result.returncode:
        raise RuntimeError(result.stderr.strip() or result.stdout.strip() or 'Google Workspace command failed')
    return json.loads(result.stdout) if result.stdout.strip() else {}


def fetch_rows(conn, table, columns):
    query = f'SELECT {", ".join(columns)} FROM "{table}" ORDER BY id'
    return [list(row) for row in conn.execute(query).fetchall()]


def cell(value):
    if value is None or isinstance(value, (bytes, bytearray)):
        return ''
    return str(value)


def text_rows(values):
    return [[cell(value) for value in row] for row in values]


def main():
    started = datetime.now(timezone.utc).isoformat()
    run_id = str(uuid.uuid4())
    conn = sqlite3.connect(DB_PATH)
    try:
        exports = {
            'Events': text_rows(fetch_rows(conn, 'events', ['id', 'title', 'start_date', 'end_date', 'location', 'is_online', 'status', 'featured', 'created_at'])),
            'Registrations': [row + [''] for row in text_rows(fetch_rows(conn, 'event_registrations', ['id', 'event_id', 'name', 'email', 'phone', 'organization', 'experience_level', 'registration_status', 'created_at']))],
            'Contact Requests': text_rows(fetch_rows(conn, 'contact_messages', ['id', 'name', 'email', 'phone', 'company', 'subject', 'priority', 'status', 'message', 'created_at'])),
            'Projects': text_rows(fetch_rows(conn, 'projects', ['id', 'title', 'category', 'status', 'featured', 'creator_id', 'created_at', 'updated_at'])),
            'Blog Posts': text_rows(fetch_rows(conn, 'blog_posts', ['id', 'title', 'slug', 'author', 'status', 'featured', 'created_at', 'updated_at'])),
            'Gallery': [row + [''] for row in text_rows(fetch_rows(conn, 'gallery_items', ['id', 'title', 'category', 'featured', 'image_url', 'created_at']))],
            'Products': text_rows(fetch_rows(conn, 'products', ['id', 'name', 'category', 'price', 'stock_quantity', 'is_available', 'featured', 'created_at'])),
            'Communities': text_rows(fetch_rows(conn, 'communities', ['id', 'name', 'category', 'member_count', 'is_active', 'created_at'])),
            'Partners': text_rows(fetch_rows(conn, 'partners', ['id', 'name', 'category', 'is_active', 'featured', 'created_at'])),
            'Team': text_rows(fetch_rows(conn, 'team_members', ['id', 'name', 'role', 'email', 'is_active', 'order_priority', 'created_at'])),
            # Deliberately exclude hashed_password, skills, and profile text from this operational export.
            'Users (Redacted)': text_rows(fetch_rows(conn, 'users', ['id', 'email', 'username', 'full_name', 'role', 'is_active', 'is_verified', 'created_at', 'updated_at'])),
        }
    finally:
        conn.close()

    widths = {
        'Events': 'I', 'Registrations': 'J', 'Contact Requests': 'J', 'Projects': 'H',
        'Blog Posts': 'H', 'Gallery': 'G', 'Products': 'H', 'Communities': 'F',
        'Partners': 'F', 'Team': 'G', 'Users (Redacted)': 'I',
    }
    clear_ranges = [f"'{name}'!A2:Z" for name in exports]
    gws(['sheets', 'spreadsheets', 'values', 'batchClear', '--params', json.dumps({'spreadsheetId': SPREADSHEET_ID})], {'ranges': clear_ranges})

    value_data = []
    for name, records in exports.items():
        width = widths[name]
        end_row = max(2, len(records) + 1)
        values = records or [[''] * (ord(width) - ord('A') + 1)]
        value_data.append({'range': f"'{name}'!A2:{width}{end_row}", 'majorDimension': 'ROWS', 'values': values})

    total_rows = sum(len(records) for records in exports.values())
    completed = datetime.now(timezone.utc).isoformat()
    value_data.append({'range': "'Export Log'!A2:F2", 'majorDimension': 'ROWS', 'values': [[run_id, started, completed, 'completed', total_rows, '']]})
    gws(['sheets', 'spreadsheets', 'values', 'batchUpdate', '--params', json.dumps({'spreadsheetId': SPREADSHEET_ID})], {'valueInputOption': 'RAW', 'data': value_data})
    print(json.dumps({'status': 'completed', 'run_id': run_id, 'rows_exported': total_rows, 'spreadsheet_id': SPREADSHEET_ID}))


if __name__ == '__main__':
    try:
        main()
    except Exception as exc:
        print(json.dumps({'status': 'failed', 'error': str(exc)}), file=sys.stderr)
        raise
