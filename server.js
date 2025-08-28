// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Basic middleware
app.use(cors());
app.use(express.json());

// API Routes - Individual serverless functions
app.post('/api/moderate', require('./api/moderate'));
app.get('/api/health', require('./api/health'));
app.get('/api/test', require('./api/test'));
app.get('/api/debug-ai-prompts', require('./api/debug-ai-prompts'));
app.post('/api/save-ai-prompt', require('./api/save-ai-prompt'));

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint working!', timestamp: new Date().toISOString() });
});

// Simple POST endpoint
app.post('/api/test-post', (req, res) => {
  res.json({ 
    message: 'POST endpoint working!', 
    body: req.body,
    timestamp: new Date().toISOString() 
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server starting up...`);
  console.log(`📡 Listening on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔧 CORS Origins: Development localhost`);
  console.log(`📊 Health check: http://127.0.0.1:${PORT}/api/health`);
  console.log(`📋 Guidelines: http://127.0.0.1:${PORT}/api/guidelines`);
  console.log(`🤖 Moderation: http://127.0.0.1:${PORT}/api/moderate`);
  console.log(`✅ Server ready to accept requests`);
}); 