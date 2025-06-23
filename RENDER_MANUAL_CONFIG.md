# Manual Render Configuration Fix

## Issue
Render is not using the updated `render.yaml` file and still running the old build command.

## Solution: Manual Configuration Override

Since Render might be caching the old configuration, manually override in Render dashboard:

### Step 1: Go to Render Dashboard
1. Navigate to your service in Render
2. Go to "Settings" tab

### Step 2: Update Build Command
**Change from:**
```
npm install; npm run build
```

**Change to:**
```
npm install && npx vite build && npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
```

### Step 3: Verify Environment Variables
Ensure these are set correctly:
- `TURSO_DATABASE_URL` = `libsql://emparo-periperi-flash.aws-eu-west-1.turso.io`
- `TURSO_AUTH_TOKEN` = `[your JWT token]`
- `NODE_ENV` = `production`

### Step 4: Deploy Again
Click "Manual Deploy" after making these changes.

## Why This Fixes It
- Uses `npx` to run vite and esbuild directly from node_modules
- Bypasses the npm script that's failing
- Builds both frontend and backend in correct order

The deployment should succeed after manual configuration override.