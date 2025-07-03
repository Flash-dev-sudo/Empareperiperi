# 🔧 Quick Fix for Render Deployment

Your deployment failed because the build command was incorrect. Here's the simple fix:

## Steps to Fix

1. **Go to your Render dashboard** 
2. **Click on your "emparoperiperi" service**
3. **Go to Settings tab**
4. **Find "Build Command"** and change it from:
   ```
   npm install && npm run build
   ```
   to:
   ```
   npm run build
   ```
5. **Click "Save Changes"**
6. **Trigger a new deployment** (it should start automatically)

## Environment Variables to Verify

Make sure these are set in your Environment Variables:
- `NODE_ENV=production`
- `DATABASE_URL=libsql://emparo-periperi-flash.aws-eu-west-1.turso.io`
- `DATABASE_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTE1NzQ4NTUsImlkIjoiNGNiZGQ0MjctZmY2NS00YzZkLTlkY2QtNGMwYTEwODkzNTUwIiwicmlkIjoiNDYzOGQ5OTQtM2IzNS00NGQ3LWI3MTYtNTExYWMwZmRmMWYzIn0.WT2WtMqRmH9boYKl6xUYycnn5_1bOhvFGrvzQc_IBuhQRcXtgerDCEmIGlOA0gcQSGHsBKrewcQ8oPsp7P7DCg`

## Why This Fix Works

The error `Cannot find module '/opt/render/project/src/dist/index.js'` happened because:
- Render was only running `npm install` 
- This installed dependencies but didn't build the project
- The `dist/index.js` file was never created
- Our start command tried to run the non-existent file

With `npm run build`, Render will:
1. Install dependencies automatically
2. Run the build command to create `dist/index.js`
3. Start the server successfully

Your website should deploy successfully after this change!