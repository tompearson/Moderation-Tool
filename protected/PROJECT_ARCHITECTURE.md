# Project Architecture & File Hierarchy

## 📋 Table of Contents
- [Overview](#overview)
- [File Structure](#file-structure)
- [Build Process Flow](#build-process-flow)
- [Deployment Pipeline](#deployment-pipeline)
- [Folder Purposes](#folder-purposes)
- [API Architecture](#api-architecture)
- [Frontend Structure](#frontend-structure)
- [Development Workflow](#development-workflow)
- [File Relationships](#file-relationships)

---

## 🎯 Overview

The Community Moderation Tool is a full-stack application built with React (Vite) frontend and Node.js/Express.js backend, deployed on Vercel as serverless functions. This document explains the complete file hierarchy, build process, and data flow.

---

## 📁 File Structure

```
ModerationTool/
├── 📁 src/                          # React frontend source code
│   ├── App.jsx                      # Main application component
│   ├── main.jsx                     # React entry point
│   └── index.css                    # Global styles
│
├── 📁 public/                       # Publicly accessible files
│   ├── index.html                   # Main HTML entry point
│   ├── about.html                   # About page
│   ├── access-denied.html           # Access control page
│   ├── directory-listing.html       # File browser page
│   ├── version.js                   # Version information
│   └── 📁 docs/                     # User documentation
│       ├── Facebook1.html           # Facebook guidelines (HTML)
│       ├── Facebook2.html           # Facebook guidelines (HTML)
│       ├── Nexdoor.html             # NextDoor guidelines (HTML)
│       ├── Facebook1.md             # Facebook guidelines (Markdown)
│       ├── Facebook2.md             # Facebook guidelines (Markdown)
│       └── Nexdoor.md               # NextDoor guidelines (Markdown)
│
├── 📁 protected/                    # Server-side only files
│   └── 📁 prompts/                  # AI prompt configurations
│       ├── ai.json                  # AI prompt configuration
│       ├── ai-instructions.md       # Core AI instructions
│       └── 📁 staging/              # Prompt development area
│           └── 📁 NextDoor/         # NextDoor-specific prompts
│               └── 📁 research/      # Research and development
│                   └── token-optimized-nextdoor-community-moderation-instructions.json
│
├── 📁 api/                          # Backend API endpoints
│   ├── moderate.js                  # Main moderation endpoint
│   ├── health.js                    # Health check endpoint
│   ├── debug-ai-prompts.js          # AI prompt debugging
│   ├── save-ai-prompt.js            # Save AI prompt
│   ├── test-ai-response.js          # Test AI responses
│   ├── routes.js                    # Express.js routes (local dev)
│   └── 📁 utils/                    # API utilities
│       ├── ai.js                    # AI service integration
│       └── guidelines.js            # Guidelines management
│
├── 📁 scripts/                      # Build and utility scripts
│   └── copy-api-files.js            # Copy API files to dist
│
├── 📁 dist/                         # Build output (generated)
│   ├── 📁 api/                      # Copied API functions
│   ├── 📁 protected/                # Copied protected files
│   ├── 📁 docs/                     # Copied documentation
│   └── [Vite build output]          # Frontend assets
│
├── server.js                        # Local development server
├── package.json                     # Dependencies and scripts
├── vercel.json                      # Vercel deployment config
├── vite.config.js                   # Vite configuration
└── .env                             # Environment variables
```

---

## 🔄 Build Process Flow

### 1. **Local Development Build**
```bash
npm run dev:frontend    # Starts Vite dev server on :3000
npm run dev:backend     # Starts Express server on :3001
```

### 2. **Vercel Production Build**
```bash
npm run vercel-build    # Runs build + copy-protected-files
```

**Build Steps:**
1. **Vite Build**: `src/` → `dist/` (React app compilation)
2. **Copy Protected**: `protected/` → `dist/protected/`
3. **Copy API**: `api/` → `dist/api/`
4. **Copy Public**: `public/` → `dist/` (automatic)

---

## 🚀 Deployment Pipeline

### **Local → Vercel Flow:**
```
Local Development → Git Push → Vercel Build → Production Deployment
     ↓                    ↓           ↓              ↓
  src/ + api/         GitHub      dist/         Live Website
  + protected/         Repo       folder        (Serverless)
```

### **Vercel Build Process:**
1. **Install Dependencies**: `npm install`
2. **Build Frontend**: `npm run build` (Vite)
3. **Copy Server Files**: `npm run copy-protected-files`
4. **Deploy**: Serve from `dist/` folder

---

## 🔒 Folder Purposes

### **📁 `src/` - Frontend Source**
- **Purpose**: React application source code
- **Access**: Compiled during build
- **Output**: JavaScript bundles in `dist/assets/`

### **📁 `public/` - Public Assets**
- **Purpose**: Files accessible to web users
- **Access**: Directly served by Vercel
- **Examples**: HTML pages, documentation, static assets

### **📁 `protected/` - Server-Side Files**
- **Purpose**: Sensitive files for server use only
- **Access**: Available to API functions, not web users
- **Examples**: AI prompts, configuration files, secrets

### **📁 `api/` - Backend Functions**
- **Purpose**: Serverless API endpoints
- **Access**: HTTP API calls only
- **Examples**: Moderation logic, health checks

---

## 🌐 API Architecture

### **Local Development:**
- **Express.js Server**: `server.js` + `api/routes.js`
- **Port**: 3001
- **Frontend Proxy**: Vite proxies `/api/*` to `:3001`

### **Production (Vercel):**
- **Serverless Functions**: Individual `api/*.js` files
- **Routing**: `vercel.json` rewrites handle URL mapping
- **Execution**: Each API call spawns a new function instance

### **API Endpoints:**
```
POST /api/moderate          # Main moderation endpoint
GET  /api/health            # Health check
POST /api/debug-ai-prompts  # Debug AI prompts
POST /api/save-ai-prompt    # Save AI prompt
POST /api/test-ai-response  # Test AI responses
```

---

## ⚛️ Frontend Structure

### **React App (Vite):**
- **Entry Point**: `src/main.jsx`
- **Main Component**: `src/App.jsx`
- **Styling**: `src/index.css`
- **Build Output**: `dist/index.html` + `dist/assets/`

### **Public Pages:**
- **Main App**: `/app` → `index.html`
- **About**: `/about` → `about.html`
- **Browse**: `/browse` → `directory-listing.html`
- **Access Control**: `/` → `access-denied.html`

---

## 🔧 Development Workflow

### **1. Making Changes:**
```bash
# Edit source files
vim src/App.jsx
vim protected/prompts/ai-instructions.md

# Test locally
npm run dev:frontend
npm run dev:backend
```

### **2. Adding New Files:**
- **Frontend**: Add to `src/`
- **Public**: Add to `public/`
- **Protected**: Add to `protected/`
- **API**: Add to `api/`

### **3. Documentation Updates:**
```bash
# Convert Markdown to HTML
./convert-docs.bat

# Files get updated in public/docs/
```

### **4. Deployment:**
```bash
git add .
git commit -m "Update description"
vercel --prod
```

---

## 🔗 File Relationships

### **AI Prompt Flow:**
```
protected/prompts/ai.json → ai.js → moderate.js → Frontend Response
```

### **Documentation Flow:**
```
Markdown (.md) → convert-md-to-html.js → HTML (.html) → User Browser
```

### **Build Dependencies:**
```
package.json → npm install → Build Scripts → dist/ folder
```

### **Deployment Dependencies:**
```
vercel.json → Vercel Build → Live Website
```

---

## 📝 Key Configuration Files

### **`vercel.json`:**
- Build commands and output directory
- URL rewrites and redirects
- Environment variables

### **`package.json`:**
- Dependencies and scripts
- Build commands
- Project metadata

### **`vite.config.js`:**
- Frontend build configuration
- Development server settings
- Proxy configuration for local dev

---

## 🚨 Important Notes

1. **Protected files are NOT web-accessible** - they're only available to server-side code
2. **Public files are directly served** - users can access them via URL
3. **API functions run in isolation** - each request spawns a new instance
4. **Build process copies everything** - `dist/` contains the complete deployment package
5. **Local dev uses Express** - production uses Vercel serverless functions

---

## 🔍 Troubleshooting

### **Common Issues:**
- **404 on protected files**: Expected behavior - they're not web-accessible
- **Build failures**: Check `copy-protected-files` script execution
- **API errors**: Verify environment variables in Vercel dashboard
- **Missing files in dist**: Ensure build scripts are running correctly

---

*Last Updated: 2025-01-24*
*This document explains the complete architecture and should be updated when the project structure changes.*


---

## Last Updated
- **Date**: 08-28-2025
- **Version**: v0.8.50-alpha
- **Status**: Documentation updated for version 0.8.50-alpha
- **Next Action**: Ready for production deployment