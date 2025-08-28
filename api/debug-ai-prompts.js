const fs = require('fs').promises;
const path = require('path');
const { buildAIPrompt } = require('./utils/ai');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  try {
    const analysisType = req.query.analysisType || 'quick';
    
    // Build the AI prompt using our new monolithic approach
    const aiPromptData = await buildAIPrompt(analysisType);
    
    if (!aiPromptData || !aiPromptData.prompt) {
      throw new Error('Failed to build AI prompt');
    }

    // Return the structure the frontend expects
    res.json({
      success: true,
      promptStructure: {
        combinedPrompt: aiPromptData.prompt, // The monolithic prompt
        totalLength: aiPromptData.prompt.length,
        analysisType: analysisType,
        maxTokens: aiPromptData.maxTokens,
        temperature: aiPromptData.config.temperature,
        config: aiPromptData.fullConfig
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({
      error: 'Debug failed',
      message: error.message || 'Unable to retrieve debug information',
      timestamp: new Date().toISOString()
    });
  }
};


