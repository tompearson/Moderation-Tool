# Deployment Guide

This guide will help you deploy your Community Moderation Tool to production.

## 🚀 Vercel Deployment (Recommended)

### Prerequisites
- [Vercel Account](https://vercel.com/signup)
- [GitHub Repository](https://github.com/tompearson/nextdoor-moderation-tool) (already set up)
- Google Gemini API Key

### Step 1: Connect to Vercel

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Select the repository**: `nextdoor-moderation-tool`

### Step 2: Configure Environment Variables

In the Vercel project settings:

1. **Go to Settings → Environment Variables**
2. **Add the following variables:**

| Name | Value | Environment |
|------|-------|-------------|
| `GEMINI_API_KEY` | `your_actual_api_key_here` | Production |
| `NODE_ENV` | `production` | Production |

### Step 3: Configure Build Settings

1. **Framework Preset**: `Node.js`
2. **Build Command**: `npm run vercel-build`
3. **Output Directory**: `dist`
4. **Install Command**: `npm install`

### Step 4: Deploy

1. **Click "Deploy"**
2. **Wait for build to complete**
3. **Your app will be live at**: `https://your-project-name.vercel.app`

## 🔧 Alternative Deployment Options

### Railway Deployment

1. **Connect to [Railway](https://railway.app/)**
2. **Import from GitHub**
3. **Set environment variables**
4. **Deploy automatically**

### Render Deployment

1. **Connect to [Render](https://render.com/)**
2. **Create new Web Service**
3. **Connect GitHub repository**
4. **Set environment variables**
5. **Deploy**

### Heroku Deployment

1. **Install Heroku CLI**
2. **Create Heroku app**
3. **Set environment variables**
4. **Deploy with Git**

## 📋 Environment Variables for Production

### Required Variables
```bash
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=production
```

### Optional Variables
```bash
PORT=3000
```

## 🔒 Security Considerations

### API Key Security
- ✅ **Environment variables** - Never commit API keys to code
- ✅ **Vercel secrets** - Use Vercel's secure environment variable storage
- ✅ **HTTPS only** - All production deployments use HTTPS

### Rate Limiting
- ⚠️ **Consider adding rate limiting** for production use
- ⚠️ **Monitor API usage** to avoid quota exceeded errors
- ⚠️ **Set up alerts** for high usage

### CORS Configuration
- ✅ **Configure CORS** for your production domain
- ✅ **Limit origins** to trusted domains only

## 🧪 Testing Production Deployment

### Health Check
```bash
curl https://your-app.vercel.app/api/health
```

### API Test
```bash
curl -X POST https://your-app.vercel.app/api/moderate \
  -H "Content-Type: application/json" \
  -d '{"postContent": "Test post content"}'
```

### Frontend Test
- Visit your production URL
- Test the web interface
- Verify all features work

## 📊 Monitoring and Analytics

### Vercel Analytics
- **Enable Vercel Analytics** in project settings
- **Monitor performance** and usage
- **Track API calls** and response times

### Error Monitoring
- **Set up error tracking** (Sentry, LogRocket)
- **Monitor API errors** and failures
- **Track model fallback usage**

## 🔄 Continuous Deployment

### Automatic Deployments
- ✅ **GitHub integration** - Automatic deploys on push
- ✅ **Preview deployments** - Test changes before production
- ✅ **Rollback capability** - Easy rollback to previous versions

### Deployment Pipeline
1. **Push to GitHub** → **Automatic build** → **Deploy to production**
2. **Environment variables** automatically included
3. **Build logs** available in Vercel dashboard

## 🚨 Troubleshooting

### Common Issues

#### "Environment variable not found"
- Check Vercel environment variables
- Ensure variable names match exactly
- Redeploy after adding variables

#### "Build failed"
- Check build logs in Vercel dashboard
- Verify all dependencies are in package.json
- Ensure build script is correct

#### "API not responding"
- Check server logs in Vercel dashboard
- Verify API key is valid
- Test locally first

#### "CORS errors"
- Configure CORS for your domain
- Check request origins
- Update CORS settings in server.js

## 📈 Performance Optimization

### Vercel Optimizations
- **Edge Functions** - Faster response times
- **CDN** - Global content delivery
- **Auto-scaling** - Handle traffic spikes

### Application Optimizations
- **Caching** - Cache guidelines and responses
- **Compression** - Enable gzip compression
- **Minification** - Optimize bundle size

## 🔗 Production URLs

After deployment, your app will be available at:

- **Frontend**: `https://your-app.vercel.app`
- **API Health**: `https://your-app.vercel.app/api/health`
- **API Guidelines**: `https://your-app.vercel.app/api/guidelines`
- **API Moderation**: `https://your-app.vercel.app/api/moderate`

## 📞 Support

### Getting Help
- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Community Support**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Status Page**: [vercel-status.com](https://vercel-status.com)

### Next Steps
1. **Deploy to Vercel**
2. **Test all endpoints**
3. **Update Postman collection** with production URL
4. **Share with your team**
5. **Monitor usage and performance**

---

**Your Community Moderation Tool is now ready for production deployment!** 🚀