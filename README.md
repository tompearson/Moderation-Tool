# Community Moderation Assistant

An AI-powered tool for moderating community posts using community guidelines and AI analysis.

## 🌐 Live Demo

**Production URL:** https://moderation-assistant-tool.vercel.app/

## Features

- **AI-Powered Moderation**: Uses Google's Gemini AI to analyze posts against community guidelines
- **Dynamic Guidelines**: Supports both embedded and URL-based community guidelines
- **Real-time Analysis**: Instant moderation results with detailed explanations
- **Responsive Design**: Works on desktop and mobile devices
- **Vercel Deployment**: Production-ready with clean URLs
- **Static HTML Pages**: Additional content pages with professional routing

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ModerationTool
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   npm run setup
   ```
   This will create a `.env` file. Make sure to add your `GEMINI_API_KEY`.

4. **Start the development servers**
   ```bash
   npm run dev:separate
   ```
   This starts both frontend (Vite) and backend (Express) servers.

## 📱 Available Scripts

- `npm run dev` - Start Vite development server only
- `npm run server` - Start Express backend server only
- `npm run dev:full` - Start both servers concurrently
- `npm run dev:separate` - Start both servers in separate terminals
- `npm run build` - Build for production
- `npm run start` - Build and start production server
- `npm run setup` - Set up environment variables
- `npm run vercel-build` - Build optimized for Vercel deployment

## 🔧 Environment Variables

Create a `.env` file with:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GUIDELINES_URL=https://example.com/guidelines
ADDITIONAL_GUIDELINES_URL=https://example.com/additional-rules
```

## 🌍 API Endpoints

- `GET /api/guidelines-endpoint` - Get current guidelines
- `POST /api/guidelines-endpoint` - Refresh guidelines from URL
- `POST /api/moderate` - Moderate a post using AI

## 🏗️ Development

- **Frontend**: React + Vite (port 3000)
- **Backend**: Express.js (port 3001)
- **AI**: Google Gemini API
- **Styling**: CSS with responsive design

## 🚀 Deployment

The app is successfully deployed on Vercel with:

### **Production URL:**
https://moderation-assistant-tool.vercel.app/

### **Clean URL Structure:**
- **Main App:** `/` → React application
- **About Page:** `/about` → About page
- **Docs Page:** `/docs` → Documentation page
- **Contact Page:** `/contact` → Contact page
- **Privacy Page:** `/privacy` → Privacy policy
- **Terms Page:** `/terms` → Terms of service

### **Configuration:**
- Frontend: Vite build optimized for Vercel
- Backend: Express.js server
- Clean URLs: No .html extensions needed
- Environment variables managed through Vercel dashboard

## 📁 Project Structure

```
ModerationTool/
├── src/                 # React source code
├── public/              # Static assets and HTML pages
│   ├── about.html       # About page
│   ├── docs.html        # Documentation page
│   ├── contact.html     # Contact page
│   ├── privacy.html     # Privacy policy
│   ├── terms.html       # Terms of service
│   ├── version.js       # Version information
│   └── vite.svg         # Vite logo
├── dist/                # Build output (generated)
├── vercel.json          # Vercel configuration
├── package.json         # Dependencies and scripts
└── vite.config.js       # Vite configuration
```

## 🔄 Adding New HTML Pages

1. **Create HTML file** in `public/` folder
2. **Add route** to `vercel.json` rewrites
3. **Build and deploy** with `npm run build && vercel --prod`

## 📚 Documentation

- [Vercel Deployment Guide](VERCEL_DEPLOYMENT_GUIDE.md) - Complete deployment instructions
- [Development Notes](DEVELOPMENT_NOTES.md) - Development workflow and notes
- [Version Management](VERSION_MANAGEMENT.md) - Version control and updates

## 🆘 Troubleshooting

1. Check the troubleshooting section in [VERCEL_DEPLOYMENT_GUIDE.md](VERCEL_DEPLOYMENT_GUIDE.md)
2. Review the test output
3. Check configuration files
4. Open an issue with detailed error information

---

**Happy Monitoring! 🚀**

---

## Last Updated
- **Date**: August 15, 2025
- **0.8.40-alpha
- **Status**: Production live on Vercel with clean URLs
- **Next Action**: Ready for production deployment 