# Available Gemini Models

## Text Models
- `gemini-pro` - Best for text generation and analysis (recommended for moderation)
- `gemini-pro-latest` - Latest version of Gemini Pro

## Multimodal Models (Text + Images)
- `gemini-pro-vision` - Can analyze both text and images
- `gemini-1.5-pro` - Advanced multimodal model
- `gemini-1.5-flash` - Faster multimodal model

## Model Comparison

### gemini-pro
- **Best for**: Text analysis, content moderation, writing
- **Input**: Text only
- **Speed**: Fast
- **Cost**: Lower
- **Use case**: Perfect for community post moderation

### gemini-pro-vision
- **Best for**: Image + text analysis
- **Input**: Text and images
- **Speed**: Slower than text-only
- **Cost**: Higher
- **Use case**: If you need to moderate posts with images

### gemini-1.5-pro
- **Best for**: Complex reasoning, long context
- **Input**: Text and images
- **Speed**: Moderate
- **Cost**: Higher
- **Use case**: Advanced analysis requiring deep reasoning

### gemini-1.5-flash
- **Best for**: Fast responses, simple tasks
- **Input**: Text and images
- **Speed**: Very fast
- **Cost**: Lower than 1.5-pro
- **Use case**: Quick moderation decisions

## API Usage Examples

### Text-only (current implementation)
```javascript
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
```

### With images
```javascript
const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
// Requires different prompt structure for images
```

### With safety settings
```javascript
const model = genAI.getGenerativeModel({ 
  model: "gemini-pro",
  safetySettings: [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    }
  ]
});
```

## Rate Limits and Quotas
- Free tier: 15 requests per minute
- Paid tier: Higher limits based on plan
- Quota resets daily

## Error Handling
- `API_KEY_INVALID` - Check your API key
- `QUOTA_EXCEEDED` - You've hit your rate limit
- `SAFETY` - Content blocked by safety filters
- `PERMISSION_DENIED` - API key doesn't have access to this model 

---

## Last Updated
- **Date**: 08-15-2025
- **Version 0.8.50-alpha
- **Status**: Documentation updated for version 0.8.50-alpha
- **Next Action**: Ready for production deployment