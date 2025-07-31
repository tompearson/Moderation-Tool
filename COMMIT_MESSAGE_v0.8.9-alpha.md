docs: add commit message files for v0.8.7-alpha and v0.8.8-alpha

DOCUMENTATION:
- Add COMMIT_MESSAGE_v0.8.7-alpha.md documenting responsive design improvements
- Add COMMIT_MESSAGE_v0.8.8-alpha.md documenting Postman collection version fix
- Maintain consistent commit message documentation pattern

FEATURES:
- Comprehensive responsive design improvements for mobile devices
- Fixed AI model information display in moderation responses
- Updated Postman collection versions to match current application version

FIXES:
- Resolved missing AI model information in backend response
- Fixed header layout issues on small screens
- Corrected button stacking and spacing on mobile devices
- Updated Community Moderation API.postman_collection.json version

IMPROVEMENTS:
- Added responsive breakpoints for phones (≤480px) and tablets (≤768px)
- Implemented better touch targets (44px minimum) for mobile buttons
- Added iOS zoom prevention with 16px font-size on focus
- Improved modal responsiveness for mobile devices

FILES ADDED:
- COMMIT_MESSAGE_v0.8.7-alpha.md (responsive design documentation)
- COMMIT_MESSAGE_v0.8.8-alpha.md (Postman collection fix documentation)

FILES MODIFIED:
- src/index.css (comprehensive responsive design improvements)
- src/App.jsx (removed character limit from heading)
- api/moderate.js (fixed AI model information in response)
- Community Moderation API.postman_collection.json (version update)

This release includes comprehensive mobile responsiveness improvements
and proper documentation of all changes made in the version series. 