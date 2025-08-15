# Dual Gist Setup: Combining Guidelines for GEMINI API

## 🎯 Overview

The moderation tool now supports combining two separate Gists when submitting content to the GEMINI API:

1. **Primary Gist**: Your main community guidelines
2. **Additional Gist**: Supplementary guidelines that get appended

This allows for more comprehensive rule sets while maintaining the dynamic, updatable nature of Gist-based guidelines.

## 🔗 Current Configuration

### Primary Guidelines (GUIDELINES_URL)
```
https://gist.githubusercontent.com/tompearson/87c37f055ee8220b421ce78c668c093b/raw/bcd17f434de2fb33b7288ff51eba68e52ae14a3e/NextDoor-Guidelines-content.md
```

### Additional Guidelines (ADDITIONAL_GUIDELINES_URL)
```
https://gist.githubusercontent.com/tompearson/659f1cedea8c6dca0879260051e65b67/raw/guidelines-content.md
```

## 🏗️ How It Works

### 1. **Fetch Process**
- Fetches primary guidelines from `GUIDELINES_URL`
- Fetches additional guidelines from `ADDITIONAL_GUIDELINES_URL`
- Combines both with a separator (`---`)

### 2. **Combination Format**
```
[Primary Guidelines Content]

---

[Additional Guidelines Content]
```

### 3. **Caching Strategy**
- Combined content is cached for 1 hour
- Both Gists are fetched fresh when cache expires
- Manual refresh fetches both Gists immediately

## 🔧 Environment Variables

### Required Variables
```bash
# Primary guidelines (existing)
GUIDELINES_URL=https://gist.githubusercontent.com/tompearson/87c37f055ee8220b421ce78c668c093b/raw/bcd17f434de2fb33b7288ff51eba68e52ae14a3e/NextDoor-Guidelines-content.md

# Additional guidelines (new)
ADDITIONAL_GUIDELINES_URL=https://gist.githubusercontent.com/tompearson/659f1cedea8c6dca0879260051e65b67/raw/guidelines-content.md
```

## 🚀 Setup Instructions

### 1. **Local Development**
```bash
# Add to your .env file
echo ADDITIONAL_GUIDELINES_URL=https://gist.githubusercontent.com/tompearson/659f1cedea8c6dca0879260051e65b67/raw/guidelines-content.md >> .env
```

### 2. **Production Environment**
```bash
# Add to Vercel production
vercel env add ADDITIONAL_GUIDELINES_URL production

# Or use the batch script
add-additional-guidelines-env.bat
```

### 3. **Deploy Changes**
```bash
vercel --prod
```

## 📊 UI Indicators

### Guidelines Modal
- **Combined Rules (2 Gists)**: Shows when both Gists are successfully loaded
- **Dynamic Rules (Gist)**: Shows when only primary Gist is loaded
- **Embedded Rules**: Shows when falling back to embedded content

### Moderation Results
- **Combined Rules (2 Gists)**: Indicates combined guidelines were used
- **Dynamic Rules (Gist)**: Indicates single Gist was used
- **Embedded Rules**: Indicates fallback was used

## 🔄 Update Process

### Primary Guidelines
1. Edit your main Gist on GitHub
2. Changes are automatically picked up after cache expires (1 hour)
3. Or use the "Refresh" button for immediate update

### Additional Guidelines
1. Edit the additional Gist on GitHub
2. Changes are automatically picked up after cache expires (1 hour)
3. Or use the "Refresh" button for immediate update

## 🛠️ Technical Implementation

### Backend Changes
```javascript
// New configuration
const GUIDELINES_CONFIG = {
  url: process.env.GUIDELINES_URL,
  additionalUrl: process.env.ADDITIONAL_GUIDELINES_URL,
  // ... other config
};

// Combined fetch logic
let combinedContent = '';
const primaryContent = await fetchGuidelinesFromURL(GUIDELINES_CONFIG.url);
const additionalContent = await fetchGuidelinesFromURL(GUIDELINES_CONFIG.additionalUrl);

if (primaryContent) combinedContent += primaryContent;
if (additionalContent) {
  if (combinedContent) combinedContent += '\n\n---\n\n';
  combinedContent += additionalContent;
}
```

### Frontend Changes
```javascript
// New source type handling
{currentGuidelines?.guidelines?.source === 'combined_url' ? (
  <span className="source-badge url">
    🌐 Combined Rules (2 Gists)
  </span>
) : // ... other cases
```

## 🚨 Troubleshooting

### Common Issues

#### Additional Guidelines Not Loading
1. **Check environment variable**: `vercel env ls`
2. **Verify URL accessibility**: Test the Gist URL directly
3. **Check network connectivity**: Ensure GitHub is accessible

#### Combined Content Not Showing
1. **Check cache**: Wait for 1-hour cache to expire
2. **Use manual refresh**: Click "Refresh" button
3. **Verify both URLs**: Ensure both Gists are accessible

#### Fallback to Embedded
1. **Check both URLs**: Ensure both Gists are configured
2. **Verify permissions**: Ensure Gists are public
3. **Check timeout settings**: 10-second timeout may need adjustment

## 📈 Benefits

### 1. **Comprehensive Rules**
- Combine different rule sets
- Maintain separation of concerns
- Easy to update individual rule categories

### 2. **Flexibility**
- Add supplementary guidelines without modifying main rules
- Test new rules in separate Gist
- Maintain version control for different rule sets

### 3. **Reliability**
- If one Gist fails, the other can still work
- Fallback system ensures app always functions
- Caching reduces API calls

## 🔗 Related Documentation

- [GUIDELINES_URL_EXPLANATION.md](./GUIDELINES_URL_EXPLANATION.md) - How Gist URLs work
- [VERCEL_TIPS_AND_TRICKS.md](./VERCEL_TIPS_AND_TRICKS.md) - Vercel deployment guide
- [GIST_SETUP.md](./GIST_SETUP.md) - Original Gist setup guide

---

*This dual Gist system provides comprehensive, flexible, and reliable guidelines for the moderation tool.*

*Last updated: August 2025*

---

## Last Updated
- **Date**: August 15, 2025
- **Version 0.8.40-alpha
- **Status**: Dual Gist setup documentation complete
- **Next Action**: Ready for production deployment
