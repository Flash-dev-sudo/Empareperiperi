# Render Deployment Guide

Your Emparo Peri Peri restaurant website is now ready for deployment on Render!

## 🚀 Deployment Steps

### 1. GitHub Repository
✅ **Already Done** - Your repository is connected to Render

### 2. Create Web Service on Render

1. Go to your Render dashboard
2. Click "New +" → "Web Service"
3. Select your connected GitHub repository
4. Configure the service:

**Service Configuration:**
- **Name**: `emparo-peri-peri` (or your preferred name)
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start`
- **Plan**: Free (or your preferred plan)

### 3. Set Environment Variables

In your Render service settings, add these environment variables:

```
NODE_ENV=production
DATABASE_URL=libsql://emparo-periperi-flash.aws-eu-west-1.turso.io
DATABASE_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTE1NzQ4NTUsImlkIjoiNGNiZGQ0MjctZmY2NS00YzZkLTlkY2QtNGMwYTEwODkzNTUwIiwicmlkIjoiNDYzOGQ5OTQtM2IzNS00NGQ3LWI3MTYtNTExYWMwZmRmMWYzIn0.WT2WtMqRmH9boYKl6xUYycnn5_1bOhvFGrvzQc_IBuhQRcXtgerDCEmIGlOA0gcQSGHsBKrewcQ8oPsp7P7DCg
```

### 4. Deploy

Click "Create Web Service" and Render will:
- Pull your code from GitHub
- Install dependencies (`npm install`)
- Build your project (`npm run build`)
- Start your server (`npm run start`)

## 🎯 What Happens During Deployment

1. **Build Process**: Vite builds your React frontend and ESBuild bundles your Express server
2. **Database**: Automatically connects to your Turso database using the credentials
3. **Server**: Starts on Render's dynamic port and serves both API and frontend
4. **Domain**: Render provides a `.onrender.com` domain for your app

## 🔧 Technical Details

- **Port**: Uses `process.env.PORT` (Render's dynamic port assignment)
- **Database**: Automatically switches to TursoStorage in production
- **Static Files**: Built frontend and assets served by Express
- **Environment**: Production-optimized with proper error handling

## 📋 Optional: Using render.yaml

Your project includes a `render.yaml` file for Infrastructure as Code deployment. To use it:

1. In your Render dashboard, go to "Blueprint"
2. Click "New Blueprint Instance"
3. Connect your repository
4. Render will automatically detect and use the `render.yaml` configuration

This is an alternative to manually creating the web service.

## 🎉 After Deployment

Once deployed successfully:
- Your restaurant website will be live at your Render URL
- The Turso database will be active and storing data
- Both development and production environments are properly configured
- Any future GitHub pushes will trigger automatic redeployments

Your Emparo Peri Peri restaurant is ready to serve customers online! 🌶️