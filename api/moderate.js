const { generateContent, buildAIPrompt, parseModerationResponse } = require('./utils/ai');

// Rate limiting configuration - Different limits for dev vs production
// Note: In Vercel serverless, this rate limiting is primarily for user experience
// The real rate limiting happens at the Google AI API level
const isDev = process.env.NODE_ENV !== 'production';
const currentRateLimit = isDev ? 60 : 15;

// Simple rate limiting for Vercel (basic check)
// Note: This is a placeholder since Vercel serverless functions can't maintain state
// The real rate limiting happens at the Google AI API level with proper error handling
function checkRateLimit(ip) {
  // In Vercel serverless, we can't maintain state between function calls
  // So we'll use a very basic approach - just log and allow for now
  // The real rate limiting should happen at the Google API level
  console.log(`🔍 Rate limit check for IP: ${ip} (Vercel serverless - no persistent state)`);
  return true; // Allow all requests for now
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    // Parse request body manually for Vercel
    let body;
    try {
      if (typeof req.body === 'string') {
        body = JSON.parse(req.body);
      } else {
        body = req.body || {};
      }
    } catch (parseError) {
      console.error('Body parsing error:', parseError);
      return res.status(400).json({
        error: 'Invalid request body',
        message: 'Request body must be valid JSON',
        received: req.body
      });
    }

    // Simple rate limiting
    const clientIP = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown';
    if (!checkRateLimit(clientIP)) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: `Too many moderation requests. Limit: ${currentRateLimit} per minute. Please wait before trying again.`,
        retryAfter: 60,
        environment: isDev ? 'development' : 'production',
        limit: currentRateLimit,
        timestamp: new Date().toISOString()
      });
    }

    // Handle both field names for compatibility
    const text = body.text || body.content || body.postContent;
    const analysisType = body.analysisType || 'quick';

    // Debug logging for production troubleshooting
    console.log('Request body received:', {
      bodyType: typeof req.body,
      bodyKeys: Object.keys(body || {}),
      hasText: !!text,
      textLength: text?.length || 0,
      analysisType: analysisType,
      fieldNames: {
        text: !!body.text,
        content: !!body.content,
        postContent: !!body.postContent
      }
    });

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        error: 'Missing text content',
        message: 'Please provide text content to moderate. Expected field: content, text, or postContent',
        debug: {
          bodyType: typeof req.body,
          bodyKeys: Object.keys(body || {}),
          receivedBody: body,
          expectedFields: ['content', 'text', 'postContent']
        }
      });
    }

    // Check environment variables and deployment info
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    console.log('🔍 Environment check:', {
      NODE_ENV: process.env.NODE_ENV,
      hasGeminiKey: !!apiKey,
      keyLength: apiKey ? apiKey.length : 0,
      keySource: process.env.GOOGLE_GENERATIVE_AI_API_KEY ? 'GOOGLE_GENERATIVE_AI_API_KEY' :
                 process.env.GEMINI_API_KEY ? 'GEMINI_API_KEY' : 'GOOGLE_API_KEY',
      vercelRegion: process.env.VERCEL_REGION || 'unknown',
      vercelUrl: process.env.VERCEL_URL || 'unknown'
    });
    
    // Build AI prompt using the monolithic configuration
    const aiPromptData = await buildAIPrompt(analysisType);
    const maxTokens = aiPromptData.maxTokens || 100;
    const temperature = aiPromptData.config.temperature || 0.3;
    
    // Construct the full prompt with explicit format requirements
    const fullPrompt = `${aiPromptData.prompt}

POST TO MODERATE:
"${text}"

CRITICAL: You MUST respond ONLY with valid JSON in this exact format:
{
  "Decision": "Keep",
  "Reason": "Your brief explanation ending with a period."
}

No markdown, no extra text, no explanations - just the JSON response.`;
    
    console.log('🤖 Calling AI with maxTokens:', maxTokens);
    console.log('🔍 Full prompt length:', fullPrompt.length);
    console.log('🔍 Full prompt preview:', fullPrompt.substring(0, 300) + '...');
    let aiResponse;
    
    try {
      aiResponse = await generateContent(fullPrompt, maxTokens, temperature);
    } catch (aiError) {
      console.error('❌ AI generation failed:', aiError.message);
      console.error('❌ AI error details:', {
        name: aiError.name,
        stack: aiError.stack,
        fullError: aiError
      });
      
      // Handle rate limit errors specifically
      if (aiError.message.includes('429') || aiError.message.includes('RATE_LIMIT_EXCEEDED') || 
          aiError.message.includes('Too Many Requests') || aiError.message.includes('Quota exceeded')) {
        return res.status(429).json({
          error: 'Rate limit exceeded',
          message: 'Google AI service is currently overloaded. Please try again later.',
          retryAfter: 60,
          timestamp: new Date().toISOString()
        });
      }
      
      // Handle API key errors
      if (aiError.message.includes('API key') || aiError.message.includes('authentication') || 
          aiError.message.includes('GEMINI_API_KEY')) {
        return res.status(500).json({
          error: 'Configuration error',
          message: 'AI service is not properly configured. Please contact support.',
          timestamp: new Date().toISOString()
        });
      }
      
      // Handle other AI errors with more detail
      return res.status(500).json({
        error: 'AI service error',
        message: 'Unable to generate moderation analysis. Please try again later.',
        details: process.env.NODE_ENV === 'production' ? 'Service temporarily unavailable' : aiError.message,
        timestamp: new Date().toISOString()
      });
    }
    
    if (!aiResponse) {
      console.error('❌ AI response is null/undefined');
      return res.status(500).json({
        error: 'AI service unavailable',
        message: 'Unable to generate moderation analysis'
      });
    }
    
    console.log('✅ AI response received, model:', aiResponse.model);

    // Parse the AI response using our proper parsing function
    const aiText = aiResponse.text;
    const characterLimit = analysisType === 'detailed' ? 2000 : 300;
    
    // Use the proper parsing function that handles character limits correctly
    const parsedResponse = parseModerationResponse(aiText, characterLimit);
    
    const decision = parsedResponse.decision;
    const reason = parsedResponse.reason;

    res.json({
      success: true,
      decision: decision,
      reason: reason,
      model: aiResponse.model,
      analysisType: analysisType,
      characterCount: parsedResponse.characterCount,
      characterLimit: characterLimit,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Moderation error:', error);
    
    let errorMessage = 'An unexpected error occurred during moderation.';
    
    // Provide specific error messages for production
    if (process.env.NODE_ENV === 'production') {
      if (error.message.includes('quota') || error.message.includes('rate limit') || 
          error.message.includes('429') || error.message.includes('RATE_LIMIT_EXCEEDED')) {
        errorMessage = 'Service temporarily overloaded. Please try again later.';
      } else if (error.message.includes('API key') || error.message.includes('authentication')) {
        errorMessage = 'Service configuration error. Please contact support.';
      }
    }
    
    res.status(500).json({
      error: 'Moderation failed',
      message: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
};
