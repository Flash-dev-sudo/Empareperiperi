# Render Build Fix

## Issue
Render build failing because `vite` command not found during `npm run build`.

## Solution Applied
Updated `render.yaml` to use `npx` commands instead of npm scripts:

**Before:**
```
buildCommand: npm install && npm run build
```

**After:**
```
buildCommand: npm install && npx vite build && npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
```

## Why This Works
- `npx` executes packages from node_modules directly
- No dependency on npm scripts working correctly
- Ensures build tools are found even if not globally installed

## Files Updated
- `render.yaml` - Fixed build command
- `.nvmrc` - Specified Node.js 20 for consistency

Push these changes to GitHub and redeploy on Render.