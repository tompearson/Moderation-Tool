# Development Notes

## Workflow Optimizations

### Git Commands
- **Use `git status --porcelain` instead of `git status`** when using automated tools
  - More reliable and faster execution
  - Machine-readable output format
  - Avoids hanging issues that can occur with full `git status`
  - Output format: `A filename` (added/staged), `M filename` (modified/not staged)

### Terminal Issues
- **Bash terminal works better** than command prompt for git operations
- **Kill node processes** if terminal hangs: `taskkill /f /im node.exe`
- **Use `--porcelain` flag** for reliable git status checks

### Version Management
- **Centralized version file**: `public/version.js` is the single source of truth
- **Vite serving**: Files in `public/` directory are served at root path (`/version.js`, not `/public/version.js`)
- **Update `public/version.js`** whenever `package.json` version changes
- **Backend imports**: Use `require('../public/version.js')` or `require('../../public/version.js')`

### API Development
- **File location matters**: `api/utils/ai.js` contains the actual `parseModerationResponse` function
- **Debug with console.log**: Add debug statements to trace execution flow
- **Restart server** after code changes to ensure updates are loaded
- **Check file imports**: Verify which files are actually being used by the server

### Frontend Development
- **Version display**: Use `window.APP_VERSION` from `/version.js`
- **CSS changes**: May require browser refresh to see updates
- **React state**: Use `useState` for dynamic content updates

## Common Issues and Solutions

### Server Not Picking Up Changes
1. Check if you're editing the correct file (verify imports)
2. Restart the server completely
3. Clear browser cache
4. Check for syntax errors in console

### Version Mismatches
1. Update `public/version.js` to match `package.json`
2. Verify git tags align with version numbers
3. Check frontend displays correct version

### Terminal Hanging
1. Kill all node processes
2. Switch to bash terminal
3. Use `--porcelain` flag for git commands
4. Restart terminal if needed

## Important Files and Their Purposes

- `public/version.js` - Centralized version management
- `api/utils/ai.js` - AI interaction and response parsing
- `api/utils/guidelines.js` - Dynamic guidelines fetching
- `src/App.jsx` - Main React component
- `src/index.css` - Frontend styling
- `server.js` - Express server entry point
- `api/routes.js` - API endpoint definitions

## Environment Variables

- `GUIDELINES_URL` - URL for dynamic guidelines fetching
- `GOOGLE_API_KEY` - Google AI API key
- `PORT` - Server port (default: 3001)

## Testing Commands

- `npm run dev:separate` - Start both frontend and backend
- `npm run dev:frontend` - Start frontend only
- `npm run dev:backend` - Start backend only
- `curl http://127.0.0.1:3001/api/health` - Test health endpoint
- `curl http://127.0.0.1:3001/api/guidelines` - Test guidelines endpoint 

## 🎯 **Next Steps**

1. **Test the new routing** with clean URLs
2. **Verify HTML pages** load correctly
3. **Deploy to production** with `vercel --prod`

---

## Last Updated
- **Date**: August 15, 2025
- **Version 0.8.40-alpha
- **Status**: Development notes updated for clean URL implementation
- **Next Action**: Ready for production deployment 