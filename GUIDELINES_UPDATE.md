# Guidelines Update Guide

## Single Source of Truth

All community moderation guidelines are now centralized in **`api/utils/guidelines.js`**. This file serves as the single source of truth for all guideline content.

## File Structure

- **`api/utils/guidelines.js`** - Core guidelines module (single source of truth)
- **`api/guidelines-endpoint.js`** - API endpoint that serves guidelines to clients

## How to Update Guidelines

### 1. Edit the Main File
Open `api/utils/guidelines.js` and modify the `MODERATION_RULES` constant:

```javascript
const MODERATION_RULES = `# Community Moderation Rules (.cursorrules)

## Purpose
Check whether a flagged post violates community guidelines. 

// ... your updated content here ...
`;
```

### 2. What Gets Updated Automatically

When you update `MODERATION_RULES` in `api/utils/guidelines.js`, the changes automatically apply to:

- ✅ **API Endpoint** (`api/guidelines-endpoint.js`) - Serves guidelines to clients
- ✅ **Moderation API** (`api/routes.js`) - Uses guidelines for content moderation
- ✅ **Structured Data** - Rules, coverage areas, and parsed content
- ✅ **Version Tracking** - Includes version info and timestamps

### 3. Available Functions

The guidelines module provides these functions:

- `loadGuidelines()` - Returns raw guidelines content
- `parseGuidelines()` - Returns structured data with rules and coverage
- `getGuidelinesWithMetadata()` - Returns guidelines with version info for API responses
- `MODERATION_RULES` - Direct access to raw content

### 4. Testing Your Changes

After updating guidelines:

1. **Restart your development server** (if running locally)
2. **Test the API endpoint**: `GET /api/guidelines`
3. **Test moderation**: `POST /api/moderate` with sample content
4. **Verify structured data**: Check that `parseGuidelines()` returns correct rules

### 5. Deployment

Guidelines updates are automatically deployed when you push to your repository, as they're embedded in the code rather than stored externally.

## Benefits of This Approach

- **Single Update Point** - Change guidelines in one place
- **No Sync Issues** - Eliminates duplicate content problems
- **Version Control** - All changes are tracked in git
- **Fast Updates** - No external dependencies or file system reads
- **Consistent Data** - All parts of the system use the same guidelines
- **Clear Naming** - No confusion between utility module and API endpoint

## Example Update

To add a new rule:

1. Edit `api/utils/guidelines.js`
2. Add your new rule to the `MODERATION_RULES` content
3. Optionally update the `parseGuidelines()` function to include the new rule in structured data
4. Test and deploy

That's it! All systems will automatically use your updated guidelines. 