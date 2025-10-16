# 🚀 Digital Ocean Deployment Guide

## Step-by-Step Instructions

### 1. Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `izonedevs-fullstack`
3. Make it **Public** (or Private with DO access)
4. **Don't** initialize with README (we already have files)
5. Click "Create repository"

### 2. Push Code to GitHub

```powershell
cd C:\Users\netwk\Downloads\izonedevs-fullstack

# Initialize git (already done)
git add .
git commit -m "Initial commit - Full stack deployment ready"

# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/izonedevs-fullstack.git

# Push to GitHub
git push -u origin main
```

### 3. Deploy on Digital Ocean

1. **Go to Digital Ocean Apps**
   - Visit: https://cloud.digitalocean.com/apps

2. **Create New App**
   - Click "Create App"
   - Select "GitHub"
   - Authorize Digital Ocean (if first time)

3. **Select Repository**
   - Choose: `YOUR_USERNAME/izonedevs-fullstack`
   - Branch: `main`
   - Click "Next"

4. **Configure Resources**

   Digital Ocean should auto-detect both components from `.do/app.yaml`:

   **Backend Component:**
   - Name: `backend`
   - Type: Web Service
   - Build Command: `pip install -r requirements.txt`
   - Run Command: `uvicorn main:app --host 0.0.0.0 --port 8080`
   - HTTP Port: `8080`
   - Route: `/api`
   - Instance Size: **Basic ($5/month)**

   **Frontend Component:**
   - Name: `frontend`  
   - Type: Static Site
   - Build Command: `npm install && npm run build`
   - Output Directory: `dist`
   - Route: `/`
   - Instance Size: **Free**

5. **Set Environment Variables**

   Click on **backend** component → Environment Variables:

   ```
   SECRET_KEY=YOUR_SUPER_SECRET_KEY_CHANGE_THIS_TO_RANDOM_STRING
   DATABASE_URL=sqlite:///./izonedevs.db
   DEBUG=false
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=izonemakers@gmail.com
   SMTP_PASSWORD=kmub uxpm bhsw qnkd
   ```

   Click on **frontend** component → Environment Variables:

   ```
   VITE_API_URL=${APP_URL}/api
   ```

6. **Review and Launch**
   - Review all settings
   - Click "Create Resources"
   - Wait 5-10 minutes for deployment

### 4. Access Your App

Once deployed, you'll get a URL like:
```
https://izonedevs-xxxx.ondigitalocean.app
```

Test these endpoints:
- **Homepage**: https://izonedevs-xxxx.ondigitalocean.app/
- **About**: https://izonedevs-xxxx.ondigitalocean.app/about
- **Events**: https://izonedevs-xxxx.ondigitalocean.app/events
- **Admin**: https://izonedevs-xxxx.ondigitalocean.app/admin
- **API Docs**: https://izonedevs-xxxx.ondigitalocean.app/api/docs

### 5. Test Everything

Login to admin panel:
- Email: `admin@izonedevs.com`
- Password: `admin123` (you should have this user in your database)

## 💰 Pricing

- Backend: **$5/month** (Basic instance)
- Frontend: **$0** (Static site - FREE!)
- **Total: $5/month**

## 🔄 Automatic Deployments

Every time you push to the `main` branch, Digital Ocean will automatically:
1. Pull latest code
2. Build both frontend and backend
3. Deploy updates
4. Zero downtime!

## 🌐 Custom Domain (Optional)

1. Go to App Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `izonedevs.com`)
4. Update your DNS records:
   - Type: `CNAME`
   - Name: `@` or `www`
   - Value: (provided by Digital Ocean)
5. Wait for SSL certificate (automatic, ~5 minutes)

## 🔧 Troubleshooting

### Build Fails

**Check logs** in Digital Ocean console:
- Click on failed deployment
- View build logs
- Look for error messages

**Common issues:**
- Missing dependencies in `requirements.txt`
- Wrong Python version
- Environment variables not set

### App Not Loading

1. Check both components are running
2. Verify environment variables
3. Check CORS settings in backend
4. View runtime logs

### Database Issues

- SQLite file is created automatically
- Data persists across deployments
- For backups, use Digital Ocean Spaces

## 📝 Post-Deployment Checklist

- [ ] App deployed successfully
- [ ] Frontend loads correctly
- [ ] Backend API accessible at `/api/docs`
- [ ] Can login to admin panel
- [ ] Events page shows data
- [ ] Blog page works
- [ ] File uploads working
- [ ] Email notifications working

## 🎯 Next Steps

1. **Add custom domain** (optional)
2. **Set up database backups**
3. **Monitor usage** in DO dashboard
4. **Scale up** if needed (easy!)

---

**🎉 Congratulations! Your app is live on Digital Ocean!**

Cost: Just **$5/month** for full-stack hosting! 🚀