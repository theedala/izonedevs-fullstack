# 🚀 Digital Ocean Deployment Guide

## Step-by-Step Deployment

### 1. Prerequisites ✅
- [x] Digital Ocean account created
- [x] GitHub repository ready
- [x] Deployment files created

### 2. Push Your Code to GitHub

```powershell
# Make sure you're in the project root
cd C:\Users\netwk\Downloads\izonedevs

# Add all deployment files
git add .

# Commit the changes
git commit -m "Prepare for Digital Ocean deployment"

# Push to GitHub
git push origin main
```

### 3. Create App on Digital Ocean

1. **Go to Digital Ocean Dashboard**
   - Visit: https://cloud.digitalocean.com/apps

2. **Click "Create App"**

3. **Connect GitHub**
   - Select "GitHub"
   - Authorize Digital Ocean
   - Choose repository: `takudzwachitsungo/izone-platform-backend`
   - Branch: `main`

4. **Configure Resources**
   
   **Backend Component:**
   - Name: `backend`
   - Type: Web Service
   - Source Directory: `/backend`
   - Build Command: (leave empty)
   - Run Command: `uvicorn main:app --host 0.0.0.0 --port 8080`
   - HTTP Port: `8080`
   - Instance Size: Basic ($5/month)
   
   **Frontend Component:**
   - Name: `frontend`
   - Type: Static Site
   - Source Directory: `/`
   - Build Command: `npm install && npm run build`
   - Output Directory: `dist`

5. **Environment Variables (Backend)**
   
   Click "Edit" on backend component → Environment Variables:
   
   ```
   SECRET_KEY=your-super-secret-key-change-this-to-something-random
   DATABASE_URL=sqlite:///./izonedevs.db
   DEBUG=false
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=izonemakers@gmail.com
   SMTP_PASSWORD=kmub uxpm bhsw qnkd
   ```

6. **Environment Variables (Frontend)**
   
   Click "Edit" on frontend component → Environment Variables:
   
   ```
   VITE_API_URL=${backend.PUBLIC_URL}/api
   ```

7. **Review & Deploy**
   - Review your app configuration
   - Click "Create Resources"
   - Wait for deployment (5-10 minutes)

### 4. Post-Deployment

Once deployed, you'll get URLs like:
- **Frontend**: `https://your-app.ondigitalocean.app`
- **Backend**: `https://backend-xxxx.ondigitalocean.app`

### 5. Test Your Application

Test these endpoints:
- **Homepage**: `https://your-app.ondigitalocean.app/`
- **API Docs**: `https://backend-xxxx.ondigitalocean.app/docs`
- **Events**: `https://your-app.ondigitalocean.app/events`
- **Admin**: `https://your-app.ondigitalocean.app/admin`

### 6. Custom Domain (Optional)

1. Go to App Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

## 💰 Cost Breakdown

- Backend: $5/month (Basic)
- Frontend: $0 (Static)
- Total: **$5/month**

## 🔧 Troubleshooting

### If deployment fails:

1. **Check build logs** in Digital Ocean console
2. **Verify requirements.txt** has all dependencies
3. **Check environment variables** are set correctly
4. **Review Python version** in runtime.txt

### Common Issues:

**Database not found:**
- SQLite file will be created automatically on first run

**CORS errors:**
- Make sure VITE_API_URL points to backend URL

**Module not found:**
- Check all dependencies in requirements.txt

## 📝 Important Notes

- **Automatic Deployments**: Every push to `main` triggers deployment
- **Logs**: View real-time logs in DO console
- **Scaling**: Easy to upgrade instance size later
- **Backups**: SQLite file persists but consider setting up backups

## 🎯 Quick Checklist

- [ ] Code pushed to GitHub
- [ ] App created on Digital Ocean
- [ ] Backend component configured
- [ ] Frontend component configured
- [ ] Environment variables set
- [ ] App deployed successfully
- [ ] Tested all major features
- [ ] Custom domain added (optional)

## 🆘 Need Help?

- Digital Ocean Docs: https://docs.digitalocean.com/products/app-platform/
- Support: https://cloud.digitalocean.com/support

---

**Your app is ready to deploy! Follow the steps above and you'll be live in minutes! 🚀**