const fs = require('fs').promises;
const path = require('path');
const { buildAIPrompt } = require('./utils/ai');

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

    const { analysisType = 'quick' } = body;

    // Build the AI prompt using our new monolithic approach
    const aiPromptData = await buildAIPrompt(analysisType);
    
    if (!aiPromptData || !aiPromptData.prompt) {
      throw new Error('Failed to build AI prompt');
    }

    // Create debug directory if it doesn't exist
    const debugDir = path.join(process.cwd(), 'debug');
    try {
      await fs.mkdir(debugDir, { recursive: true });
    } catch (mkdirError) {
      console.error('Error creating debug directory:', mkdirError);
    }

    // Generate timestamp for filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const timestampedFilename = `ai-prompt-${analysisType}-${timestamp}.txt`;
    const latestFilename = `ai-prompt-${analysisType}-latest.txt`;
    
    const timestampedPath = path.join(debugDir, timestampedFilename);
    const latestPath = path.join(debugDir, latestFilename);

    // Save the prompt to both timestamped and latest files
    await fs.writeFile(timestampedPath, aiPromptData.prompt, 'utf8');
    await fs.writeFile(latestPath, aiPromptData.prompt, 'utf8');

    res.json({
      success: true,
      message: 'AI prompt saved successfully',
      files: {
        timestamped: timestampedFilename,
        latest: latestFilename
      },
      promptInfo: {
        analysisType: analysisType,
        totalLength: aiPromptData.prompt.length,
        maxTokens: aiPromptData.maxTokens,
        temperature: aiPromptData.config.temperature
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Save prompt error:', error);
    res.status(500).json({
      error: 'Save failed',
      message: error.message || 'Unable to save AI prompt',
      timestamp: new Date().toISOString()
    });
  }
};


