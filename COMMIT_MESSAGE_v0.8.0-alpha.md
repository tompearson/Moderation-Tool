feat: implement centralized version management and fix network configuration

BREAKING CHANGES:
- Backend now binds to 127.0.0.1:3001 instead of 0.0.0.0:3000
- Frontend now uses 127.0.0.1:3000 with strict port binding
- Environment variable access changed from process.env to import.meta.env in frontend

FEATURES:
- Add centralized version management system (version.js)
- Add automated version update script (scripts/update-version.js)
- Add VERSION_MANAGEMENT.md documentation
- Update all Postman collections to use current version and timestamps
- Implement proper IPv4-only binding to prevent IPv6 conflicts

FIXES:
- Resolve port conflicts between frontend (3000) and backend (3001)
- Fix "process is not defined" error in frontend by using import.meta.env
- Correct start-backend.bat to run npm run server instead of dev
- Update vite.config.js to use strictPort: true and host: '127.0.0.1'
- Add proxy configuration in vite.config.js for API requests
- Update CORS origins to include 127.0.0.1:3000
- Fix environment variable access in App.jsx for Vite compatibility

IMPROVEMENTS:
- Add pause command to start-backend.bat for better UX
- Update start-frontend.bat to use npm run dev instead of dev:full
- Centralize version display in App.jsx using window.APP_VERSION
- Add version.js script loading in main.jsx
- Update all timestamps in Postman collections to 2025-07-25T10:30:00Z
- Regenerate package-lock.json with current dependencies

TECHNICAL DEBT:
- Remove hardcoded version numbers from multiple files
- Implement automated version synchronization across all project files
- Standardize network addressing to use 127.0.0.1 consistently

FILES ADDED:
- version.js (centralized version management)
- scripts/update-version.js (automated version updates)
- VERSION_MANAGEMENT.md (documentation)

FILES MODIFIED:
- package.json (added update-version script, updated version)
- server.js (port 3001, IPv4 binding, CORS updates)
- vite.config.js (strictPort, IPv4 host, proxy config)
- src/App.jsx (import.meta.env, centralized version display)
- src/main.jsx (version.js script loading)
- start-backend.bat (correct npm command, added pause)
- start-frontend.bat (npm run dev instead of dev:full)
- README.md (version indicator update)
- All Postman collection files (version and timestamp updates)
- package-lock.json (regenerated)

This release establishes a robust foundation for version management and resolves
critical network configuration issues that were preventing proper frontend-backend
communication in development environments. 