# Vercel Deployment Guide

This guide will help you deploy your Community Moderation Tool to Vercel for public hosting.

## Prerequisites

- ✅ Vercel CLI installed (`npm install -g vercel`)
- ✅ Git repository initialized and committed
- ✅ Node.js and npm installed

## Current Working Configuration

### **Production URL:**
**https://moderation-assistant-tool.vercel.app/**

### **Clean URL Structure:**
- **Main App:** `/` → React application
- **About Page:** `/about` → About page (no .html needed)
- **Docs Page:** `/docs` → Documentation page
- **Contact Page:** `/contact` → Contact page
- **Privacy Page:** `/privacy` → Privacy policy
- **Terms Page:** `/terms` → Terms of service

## Quick Deployment Steps

### 1. Login to Vercel (if not already logged in)
```bash
vercel login
```

### 2. Deploy to Vercel
```bash
vercel
```

Follow the prompts:
- Set up and deploy? → `Y`
- Which scope? → Select your account
- Link to existing project? → `N` (for first deployment)
- Project name? → `moderation-assistant-tool` (or your preferred name)
- In which directory is your code located? → `./` (current directory)
- Want to override the settings? → `N`

### 3. For Production Deployment
```bash
vercel --prod
```

## Configuration Details

The project is configured with:
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `dist`
- **Framework**: Vite
- **Clean URLs**: HTML pages accessible without .html extension
- **SPA Routing**: React app handles client-side routing

## Current vercel.json Configuration

```json
{
  "version": 2,
  "buildCommand": "npm run vercel-build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    { "source": "/about", "destination": "/about.html" },
    { "source": "/docs", "destination": "/docs.html" },
    { "source": "/contact", "destination": "/contact.html" },
    { "source": "/privacy", "destination": "/privacy.html" },
    { "source": "/terms", "destination": "/terms.html" }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

## Adding New HTML Pages

### 1. Create HTML file in `public/` folder
```bash
# Example: public/docs.html
touch public/docs.html
```

### 2. Add route to vercel.json
```json
{ "source": "/docs", "destination": "/docs.html" }
```

### 3. Build and deploy
```bash
npm run build
vercel --prod
```

## Environment Variables

If you need to set environment variables for production:
```bash
vercel env add VARIABLE_NAME
```

## Custom Domain (Optional)

To add a custom domain:
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Domains
4. Add your custom domain

## Automatic Deployments

Vercel will automatically deploy when you push to your main branch. To enable this:
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect changes and deploy

## Manual Deployment Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Pull latest environment variables
vercel env pull

# View deployment status
vercel ls
```

## Troubleshooting

### Build Issues
- Ensure all dependencies are in `package.json`
- Check that the build command works locally: `npm run build`

### Routing Issues
- The `vercel.json` includes clean URL routing for HTML pages
- React app routing works automatically for unmatched routes

### Environment Variables
- Use `vercel env add` to add production environment variables
- Don't commit `.env` files to your repository

## Project Structure for Vercel

```
ModerationTool/
├── src/                 # Source code
├── public/              # Static assets and HTML pages
│   ├── about.html       # About page
│   ├── docs.html        # Documentation page
│   ├── contact.html     # Contact page
│   ├── privacy.html     # Privacy policy
│   ├── terms.html       # Terms of service
│   ├── version.js       # Version information
│   └── vite.svg         # Vite logo
├── dist/                # Build output (generated)
├── vercel.json          # Vercel configuration
├── package.json         # Dependencies and scripts
└── vite.config.js       # Vite configuration
```

## Next Steps

After deployment:
1. Test your application at the provided Vercel URL
2. Verify clean URLs work (e.g., `/about`, `/docs`)
3. Set up automatic deployments by connecting your Git repository
4. Configure custom domains if needed
5. Monitor performance in the Vercel dashboard

Your application will be publicly accessible to everyone with clean, professional URLs as requested!

## Current Status

- ✅ **Production URL**: https://moderation-assistant-tool.vercel.app/
- ✅ **Clean URLs**: Working for HTML pages
- ✅ **React App**: Loading properly at root
- ✅ **HTML Pages**: Accessible via clean routes
- ✅ **Version 0.8.50-alpha

---

## Last Updated
- **Date**: August 15, 2025
- **Version 0.8.50-alpha
- **Status**: Vercel deployment working with clean URLs
- **Next Action**: Ready for production deployment
