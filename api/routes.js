const express = require('express');
const { loadGuidelines, parseGuidelines } = require('./utils/guidelines');
const { generateContent, parseModerationResponse } = require('./utils/ai');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    version: '0.6.0-alpha',
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
  console.log('Received request body:', req.body);
  console.log('Request body type:', typeof req.body);
  console.log('Request body keys:', Object.keys(req.body || {}));
  
  // Handle both 'content' and 'postContent' field names for flexibility
  const content = req.body.content || req.body.postContent;
  console.log('Extracted content:', content);
  console.log('Content type:', typeof content);
  console.log('Content length:', content ? content.length : 'null');
  
  // Validate that we have content to moderate
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return res.status(400).json({ 
      error: 'Missing or invalid content. Please provide a post to moderate.',
      received: req.body 
    });
  }
  
  try {
    // Load moderation rules from guidelines
    const guidelinesData = parseGuidelines();
    const guidelines = guidelinesData.rawContent;
    
    // Construct the full moderation prompt
    const prompt = `SYSTEM: You are a community moderation AI. Your ONLY job is to analyze posts and determine if they violate community guidelines. You must respond in the exact format specified.

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

Keep your response under 300 characters. Focus only on the moderation decision.`;

    // Send the full prompt to the AI
    console.log('Full prompt length:', prompt.length);
    console.log('Post content being moderated:', content);
    console.log('Sending prompt to AI (first 1000 chars):', prompt.substring(0, 1000) + '...');
    const aiResponse = await generateContent(prompt);
    console.log('AI Response:', aiResponse.text);
    
    // Parse the AI response to extract decision and reason
    const parsedResult = parseModerationResponse(aiResponse.text);
    console.log('Parsed Result:', parsedResult);
    
    res.json(parsedResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 