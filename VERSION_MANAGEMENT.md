# Version Management System

## Overview

This project now uses a centralized version management system to prevent version inconsistencies across files.

## Current Version

**v0.8.50-alpha** - Successfully deployed to Vercel with clean URLs

## How It Works

### 1. Single Source of Truth
- **`public/version.js`** - Contains the current version information
- All other files import version from this central location

### 2. Files That Use Centralized Version
- ✅ `api/health.js` - Health endpoint version
- ✅ `api/routes.js` - Routes health endpoint version  
- ✅ `api/guidelines-endpoint.js` - Guidelines endpoint version
- ✅ `package.json` - Updated automatically by script
- ✅ `package-lock.json` - Regenerated automatically by script
- ✅ `README.md` - Version indicator updated automatically
- ✅ `Community Moderation API.postman_collection.json` - Example responses updated automatically
- ✅ `public/about.html` - Version display on About page

### 3. Version Update Process

#### To Update Version:
1. **Edit `public/version.js`** - Change the version number in the `number` field
2. **Run update script** - `npm run update-version`
3. **Test the application** - Ensure everything works
4. **Build and deploy** - `npm run build && vercel --prod`
5. **Commit changes** - `git add . && git commit -m "v0.8.50-alpha: New features"`
6. **Create git tag** - `git tag v0.8.50-alpha && git push origin v0.8.50-alpha`

#### Example Version Update:
```javascript
// In public/version.js
const VERSION = {
  number: '0.8.50-alpha',  // ← Change this line
  major: 0,
  minor: 8,                // ← Update these accordingly
  patch: 31,
  prerelease: 'alpha',
  full: '0.8.50-alpha'     // ← This will be auto-generated
};
```

### 4. Automatic Updates

The `npm run update-version` script automatically:
- ✅ Updates `package.json` version
- ✅ Updates Postman collection example responses
- ✅ Updates README.md version indicator
- ✅ Regenerates `package-lock.json`
- ✅ Provides next steps for git tagging

### 5. Version Format

The version follows semantic versioning:
- **Major.Minor.Patch-Prerelase**
- Example: `0.8.50-alpha`
- **Major**: Breaking changes
- **Minor**: New features, backward compatible
- **Patch**: Bug fixes, backward compatible
- **Prerelease**: alpha, beta, rc (release candidate)

## Production Deployment

### Current Status
- ✅ **Version 0.8.50-alpha
- ✅ **Production URL**: https://moderation-assistant-tool.vercel.app/
- ✅ **Deployment**: Working with clean URLs
- ✅ **Build Process**: Optimized for Vercel

### Deployment Workflow
1. **Update version** in `public/version.js`
2. **Build project** with `npm run build`
3. **Deploy to Vercel** with `vercel --prod`
4. **Verify deployment** at production URL
5. **Test clean URLs** (`/about`, `/docs`, `/contact`)

## Benefits

✅ **No more manual updates** - Single file to change  
✅ **Consistent versions** - All files always match  
✅ **Automated process** - Script handles all updates  
✅ **Error prevention** - No more forgotten files  
✅ **Easy maintenance** - Clear process for version updates  
✅ **Production ready** - Version updates automatically deploy to Vercel

## Troubleshooting

### Version Not Updating in API Response
1. Restart the server after version changes
2. Check that `public/version.js` is being imported correctly
3. Verify the server is running the updated code

### Production Version Not Updating
1. Ensure you've run `npm run build` after version changes
2. Deploy with `vercel --prod` to update production
3. Check that `public/version.js` is being copied to `dist/`

### Script Errors
1. Ensure `scripts/update-version.js` exists and is executable
2. Check that all file paths in the script are correct
3. Verify npm has write permissions to update files

## Future Improvements

- [ ] Add version validation (semantic versioning check)
- [ ] Add changelog generation
- [ ] Add version bump helpers (patch, minor, major)
- [ ] Add pre-commit hooks to ensure version consistency
- [ ] Add automatic Vercel deployment after version updates

---

## Last Updated
- **Date**: August 15, 2025
- **Version 0.8.50-alpha
- **Status**: Version management system working with centralized control
- **Next Action**: Ready for production deployment 