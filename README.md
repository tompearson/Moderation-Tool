# Community Moderation Assistant

An AI-powered web application for moderating community posts using Google's Gemini Pro model and community guidelines.

## Features

- 🤖 AI-powered post analysis using Google Gemini Pro
- 📋 Automatic loading of Community Guidelines from `.cursorrules`
- 📖 **Show Guidlines modal** - Beautiful, organized display of all community guidelines
- 🎨 Modern, responsive UI with beautiful styling
- ⚡ Real-time analysis with loading states
- 🔒 Secure API key handling (stored locally)
- 📱 Mobile-friendly design
- 📋 Copy button for easy sharing of moderation results
- 🧪 Comprehensive testing framework with 17+ test cases
- 🏷️ **Version indicator** - Discrete version number display (v0.8.5-alpha)
- ⚡ **Dynamic Character Limits** - Two analysis modes: Quick (300 chars) and Detailed (2000 chars)

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Google AI API key (get one at [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey))
- mkcert (optional, for HTTPS development) - [Installation guide](https://github.com/FiloSottile/mkcert#installation)

## Installation

1. **Clone or download this repository**
   ```bash
   # If you have the files locally, navigate to the project directory
   cd ModerationTool
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Interactive setup (recommended)
   npm run setup
   
   # OR manually create .env file
   cp env.example .env
   # Then edit .env with your Gemini API key
   ```

3. **Choose your development mode:**

   **Option A: Frontend Only (Vite Dev Server)**
   ```bash
   npm run dev
   ```
   - Runs on `http://localhost:5173`
   - Hot reload for development
   - No API endpoints available

   **Option B: Full Stack (Express Server)**
   ```bash
   npm run start
   ```
   - Runs on `http://localhost:3000`
   - Includes API endpoints for Postman testing
   - Serves built React app

   **Option C: Development with API (Both servers)**
   ```bash
   npm run dev:full
   ```
   - Frontend: `http://localhost:5173` (Vite dev server)
   - Backend: `http://localhost:3000` (Express API server)
   - Best for development with API testing

4. **Open your browser**
   - Frontend only: `http://localhost:5173`
   - Full stack: `http://localhost:3000`

## HTTPS Development Setup (Optional)

For secure local development with HTTPS (recommended for clipboard API and modern browser features), you can set up mkcert to generate trusted local certificates.

### Installing mkcert

#### Windows (using Chocolatey)
```bash
choco install mkcert
```

#### macOS (using Homebrew)
```bash
brew install mkcert
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt install mkcert
```

#### Manual Installation
Download from [https://github.com/FiloSottile/mkcert#installation](https://github.com/FiloSottile/mkcert#installation)

### Setting up HTTPS

1. **Install the root certificate**
   ```bash
   mkcert -install
   ```

2. **Generate certificates for localhost and your network IP**
   ```bash
   # For localhost only
   mkcert localhost
   
   # For localhost and network access (replace with your IP)
   mkcert localhost 192.168.254.204
   ```

3. **Update Vite configuration**
   The project is already configured to use mkcert certificates. If you generated new certificates, update the filenames in `vite.config.js`:
   ```javascript
   https: {
     key: fs.readFileSync('./localhost-key.pem'),
     cert: fs.readFileSync('./localhost.pem')
   }
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access your app**
   - Local: `https://localhost:3000/`
   - Network: `https://192.168.254.204:3000/` (replace with your IP)

### Benefits of HTTPS Development

- ✅ **Clipboard API works** - Copy button functionality requires secure context
- ✅ **No certificate warnings** - Trusted local certificates
- ✅ **Modern browser features** - All APIs work as expected
- ✅ **Network access** - Access from other devices on your network
- ✅ **Production-like environment** - Closer to real-world deployment

### Network Access

To access the app from other devices on your network:

1. **Find your computer's IP address**
   ```bash
   # Windows
   ipconfig
   
   # macOS/Linux
   ifconfig
   ```

2. **Generate certificates including your IP**
   ```bash
   mkcert localhost 192.168.254.204
   ```

3. **Install mkcert on other devices** (optional, for trusted certificates)
   - Install mkcert on the other device
   - Run `mkcert -install` to trust the root certificate

4. **Access from other devices**
   - Use `https://YOUR_IP:3000/` from any device on the network

## Usage

1. **Enter your Google AI API key**
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Enter it in the "Google AI API Key" field
   - Your key is stored locally and never sent to our servers

2. **Review the guidelines (optional)**
   - Click the "📋 Show Guidelines" button to view all Community Guidelines
   - The modal displays organized sections with local zip codes and moderation approach
   - Perfect for reference during moderation decisions

3. **Paste a flagged post**
   - Copy the content of a flagged community post
   - Paste it into the "Flagged Post Content" text area

4. **Choose your analysis mode**
   - **Quick Analysis (300 chars)**: Brief, concise responses for fast moderation
   - **Detailed Analysis (2000 chars)**: Comprehensive analysis with detailed reasoning, rule evaluation, and context analysis
   - The AI will review the post against Community Guidelines
   - Results will show the decision (Remove/Keep) and detailed reasoning with character count

## How It Works

The application:

1. **Loads moderation rules** from the `.cursorrules` file in your project directory
2. **Sends the post content** to Google's Gemini Pro model along with the rules
3. **Analyzes the response** to extract the decision and reasoning
4. **Displays results** in a user-friendly format with color coding

## Community Guidelines

The tool uses the Community Guidelines defined in `.cursorrules`:

- **Be Respectful** - No hate speech, harassment, or threats
- **Keep It Relevant** - Posts must be relevant to the local community
- **Do Not Discriminate** - No content promoting hate based on protected characteristics
- **No Misinformation** - No false or misleading information
- **Respect Privacy** - No sharing private information without consent
- **No Prohibited Content** - No violence, criminal acts, or adult content
- **Civil Tone** - Use civil language and avoid aggressive tone

## API Endpoints

When running in full-stack mode (`npm run start`), the following API endpoints are available:

### Health Check
```bash
GET /api/health
```
Returns service status and version information.

### Get Guidelines
```bash
GET /api/guidelines
```
Returns the current community moderation guidelines in structured format.

### Moderate Post
```bash
POST /api/moderate
Content-Type: application/json

{
  "content": "Your post content here",
  "characterLimit": 300
}
```
Analyzes a flagged post and returns a moderation decision.

**Parameters:**
- `content` (required): The post content to moderate
- `characterLimit` (optional): Response character limit (default: 300, max: 2000)

**Character Limit Options:**
- **300 characters**: Quick, concise analysis
- **2000 characters**: Detailed analysis with comprehensive reasoning

**Response Format:**
```json
{
  "success": true,
  "decision": "Keep|Remove",
  "reason": "Detailed reasoning...",
  "model": "gemini-1.5-flash",
  "timestamp": "2024-12-15T10:30:00Z"
}
```

### Postman Integration

The project includes ready-to-use Postman files:
- `postman_collection.json` - Complete API collection
- `openapi.yaml` - OpenAPI specification
- `POSTMAN_SETUP.md` - Setup instructions

## Environment Variables

### **Required Variables**
- **`GEMINI_API_KEY`** - Your Google Gemini API key (get one at [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey))

### **Optional Variables**
- **`PORT`** - Server port (default: 3000)
- **`NODE_ENV`** - Environment (development/production)

### **Setup Methods**

#### **Method 1: Interactive Setup (Recommended)**
```bash
npm run setup
```
This will guide you through creating your `.env` file interactively.

#### **Method 2: Manual Setup**
```bash
# Copy the example file
cp env.example .env

# Edit .env with your API key
# GEMINI_API_KEY=your_actual_api_key_here
```

## 🚀 Production Deployment

### **Vercel Deployment (Recommended)**
Your app is ready for production deployment on Vercel!

1. **Connect to Vercel**: Import your GitHub repository
2. **Set Environment Variables**: Add `GEMINI_API_KEY` in Vercel dashboard
3. **Deploy**: Automatic deployment on every push

**See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.**

### **Production URLs**
After deployment, your app will be available at:
- **Frontend**: `https://your-app.vercel.app`
- **API Health**: `https://your-app.vercel.app/api/health`
- **API Guidelines**: `https://your-app.vercel.app/api/guidelines`
- **API Moderation**: `https://your-app.vercel.app/api/moderate`

### **Production Postman Collection**
Use `postman_collection_production.json` for production testing.

## API Key Security

⚠️ **Important**: The API endpoints handle your Gemini API key server-side for better security. For production use, consider:

- Using environment variables for API keys (✅ Already implemented)
- Implementing proper API key management
- Adding rate limiting and usage monitoring
- Setting up authentication for API access

## Testing Framework

### Test Posts

The project includes a comprehensive testing framework with structured test cases:

- **`test-posts.md`** - Complete test suite with 17+ test cases
- **Public Gist** - [View test posts online](https://gist.github.com/tompearson/8062df3075486e944bf436bc596be0f2)

#### Test Categories:
- **Posts that should be REMOVED** (7 examples) - Hate speech, threats, misinformation, etc.
- **Posts that should be KEPT** (5 examples) - Legitimate local concerns, community events
- **Borderline cases** (3 examples) - Test AI judgment capabilities
- **Complex cases** (2 examples) - Multiple issues in single posts

#### Using the Test Framework:
1. Copy a test post from the Gist or `test-posts.md`
2. Paste it into the moderation tool
3. Compare AI decision with expected result
4. Use the Clear button to reset for next test

### Automated Testing

The test posts are designed to verify:
- ✅ **Accuracy** across different violation types
- ✅ **Consistency** in AI decisions
- ✅ **Edge case handling** for borderline situations
- ✅ **Error handling** for invalid content

## Development

### Project Structure
```
ModerationTool/
├── .cursorrules          # Community Guidelines
├── test-posts.md         # Comprehensive test cases
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
├── index.html            # Main HTML file
├── src/
│   ├── main.jsx          # React entry point
│   ├── App.jsx           # Main application component
│   └── index.css         # Styles
└── README.md             # This file
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Customization

To modify the moderation rules:
1. Edit the `.cursorrules` file
2. The changes will be automatically loaded when you refresh the page

To change the AI model:
1. Open `src/App.jsx`
2. Find the `MODELS_TO_TRY` array
3. Change to your preferred models (e.g., `"gemini-pro-vision"` for image support)

## Model Performance & Token Usage

### Current Model Configuration
The app uses a sequential fallback approach with these models:
- **Primary**: `gemini-1.5-pro` - Advanced reasoning capabilities
- **Fallback**: `gemini-1.5-flash` - Fast alternative if primary is overloaded

### Token Usage Analysis
Typical usage for content moderation:
```
"usageMetadata": {
  "promptTokenCount": 1238,      // Your input + rules
  "candidatesTokenCount": 72,    // AI's decision + reasoning  
  "totalTokenCount": 1310,       // Total tokens used
  "promptTokensDetails": [
    {
      "modality": "TEXT",
      "tokenCount": 1238
    }
  ]
}
```

### Load Classification
- **Light Load** (< 1,000 tokens): Simple questions, short analysis
- **Moderate Load** (1,000 - 4,000 tokens): ⭐ **Your usage here** - Content moderation with rules
- **Heavy Load** (4,000 - 32,000 tokens): Long documents, complex analysis
- **Very Heavy Load** (32,000+ tokens): Book-length content, massive datasets

### Why This is Efficient
✅ **1,310 tokens** is well within normal range  
✅ **Good prompt-to-response ratio** (1,238 → 72)  
✅ **Cost-effective** - not wasting tokens  
✅ **Fast response time** expected  
✅ **Only 0.07%** of Gemini 1.5's 2M token capacity  

### Cost Impact
- **Very low cost** per request
- **Efficient token usage** for quality results
- **Good value** for moderation quality
- **Optimal** for content moderation tasks

### Rate Limits & Usage Tiers

The Gemini API has different rate limits based on your usage tier. According to the [official Gemini API rate limits documentation](https://ai.google.dev/gemini-api/docs/rate-limits), here are the key limits:

#### Free Tier Limits
- **Gemini 1.5 Flash (Deprecated)**: 15 RPM, 250,000 TPM, 50 RPD
- **Gemini 1.5 Pro (Deprecated)**: No free tier access
- **Gemini 2.5 Pro**: 5 RPM, 250,000 TPM, 100 RPD
- **Gemini 2.5 Flash**: 10 RPM, 250,000 TPM, 250 RPD

#### Tier 1 Limits (Paid)
- **Gemini 1.5 Flash (Deprecated)**: 2,000 RPM, 4,000,000 TPM
- **Gemini 1.5 Pro (Deprecated)**: 1,000 RPM, 4,000,000 TPM
- **Gemini 2.5 Pro**: 150 RPM, 2,000,000 TPM, 1,000 RPD
- **Gemini 2.5 Flash**: 1,000 RPM, 1,000,000 TPM, 10,000 RPD

#### Rate Limit Dimensions
- **RPM**: Requests per minute
- **TPM**: Tokens per minute (input)
- **RPD**: Requests per day

#### Usage Tier Qualifications
- **Free**: Users in eligible countries
- **Tier 1**: Billing account linked to project
- **Tier 2**: Total spend > $250 and 30+ days since payment
- **Tier 3**: Total spend > $1,000 and 30+ days since payment

**Note**: Your current usage of ~1,310 tokens per request is well within all tier limits. Even on the free tier, you could make ~190 requests per minute before hitting TPM limits.

## Troubleshooting

### Common Issues

**"Failed to load moderation rules"**
- Ensure the `.cursorrules` file exists in the project root
- Check that the file is readable

**"Invalid API key"**
- Verify your Google AI API key is correct
- Ensure you have sufficient quota in your Google AI account

**"API quota exceeded"**
- Check your Google AI usage limits
- Consider upgrading your plan if this happens frequently

**"Unable to parse AI response"**
- This usually means the AI response format changed
- Try the request again, or check the console for the raw response

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Google AI API key and account status
3. Ensure all dependencies are installed correctly

## License

MIT License - feel free to use and modify as needed.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 