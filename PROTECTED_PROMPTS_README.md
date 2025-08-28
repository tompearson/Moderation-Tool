# 🔒 Protected Prompts System

This system securely stores AI prompts and sensitive content that should never be exposed to public users.

## 🏗️ Architecture

```
dist/
├── public/                    # Public HTML files (accessible to everyone)
├── protected/                 # Protected content (app-only access)
│   └── prompts/
│       ├── moderation-prompts.json    # Community moderation rules
│       └── ai-instructions.json       # AI system prompts
└── index.html
```

## 🛡️ Security Features

### Origin Validation
- **Only your app** can access protected content
- **Origin checking** prevents cross-site requests
- **Local development** allowed for testing
- **Production domains** whitelisted

### Access Control
- **API endpoint**: `/api/prompts/:type`
- **Authentication**: Origin-based validation
- **No public URLs**: Files not served statically
- **Server-side protection**: All requests validated

## 📁 Available Prompt Types

### 1. `moderation-prompts`
- Community moderation rules
- Local coverage areas
- Rule definitions and details
- Output format specifications

### 2. `ai-instructions`
- AI system prompts
- Moderation workflow
- Sensitive topic handling
- Response templates

## 🔧 Usage in Your App

### Fetch Prompts Securely
```javascript
const fetchPrompts = async (type) => {
  try {
    const response = await fetch(`/api/prompts/${type}`);
    if (response.ok) {
      const data = await response.json();
      return data.prompts;
    }
  } catch (error) {
    console.error('Failed to fetch prompts:', error);
  }
};

// Usage examples
const moderationRules = await fetchPrompts('moderation-prompts');
const aiInstructions = await fetchPrompts('ai-instructions');
```

### Error Handling
```javascript
if (response.status === 403) {
  console.error('Access denied - unauthorized origin');
} else if (response.status === 404) {
  console.error('Prompt type not found');
} else if (response.status === 500) {
  console.error('Server error loading prompts');
}
```

## 🧪 Testing

### Run Test Script
```bash
node test-protected-prompts.js
```

### Manual Testing
```bash
# Valid request (should work)
curl -H "Origin: http://127.0.0.1:3000" \
     http://127.0.0.1:3001/api/prompts/moderation-prompts

# Invalid origin (should be blocked)
curl -H "Origin: https://malicious-site.com" \
     http://127.0.0.1:3001/api/prompts/moderation-prompts
```

## 🚀 Deployment

### Vercel Deployment
- **Protected folder** is included in build
- **Server-side protection** works in production
- **Origin validation** includes your Vercel domains

### Environment Variables
```bash
NODE_ENV=production  # Enables production origin checking
```

## 🔐 Security Best Practices

### ✅ Do's
- Store sensitive prompts in `dist/protected/`
- Use the API endpoint to access content
- Validate all requests server-side
- Keep prompts updated and secure

### ❌ Don'ts
- Never expose protected content via static URLs
- Don't commit sensitive prompts to Git
- Avoid client-side storage of prompts
- Don't bypass origin validation

## 🆘 Troubleshooting

### Common Issues

1. **403 Access Denied**
   - Check origin header in request
   - Verify domain is whitelisted
   - Ensure proper referer header

2. **404 Not Found**
   - Verify prompt type exists
   - Check file path in `dist/protected/prompts/`
   - Ensure build process includes protected folder

3. **500 Server Error**
   - Check server logs for file read errors
   - Verify file permissions
   - Ensure JSON files are valid

### Debug Mode
Enable detailed logging in server.js:
```javascript
console.log('Request origin:', req.get('Origin'));
console.log('Request referer:', req.get('Referer'));
console.log('Prompt path:', promptPath);
```

## 📝 Adding New Prompt Types

1. **Create JSON file** in `dist/protected/prompts/`
2. **Update test script** to include new type
3. **Test access** with valid/invalid origins
4. **Update documentation** with new type details

## 🔄 Updating Prompts

1. **Edit JSON files** in protected folder
2. **Restart server** to load changes
3. **Test access** to ensure security maintained
4. **Deploy updates** with your app

---

**⚠️ Security Note**: This system protects your AI prompts from public exposure. Never bypass the origin validation or expose protected content through public URLs.

