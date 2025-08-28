# Guidelines Update System

## Overview

The Community Moderation Tool now supports dynamic loading of moderation guidelines from external URLs. This allows you to keep your moderation rules up-to-date without manually updating the code.

## Current Implementation

### How It Works

1. **URL Fetching**: The system attempts to fetch guidelines from a configured URL
2. **Smart Caching**: Successful fetches are cached for 1 hour to improve performance
3. **Fallback System**: If URL fetching fails, it automatically falls back to embedded rules
4. **Content Validation**: Fetched content is validated to ensure it's meaningful

### Configuration

Set the `GUIDELINES_URL` environment variable:

```bash
# Use external URL
GUIDELINES_URL=https://help.nextdoor.com/s/article/community-guidelines?language=en_GB

# Use embedded rules only
GUIDELINES_URL=embedded

# Use a different URL
GUIDELINES_URL=https://your-own-guidelines-url.com
```

### API Endpoints

- **GET** `/api/guidelines-endpoint` - Check guidelines status and cache info
- **POST** `/api/guidelines-endpoint` - Force refresh guidelines from URL

## Current Issue with Nextdoor URL

The Nextdoor guidelines URL (`https://help.nextdoor.com/s/article/community-guidelines?language=en_GB`) appears to be a dynamic page that requires JavaScript to load content. The current implementation can only fetch static HTML content.

## Alternative Approaches

### 1. Use a Static Guidelines URL

Create your own guidelines page that serves static content:

```bash
# Example: Use a GitHub Gist or GitHub Pages
GUIDELINES_URL=https://gist.githubusercontent.com/yourusername/guidelines-raw/main/guidelines.md
```

### 2. Use a Markdown File

Create a simple markdown file with your guidelines and host it:

```markdown
# Community Guidelines

## Be Respectful
- No hate speech or harassment
- No personal attacks

## Keep It Relevant  
- Posts must be relevant to local community
- No off-topic content

## No Misinformation
- Do not share false information
- Health and safety claims must be accurate
```

### 3. Use a JSON API

Create a simple API that returns guidelines:

```json
{
  "guidelines": "# Community Guidelines\n\n## Be Respectful\n- No hate speech\n\n## Keep It Relevant\n- Local content only",
  "version": "1.0.0",
  "lastUpdated": "2024-08-02"
}
```

### 4. Use a Webhook System

Set up a webhook that updates guidelines when your source changes:

```bash
# Webhook endpoint to receive guideline updates
POST /api/guidelines-webhook
{
  "guidelines": "new guidelines content",
  "version": "1.0.1"
}
```

## Testing the System

### Test Current Implementation

```bash
# Test guidelines fetching
node test-guidelines.js

# Test URL content analysis  
node test-url-content.js
```

### Test with Different URLs

```bash
# Test with a GitHub Gist
GUIDELINES_URL=https://gist.githubusercontent.com/username/guidelines-raw/main/guidelines.md node test-guidelines.js

# Test with a raw text file
GUIDELINES_URL=https://raw.githubusercontent.com/username/repo/main/guidelines.txt node test-guidelines.js
```

## Recommended Solution

For reliable guidelines updates, I recommend:

1. **Create a GitHub Gist** with your guidelines in markdown format
2. **Use the raw URL** of the Gist as your `GUIDELINES_URL`
3. **Update the Gist** whenever guidelines change
4. **The system will automatically fetch** the updated guidelines

Example:
```bash
GUIDELINES_URL=https://gist.githubusercontent.com/yourusername/guidelines-raw/main/guidelines.md
```

## Monitoring

Check guidelines status via the API:

```bash
curl http://localhost:3000/api/guidelines-endpoint
```

Force refresh guidelines:

```bash
curl -X POST http://localhost:3000/api/guidelines-endpoint \
  -H "Content-Type: application/json" \
  -d '{"action": "refresh"}'
```

## Fallback Behavior

The system is designed to be robust:

1. **URL Fetching**: Attempts to fetch from configured URL
2. **Content Validation**: Ensures fetched content is meaningful
3. **Embedded Fallback**: Uses built-in rules if URL fails
4. **Caching**: Reduces load on external servers
5. **Error Handling**: Graceful degradation on failures

This ensures your moderation tool always has working guidelines, even if external sources are unavailable. 

## 🎯 **Next Steps**

1. **Update your Gist** with new guidelines
2. **Test the changes** in production
3. **Verify content** loads correctly

---

## Last Updated
- **Date**: August 15, 2025
- **Version 0.8.50-alpha
- **Status**: Guidelines update documentation complete
- **Next Action**: Ready for production deployment 