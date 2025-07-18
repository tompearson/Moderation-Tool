# Community Moderation Tool - Development Status

## Current Status Summary

### ✅ Working: Local Development
- **URL**: `http://localhost:3000/api/moderate`
- **Status**: ✅ Working perfectly
- **API Key**: Uses `.env` file (working)
- **Code**: Same as production
- **Command**: `npm run server`

### ❌ Blocked: Vercel Production
- **URL**: `https://moderation-tool.vercel.app/api/moderate`
- **Status**: ❌ Blocked by SSO authentication
- **Issue**: "Authentication Required" page
- **Solution**: Disable SSO in Vercel dashboard

### 🔧 Environment Variables
- **Local**: `.env` file with working API key
- **Vercel**: Environment variable set but blocked by SSO
- **Command**: `vercel env ls` (shows all environments)

## API Endpoints

### Local Development (Working)
- **Health**: `http://localhost:3000/api/health`
- **Guidelines**: `http://localhost:3000/api/guidelines`
- **Moderate**: `http://localhost:3000/api/moderate`

### Production (Blocked by SSO)
- **Health**: `https://moderation-tool.vercel.app/api/health`
- **Guidelines**: `https://moderation-tool.vercel.app/api/guidelines`
- **Moderate**: `https://moderation-tool.vercel.app/api/moderate`

## Gemini API Status

### Current Issues
- **gemini-2.0-flash-exp**: ❌ 404 Not Found (model doesn't exist)
- **gemini-1.5-pro**: ❌ 429 Too Many Requests (quota exceeded)
- **gemini-1.5-flash**: ✅ Working (fallback model)

### Fallback Logic
- ✅ **Working correctly** - falls back to available models
- ✅ **Error handling** - gracefully handles model failures
- ✅ **Local testing** - `gemini-1.5-flash` works for development

## Vercel Environments

### Three Available Environments
1. **Production** ✅ (You have this)
   - URL: `https://moderation-tool.vercel.app`
   - Deploy: `vercel --prod`
   - Status: Blocked by SSO

2. **Preview** ❌ (You're missing this)
   - URL: `https://moderation-tool-[hash].vercel.app`
   - Deploy: `vercel` (without `--prod`)
   - Purpose: Test changes before production

3. **Development** ✅ (Your localhost)
   - URL: `http://localhost:3000`
   - Command: `npm run server`
   - Status: Working perfectly

## Next Steps

### Immediate (Local Development)
1. ✅ **Continue developing locally** - everything works
2. ✅ **Test API endpoints** - use Postman with local environment
3. ✅ **Use working API key** - from `.env` file

### When Ready for Production
1. **Disable SSO in Vercel Dashboard**
   - Go to: https://vercel.com/dashboard
   - Project: `moderation-tool`
   - Settings → Security → Disable SSO Protection

2. **Deploy to Production**
   ```bash
   vercel --prod
   ```

3. **Test Production API**
   - Use Postman with production environment
   - Verify all endpoints work

### Optional: Set Up Preview Environment
1. **Create Git repository** (if not already done)
2. **Push code to GitHub**
3. **Vercel will auto-deploy previews** on each push
4. **Test changes** before production deployment

## Commands Reference

### Local Development
```bash
npm run server          # Start local server
npm run build          # Build React app
npm run dev            # Start Vite dev server (if needed)
```

### Vercel Deployment
```bash
vercel                 # Deploy to preview
vercel --prod          # Deploy to production
vercel env ls          # List environment variables
```

### Testing
```bash
# Test local API
curl http://localhost:3000/api/health

# Test production API (after fixing SSO)
curl https://moderation-tool.vercel.app/api/health
```

## File Structure
```
ModerationTool/
├── api/
│   ├── routes.js          # API endpoints
│   └── utils/
│       └── ai.js          # Gemini AI integration
├── src/                   # React frontend
├── dist/                  # Built React app
├── server.js              # Express server (local only)
├── vercel.json            # Vercel configuration
├── .env                   # Local environment variables
└── package.json           # Dependencies and scripts
```

## Troubleshooting

### Port 3000 Already in Use
```bash
netstat -ano | findstr :3000
taskkill /PID [PID] /F
```

### API Key Issues
- **Local**: Check `.env` file exists and has correct key
- **Production**: Check Vercel environment variables
- **Invalid Key**: Regenerate in Google AI Studio

### CORS Issues
- **Local**: CORS allows `http://localhost:3000`
- **Production**: CORS allows `https://moderation-tool.vercel.app`

## Last Updated
- **Date**: December 19, 2024
- **Status**: Local development working, production blocked by SSO
- **Next Action**: Continue local development, fix SSO when ready for production 