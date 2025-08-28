const { generateContent } = require('./utils/ai');

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

    const { prompt, maxTokens = 500 } = body;

    if (!prompt) {
      return res.status(400).json({
        error: 'Missing prompt',
        message: 'Please provide a prompt to test'
      });
    }

    // Generate AI response
    const aiResponse = await generateContent(prompt, maxTokens);
    
    if (!aiResponse) {
      return res.status(500).json({
        error: 'AI service unavailable',
        message: 'Unable to generate AI response'
      });
    }

    res.json({
      success: true,
      response: aiResponse,
      maxTokens: maxTokens,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Test AI response error:', error);
    
    let errorMessage = 'An unexpected error occurred during AI testing.';
    
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
      error: 'AI test failed',
      message: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
};
