# 🚨 URGENT: Manual Fix Required in Render Dashboard

Your build is failing because Render is still using the old build command. You need to manually update it in your dashboard.

## Immediate Steps (Do This Now):

### 1. Go to Render Dashboard
- Open https://dashboard.render.com/
- Find your "Emparoperiperi" service
- Click on it

### 2. Update Build Command
- Click **"Settings"** tab (top navigation)
- Scroll down to **"Build & Deploy"** section
- Find **"Build Command"** field
- Change it from: `npm install && npm run build`
- Change it to: `npm install --include=dev && npm run build`
- Click **"Save Changes"**

### 3. Trigger New Deployment
- Go to **"Manual Deploy"** button (should be visible)
- Click **"Deploy Latest Commit"**
- Or wait for automatic deployment to trigger

## Why This Manual Step is Required

- Your render.yaml file changes aren't being applied
- Render is using the service settings instead of the config file
- The `--include=dev` flag is critical to install Vite and ESBuild
- Without devDependencies, the build tools aren't available

## Expected Result

After this change, your build log should show:
```
==> Running build command 'npm install --include=dev && npm run build'...
✓ 1680 modules transformed.
✓ built in 9.02s
==> Build successful 🎉
```

Your website will then be live at https://empareperiperi.onrender.com

## This is a One-Time Fix
Once you update the build command manually, future deployments will work correctly.