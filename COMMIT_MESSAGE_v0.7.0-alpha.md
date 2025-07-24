feat: v0.7.0-alpha - Consolidated moderation rules and improved API reliability

## Major Changes
- **Consolidated moderation rules**: Removed .cursorrules file and made moderate.js the single source of truth
- **Improved API reliability**: Enhanced error handling and response parsing
- **Better character limit handling**: More robust truncation and formatting
- **Cleaner codebase**: Eliminated duplication and improved maintainability

## Technical Improvements
- Hardcoded moderation rules as string constant in moderate.js for better reliability
- Enhanced prompt engineering with dynamic character limit instructions
- Improved response parsing with better fallback handling
- Added comprehensive logging for debugging and monitoring
- Streamlined deployment with fewer file dependencies

## Breaking Changes
- None - this is a backward compatible release

## Files Changed
- Removed: .cursorrules (consolidated into moderate.js)
- Modified: api/moderate.js (enhanced rules handling and reliability)
- Updated: Various configuration and documentation files

## Testing
- Verified moderation API functionality with various test cases
- Confirmed character limit handling works correctly
- Tested error scenarios and fallback mechanisms

## Deployment Notes
- No environment variable changes required
- No database migrations needed
- Ready for immediate deployment 