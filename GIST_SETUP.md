# GitHub Gist Setup for Dynamic Guidelines

## Overview

This document describes how to configure the Community Moderation Tool to use a GitHub Gist for dynamic guidelines instead of embedded rules. This allows you to update moderation rules without redeploying the application.

## Problem Solved

**Issue**: Production environment was showing "Embedded Rules" instead of "Dynamic Rules (Gist)"

**Root Cause**: Missing `GUIDELINES_URL` environment variable in Vercel production environment

**Solution**: Configure both local and production environments to use the GitHub Gist URL

## GitHub Gist Details

- **Gist URL**: https://gist.githubusercontent.com/tompearson/659f1cedea8c6dca0879260051e65b67/raw/guidelines-content.md
- **Content**: Full community moderation guidelines in markdown format
- **Access**: Public, server-side fetchable content

## Environment Configuration

### Local Development (.env file)

Create a `.env` file in your project root with:

```bash
# Community Moderation Tool Environment Variables

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration (optional)
PORT=3000

# Environment (optional)
NODE_ENV=development

# Guidelines URL - Using GitHub Gist
GUIDELINES_URL=https://gist.githubusercontent.com/tompearson/659f1cedea8c6dca0879260051e65b67/raw/guidelines-content.md
```

### Vercel Production Environment

#### Option 1: Vercel CLI (Recommended)

```bash
# Add environment variable
vercel env add GUIDELINES_URL production

# When prompted, enter the gist URL:
https://gist.githubusercontent.com/tompearson/659f1cedea8c6dca0879260051e65b67/raw/guidelines-content.md

# Deploy to production
vercel --prod
```

#### Option 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and log in
2. Navigate to your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - **Name**: `GUIDELINES_URL`
   - **Value**: `https://gist.githubusercontent.com/tompearson/659f1cedea8c6dca0879260051e65b67/raw/guidelines-content.md`
   - **Environment**: Production (and Preview if desired)
5. Click **Save**
6. Your app will automatically redeploy

## Verification Steps

### 1. Test Gist Accessibility

```bash
# Windows Command Prompt
curl -s "https://gist.githubusercontent.com/tompearson/659f1cedea8c6dca0879260051e65b67/raw/guidelines-content.md"

# Unix/Linux/Mac
curl -s "https://gist.githubusercontent.com/tompearson/659f1cedea8c6dca0879260051e65b67/raw/guidelines-content.md" | head -10
```

**Expected**: Returns full guidelines content

### 2. Check Local Development

```bash
# Start local server
npm run dev

# Test local API
curl -s "http://127.0.0.1:3000/api/guidelines-endpoint"
```

**Expected Response**:
```json
{
  "success": true,
  "guidelines": {
    "source": "url",
    "cacheAge": 0
  },
  "config": {
    "url": "https://gist.githubusercontent.com/tompearson/659f1cedea8c6dca0879260051e65b67/raw/guidelines-content.md"
  }
}
```

### 3. Check Production Environment

```bash
# Test production API
curl -s "https://moderation-assistant-tool.vercel.app/api/guidelines-endpoint"
```

**Expected Response**:
```json
{
  "success": true,
  "guidelines": {
    "source": "url",
    "cacheAge": 0
  },
  "config": {
    "url": "https://gist.githubusercontent.com/tompearson/659f1cedea8c6dca0879260051e65b67/raw/guidelines-content.md"
  }
}
```

### 4. Frontend Verification

- **Local**: Visit http://127.0.0.1:3000 and submit a test post
- **Production**: Visit https://moderation-assistant-tool.vercel.app/ and submit a test post

**Expected**: Shows "Dynamic Rules (Gist)" badge instead of "Embedded Rules"

## Troubleshooting

### Issue: Still showing "Embedded Rules"

**Check**:
1. Verify `.env` file exists and has correct `GUIDELINES_URL`
2. Restart local development server
3. Check Vercel environment variables in dashboard
4. Redeploy production: `vercel --prod`

### Issue: API returns `"source": "embedded"`

**Check**:
1. Environment variable is set correctly
2. Gist URL is accessible
3. No network/firewall issues blocking the fetch

### Issue: Gist not accessible

**Check**:
1. Gist is public
2. Using the raw URL (not the web interface URL)
3. URL format: `https://gist.githubusercontent.com/username/gist-id/raw/filename.md`

## Code Architecture

### File Relationships

- **`api/utils/guidelines.js`**: Core logic for fetching and caching guidelines
- **`api/guidelines-endpoint.js`**: API endpoint that exposes guidelines data
- **`src/App.jsx`**: Frontend that displays rule source badge

### Key Functions

```javascript
// guidelines.js
async function loadGuidelines() {
  // Tries URL first, falls back to embedded rules
}

async function getGuidelinesWithMetadata() {
  // Returns guidelines with source tracking
}

// guidelines-endpoint.js
export default async function handler(req, res) {
  // Exposes guidelines via HTTP endpoint
}
```

## Benefits

1. **Dynamic Updates**: Change guidelines without redeploying
2. **Version Control**: Guidelines are versioned in GitHub
3. **Collaboration**: Multiple people can edit the gist
4. **Backup**: Guidelines are stored externally
5. **Performance**: Cached for 1 hour to reduce API calls

## Maintenance

### Updating Guidelines

1. Edit the GitHub Gist: https://gist.github.com/tompearson/659f1cedea8c6dca0879260051e65b67
2. Save changes
3. The application will automatically use the updated content within 1 hour (cache timeout)

### Cache Management

- **Cache Duration**: 1 hour (3600000 milliseconds)
- **Force Refresh**: Use the guidelines endpoint POST method
- **Cache Status**: Available via `/api/guidelines-endpoint` GET request

## Security Considerations

- Gist is public (required for server-side fetching)
- No sensitive information in guidelines
- Content is validated before use
- Fallback to embedded rules if fetch fails

## Related Files

- `env.example` - Template for environment variables
- `api/utils/guidelines.js` - Core guidelines logic
- `api/guidelines-endpoint.js` - API endpoint
- `src/App.jsx` - Frontend display logic
- `GUIDELINES_UPDATE.md` - Previous guidelines update documentation

---

## 🎯 **Next Steps**

1. **Test the guidelines** by visiting your production URL
2. **Verify content** matches your Gist
3. **Update guidelines** as needed in your Gist

---

## Last Updated
- **Date**: August 15, 2025
- **Version 0.8.50-alpha
- **Status**: Gist setup documentation complete
- **Next Action**: Ready for production deployment 