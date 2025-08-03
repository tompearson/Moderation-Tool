const express = require('express');
const { loadGuidelines, parseGuidelines } = require('./utils/guidelines');
const { generateContent, parseModerationResponse } = require('./utils/ai');
const VERSION = require('../version.js');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    version: VERSION.full,
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
router.get('/guidelines', async (req, res) => {
  try {
    const guidelines = await parseGuidelines();
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
    const { getGuidelinesWithMetadata, getCacheStatus } = require('./utils/guidelines.js');
    
    // Get guidelines with metadata
    const guidelines = await getGuidelinesWithMetadata();
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
    const { refreshGuidelines, getCacheStatus } = require('./utils/guidelines.js');
    const { action } = req.body;
    
    if (action === 'refresh') {
      // Force refresh guidelines from URL
      const refreshedContent = await refreshGuidelines();
      const cacheStatus = getCacheStatus();
      
      res.status(200).json({
        success: true,
        message: 'Guidelines refreshed successfully',
        source: cacheStatus.source,
        cacheAge: cacheStatus.age,
        contentPreview: refreshedContent.substring(0, 500) + '...'
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
router.post('/moderate', async (req, res) => {
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
    // Load moderation rules from guidelines
    const guidelinesData = parseGuidelines();
    const guidelines = guidelinesData.rawContent;
    
    // Construct the full moderation prompt
    const prompt = characterLimit <= 300 ? 
      // Original simple prompt for 300 characters
      `SYSTEM: You are a community moderation AI. Your ONLY job is to analyze posts and determine if they violate community guidelines. You must respond in the exact format specified. Never truncate your response being sure to use all the characters available.

TASK: Analyze the following post according to these community guidelines:

${guidelines}

POST TO MODERATE:
"${content}"

MODERATION INSTRUCTIONS:
- You are a community moderator reviewing a flagged post
- Compare the post content to each rule above
- Determine if the post should be kept or removed
- When in doubt, err on the side of keeping posts
- Only remove posts that clearly violate rules
- Consider context and intent
- Be lenient with local community content

REQUIRED RESPONSE FORMAT (you must use exactly this format):
**Decision:** [Remove] or [Keep]
**Reason:** [Brief explanation of which rule(s) apply and why]

Keep your response under ${characterLimit} characters. Focus only on the moderation decision.` :
      // Detailed prompt for 2000 characters
      `CRITICAL CHARACTER LIMIT INSTRUCTION: You MUST write a comprehensive and detailed response using MOST of the available ${characterLimit} characters. Provide extensive analysis with specific rule evaluation, context analysis, and detailed reasoning.

SYSTEM: You are a community moderation AI. Your ONLY job is to analyze posts and determine if they violate community guidelines. You must respond in the exact format specified.

TASK: Analyze the following post according to these community guidelines:

${guidelines}

POST TO MODERATE:
"${content}"

MODERATION INSTRUCTIONS:
- You are a community moderator reviewing a flagged post
- Compare the post content to each rule above
- Determine if the post should be kept or removed
- When in doubt, err on the side of keeping posts
- Only remove posts that clearly violate rules
- Consider context and intent
- Be lenient with local community content

REQUIRED RESPONSE FORMAT (you must use exactly this format):
**Decision:** [Remove] or [Keep]
**Reason:** [Comprehensive analysis with specific rule evaluation, context analysis, and detailed reasoning]

CHARACTER LIMIT ENFORCEMENT: Your ENTIRE response (including "**Decision:**" and "**Reason:**" text) must be EXACTLY ${characterLimit} characters or less. DO NOT exceed ${characterLimit} characters. For ${characterLimit} characters, aim to use at least ${Math.floor(characterLimit * 0.8)} characters in your response.

EXAMPLE FOR ${characterLimit} CHARACTERS:
**Decision:** Keep
**Reason:** This post fully aligns with the community guidelines and does not violate any of the specified rules. It promotes a local event focused on Restorative Justice, which is a legitimate and constructive topic for community discussion. The content is highly relevant to the local community as it aims to foster healing, understanding, and transformation within the neighborhood. The event details, including the location in Beaverton, Oregon, clearly place it within the approved local coverage area. The post is written with a civil tone, using respectful, inviting, and inclusive language throughout. There is no hate speech, threats, personal attacks, or excessive profanity. It does not attempt to discriminate based on any protected characteristic, nor does it share any misinformation, false claims, or private information without consent. Furthermore, it does not promote violence, criminal acts, or any other prohibited content like spam or fraudulent schemes. The event is a free community gathering, which is appropriate content for the main feed, and therefore, it does not fall under the 'Incorrect Category' rule that applies to items offered for sale or free. Overall, the post strongly encourages positive community engagement and directly supports the platform's goal of creating a safe, respectful, and inclusive space for neighbors to build stronger communities through constructive conversations. It provides clear, actionable information about a beneficial community event.

Make your response similar in length and detail to this example. REMEMBER: Your response must be ${characterLimit} characters or less.`;

    // Send the full prompt to the AI
    const aiResponse = await generateContent(prompt);
    
    // Parse the AI response to extract decision and reason
    const parsedResult = parseModerationResponse(aiResponse.text, characterLimit);
    
    // Add the AI model information to the response
    const finalResult = {
      ...parsedResult,
      model: aiResponse.model
    };
    
    // Production-safe logging
    if (process.env.NODE_ENV !== 'production') {
      // console.log('AI Model used:', aiResponse.model);
      // console.log('Response decision:', parsedResult.decision);
      // console.log('Response length:', aiResponse.text.length);
    }
    
    res.status(200).json(finalResult);
  } catch (error) {
    console.error('Moderation error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 