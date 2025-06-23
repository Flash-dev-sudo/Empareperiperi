# Emparo Peri Peri - Render Deployment Guide

## Prerequisites
- GitHub repository with your code
- Render account (free tier available)
- GoDaddy domain purchased

## Deployment Steps

### 1. GitHub Setup
1. Push your code to GitHub repository
2. Ensure all files are committed including `render.yaml`

### 2. Render Deployment
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` configuration
5. Click "Deploy"

### 3. Environment Variables (Auto-configured)
The `render.yaml` file includes:
- `NODE_ENV=production`
- `TURSO_DATABASE_URL` (your Turso database)
- `TURSO_AUTH_TOKEN` (your authentication token)

### 4. Domain Configuration
Once deployed:
1. In Render dashboard, go to your service settings
2. Add your GoDaddy domain under "Custom Domains"
3. Copy the DNS records provided by Render
4. In GoDaddy DNS management:
   - Create CNAME record: `www` → `[your-app].onrender.com`
   - Create A record: `@` → Render's IP address

### 5. SSL Certificate
Render automatically provides SSL certificates for custom domains.

## Build Configuration
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start`
- **Node Version**: 20.x (automatically detected)
- **Health Check**: `/` endpoint

## Database
- **Turso Database**: Already configured and operational
- **Data Persistence**: Your menu items and orders are stored in cloud database
- **Automatic Backups**: Handled by Turso

## Expected Costs
- **Render Starter Plan**: $7/month (includes custom domain + SSL)
- **Turso Database**: Free tier (25GB storage, 1B row reads/month)
- **Total**: ~$7/month for professional hosting

## Post-Deployment Checklist
- [ ] Verify website loads at your custom domain
- [ ] Test menu API: `https://yourdomain.com/api/menu`
- [ ] Test order functionality
- [ ] Verify mobile responsiveness
- [ ] Check SSL certificate is active

## Troubleshooting
- **Build fails**: Check npm version and dependencies
- **Database connection**: Verify Turso credentials in environment variables
- **Domain not working**: Check DNS propagation (can take 24-48 hours)

Your restaurant website will be live with professional hosting, SSL security, and a custom domain!