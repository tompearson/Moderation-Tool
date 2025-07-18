const express = require('express');
const { loadGuidelines, parseGuidelines } = require('./utils/guidelines');
const { generateContent, parseModerationResponse } = require('./utils/ai');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    version: '0.3.0-alpha',
    timestamp: new Date().toISOString()
  });
});

// Debug environment variables endpoint
router.get('/debug-env', (req, res) => {
  const envInfo = {
    geminiApiKey: process.env.GEMINI_API_KEY ? {
      exists: true,
      length: process.env.GEMINI_API_KEY.length,
      startsWith: process.env.GEMINI_API_KEY.substring(0, 10) + '...',
      endsWith: '...' + process.env.GEMINI_API_KEY.substring(process.env.GEMINI_API_KEY.length - 4)
    } : {
      exists: false,
      message: 'GEMINI_API_KEY not found in environment variables'
    },
    nodeEnv: process.env.NODE_ENV || 'not set',
    isProduction: process.env.NODE_ENV === 'production',
    vercelEnv: process.env.VERCEL_ENV || 'not set',
    vercelUrl: process.env.VERCEL_URL || 'not set',
    allEnvKeys: Object.keys(process.env).filter(key => 
      key.includes('GEMINI') || key.includes('API') || key.includes('KEY')
    )
  };
  
  res.json({
    success: true,
    environment: envInfo,
    timestamp: new Date().toISOString()
  });
});

// Get guidelines endpoint
router.get('/guidelines', (req, res) => {
  try {
    const guidelines = parseGuidelines();
    res.json({
      success: true,
      guidelines
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to load guidelines'
    });
  }
});

// Main moderation endpoint
router.post('/moderate', async (req, res) => {
  const { content } = req.body; // Gets the post content
  
  try {
    // Backend has access to GEMINI_API_KEY via process.env
    const result = await generateContent(content);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 