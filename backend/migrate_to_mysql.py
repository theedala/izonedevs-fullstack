"""
Migration script to move from SQLite to MySQL
Run this after setting up your MySQL database on Digital Ocean
"""

import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# Import our models and seed data
from database import Base, User, Community, Project, Event, BlogPost, Product, GalleryItem
from seed_data import main as seed_main
from config import Settings

def migrate_to_mysql():
    """Migrate data from SQLite to MySQL"""
    
    # Get database URLs
    sqlite_url = "sqlite:///./izonedevs.db"
    mysql_url = os.getenv("DATABASE_URL")
    
    if not mysql_url:
        print("❌ Error: DATABASE_URL environment variable not set")
        print("Please set it to your MySQL connection string like:")
        print("mysql+pymysql://username:password@hostname:port/database_name")
        return False
    
    print(f"🔄 Migrating from SQLite to MySQL...")
    print(f"   Source: {sqlite_url}")
    print(f"   Target: {mysql_url}")
    
    try:
        # Create engines
        sqlite_engine = create_engine(sqlite_url)
        mysql_engine = create_engine(mysql_url)
        
        # Create sessions
        SqliteSession = sessionmaker(bind=sqlite_engine)
        MysqlSession = sessionmaker(bind=mysql_engine)
        
        sqlite_session = SqliteSession()
        mysql_session = MysqlSession()
        
        # Create all tables in MySQL
        print("📋 Creating MySQL tables...")
        Base.metadata.create_all(mysql_engine)
        
        # Check if SQLite database exists and has data
        try:
            sqlite_users = sqlite_session.query(User).count()
            print(f"📊 Found {sqlite_users} users in SQLite database")
            
            if sqlite_users == 0:
                print("ℹ️ No data in SQLite database, will create fresh seed data in MySQL")
                sqlite_session.close()
                mysql_session.close()
                
                # Set the config to use MySQL
                os.environ["DATABASE_URL"] = mysql_url
                
                # Run seed data creation directly on MySQL
                print("🌱 Creating fresh seed data in MySQL...")
                seed_main()
                return True
                
        except Exception as e:
            print(f"ℹ️ SQLite database not accessible: {e}")
            print("🌱 Creating fresh seed data in MySQL...")
            sqlite_session.close()
            mysql_session.close()
            
            # Set the config to use MySQL and run seed
            os.environ["DATABASE_URL"] = mysql_url
            seed_main()
            return True
        
        # Migrate data from SQLite to MySQL
        tables_to_migrate = [
            (User, "users"),
            (Community, "communities"), 
            (Project, "projects"),
            (Event, "events"),
            (BlogPost, "blog_posts"),
            (Product, "products"),
            (GalleryItem, "gallery_items")
        ]
        
        for model_class, table_name in tables_to_migrate:
            print(f"🔄 Migrating {table_name}...")
            
            # Get all records from SQLite
            sqlite_records = sqlite_session.query(model_class).all()
            
            if sqlite_records:
                # Clear existing records in MySQL (in case of re-run)
                mysql_session.query(model_class).delete()
                
                # Insert records into MySQL
                for record in sqlite_records:
                    # Create new instance without the id to let MySQL auto-increment
                    record_dict = {}
                    for column in model_class.__table__.columns:
                        if column.name != 'id':  # Skip ID to let MySQL auto-increment
                            value = getattr(record, column.name)
                            record_dict[column.name] = value
                    
                    new_record = model_class(**record_dict)
                    mysql_session.add(new_record)
                
                mysql_session.commit()
                print(f"✅ Migrated {len(sqlite_records)} records from {table_name}")
            else:
                print(f"ℹ️ No records found in {table_name}")
        
        sqlite_session.close()
        mysql_session.close()
        
        print("🎉 Migration completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False

def setup_mysql_fresh():
    """Set up fresh MySQL database with seed data"""
    mysql_url = os.getenv("DATABASE_URL")
    
    if not mysql_url:
        print("❌ Error: DATABASE_URL environment variable not set")
        return False
    
    try:
        print("🔄 Setting up fresh MySQL database...")
        
        # Create engine and tables
        engine = create_engine(mysql_url)
        Base.metadata.create_all(engine)
        
        print("📋 MySQL tables created successfully")
        
        # Update settings to use MySQL
        from config import settings
        settings.database_url = mysql_url
        
        # Run seed data
        print("🌱 Creating seed data...")
        seed_main()
        
        print("🎉 MySQL database setup completed!")
        return True
        
    except Exception as e:
        print(f"❌ Setup failed: {e}")
        return False

if __name__ == "__main__":
    print("🗄️ MySQL Migration Tool")
    print("=" * 50)
    
    if len(sys.argv) > 1 and sys.argv[1] == "--fresh":
        # Fresh setup mode
        success = setup_mysql_fresh()
    else:
        # Migration mode
        success = migrate_to_mysql()
    
    if success:
        print("\n✅ Database ready!")
        print("Don't forget to:")
        print("1. Set DATABASE_URL environment variable in Digital Ocean")
        print("2. Update your app to use the new database")
        print("3. Test your application")
    else:
        print("\n❌ Migration failed. Please check the errors above.")
        sys.exit(1)