// Guidelines configuration and utilities for external content display

// Configuration for external guidelines URL
const GUIDELINES_CONFIG = {
  url: process.env.GUIDELINES_URL,
  cacheTimeout: 3600000, // 1 hour in milliseconds
  timeout: 10000, // 10 seconds timeout for fetch
  userAgent: 'Community-Moderation-Tool/1.0'
};

// Cache for fetched guidelines
let guidelinesCache = {
  content: null,
  timestamp: null,
  source: null
};

// Fetch guidelines from external URL
async function fetchGuidelinesFromURL(url) {
  try {
    console.log(`🔄 Fetching guidelines from: ${url}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), GUIDELINES_CONFIG.timeout);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/plain,text/markdown,*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const content = await response.text();
    
    // Check if content is meaningful
    if (!content || content.length < 50) {
      console.log(`⚠️ Fetched content appears to be invalid (length: ${content?.length || 0})`);
      return null;
    }
    
    console.log(`✅ Successfully fetched guidelines (${content.length} characters)`);
    return content;
  } catch (error) {
    console.log(`❌ Failed to fetch guidelines from URL: ${error.message}`);
    return null;
  }
}

// Load guidelines from external URL for display purposes
async function loadGuidelines() {
  // Check if we have valid cached content
  if (guidelinesCache.content && guidelinesCache.timestamp) {
    const now = Date.now();
    const age = now - guidelinesCache.timestamp;
    
    if (age < GUIDELINES_CONFIG.cacheTimeout) {
      return guidelinesCache.content;
    }
  }
  
  // Try to fetch from URL if configured
  if (GUIDELINES_CONFIG.url && GUIDELINES_CONFIG.url !== 'embedded') {
    try {
      const content = await fetchGuidelinesFromURL(GUIDELINES_CONFIG.url);
      if (content) {
        guidelinesCache = {
          content: content,
          timestamp: Date.now(),
          source: 'url'
        };
        return content;
      }
    } catch (error) {
      console.log(`❌ Failed to fetch from URL: ${error.message}`);
    }
  }
  
  // If no content could be fetched, return null
  return null;
}

// Load guidelines synchronously (for backward compatibility)
function loadGuidelinesSync() {
  return guidelinesCache.content || null;
}

// Get guidelines for AI moderation (called by Vercel functions)
async function getGuidelines(analysisType = 'quick') {
  try {
    // For now, return a basic prompt structure
    // In production, this should load from your prompt files
    const basePrompt = `You are a community moderation assistant. Your task is to analyze posts and determine if they should be kept or removed based on community guidelines.

Key Guidelines:
1. Be Respectful - No hate speech, harassment, or personal attacks
2. Stay Relevant - Content should be relevant to the local community
3. No Discrimination - No content that discriminates based on race, religion, gender, etc.
4. Be Honest - No false information or misleading content
5. Protect Privacy - No sharing of personal information without consent
6. No Spam - No commercial advertising or repetitive content
7. Be Civil - No inflammatory or provocative language
8. Follow Laws - No illegal content or activities

Analysis Type: ${analysisType === 'detailed' ? 'Detailed analysis with specific rule violations' : 'Quick assessment with brief reasoning'}

Please analyze the following post and provide:
1. Decision: Keep, Remove, or Maybe Remove
2. Reason: Brief explanation of your decision
3. Rules: List any specific community guidelines that were violated (if any)`;

    return basePrompt;
  } catch (error) {
    console.error('Error getting guidelines:', error);
    return null;
  }
}

// Get guidelines for frontend display (Show Guidelines button)
async function getGuidelinesForDisplay() {
  const VERSION = require('../../public/version.js');
  
  // Check if we have cached content
  if (guidelinesCache.content && guidelinesCache.timestamp) {
    const now = Date.now();
    const age = now - guidelinesCache.timestamp;
    
    if (age < GUIDELINES_CONFIG.cacheTimeout) {
      return {
        rawContent: guidelinesCache.content,
        version: VERSION.full,
        timestamp: new Date().toISOString(),
        source: guidelinesCache.source,
        cacheAge: Math.round(age / 1000)
      };
    }
  }
  
  // If no cache or cache expired, fetch fresh content
  let displayContent = '';
  
  if (GUIDELINES_CONFIG.url && GUIDELINES_CONFIG.url !== 'embedded') {
    try {
      const content = await fetchGuidelinesFromURL(GUIDELINES_CONFIG.url);
      if (content) {
        displayContent = content;
      }
    } catch (error) {
      console.log(`❌ Failed to fetch guidelines for display: ${error.message}`);
    }
  }
  
  // If no content could be fetched, return null
  if (!displayContent) {
    return null;
  }
  
  return {
    rawContent: displayContent,
    version: VERSION.full,
    timestamp: new Date().toISOString(),
    source: 'url',
    cacheAge: null
  };
}

// Force refresh guidelines from URL
async function refreshGuidelines() {
  // Clear the cache to force a fresh fetch
  guidelinesCache = {
    content: null,
    timestamp: null,
    source: 'refreshing'
  };
  return await loadGuidelines();
}

// Get cache status
function getCacheStatus() {
  return {
    hasCache: !!guidelinesCache.content,
    source: guidelinesCache.source,
    age: guidelinesCache.timestamp ? Math.round((Date.now() - guidelinesCache.timestamp) / 1000) : null,
    config: {
      url: GUIDELINES_CONFIG.url,
      cacheTimeout: GUIDELINES_CONFIG.cacheTimeout,
      timeout: GUIDELINES_CONFIG.timeout
    }
  };
}

module.exports = {
  loadGuidelines,
  loadGuidelinesSync,
  getGuidelinesForDisplay,
  getGuidelines,
  refreshGuidelines,
  getCacheStatus
}; 