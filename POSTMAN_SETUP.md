# Postman Integration Guide

This guide will help you import and set up the Community Moderation API in Postman.

## 📋 What You Need

1. **Postman Desktop App** (or Postman web)
2. **Your Google AI API Key**: `YOUR_API_KEY_HERE`
3. **Local Development Server**: Running on `http://localhost:3000`

## 🚀 Quick Start

### Option 1: Import OpenAPI Specification (Recommended)

1. **Open Postman**
2. **Click "Import"** in the top left
3. **Choose "File"** tab
4. **Select `openapi.yaml`** from this repository
5. **Click "Import"**

### Option 2: Import Postman Collection

1. **Open Postman**
2. **Click "Import"** in the top left
3. **Choose "File"** tab
4. **Select `postman_collection.json`** from this repository
5. **Click "Import"**

## ⚙️ Configuration

### Set Environment Variables

1. **Create a new environment** in Postman:
   - Click the gear icon (⚙️) in the top right
   - Click "Add" to create a new environment
   - Name it "Community Moderation API"

2. **Add these variables**:
   ```
   baseUrl: http://localhost:3000
   GEMINI_API_KEY: your_actual_api_key_here
   ```

3. **Select the environment** from the dropdown in the top right

## 📡 Available Endpoints

### 1. Moderate Post
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/moderate`
- **Description**: Analyze a flagged community post
- **Body**:
  ```json
  {
    "postContent": "Your post content here"
  }
  ```

### 2. Health Check
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/health`
- **Description**: Check if the service is running

### 3. Get Guidelines
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/guidelines`
- **Description**: Retrieve community moderation guidelines

## 🧪 Testing Examples

### Test Case 1: Legitimate Post (Should Keep)
```json
{
  "postContent": "Lost my keys near the park on Main Street. If anyone finds them, please let me know. Thanks neighbors!"
}
```

**Expected Response**:
```json
{
  "success": true,
  "decision": "Keep",
  "reason": "This post is a legitimate community concern about lost property...",
  "model": "gemini-2.5-pro",
  "timestamp": "2024-12-15T10:30:00Z"
}
```

### Test Case 2: Hate Speech (Should Remove)
```json
{
  "postContent": "I hate all the immigrants moving into our neighborhood. They're ruining everything and should go back where they came from!"
}
```

**Expected Response**:
```json
{
  "success": true,
  "decision": "Remove",
  "reason": "This post violates Rule 1 (Be Respectful) and Rule 3 (Do Not Discriminate)...",
  "model": "gemini-2.5-pro",
  "timestamp": "2024-12-15T10:30:00Z"
}
```

### Test Case 3: Political Content (Should Remove)
```json
{
  "postContent": "Everyone should boycott the new restaurant on Oak Ave because the owner is a Democrat and supports liberal policies."
}
```

## 🔧 Troubleshooting

### "Unable to find any files to import"
- Make sure you're selecting the correct file (`openapi.yaml` or `postman_collection.json`)
- Verify the file is in your repository
- Try downloading the file first, then importing

### "Connection refused" or "Cannot connect"
- Ensure your local development server is running (`npm run dev`)
- Check that the server is on `http://localhost:3000`
- Verify the `baseUrl` environment variable is set correctly

### "Invalid API key" error
- Check that your Google AI API key is correct
- Verify the `GEMINI_API_KEY` environment variable is set
- Ensure you have sufficient quota in your Google AI account

### "Model overloaded" error
- The API automatically retries with different models
- Wait a few minutes and try again
- Check your Google AI usage limits

## 📊 Response Codes

| Status | Description |
|--------|-------------|
| 200 | Success - moderation analysis complete |
| 400 | Bad request - missing or invalid input |
| 401 | Unauthorized - invalid API key |
| 429 | Rate limit exceeded |
| 500 | Internal server error - model unavailable |

## 🎯 **Next Steps**

1. **Test your API endpoints** with Postman
2. **Verify responses** match expected format
3. **Update collections** as needed

---

## Last Updated
- **Date**: August 15, 2025
- **Version 0.8.50-alpha
- **Status**: Postman setup documentation complete
- **Next Action**: Ready for production deployment

## 📚 Additional Resources

- [Postman Documentation](https://learning.postman.com/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Google AI API Documentation](https://ai.google.dev/docs)

---

**Note**: This API is currently in development (v0.8.50-alpha). The endpoints and response formats may change in future versions. 