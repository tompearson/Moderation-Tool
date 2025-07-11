# Nextdoor Moderation Tool

An AI-powered web application for moderating Nextdoor posts using Google's Gemini Pro model and Nextdoor's Community Guidelines.

## Features

- 🤖 AI-powered post analysis using Google Gemini Pro
- 📋 Automatic loading of Nextdoor Community Guidelines from `.cursorrules`
- 🎨 Modern, responsive UI with beautiful styling
- ⚡ Real-time analysis with loading states
- 🔒 Secure API key handling (stored locally)
- 📱 Mobile-friendly design

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Google AI API key (get one at [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey))

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

## Development

### Project Structure
```
ModerationTool/
├── .cursorrules          # Nextdoor Community Guidelines
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