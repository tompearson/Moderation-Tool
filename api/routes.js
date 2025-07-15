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
  try {
    const { postContent } = req.body;
    
    if (!postContent) {
      return res.status(400).json({
        success: false,
        error: 'postContent is required'
      });
    }

    const guidelines = loadGuidelines();
    
    // Create the prompt for Gemini
    const prompt = `${guidelines}

Please analyze this flagged post according to the community guidelines above:

POST CONTENT:
${postContent}

Please provide your analysis in this exact format:

**Decision:** [Remove] or [Keep]  
**Reason:** [State the specific rule(s) and exactly why this post violates or does not violate them.]

IMPORTANT: Keep your response brief and concise and limited to 300 characters. Focus on the most relevant rule violations or reasons for keeping the post. Avoid lengthy explanations unless necessary. Limit response to 300 characters.`;

    // Generate content with fallback
    const { text, model: usedModel } = await generateContent(prompt);
    
    // Parse the response
    const { decision, reason } = parseModerationResponse(text);

    res.json({
      success: true,
      decision,
      reason,
      model: usedModel,
      timestamp: new Date().toISOString(),
      rawResponse: text
    });

  } catch (error) {
    console.error('Moderation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router; 