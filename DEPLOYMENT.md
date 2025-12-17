# Deployment Guide

## Overview
This application is configured to deploy as a **single service** - the backend serves both the API and the frontend static files. This simplifies deployment and reduces costs.

## Prerequisites
- MongoDB Atlas account with cluster set up
- GitHub repo pushed (✓ already done)
- Free Render account

---

## Deploy Full Stack Application (Single Service)

### Steps:
1. Go to [render.com](https://render.com) and sign in with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your `Feedback-Collector` repo
4. Configure:
   - **Name:** `feedback-collector` (or any name you prefer)
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Root Directory:** `feedback-backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
5. Add **Environment Variables:**
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/feedback?retryWrites=true&w=majority
   JWT_SECRET=your_strong_jwt_secret_here_min_32_chars
   PORT=5000
   NODE_ENV=production
   ```
   
   **IMPORTANT - MongoDB Connection String:**
   - Go to MongoDB Atlas → Connect → Drivers → Copy connection string
   - Replace `<password>` with your database user password
   - **If password has special chars (`@`, `#`, `!`, etc.), URL-encode them:**
     - `@` → `%40`
     - `#` → `%23`
     - `!` → `%21`
     - `$` → `%24`
   - Example: `password@123` becomes `password%40123`
   - Replace `<database>` with your database name (e.g., `feedback`)
   - Verify the cluster URL matches your Atlas cluster
6. Click **"Create Web Service"**
7. Wait 5-7 minutes for deployment (frontend build takes extra time)
8. Your app will be live at `https://your-service-name.onrender.com`

### What happens during build:
- Backend dependencies are installed
- Frontend is built with production API URL
- Frontend build is copied to backend's public folder
- Backend serves both API and frontend

---

## How It Works

The application is structured to run as a single service:

1. **Backend** serves API routes at `/api/*`
2. **Backend** serves frontend static files from `/public`
3. **All non-API routes** return the React app's `index.html` for client-side routing
4. Frontend makes API calls to the same domain at `/api/*`

### File Structure After Build:
```
feedback-backend/
  ├── public/              ← Frontend build output
  │   ├── index.html
  │   ├── assets/
  │   └── vite.svg
  ├── src/
  │   └── app.js          ← Serves both API and static files
  └── server.js
```

---

## Testing Locally

To test the production setup locally:

```powershell
# From project root
cd feedback-backend
npm run build
npm start
```

Then visit `http://localhost:5000` - you should see the frontend and be able to use all features.

---

## Updating Your Deployment

When you make changes to frontend or backend:

```powershell
git add .
git commit -m "Your update message"
git push origin main
```

Render will automatically:
1. Detect the push
2. Run the build process
3. Redeploy your application

---

## Troubleshooting

### Backend Issues:
- Check Render logs for errors
- Verify `MONGO_URI` connects successfully
- Ensure `JWT_SECRET` is set (min 32 characters)

### Frontend Not Showing:
- Ensure build command is `npm run build` (not just `npm install`)
- Check Render logs for frontend build errors
- Verify `public/` folder exists after build

### Database Issues:
- MongoDB Atlas: whitelist `0.0.0.0/0` (all IPs) in Network Access
- Check connection string format and credentials
- URL-encode special characters in password

### API Errors:
- Frontend automatically uses same domain for API calls
- Check browser console for specific error messages
- Verify environment variables are set correctly

---

## Environment Variables Checklist

### On Render:
- ✓ `MONGO_URI`
- ✓ `JWT_SECRET`
- ✓ `PORT` (5000)
- ✓ `NODE_ENV` (production)

---

## Free Tier Limits

- **Render:** 750 hours/month, sleeps after 15 min inactivity (first request takes ~30s)
- **MongoDB Atlas:** 512MB storage free tier

---

## Cost Optimization

1. **Keep service awake:** Use a service like [UptimeRobot](https://uptimerobot.com) to ping your app every 5 minutes
2. **Use MongoDB indexes:** Improves query performance on free tier

---

## Post-Deployment

- Monitor Render logs for errors
- Set up alerts for downtime (Render provides email notifications)
- Regularly check MongoDB Atlas metrics
- Your app URL: `https://your-service-name.onrender.com`

---

## Custom Domain (Optional)

1. Go to Render Dashboard → Your Service → Settings
2. Scroll to "Custom Domain"
3. Click "Add Custom Domain"
4. Follow DNS configuration instructions
5. Wait for SSL certificate to provision (automatic)
