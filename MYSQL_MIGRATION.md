# MySQL Database Migration Guide

## 🚀 **Step 1: Create MySQL Database on Digital Ocean**

1. **Login to Digital Ocean Console**
   - Go to https://cloud.digitalocean.com/databases

2. **Create New Database**
   - Click "Create Database"
   - Choose **MySQL** (version 8.0+ recommended)
   - Select your preferred region (same as your app)
   - Choose plan (Basic $15/month is fine to start)
   - Name it: `izonedevs-mysql`

3. **Get Connection Details**
   - After creation, go to database settings
   - Copy the connection string (format: `mysql://username:password@hostname:port/database`)

## 🔧 **Step 2: Update Your Digital Ocean App**

1. **Add Environment Variable**
   - Go to your App settings in Digital Ocean
   - Add new environment variable:
     - **Name**: `DATABASE_URL`
     - **Value**: Your MySQL connection string (from step 1)
   - Example: `mysql+pymysql://doadmin:password123@db-mysql-nyc1-12345.ondigitalocean.com:25060/defaultdb?ssl_mode=REQUIRE`

2. **Important**: Make sure the connection string starts with `mysql+pymysql://` (not just `mysql://`)

## 📝 **Step 3: Deploy Updated Code**

The code changes are already ready in your repository:
- ✅ Added MySQL driver (`pymysql`)
- ✅ Updated configuration to use `DATABASE_URL`
- ✅ Created migration script

Just redeploy your app and it will automatically:
1. Use the new MySQL database
2. Create all tables
3. Populate with seed data

## 🔍 **Step 4: Verify Migration**

After deployment, check your app logs to confirm:
- Tables created successfully
- Seed data populated
- Blog posts, users, and other data are accessible

## 🆘 **If You Need to Migrate Existing Data**

If you have important data in your old SQLite database, you can run the migration script locally:

```bash
# Set your MySQL connection string
export DATABASE_URL="mysql+pymysql://your-connection-string"

# Run migration (if you have existing SQLite data)
python migrate_to_mysql.py

# OR create fresh data
python migrate_to_mysql.py --fresh
```

## ✅ **Benefits of MySQL**

- ✅ **Persistent data** - survives app restarts and deployments
- ✅ **Better performance** for production workloads
- ✅ **Automated backups** - Digital Ocean handles this
- ✅ **Scalability** - can handle more concurrent users
- ✅ **Reliability** - managed service with high availability

## 🔧 **Connection String Format**

```
mysql+pymysql://username:password@hostname:port/database_name?ssl_mode=REQUIRE
```

- Replace `username`, `password`, `hostname`, `port` with your values from Digital Ocean
- Keep `?ssl_mode=REQUIRE` for secure connections

## 📋 **Next Steps**

1. Create the MySQL database on Digital Ocean
2. Copy the connection string
3. Add `DATABASE_URL` environment variable to your app
4. Redeploy the app
5. Test that everything works correctly

Your data loss problem will be solved permanently! 🎉