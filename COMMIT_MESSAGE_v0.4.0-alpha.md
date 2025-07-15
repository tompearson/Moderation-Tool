feat: Add full-stack API with organized structure (v0.4.0-alpha)

## Major Features Added

### 🏗️ Full-Stack Architecture
- **Express.js Server**: Complete backend API implementation
- **API Folder Structure**: Organized modular architecture
- **Middleware Support**: Error handling and request processing
- **Utility Functions**: Separated AI and guidelines logic

### 📁 New API Structure
```
api/
├── README.md              # API documentation
├── routes.js              # Main API endpoints
├── middleware/
│   └── errorHandler.js    # Error handling middleware
└── utils/
    ├── ai.js              # AI model interactions
    └── guidelines.js      # Guidelines loading and parsing
```

### 🔌 API Endpoints
- **GET /api/health** - Service health check
- **GET /api/guidelines** - Structured community guidelines
- **POST /api/moderate** - AI-powered post moderation

### 🛠️ Development Improvements
- **Multiple Run Modes**:
  - `npm run dev` - Frontend only (Vite dev server)
  - `npm run start` - Full-stack production build
  - `npm run dev:full` - Both dev servers for development
  - `npm run server` - Express server only

### 📋 Postman Integration
- **Postman Collection**: Complete API collection with examples
- **OpenAPI Specification**: Standard API documentation
- **Setup Guide**: Step-by-step Postman configuration
- **Environment Variables**: Pre-configured for easy testing

### 🔧 Technical Enhancements
- **Modular Code**: Separated concerns into utilities and middleware
- **Error Handling**: Centralized error management
- **Model Fallback**: Robust AI model selection with fallback
- **CORS Support**: Cross-origin resource sharing enabled
- **Static File Serving**: Built React app served by Express

### 📚 Documentation Updates
- **API Documentation**: Complete endpoint documentation
- **README Updates**: New installation and usage instructions
- **Folder Structure**: Clear organization documentation
- **Development Guide**: Multiple run mode explanations

### 🔒 Security & Performance
- **Server-side API Key Handling**: Better security than client-side
- **Environment Variables**: Support for production configuration
- **Request Validation**: Input validation and error responses
- **Consistent Response Format**: Standardized API responses

## Breaking Changes
- None - all changes are additive

## Migration Guide
- Existing frontend functionality unchanged
- New API endpoints available for external integration
- Postman collection ready for immediate use

## Files Added
- `server.js` - Express server implementation
- `api/` - Complete API folder structure
- `postman_collection.json` - Postman collection
- `openapi.yaml` - OpenAPI specification
- `POSTMAN_SETUP.md` - Setup instructions

## Files Modified
- `package.json` - Added Express, CORS, and new scripts
- `README.md` - Updated with API documentation
- `src/index.css` - Minor styling improvements

## Dependencies Added
- `express` - Web server framework
- `cors` - Cross-origin resource sharing
- `concurrently` - Run multiple commands (dev dependency)

## Testing
- ✅ All API endpoints tested and working
- ✅ Postman collection validated
- ✅ Error handling verified
- ✅ Model fallback tested
- ✅ Frontend integration confirmed

## Next Steps
- Deploy to production environment
- Set up environment variables for API keys
- Configure authentication if needed
- Monitor API usage and performance 