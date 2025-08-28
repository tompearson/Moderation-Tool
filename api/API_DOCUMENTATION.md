# API Documentation

This folder contains the backend API implementation for the Community Moderation Tool.

## Folder Structure

```
api/
├── README.md              # This file
├── routes.js              # Main API routes
├── middleware/
│   └── errorHandler.js    # Error handling middleware
└── utils/
    ├── ai.js              # AI model interactions
    └── guidelines.js      # Guidelines loading and parsing
```

## API Endpoints

### Health Check
- **GET** `/api/health`
- Returns service status and version information

### Guidelines
- **GET** `/api/guidelines`
- Returns structured community guidelines

### Moderation
- **POST** `/api/moderate`
- Analyzes flagged posts using AI
- **Body**: `{ "postContent": "string" }`
- **Response**: `{ "success": true, "decision": "Keep|Remove", "reason": "string", "model": "string" }`

## Utilities

### `utils/ai.js`
- `generateContent(prompt)` - Generate content with model fallback
- `parseModerationResponse(text)` - Parse AI response into structured format
- `MODELS` - Array of available models in fallback order

### `utils/guidelines.js`
- `loadGuidelines()` - Load guidelines from external URL for display
- `getGuidelinesForDisplay()` - Get guidelines formatted for frontend display
- `refreshGuidelines()` - Force refresh guidelines from external source
- `getCacheStatus()` - Get current cache status and configuration

## Middleware

### `middleware/errorHandler.js`
- Centralized error handling for all API routes
- Handles validation errors, unauthorized access, and file not found errors
- Returns consistent error response format

## Usage

The API is automatically loaded by the main `server.js` file:

```javascript
const apiRoutes = require('./api/routes');
app.use('/api', apiRoutes);
```

## Error Handling

All API endpoints use consistent error handling:

```json
{
  "success": false,
  "error": "Error description",
  "timestamp": "2024-12-15T10:30:00Z"
}
```

## Development

To add new endpoints:
1. Add route handlers to `routes.js`
2. Create utility functions in `utils/` if needed
3. Add middleware in `middleware/` if required
4. Update this README with new endpoint documentation 

---

## Last Updated
- **Date**: 08-15-2025
- **Version 0.8.50-alpha
- **Status**: Documentation updated for version 0.8.50-alpha
- **Next Action**: Ready for production deployment