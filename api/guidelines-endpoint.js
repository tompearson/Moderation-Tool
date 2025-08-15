import { getGuidelinesForDisplay, refreshGuidelines, getCacheStatus } from './utils/guidelines.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
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
          url: process.env.GUIDELINES_URL || 'https://help.nextdoor.com/s/article/community-guidelines?language=en_GB',
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
  } else if (req.method === 'POST') {
    try {
      const { action } = req.body;
      
      if (action === 'refresh') {
        // Force refresh guidelines from URL (this populates cache with combined content for backend)
        const refreshedContent = await refreshGuidelines();
        const cacheStatus = getCacheStatus();
        
        // Get the display guidelines (primary Gist only, ignoring cache)
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
          cache: cacheStatus,
          config: {
            url: process.env.GUIDELINES_URL || 'https://help.nextdoor.com/s/article/community-guidelines?language=en_GB',
            cacheTimeout: 3600000, // 1 hour
            timeout: 10000 // 10 seconds
          }
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
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 