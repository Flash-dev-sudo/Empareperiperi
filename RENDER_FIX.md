# 🔧 Quick Fix for Render Deployment

Your deployment failed because the build command was incorrect. Here's the simple fix:

## Steps to Fix

1. **Go to your Render dashboard** 
2. **Click on your "emparoperiperi" service**
3. **Go to Settings tab**
4. **Find "Build Command"** and change it to:
   ```
   npm install --include=dev && npm run build
   ```
5. **Click "Save Changes"**
6. **Trigger a new deployment** (it should start automatically)

## Environment Variables to Verify

Make sure these are set in your Environment Variables:
- `NODE_ENV=production`
- `DATABASE_URL=libsql://emparo-periperi-flash.aws-eu-west-1.turso.io`
- `DATABASE_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTE1NzQ4NTUsImlkIjoiNGNiZGQ0MjctZmY2NS00YzZkLTlkY2QtNGMwYTEwODkzNTUwIiwicmlkIjoiNDYzOGQ5OTQtM2IzNS00NGQ3LWI3MTYtNTExYWMwZmRmMWYzIn0.WT2WtMqRmH9boYKl6xUYycnn5_1bOhvFGrvzQc_IBuhQRcXtgerDCEmIGlOA0gcQSGHsBKrewcQ8oPsp7P7DCg`

## Why This Fix Works

The error `sh: 1: vite: not found` happened because:
- Render wasn't installing devDependencies (where `vite` and `esbuild` are located)
- Build tools like Vite are needed to create the production bundle
- The `dist/index.js` file couldn't be created without these tools

With `npm install --include=dev && npm run build`, Render will:
1. Clean install all dependencies (including devDependencies)
2. Run the build command using Vite and ESBuild
3. Create the `dist/index.js` file successfully
4. Start the server properly

**Note:** `npm ci` is better than `npm install` for production builds because it:
- Installs dependencies from package-lock.json exactly
- Includes devDependencies by default
- Is faster and more reliable for CI/CD environments

Your website should deploy successfully after this change!