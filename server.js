// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

// Import API routes and middleware
const apiRoutes = require('./api/routes');
const errorHandler = require('./api/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Production environment setup
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(cors({
  origin: isProduction 
    ? ['https://moderation-tool.vercel.app'] 
    : ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.static('dist')); // Serve the built React app

// API Routes
app.use('/api', apiRoutes);

// Error handling middleware
app.use(errorHandler);

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${isProduction ? 'production' : `http://localhost:${PORT}`}`);
  console.log(`📊 Health check: ${isProduction ? 'https://moderation-tool.vercel.app' : `http://localhost:${PORT}`}/api/health`);
  console.log(`📋 Guidelines: ${isProduction ? 'https://moderation-tool.vercel.app' : `http://localhost:${PORT}`}/api/guidelines`);
  console.log(`🤖 Moderation: ${isProduction ? 'https://moderation-tool.vercel.app' : `http://localhost:${PORT}`}/api/moderate`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
}); 