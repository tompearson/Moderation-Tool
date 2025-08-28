const express = require('express');
const { loadGuidelines } = require('./utils/guidelines');
const { generateContent, parseModerationResponse } = require('./utils/ai');
const VERSION = require('../public/version.js');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiting configuration - Different limits for dev vs production
const moderationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: process.env.NODE_ENV === 'production' ? 15 : 60, // 15 prod, 60 dev
  message: {
    error: 'Too many moderation requests. Please wait a minute before trying again.',
    retryAfter: 60
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    const isDev = process.env.NODE_ENV !== 'production';
    const limit = isDev ? 60 : 15;
    
    res.status(429).json({
      error: 'Rate limit exceeded',
      message: `Too many moderation requests. Limit: ${limit} per minute. Please wait before trying again.`,
      retryAfter: 60,
      environment: isDev ? 'development' : 'production',
      limit: limit,
      timestamp: new Date().toISOString()
    });
  }
});

// Log rate limiting configuration on startup
const isDev = process.env.NODE_ENV !== 'production';
const currentRateLimit = isDev ? 60 : 15;
console.log(`🚦 Rate limiting configured: ${currentRateLimit} requests/minute (${isDev ? 'development' : 'production'} mode)`);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    version: '0.8.9-alpha',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    message: 'API is working correctly'
  });
});

// Test endpoint for debugging
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Test endpoint is working',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
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

// Debug combined guidelines endpoint
router.get('/debug-guidelines', async (req, res) => {
  try {
    const { getGuidelinesForDisplay, getCacheStatus } = require('./utils/guidelines.js');
    
    // Get display guidelines only (AI now uses prompt folder system)
    const displayGuidelines = await getGuidelinesForDisplay();
    const cacheStatus = getCacheStatus();
    
    res.json({
      success: true,
      display: {
        content: displayGuidelines.rawContent.substring(0, 1000) + '...',
        length: displayGuidelines.rawContent.length,
        source: displayGuidelines.source
      },
      cache: cacheStatus,
      note: 'AI guidelines now use the prompt folder system instead of external URLs'
    });
  } catch (error) {
    console.error('Error getting debug guidelines:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Debug AI prompts endpoint
router.get('/debug-ai-prompts', async (req, res) => {
  try {
    const { buildAIPrompt } = require('./utils/ai.js');
    const analysisType = req.query.analysisType || 'quick';
    
    const promptResult = await buildAIPrompt(analysisType);
    
    res.json({
      success: true,
      analysisType,
      config: promptResult.config,
      promptStructure: {
        totalLength: promptResult.prompt.length,
        promptIds: promptResult.config.promptIds,
        individualPrompts: Object.keys(promptResult.prompts).reduce((acc, key) => {
          acc[key] = {
            length: promptResult.prompts[key].length,
            preview: promptResult.prompts[key].substring(0, 300) + '...',
            content: promptResult.prompts[key]
          };
          return acc;
        }, {}),
        combinedPrompt: promptResult.prompt
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting debug AI prompts:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Test AI response parsing endpoint (for debugging production issues)
router.post('/test-ai-response', async (req, res) => {
  try {
    const { text, characterLimit = 300 } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Missing text parameter' });
    }
    
    const { parseModerationResponse } = require('./utils/ai.js');
    const result = parseModerationResponse(text, characterLimit);
    
    res.json({
      success: true,
      originalText: text.substring(0, 500) + (text.length > 500 ? '...' : ''),
      originalLength: text.length,
      parsedResult: result,
      hasHtml: text.includes('<html') || text.includes('<!DOCTYPE'),
      hasErrorKeywords: text.toLowerCase().includes('error') || text.toLowerCase().includes('failed')
    });
    
  } catch (error) {
    console.error('Error testing AI response parsing:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Save AI prompt to debug file endpoint
router.post('/save-ai-prompt', async (req, res) => {
  try {
    const { buildAIPrompt } = require('./utils/ai.js');
    const { analysisType = 'quick' } = req.body;
    
    // Build the AI prompt
    const promptResult = await buildAIPrompt(analysisType);
    
    // Save to debug file with timestamp
    const fs = require('fs/promises');
    const path = require('path');
    
    try {
      await fs.mkdir('debug', { recursive: true });
      
      // Create timestamped filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const debugFile = `debug/ai-prompt-combined-${timestamp}.txt`;
      await fs.writeFile(debugFile, promptResult.prompt, 'utf8');
      
      // Also update the latest file
      const latestFile = 'debug/ai-prompt-combined-latest.txt';
      await fs.writeFile(latestFile, promptResult.prompt, 'utf8');
      
      res.json({
        success: true,
        message: 'AI prompt saved to debug file',
        files: {
          timestamped: debugFile,
          latest: latestFile
        },
        promptInfo: {
          analysisType,
          totalLength: promptResult.prompt.length,
          promptIds: promptResult.config.promptIds,
          maxTokens: promptResult.config.maxTokens
        }
      });
      
    } catch (saveError) {
      console.error('Error saving debug file:', saveError);
      res.status(500).json({
        success: false,
        error: 'Failed to save debug file: ' + saveError.message
      });
    }
    
  } catch (error) {
    console.error('Error building AI prompt for debug save:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get guidelines endpoint
router.get('/guidelines', async (req, res) => {
  try {
    const { getGuidelinesForDisplay } = require('./utils/guidelines.js');
    const guidelines = await getGuidelinesForDisplay();
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

// Guidelines endpoint with metadata and cache info
router.get('/guidelines-endpoint', async (req, res) => {
  try {
    const { getGuidelinesForDisplay, getCacheStatus } = require('./utils/guidelines.js');
    
    // Get guidelines for frontend display (primary Gist only)
    const guidelines = await getGuidelinesForDisplay();
    const cacheStatus = getCacheStatus();
    
    res.status(200).json({
      success: true,
      guidelines: {
        content: guidelines.rawContent.substring(0, 500) + '...', // Preview only
        fullContent: guidelines.rawContent,
        version: guidelines.version,
        timestamp: guidelines.timestamp,
        source: guidelines.source,
        cacheAge: guidelines.cacheAge
      },
      cache: cacheStatus,
      config: {
        url: process.env.GUIDELINES_URL || 'embedded',
        cacheTimeout: 3600000, // 1 hour
        timeout: 10000 // 10 seconds
      }
    });
  } catch (error) {
    console.error('Error getting guidelines:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Force refresh guidelines
router.post('/guidelines-endpoint', async (req, res) => {
  try {
    const { refreshGuidelines, getGuidelinesForDisplay, getCacheStatus } = require('./utils/guidelines.js');
    const { action } = req.body;
    
    if (action === 'refresh') {
      // Force refresh guidelines from URL (populates cache with combined content for backend)
      const refreshedContent = await refreshGuidelines();
      const cacheStatus = getCacheStatus();
      
      // Get display guidelines (primary Gist only, ignoring cache)
      const guidelines = await getGuidelinesForDisplay();
      
      res.status(200).json({
        success: true,
        message: 'Guidelines refreshed successfully',
        guidelines: {
          content: guidelines.rawContent.substring(0, 500) + '...', // Preview only
          fullContent: guidelines.rawContent,
          version: guidelines.version,
          timestamp: guidelines.timestamp,
          source: guidelines.source,
          cacheAge: guidelines.cacheAge
        },
        cache: cacheStatus
      });
    } else {
      res.status(400).json({ 
        success: false, 
        error: 'Invalid action. Use "refresh" to force refresh guidelines.' 
      });
    }
  } catch (error) {
    console.error('Error refreshing guidelines:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Main moderation endpoint
router.post('/moderate', moderationLimiter, async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle both 'content' and 'postContent' field names for flexibility
  const content = req.body.content || req.body.postContent;
  const characterLimit = req.body.characterLimit || 300; // Default to 300 if not provided
  
  // Production-safe logging
  if (process.env.NODE_ENV !== 'production') {
    // console.log('=== REQUEST DEBUG INFO ===');
    // console.log('Content length:', content ? content.length : 'null');
    // console.log('Character limit:', characterLimit);
    // console.log('=== END REQUEST DEBUG INFO ===');
  }
  
  // Validate that we have content to moderate
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return res.status(400).json({ 
      error: 'Missing or invalid content. Please provide a post to moderate.',
      received: req.body 
    });
  }

  // Validate API key
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ 
      error: 'GEMINI_API_KEY environment variable is not set. Please configure your API key in Vercel.' 
    });
  }
  
      try {
        // Build AI prompt using the new prompt folder system
        const { buildAIPrompt } = require('./utils/ai.js');
        const analysisType = characterLimit <= 300 ? 'quick' : 'detailed';
        
        const promptResult = await buildAIPrompt(analysisType);
        const aiPrompt = promptResult.prompt;
        const analysisConfig = promptResult.config;
        
        // Production-safe logging
        if (process.env.NODE_ENV !== 'production') {
          console.log('🎯 AI Prompt Structure:');
          console.log(`   - Analysis Type: ${analysisType}`);
          console.log(`   - Prompt IDs: ${analysisConfig.promptIds.join(', ')}`);
          console.log(`   - Max Tokens: ${analysisConfig.maxTokens}`);
          console.log(`   - Total Length: ${aiPrompt.length} characters`);
        }
        
        // Construct the full moderation prompt using prompt files
        const prompt = `TASK: Analyze the following post according to these community guidelines:

${aiPrompt}

POST TO MODERATE:
"${content}"

CHARACTER LIMIT: Keep your response under ${characterLimit} characters. Focus only on the moderation decision.`;

        // Send the full prompt to the AI with maxTokens from config
        const aiResponse = await generateContent(prompt, analysisConfig.maxTokens);
        
        // Validate AI response before parsing
        if (!aiResponse || !aiResponse.text) {
          throw new Error('AI service returned invalid response');
        }
        
        // Additional validation for HTML or error content (double-check)
        if (aiResponse.text.includes('<html') || aiResponse.text.includes('<!DOCTYPE') || 
            aiResponse.text.includes('The page') || aiResponse.text.includes('<body') || 
            aiResponse.text.includes('<title') || aiResponse.text.includes('<head')) {
          console.error('AI returned HTML content:', aiResponse.text.substring(0, 200));
          throw new Error('AI service returned HTML error page instead of moderation response');
        }
        
        // Check for common error messages
        if (aiResponse.text.toLowerCase().includes('error') || 
            aiResponse.text.toLowerCase().includes('failed') || 
            aiResponse.text.toLowerCase().includes('unable') ||
            aiResponse.text.toLowerCase().includes('service unavailable') || 
            aiResponse.text.toLowerCase().includes('rate limit') || 
            aiResponse.text.toLowerCase().includes('quota exceeded') || 
            aiResponse.text.toLowerCase().includes('timeout')) {
          console.error('AI returned error message:', aiResponse.text.substring(0, 200));
          throw new Error('AI service encountered an error: ' + aiResponse.text.substring(0, 100));
        }
        
        // Parse the AI response to extract decision and reason
        let parsedResult;
        try {
          parsedResult = parseModerationResponse(aiResponse.text, characterLimit);
        } catch (parseError) {
          console.error('Failed to parse AI response:', parseError);
          // Fallback to safe default
          parsedResult = {
            decision: 'Keep',
            reason: 'Error: Unable to parse AI response. Please try again.',
            rules: [{ id: 0, title: 'System Error', emoji: '⚠️' }],
            characterCount: 0,
            characterLimit
          };
        }
        
        // Add the AI model information and rule source to the response
        const finalResult = {
          ...parsedResult,
          model: aiResponse.model,
          ruleSource: `ai-${analysisType}` // Use AI source instead of Gist
        };
        
        // Production-safe logging
        if (process.env.NODE_ENV !== 'production') {
          console.log('AI Model used:', aiResponse.model);
          console.log('Response decision:', parsedResult.decision);
          console.log('Response length:', aiResponse.text.length);
        } else {
          // Minimal production logging
          console.log(`Moderation completed: ${parsedResult.decision} (${aiResponse.text.length} chars)`);
        }
        
        res.status(200).json(finalResult);
  } catch (error) {
    console.error('Moderation error:', error);
    
    // Ensure we always return proper JSON, never HTML
    let errorMessage = error.message || 'Unknown error occurred';
    
    // Sanitize error messages for production
    if (process.env.NODE_ENV === 'production') {
      if (errorMessage.includes('HTML') || errorMessage.includes('The page')) {
        errorMessage = 'AI service temporarily unavailable. Please try again.';
      } else if (errorMessage.includes('API key') || errorMessage.includes('GEMINI_API_KEY')) {
        errorMessage = 'Service configuration error. Please contact support.';
      } else if (errorMessage.includes('quota') || errorMessage.includes('rate limit') || 
                 errorMessage.includes('429') || errorMessage.includes('RATE_LIMIT_EXCEEDED')) {
        errorMessage = 'Service temporarily overloaded. Please try again later.';
      } else {
        errorMessage = 'Service temporarily unavailable. Please try again.';
      }
    }
    
    res.status(500).json({ 
      error: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router; 