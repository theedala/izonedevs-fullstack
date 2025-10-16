import qrcode
import json
import os
from io import BytesIO
import base64
from typing import Dict, Any
from datetime import datetime

class QRCodeService:
    @staticmethod
    def generate_qr_code(registration_data: Dict[str, Any], file_path: str = None) -> str:
        """
        Generate a QR code for event registration with encoded data
        
        Args:
            registration_data: Dictionary containing registration information
            file_path: Optional file path to save QR code. If None, returns base64 string
            
        Returns:
            File path if saved to file, or base64 encoded string if no file path
        """
        # Create QR code data structure
        qr_data = {
            "registration_id": registration_data.get("id"),
            "event_id": registration_data.get("event_id"),
            "event_title": registration_data.get("event_title", ""),
            "attendee_name": registration_data.get("name"),
            "attendee_email": registration_data.get("email"),
            "registration_date": registration_data.get("created_at", datetime.now().isoformat()),
            "status": registration_data.get("registration_status", "confirmed"),
            "organization": "iZonehub Makerspace",
            "verification_url": f"https://izonedevs.co.zw/events/verify/{registration_data.get('id')}"
        }
        
        # Convert to JSON string
        qr_content = json.dumps(qr_data, indent=2)
        
        # Create QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(qr_content)
        qr.make(fit=True)
        
        # Create image
        img = qr.make_image(fill_color="black", back_color="white")
        
        if file_path:
            # Save to file
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            img.save(file_path)
            return file_path
        else:
            # Return base64 encoded string
            buffer = BytesIO()
            img.save(buffer, format='PNG')
            buffer.seek(0)
            img_base64 = base64.b64encode(buffer.read()).decode()
            return img_base64
    
    @staticmethod
    def get_qr_file_path(registration_id: int, event_id: int) -> str:
        """Generate a standardized file path for QR codes"""
        qr_dir = "static/qr_codes"
        os.makedirs(qr_dir, exist_ok=True)
        return f"{qr_dir}/event_{event_id}_registration_{registration_id}.png"
    
    @staticmethod
    def verify_qr_data(qr_data_string: str) -> Dict[str, Any]:
        """
        Verify and decode QR code data
        
        Args:
            qr_data_string: JSON string from QR code
            
        Returns:
            Decoded registration data
        """
        try:
            return json.loads(qr_data_string)
        except json.JSONDecodeError:
            raise ValueError("Invalid QR code data format")