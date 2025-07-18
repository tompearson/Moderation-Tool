# Moderation Tool Release Notes - v0.3.0-alpha

## 🚀 New Features

### 📋 Enhanced Clipboard Integration
- **Paste Content Button**: Quick paste functionality that's always visible when textarea is empty
- **Clear & Paste Button**: One-click operation to clear existing content and paste new clipboard content
- **Smart Button Visibility**: Buttons appear/disappear based on content state for optimal UX

### 🎨 Improved User Interface
- **Button Row Layout**: Organized button arrangement with proper spacing
- **Color-Coded Buttons**: 
  - Green: Paste Content
  - Red: Clear Content  
  - Purple: Clear & Paste
- **Responsive Design**: Buttons size naturally to fit their content

### 📋 Guidelines Modal
- **Show Guidelines Button**: Easy access to community rules
- **Comprehensive Rules Display**: All moderation guidelines in an organized modal
- **Local Coverage Information**: Portland Metro area zip codes clearly listed
- **Moderation Approach**: Clear explanation of AI's balanced, lenient approach

### 🔧 Enhanced Functionality
- **Copy Result Button**: One-click copying of moderation decisions
- **Clear Content Button**: Quick way to reset the form
- **Better Error Handling**: More specific error messages for different failure types
- **Loading States**: Proper button disabling during analysis

## 🔄 Technical Improvements

### API Integration
- **Multiple Model Fallback**: Automatic fallback between different Gemini models
- **Retry Logic**: Handles temporary model overload with automatic retries
- **Environment Variable Support**: API key can be set via `VITE_GEMINI_API_KEY`
- **Better Error Messages**: Specific feedback for quota, permission, and model issues

### Code Quality
- **Modular Button Components**: Clean, reusable button implementations
- **Improved State Management**: Better handling of loading, error, and result states
- **Enhanced CSS**: Consistent styling with hover effects and disabled states

## 📝 Updated Guidelines

### New Rule Added
- **Rule 8: Incorrect Category**: Items offered for sale or free are considered 'Posted In Error' and should not be allowed in the main feed

### Enhanced Moderation Approach
- **Balanced Decision Making**: AI instructed to err on the side of keeping posts
- **Context Consideration**: Takes into account local community relevance
- **Lenient Approach**: Minor violations generally kept with warnings

## 🐛 Bug Fixes

- **Model Availability Issues**: Fixed 404 errors for unavailable models
- **Quota Handling**: Better handling of API quota exceeded scenarios
- **Response Parsing**: Improved parsing of AI responses for decision extraction
- **Button State Management**: Fixed button visibility and disabled states

## 🔧 Configuration

### Environment Variables
- `VITE_GEMINI_API_KEY`: Set your Google AI API key (optional, falls back to default)

### Supported Models
- `gemini-2.5-pro`: Primary model for advanced reasoning
- `gemini-2.5-flash`: Fast fallback option
- `gemini-2.0-flash`: Alternative reliable model
- `gemini-2.0-flash-lite`: Fastest backup option

## 📋 Usage Instructions

### Basic Workflow
1. **Paste Content**: Use "📋 Paste Content" button or paste manually
2. **Analyze**: Click "Analyze Post" to get moderation decision
3. **Review**: Check the decision and reasoning
4. **Copy Result**: Use "Copy Result" button to copy decision to clipboard
5. **Clear & Continue**: Use "Clear Content" or "Clear & Paste" for next post

### Guidelines Access
- Click "📋 Show Guidelines" to view all community rules
- Modal includes local coverage areas and moderation approach
- Guidelines are always accessible during analysis

## 🚨 Breaking Changes

None - this is a feature enhancement release with full backward compatibility.

## 🔮 Future Roadmap

- **Batch Processing**: Analyze multiple posts at once
- **History Feature**: Save and review previous moderation decisions
- **Custom Rules**: Allow users to modify guidelines for specific communities
- **Export Functionality**: Export moderation logs and statistics

---

**Version**: v0.3.0-alpha  
**Release Date**: December 2024  
**Compatibility**: All modern browsers with clipboard API support 