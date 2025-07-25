# Release Notes - v0.8.0-alpha

**Release Date:** July 25, 2025  
**Version:** 0.8.0-alpha  
**Type:** Alpha Release

## 🎉 What's New

### Centralized Version Management
- **Single Source of Truth**: All version information is now managed from one file (`version.js`)
- **Automated Updates**: New script automatically updates version numbers across all project files
- **Consistent Versioning**: No more hardcoded version numbers scattered throughout the codebase

### Improved Development Experience
- **Fixed Port Conflicts**: Frontend and backend now run on separate ports (3000 and 3001) without conflicts
- **Better Startup Scripts**: Updated batch files for more reliable server startup
- **IPv4-Only Binding**: Eliminated IPv6-related network issues

### Enhanced Frontend
- **Fixed Environment Variables**: Resolved "process is not defined" errors in the browser
- **Dynamic Version Display**: Version number now updates automatically from centralized source
- **Improved Error Handling**: Better error messages and debugging information

## 🔧 Technical Improvements

### Network Configuration
- Backend server now binds to `127.0.0.1:3001` for consistent IPv4 operation
- Frontend development server uses `127.0.0.1:3000` with strict port binding
- Added proxy configuration for seamless API communication

### Development Tools
- New `npm run update-version` script for automated version management
- Updated Postman collections with current version and timestamps
- Improved batch files for independent server startup

### Code Quality
- Standardized environment variable access patterns
- Removed hardcoded values and implemented centralized configuration
- Enhanced error handling and debugging capabilities

## 🐛 Bug Fixes

- **Port Conflicts**: Resolved issues where frontend and backend would compete for the same port
- **Environment Variables**: Fixed "process is not defined" errors in Vite frontend
- **Network Binding**: Eliminated IPv6 process conflicts on port 3001
- **Startup Scripts**: Corrected batch files to start the intended servers

## 📋 Breaking Changes

> ⚠️ **Important**: This release includes breaking changes that may affect development workflows.

### Network Configuration Changes
- Backend now runs on port 3001 instead of 3000
- Frontend now uses strict port binding (no automatic fallback)
- All servers now bind to IPv4 (`127.0.0.1`) instead of all interfaces

### Environment Variable Changes
- Frontend now uses `import.meta.env` instead of `process.env`
- API port configuration changed from `REACT_APP_API_PORT` to `VITE_API_PORT`

## 🚀 Getting Started

### For New Users
1. Clone the repository
2. Run `npm install` to install dependencies
3. Use `start-backend.bat` to start the backend server
4. Use `start-frontend.bat` to start the frontend server
5. Access the application at `http://127.0.0.1:3000`

### For Existing Users
1. Update your local repository
2. Run `npm install` to update dependencies
3. Update any custom startup scripts to use the new port configuration
4. Test the application to ensure everything works as expected

## 📚 Documentation

- **VERSION_MANAGEMENT.md**: Complete guide to the new version management system
- **Updated README.md**: Current project information and setup instructions
- **Updated Postman Collections**: Current API documentation and examples

## 🔮 What's Next

- Beta release with additional features
- Enhanced error handling and user feedback
- Performance optimizations
- Additional API endpoints

## 📞 Support

If you encounter any issues with this release, please:
1. Check the troubleshooting section in VERSION_MANAGEMENT.md
2. Review the updated documentation
3. Test with the provided Postman collections

---

**Note**: This is an alpha release intended for development and testing purposes. Not recommended for production use. 