# URGENT: Manual Render Dashboard Configuration

## Problem
Render is ignoring the `render.yaml` file and using cached build command `npm install; npm run build` which fails because `vite` is not found.

## Immediate Fix Required

### Step 1: Access Render Dashboard
1. Go to your Render service dashboard
2. Click on your "emparo-periperi" service

### Step 2: Override Build Settings
1. Click **"Settings"** tab
2. Scroll to **"Build & Deploy"** section
3. **REPLACE** the Build Command with:
```
npm install && npx vite build && npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
```

### Step 3: Save and Deploy
1. Click **"Save Changes"**
2. Go back to **"Deploys"** tab
3. Click **"Deploy latest commit"**

## Why This Works
- `npx vite build` - Runs vite directly from node_modules
- `npx esbuild` - Bundles the server code
- Bypasses the failing npm script completely

## Expected Result
Build will succeed and your restaurant website will be live with the Turso database.

**This manual override is necessary because Render cached the initial configuration.**