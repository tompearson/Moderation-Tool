# GUIDELINES_URL: How It Always Gets the Latest Version

## 🎯 Overview

The `GUIDELINES_URL` environment variable is configured to automatically fetch the latest version of your community guidelines from a GitHub Gist. This document explains how this system works and why it's always current.

## 🔗 Current Configuration

```bash
GUIDELINES_URL=https://gist.githubusercontent.com/tompearson/87c37f055ee8220b421ce78c668c093b/raw/bcd17f434de2fb33b7288ff51eba68e52ae14a3e/NextDoor-Guidelines-content.md
```

## 🏗️ URL Structure Breakdown

### Components:
1. **Base URL**: `https://gist.githubusercontent.com/`
2. **Username**: `tompearson`
3. **Gist ID**: `87c37f055ee8220b421ce78c668c093b`
4. **Raw Content Path**: `/raw/`
5. **Commit Hash**: `bcd17f434de2fb33b7288ff51eba68e52ae14a3e`
6. **Filename**: `NextDoor-Guidelines-content.md`

### Key Insight:
The **commit hash** in the URL automatically updates when you edit your Gist on GitHub, ensuring the URL always points to the latest version.

## 🔄 How GitHub Gist URLs Work

### Automatic Version Updates:
1. **You edit your Gist** on GitHub.com
2. **GitHub generates a new commit hash** for the updated content
3. **The URL structure remains the same** - only the commit hash changes
4. **Your app fetches from the updated URL** automatically

### Example URL Evolution:
```
Before: .../raw/abc123/guidelines.md
After:  .../raw/def456/guidelines.md
```

## ⏰ Caching Strategy

### Cache Configuration:
```javascript
const GUIDELINES_CONFIG = {
  url: process.env.GUIDELINES_URL,
  cacheTimeout: 3600000, // 1 hour in milliseconds
  timeout: 10000, // 10 seconds timeout
  userAgent: 'Community-Moderation-Tool/1.0'
};
```

### Cache Behavior:
1. **First Request**: Fetches fresh content from Gist
2. **Subsequent Requests**: Uses cached content for 1 hour
3. **After 1 Hour**: Automatically fetches fresh content
4. **Manual Refresh**: Users can force immediate update

## 🔄 Complete Update Flow

### Automatic Updates:
```
1. You edit Gist on GitHub
   ↓
2. GitHub updates commit hash
   ↓
3. App cache expires (after 1 hour)
   ↓
4. App fetches fresh content
   ↓
5. Users see updated guidelines
```

### Manual Updates:
```
1. User clicks "Refresh" button
   ↓
2. App immediately fetches fresh content
   ↓
3. Cache is updated with new content
   ↓
4. Users see updated guidelines immediately
```

## 🛠️ Technical Implementation

### Fetch Function:
```javascript
async function fetchGuidelinesFromURL(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0...',
      'Accept': 'text/plain,text/markdown,*/*',
      'Cache-Control': 'max-age=0'
    }
  });
  
  const content = await response.text();
  return content;
}
```

### Cache Management:
```javascript
// Check if cache is still valid
if (guidelinesCache.content && guidelinesCache.timestamp) {
  const now = Date.now();
  const age = now - guidelinesCache.timestamp;
  
  if (age < GUIDELINES_CONFIG.cacheTimeout) {
    return guidelinesCache.content; // Use cached version
  }
}

// Fetch fresh content
const fetchedContent = await fetchGuidelinesFromURL(GUIDELINES_CONFIG.url);
```

## 🎯 Why This System Works

### 1. **Always Current**:
- GitHub's raw URLs automatically point to the latest version
- No manual URL updates required

### 2. **Performance Optimized**:
- 1-hour cache prevents excessive API calls
- Reduces load on GitHub's servers
- Faster response times for users

### 3. **Reliable Fallback**:
- If Gist is unavailable, falls back to embedded guidelines
- App continues to function even if external source fails

### 4. **User Control**:
- Manual refresh button for immediate updates
- Users can force fresh content when needed

## 🔧 Environment Setup

### Production Environment:
```bash
# Check current configuration
vercel env ls

# Verify GUIDELINES_URL is set
vercel env pull .env.production
```

### Local Development:
```bash
# Create .env file with GUIDELINES_URL
echo GUIDELINES_URL=https://gist.githubusercontent.com/tompearson/87c37f055ee8220b421ce78c668c093b/raw/bcd17f434de2fb33b7288ff51eba68e52ae14a3e/NextDoor-Guidelines-content.md > .env
```

## 🚨 Troubleshooting

### Common Issues:

#### Guidelines Not Updating:
1. **Check cache age**: Wait for 1-hour cache to expire
2. **Use manual refresh**: Click "Refresh" button in the app
3. **Verify Gist URL**: Ensure the URL is correct and accessible

#### Guidelines Showing as "Embedded":
1. **Check environment variable**: `vercel env ls`
2. **Verify GUIDELINES_URL**: Ensure it's set correctly
3. **Redeploy**: `vercel --prod` to pick up changes

#### Fetch Errors:
1. **Check network connectivity**: Ensure GitHub is accessible
2. **Verify Gist permissions**: Ensure the Gist is public
3. **Check timeout settings**: 10-second timeout may need adjustment

## 📊 Monitoring

### Check Guidelines Source:
- **URL Source**: Shows "🌐 Dynamic Rules (Gist)"
- **Embedded Source**: Shows "📋 Embedded Rules"
- **Fallback Source**: Shows "⚠️ Fallback Rules"

### Debug Information:
```javascript
console.log('Guidelines source:', data.guidelines?.source);
console.log('Guidelines content length:', data.guidelines?.fullContent?.length);
console.log('Guidelines cache age:', data.cache?.age);
```

## 💡 Best Practices

### 1. **Regular Updates**:
- Update your Gist regularly with current guidelines
- Test changes locally before updating production

### 2. **Cache Management**:
- 1-hour cache is optimal for most use cases
- Consider adjusting for more frequent updates if needed

### 3. **Error Handling**:
- Always have embedded guidelines as fallback
- Monitor for fetch failures in production

### 4. **User Communication**:
- Inform users about the refresh button
- Explain the caching behavior

## 🔗 Related Documentation

- [GIST_SETUP.md](./GIST_SETUP.md) - How to set up the Gist
- [VERCEL_TIPS_AND_TRICKS.md](./VERCEL_TIPS_AND_TRICKS.md) - Vercel deployment guide
- [GUIDELINES_UPDATE.md](./GUIDELINES_UPDATE.md) - How to update guidelines

---

*This system ensures your community guidelines are always current while maintaining optimal performance and reliability.*

*Last updated: August 2025*


---

## Last Updated
- **Date**: 08-15-2025
- **Version 0.8.40-alpha
- **Status**: Documentation updated for version 0.8.40-alpha
- **Next Action**: Ready for production deployment