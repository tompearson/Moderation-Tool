# Versioning Workflow

This document outlines the correct order for updating versions across all components of the Community Moderation Tool to ensure proper synchronization.

## **Complete Git Versioning Workflow (Correct Order)**

### **Step 1: Update Version Files**
```bash
# 1. Bump version in package.json and public/version.js
npm run bump-patch

# 2. Verify both files are updated
cat package.json | grep version
cat public/version.js | grep number
```

### **Step 2: Commit Version Changes**
```bash
# 3. Add all version-related files
git add package.json package-lock.json public/version.js README.md postman_collection.json postman_collection_production.json

# 4. Commit version bump
git commit -m "chore: bump version to X.X.X-alpha"
```

### **Step 3: Create Git Tag**
```bash
# 5. Create tag matching the new version
git tag vX.X.X-alpha

# 6. Verify tag was created
git tag
```

### **Step 4: Push Everything**
```bash
# 7. Push commits to remote
git push origin master

# 8. Push tag to remote
git push origin vX.X.X-alpha
```

### **Step 5: Verify Frontend Shows Correct Version**
```bash
# 9. Restart development server
npm run dev:separate

# 10. Check frontend displays correct version
# Go to http://127.0.0.1:3000/ and verify version
```

## **Key Points to Remember:**

1. **Always update `public/version.js`** - This is what the frontend reads
2. **Commit version changes BEFORE creating tag**
3. **Tag should match the version in both `package.json` and `public/version.js`**
4. **Restart dev server after version changes** to see frontend updates

## **Example for Next Version 0.8.40-alpha):**

```bash
# 1. Bump version
npm run bump-patch

# 2. Verify both files show 0.8.40-alpha
# 3. Add and commit
git add package.json package-lock.json public/version.js README.md postman_collection.json postman_collection_production.json
git commit -m "chore: bump version to 0.8.40-alpha"

# 4. Create and push tag
git tag v0.8.40-alpha
git push origin master
git push origin v0.8.40-alpha

# 5. Restart server and verify frontend
npm run dev:separate
```

## **Version Bump Types:**

- **Patch**: `npm run bump-patch` (0.8.16 → 0.8.17)
- **Minor**: `npm run bump-minor` (0.8.16 → 0.9.0)  
- **Major**: `npm run bump-major` (0.8.16 → 1.0.0)

## **Troubleshooting:**

### **Frontend Shows Wrong Version**
1. Check `public/version.js` matches `package.json`
2. Restart development server: `npm run dev:separate`
3. Clear browser cache if needed

### **Git Tag Missing**
1. Verify tag was created: `git tag`
2. Push tag to remote: `git push origin vX.X.X-alpha`

### **Version Files Out of Sync**
1. Manually update `public/version.js` to match `package.json`
2. Commit the fix
3. Restart development server

## **Files That Get Updated:**

- `package.json` - Project metadata and version
- `public/version.js` - Frontend version display (served as `/version.js` by Vite)

- `README.md` - Documentation updates
- `postman_collection.json` - API documentation
- `postman_collection_production.json` - Production API docs

## **Important Notes:**

### **Vite File Serving**
- Files in the `public/` directory are served at the root path
- `public/version.js` is accessible as `/version.js` in the browser
- Always reference version files as `/version.js` in HTML, not `/public/version.js`

### **Version File Locations**
- **Frontend**: `public/version.js` (served as `/version.js`)
- **Backend**: `public/version.js` (imported as `../public/version.js`)
- **Scripts**: `public/version.js` (referenced as `../public/version.js`)

This ensures the frontend always shows the correct version that matches our git tags! 

## 🎯 **Next Steps**

1. **Follow the workflow** for version updates
2. **Test thoroughly** before deployment
3. **Deploy to production** with confidence

---

## Last Updated
- **Date**: August 15, 2025
- **Version 0.8.40-alpha
- **Status**: Versioning workflow documentation complete
- **Next Action**: Ready for production deployment 