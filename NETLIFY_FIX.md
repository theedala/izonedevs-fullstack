# Fix Netlify Deployment

## Problem
Netlify is deploying from the wrong GitHub repository. The backend is working correctly on Digital Ocean, but the frontend on Netlify is outdated.

## Solution

### Step 1: Update Netlify Site Settings

1. Go to https://app.netlify.com
2. Click on your site (`izonedevs`)
3. Go to **Site settings** → **Build & deploy** → **Continuous Deployment**
4. Click **Link to a different repository** OR **Configure**

### Step 2: Configure the Repository

Set these values:

- **Repository**: `theedala/izonedevs-fullstack`
- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `frontend/dist`

### Step 3: Environment Variables

Make sure these environment variables are set in Netlify:

- **VITE_API_URL**: `https://coral-app-ycosl.ondigitalocean.app/api`
- **NODE_VERSION**: `18`

### Step 4: Trigger Deploy

1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**

## Alternative: Create New Netlify Site

If updating doesn't work, you can create a fresh Netlify site:

1. Go to https://app.netlify.com
2. Click **Add new site** → **Import an existing project**
3. Choose **GitHub**
4. Select `theedala/izonedevs-fullstack`
5. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
6. Add environment variable:
   - **VITE_API_URL**: `https://coral-app-ycosl.ondigitalocean.app/api`
7. Click **Deploy site**

## Verification

After deployment, test:

1. Login with: admin / Admin@iZone2025!
2. Navigate to Event Registrations page
3. Register for an event
4. Check that the registration appears in the admin list with email visible

## Current Status

✅ **Backend (Digital Ocean)**: Working correctly
   - API: https://coral-app-ycosl.ondigitalocean.app/api
   - Event registration endpoint: Working
   - Registrations list endpoint: Working (returns data with emails)

❌ **Frontend (Netlify)**: Needs to be redeployed from correct repository
   - Current site: https://izonedevs.netlify.app
   - Issue: Deploying from old/wrong source
   - Fix: Reconfigure to use `theedala/izonedevs-fullstack` repo

## Backend Test Results

Tested directly with API:

```bash
# Registration works
POST /api/events/1/register
Response includes: email, name, phone, etc.

# List registrations works
GET /api/events/registrations
Response: {
  "items": [{ "email": "test@example.com", ... }],
  "total": 15,
  "page": 1,
  "pages": 2
}
```

The backend is 100% functional. Only the frontend needs redeployment from the correct repository.
