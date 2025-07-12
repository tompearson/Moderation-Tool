# Nextdoor Moderation Tool

An AI-powered web application for moderating Nextdoor posts using Google's Gemini Pro model and Nextdoor's Community Guidelines.

## Features

- 🤖 AI-powered post analysis using Google Gemini Pro
- 📋 Automatic loading of Nextdoor Community Guidelines from `.cursorrules`
- 🎨 Modern, responsive UI with beautiful styling
- ⚡ Real-time analysis with loading states
- 🔒 Secure API key handling (stored locally)
- 📱 Mobile-friendly design
- 📋 Copy button for easy sharing of moderation results
- 🧪 Comprehensive testing framework with 17+ test cases

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

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   The application will automatically open at `http://localhost:3000`

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

2. **Paste a flagged post**
   - Copy the content of a flagged Nextdoor post
   - Paste it into the "Flagged Post Content" text area

3. **Analyze the post**
   - Click "Analyze Post" to send the content to Gemini
   - The AI will review the post against Nextdoor's Community Guidelines
   - Results will show the decision (Remove/Keep) and detailed reasoning

## How It Works

The application:

1. **Loads moderation rules** from the `.cursorrules` file in your project directory
2. **Sends the post content** to Google's Gemini Pro model along with the rules
3. **Analyzes the response** to extract the decision and reasoning
4. **Displays results** in a user-friendly format with color coding

## Community Guidelines

The tool uses the Nextdoor Community Guidelines defined in `.cursorrules`:

- **Be Respectful** - No hate speech, harassment, or threats
- **Keep It Relevant** - Posts must be relevant to the local community
- **Do Not Discriminate** - No content promoting hate based on protected characteristics
- **No Misinformation** - No false or misleading information
- **Respect Privacy** - No sharing private information without consent
- **No Prohibited Content** - No violence, criminal acts, or adult content
- **Civil Tone** - Use civil language and avoid aggressive tone

## API Key Security

⚠️ **Important**: This application runs entirely in the browser and sends your API key directly to Google AI. For production use, consider:

- Using a backend proxy to handle API calls
- Implementing proper API key management
- Adding rate limiting and usage monitoring

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
├── .cursorrules          # Nextdoor Community Guidelines
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
2. Find the `model: "gemini-pro"` line
3. Change to your preferred model (e.g., `"gemini-pro-vision"` for image support)

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