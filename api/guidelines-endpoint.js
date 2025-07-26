const { getGuidelinesWithMetadata } = require('./utils/guidelines.js');

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const guidelinesData = getGuidelinesWithMetadata();
    
    res.status(200).json({
      success: true,
      guidelines: guidelinesData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to load guidelines'
    });
  }
} 