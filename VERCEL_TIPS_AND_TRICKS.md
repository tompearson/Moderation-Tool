# Vercel Tips and Tricks

## 🚀 Quick Start Commands

### Deployment
```bash
# Deploy to production
vercel --prod

# Deploy to preview (staging)
vercel

# Deploy with specific environment
vercel --env production
```

### Environment Variables
```bash
# List all environment variables
vercel env ls

# Add environment variable to production
vercel env add VARIABLE_NAME production

# Add environment variable to all environments
vercel env add VARIABLE_NAME

# Remove environment variable
vercel env rm VARIABLE_NAME

# Pull environment variables locally (for debugging)
vercel env pull

# Pull production environment variables specifically
vercel env pull .env.production
```

### Project Management
```bash
# Link to existing project
vercel link

# Unlink from project
vercel unlink

# List all projects
vercel projects ls

# Switch between projects
vercel switch
```

## 📋 Essential Commands for This Project

### Environment Setup
```bash
# Check current environment variables
vercel env ls

# Add GUIDELINES_URL to production (if needed)
vercel env add GUIDELINES_URL production

# Add ADDITIONAL_GUIDELINES_URL to production (if needed)
vercel env add ADDITIONAL_GUIDELINES_URL production

# Add GEMINI_API_KEY to production (if needed)
vercel env add GEMINI_API_KEY production
```

### Deployment Workflow
```bash
# 1. Check current status
vercel env ls

# 2. Deploy to production
vercel --prod

# 3. Verify deployment
# Visit: https://moderation-assistant-tool.vercel.app/
```

## 🔧 Configuration Files

### vercel.json
```json
{
  "version": 2,
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Environment Variables for This Project
- `GEMINI_API_KEY` - Google AI API key
- `GUIDELINES_URL` - URL for primary guidelines (Gist)
- `ADDITIONAL_GUIDELINES_URL` - URL for additional guidelines (Gist)
- `NODE_ENV` - Environment (development/production)

## 🐛 Debugging Commands

### Check Environment Variables
```bash
# List all variables
vercel env ls

# Pull production variables locally
vercel env pull .env.production

# View local environment file
type .env.production
```

### Check Deployment Status
```bash
# List recent deployments
vercel ls

# Get deployment URL
vercel inspect [deployment-id]
```

### Local Development
```bash
# Start local development server
vercel dev

# Pull environment variables for local testing
vercel env pull .env.local
```

## 📁 File Management

### Files You DON'T Need to Maintain
- `.env.production` - Created temporarily for debugging
- `.env.local` - Created temporarily for debugging
- `node_modules/` - Auto-generated

### Files You SHOULD Maintain
- `vercel.json` - Vercel configuration
- `package.json` - Dependencies and scripts
- Source code files
- `.gitignore` - Git ignore rules

## 🔄 Common Workflows

### New Feature Deployment
```bash
# 1. Make code changes
# 2. Test locally
npm run dev

# 3. Deploy to production
vercel --prod

# 4. Verify at: https://moderation-assistant-tool.vercel.app/
```

### Environment Variable Update
```bash
# 1. Update environment variable
vercel env add VARIABLE_NAME production

# 2. Redeploy to pick up changes
vercel --prod
```

### Debug Production Issues
```bash
# 1. Check environment variables
vercel env ls

# 2. Pull production variables locally
vercel env pull .env.production

# 3. Test locally with production config
npm run dev
```

## 🚨 Troubleshooting

### Common Issues

#### Environment Variables Not Working
```bash
# Check if variables are set
vercel env ls

# Redeploy to pick up changes
vercel --prod
```

#### Deployment Fails
```bash
# Check build logs
vercel logs [deployment-url]

# Redeploy with fresh cache
vercel --prod --force
```

#### Local vs Production Mismatch
```bash
# Pull production environment
vercel env pull .env.production

# Compare with local .env file
```

## 📊 Monitoring

### Check Deployment Status
- Production: https://moderation-assistant-tool.vercel.app/
- Vercel Dashboard: https://vercel.com/dashboard

### Environment Variables Status
```bash
vercel env ls
```

## 💡 Pro Tips

1. **Always use `vercel --prod` for production deployments**
2. **Environment variables are encrypted and secure on Vercel**
3. **You don't need to maintain `.env` files for production**
4. **Use `vercel env ls` to check variable status**
5. **Redeploy after changing environment variables**
6. **Test locally with `vercel dev` before deploying**

## 🔗 Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Production App](https://moderation-assistant-tool.vercel.app/)
- [Vercel Documentation](https://vercel.com/docs)
- [Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)

## 📝 Notes for This Project

- **Production URL**: https://moderation-assistant-tool.vercel.app/
- **Guidelines URL**: Set to Gist for dynamic content
- **API Key**: Google Gemini API for AI moderation
- **Environment**: Production uses `NODE_ENV=production`

---

*Last updated: August 2025*

---

## Last Updated
- **Date**: August 15, 2025
- **Version 0.8.40-alpha
- **Status**: Vercel tips and tricks documentation complete
- **Next Action**: Ready for production deployment
