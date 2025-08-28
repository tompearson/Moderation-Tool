# Deployment Guide

This guide will help you deploy your Community Moderation Tool to production.

## 🚀 Vercel Deployment (Recommended)

### Prerequisites
- [Vercel Account](https://vercel.com/signup)
- [GitHub Repository](https://github.com/tompearson/moderation-tool) (already set up)
- Google Gemini API Key
- Vercel CLI installed (`npm i -g vercel`)

### Step 1: Connect to Vercel

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Select the repository**: `moderation-tool`

### Step 2: Configure Environment Variables

In the Vercel project settings:

1. **Go to Settings → Environment Variables**
2. **Add the following variables:**

| Name | Value | Environment |
|------|-------|-------------|
| `GEMINI_API_KEY` | `your_actual_api_key_here` | Production |
| `NODE_ENV` | `production` | Production |
| `GUIDELINES_URL` | `https://gist.githubusercontent.com/tompearson/87c37f055ee8220b421ce78c668c093b/raw/NextDoor-Guidelines-content.md` | Production |
| `ADDITIONAL_GUIDELINES_URL` | `https://gist.githubusercontent.com/tompearson/659f1cedea8c6dca0879260051e65b67/raw/guidelines-content.md` | Production |

**Important**: Use Gist URLs **without commit hashes** to automatically pick up updates.

## 🔄 Automatic Gist Updates

### How Gist URLs Work

The Gist URLs used in your environment variables are designed to **automatically fetch the latest content**:

```
https://gist.githubusercontent.com/tompearson/87c37f055ee8220b421ce78c668c093b/raw/NextDoor-Guidelines-content.md
and 
https://gist.githubusercontent.com/tompearson/ce350d09fa92673ec5efd2a0aa37cb72/raw/Nextdoor%2520Mods%2520for%2520West%2520of%2520Portland
```

**URL Structure Breakdown:**
- **Gist ID**: `87c37f055ee8220b421ce78c668c093b` (unique identifier)
- **Filename**: `NextDoor-Guidelines-content.md` (the actual file to fetch)
- **No commit hash**: The URL automatically points to the latest version of this file

**Key Points:**
- ✅ **No commit hash** - URL always points to the latest version
- ✅ **Real-time updates** - Changes appear immediately without redeployment
- ✅ **Automatic refresh** - Backend fetches fresh content on each request
- ✅ **No caching delays** - Guidelines are updated within minutes of Gist changes

### Update Process

1. **Edit your Gist** on GitHub (add/remove/modify content)
2. **Save the Gist** - changes are immediately available
3. **No redeployment needed** - production app automatically uses new content
4. **Test in production** - verify updates are working

### Why This Works

- **Raw Gist URLs** bypass GitHub's versioning system
- **No build process** - content is fetched at runtime
- **Dynamic loading** - guidelines are loaded fresh for each moderation request
- **Instant propagation** - changes are available as soon as you save the Gist
- **No deployment required** - content updates are automatically available without redeploying the application

### Step 3: Deploy to Production

Use the correct deployment command for your project scope:

```bash
vercel --prod --scope=tom-pearsons-projects-76b0a339
```

**Note**: The `--scope` flag is required if you have multiple Vercel accounts or teams.

### Step 4: Verify Deployment

1. **Check your production URL**: `https://moderation-assistant-tool.vercel.app`
2. **Test the "Show Guidelines" button** - should display primary Gist content
3. **Verify AI moderation** - uses combined content from both Gists

## 🔧 Environment Variable Management

### Pull Production Environment Variables

Use the provided batch file to pull production environment variables:

```bash
# Run the batch file
pull-env-production.bat

# Or manually
vercel env pull .env.production --environment=production
```

**Important**: Always use `--environment=production` flag to get production variables, not development.

### Add New Environment Variables

```bash
# Add to production environment
vercel env add VARIABLE_NAME production

# List all environment variables
vercel env ls

# Pull latest environment variables
vercel env pull .env.production --environment=production
```

## 🎯 Dual Gist System

### How It Works

The system uses **two GitHub Gists** for optimal moderation:

1. **Primary Gist** (`GUIDELINES_URL`) - Displayed in frontend
2. **Additional Gist** (`ADDITIONAL_GUIDELINES_URL`) - Combined with primary for AI

### Frontend vs Backend

- **Frontend**: Shows only primary Gist content
- **Backend**: Sends combined content to Gemini API
- **Transparent**: Users don't see the dual Gist setup

### Benefits

- ✅ **Comprehensive AI moderation** using both rule sets
- ✅ **Clean frontend display** showing only primary guidelines
- ✅ **Automatic updates** when either Gist changes
- ✅ **No redeployment needed** for content updates

## 📱 Mobile Responsiveness

### Recent Improvements

- **Rules Source and Refresh button** now stack properly on mobile
- **Centered layout** prevents overlap with "Community Guidelines" text
- **Responsive design** works on all screen sizes

## 🔄 Update Process

### When Guidelines Change

1. **Update your Gist content** on GitHub
2. **No redeployment needed** - changes are automatic
3. **Test in production** to verify updates

### When Environment Variables Change

1. **Update in Vercel Dashboard** or via CLI
2. **Redeploy with**: `vercel --prod --scope=tom-pearsons-projects-76b0a339`
3. **Verify changes** are applied

## 🚀 When to Deploy vs When Not To

### ❌ **NO Deployment Needed** (Automatic Updates)

**Gist Content Changes:**
- ✅ **Adding new rules** to your Gist
- ✅ **Modifying existing guidelines** 
- ✅ **Removing outdated content**
- ✅ **Updating documentation**

---

## Last Updated
- **Date**: August 15, 2025
- **Version 0.8.50-alpha
- **Status**: Deployment documentation updated for Vercel
- **Next Action**: Ready for production deployment

## 🚨 Troubleshooting

### Common Issues

#### "Show Guidelines shows wrong content"
- Check `GUIDELINES_URL` in Vercel environment variables
- Ensure it points to the correct primary Gist
- Redeploy after fixing environment variables

#### "AI not using combined guidelines"
- Verify `ADDITIONAL_GUIDELINES_URL` is set in production
- Check backend logs for guidelines loading
- Use debug endpoint: `/api/debug-guidelines`

#### "Environment variables not updating"
- Use `--environment=production` flag when pulling
- Redeploy after environment variable changes
- Check Vercel dashboard for current values

#### "Project not found in Vercel"
- Use correct scope: `--scope=tom-pearsons-projects-76b0a339`
- Check project linking: `vercel link`
- Verify project visibility in dashboard

### Debug Commands

```bash
# Check project status
vercel ls

# List environment variables
vercel env ls

# Link to project
vercel link

# Check domain status
vercel domains ls
```

## 📊 Production URLs

After deployment, your app will be available at:

- **Frontend**: `https://moderation-assistant-tool.vercel.app`
- **API Health**: `https://moderation-assistant-tool.vercel.app/api/health`
- **API Guidelines**: `https://moderation-assistant-tool.vercel.app/api/guidelines-endpoint`
- **API Moderation**: `https://moderation-assistant-tool.vercel.app/api/moderate`
- **Debug Guidelines**: `https://moderation-assistant-tool.vercel.app/api/debug-guidelines`

## 🛠️ Available Batch Files

- **`pull-env-production.bat`** - Pull production environment variables
- **`add-additional-guidelines-env.bat`** - Add additional guidelines environment variable
- **`start-production.bat`** - Start production server locally
- **`vercel --prod --scope=tom-pearsons-projects-76b0a339`** - Deploy to production

## 📞 Support

### Getting Help
- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Community Support**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Status Page**: [vercel-status.com](https://vercel-status.com)

### Next Steps
1. **Deploy to production** using the correct scope
2. **Test all endpoints** and mobile responsiveness
3. **Update Postman collection** with production URL
4. **Monitor usage and performance**
5. **Update guidelines** in Gists as needed

---

**Your Community Moderation Tool is now ready for production deployment with dual Gist support!** 🚀