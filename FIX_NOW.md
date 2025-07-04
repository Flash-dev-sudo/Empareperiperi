# Fix Your Deployment Right Now

## The Problem
Your build is failing because Render can't find the `vite` command. This happens because devDependencies aren't being installed.

## The Solution (Takes 2 minutes)

### Step 1: Open Your Render Dashboard
1. Go to https://dashboard.render.com
2. Find your "Emparoperiperi" service
3. Click on it

### Step 2: Update the Build Command
1. Click the **Settings** tab
2. Scroll down to find **"Build Command"**
3. Change it from: `npm install && npm run build`
4. Change it to: `npm install --include=dev && npm run build`
5. Click **"Save Changes"**

### Step 3: Redeploy
1. Go back to your service dashboard
2. Click **"Manual Deploy"** 
3. Click **"Deploy Latest Commit"**

## What This Does
The `--include=dev` flag tells npm to install devDependencies, which include:
- `vite` (for building the frontend)
- `esbuild` (for building the backend)
- Other build tools needed for production

## Expected Result
Your next build will succeed and your restaurant website will be live at:
https://empareperiperi.onrender.com

This is a one-time fix. Future deployments will work automatically.