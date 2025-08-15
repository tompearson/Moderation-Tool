// Single source of truth for community guidelines - update here for all changes
const MODERATION_RULES = `# Community Moderation Rules (.cursorrules)

## Purpose
Check whether a flagged post violates community guidelines. 

## When reviewing a post:
- Read the post carefully.
- Compare the content to each rule below.
- If any rule is violated, say which one and why.
- There are no specific "civil tone' guidelines but the goal of the guidelines is to create a safe, respectful inclusive space where neighbors can build stronger communities through constructive conversations. This platform is locally focused, not a place for discussing events in other states.

## Limitations
- This tool does not store any submitted posts and has no awareness of the origin of the input. As a result, it cannot identify nuanced or repetitive submissions.

## Local Coverage
### Counties
- WASHINGTON COUNTY OR (includes all cities and zip codes within Washington County)

### Specific Cities and Zip Codes
HILLSBORO OR 97124
BEAVERTON OR 97006, 97003, 97078
CORNELIUS OR 97113
FOREST GROVE OR 97116
GASTON OR 97119
NEWBURG OR 97132
SHERWOOD OR 97140
PORTLAND OR 97086
PORTLAND OR 97201
PORTLAND OR 97202
PORTLAND OR 97203
PORTLAND OR 97204
PORTLAND OR 97205
PORTLAND OR 97206
PORTLAND OR 97209
PORTLAND OR 97210
PORTLAND OR 97211
PORTLAND OR 97212
PORTLAND OR 97213
PORTLAND OR 97214
PORTLAND OR 97215
PORTLAND OR 97216
PORTLAND OR 97217
PORTLAND OR 97218
PORTLAND OR 97219
PORTLAND OR 97220
PORTLAND OR 97221
PORTLAND OR 97222
PORTLAND OR 97223
PORTLAND OR 97224
PORTLAND OR 97225
PORTLAND OR 97227
PORTLAND OR 97229
PORTLAND OR 97230
PORTLAND OR 97231
PORTLAND OR 97232
PORTLAND OR 97233
PORTLAND OR 97236
PORTLAND OR 97252
PORTLAND OR 97253
PORTLAND OR 97267

---

## Rules

### 1. Be Respectful
- No hate speech, slurs, or harassment.
- No threats or intimidation.
- No name-calling, personal attacks, or insults.
- Excessive profanity aimed at others is not allowed.
- If the post is respectful and focuses on a legitimate neighborhood concern without singling out or attacking the neighbor

### 2. Keep It Relevant
- Posts must be relevant to the local community.
- Do not share unrelated national politics or off-topic content.

### 3. Do Not Discriminate
- No content that discriminates or promotes hate based on race, ethnicity, religion, gender, sexual orientation, disability, or age.

### 4. No Misinformation
- Do not share false or misleading information that could harm others.
- Health, safety, or crime claims must be accurate.
- Do not allow misinformation about politics and election topics    

### 5. Respect Privacy
- Do not share someone's private information without consent (addresses, phone numbers, etc.).
- No doxxing.

### 6. No Prohibited Content
- No violence or calls for violence.
- No promotion of criminal acts.
- No adult sexual content or explicit material.
- No spam, scams, or fraudulent schemes.
- Public shaming
- Threats or harassment
- Selling or promoting illegal goods or services 
- Spam or misinformation

### 7. Civil Tone
- Use civil language.
- Avoid aggressive or offensive tone.

### 8. Incorrect Catagory 
- Items offered for sale or free are considered 'Posted In Error' 
and should not be in the main feed and should not be allowed.

---

## Output Format

When you analyze a post, always respond like this:

**Decision:** [Remove] or [Keep]  
**Reason:** [State the specific rule(s) and exactly why this post violates or does not violate them.]

IMPORTANT: Keep your response brief and concise and limited to 300 characters. Focus on the most relevant rule violations or reasons for keeping the post. Avoid lengthy explanations unless necessary. Limit response to 300 characters.`;

// Configuration for external guidelines URL
const GUIDELINES_CONFIG = {
  url: process.env.GUIDELINES_URL,
  additionalUrl: process.env.ADDITIONAL_GUIDELINES_URL,
  promptInstructionsUrl: process.env.SPECIAL_PROMPT_URL, // New third variable
  cacheTimeout: 3600000, // 1 hour in milliseconds
  timeout: 10000, // 10 seconds timeout for fetch
  userAgent: 'Community-Moderation-Tool/1.0'
};



// Cache for fetched guidelines
let guidelinesCache = {
  content: null,
  primaryContent: null, // Store primary content separately
  timestamp: null,
  source: 'embedded'
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
      console.log(`Content preview: ${content?.substring(0, 200) || 'No content'}...`);
      return null;
    }
    
    console.log(`✅ Successfully fetched guidelines (${content.length} characters)`);
    console.log(`Content preview: ${content.substring(0, 200)}...`);
    
    return content;
  } catch (error) {
    console.log(`❌ Failed to fetch guidelines from URL: ${error.message}`);
    return null;
  }
}

// Load community guidelines with URL fallback
async function loadGuidelines() {
  // Check if we have valid cached content
  if (guidelinesCache.content && guidelinesCache.timestamp) {
    const now = Date.now();
    const age = now - guidelinesCache.timestamp;
    
    if (age < GUIDELINES_CONFIG.cacheTimeout) {
      return guidelinesCache.content;
    }
  }
  
      // Try to fetch from URLs if configured
    if (GUIDELINES_CONFIG.url && GUIDELINES_CONFIG.url !== 'embedded') {
      try {
        let combinedContent = '';
        
        // Fetch prompt instructions first (to set the tone for AI responses)
        if (GUIDELINES_CONFIG.promptInstructionsUrl) {
          const promptInstructions = await fetchGuidelinesFromURL(GUIDELINES_CONFIG.promptInstructionsUrl);
          if (promptInstructions) {
            combinedContent += promptInstructions;
            combinedContent += '\n\n---\n\n';
          }
        }
        
        // Fetch additional guidelines
        if (GUIDELINES_CONFIG.additionalUrl) {
          const additionalContent = await fetchGuidelinesFromURL(GUIDELINES_CONFIG.additionalUrl);
          if (additionalContent) {
            combinedContent += additionalContent;
            combinedContent += '\n\n---\n\n';
          }
        }
        
        // Fetch primary guidelines last
        const primaryContent = await fetchGuidelinesFromURL(GUIDELINES_CONFIG.url);
        if (primaryContent) {
          combinedContent += primaryContent;
        }
        
        if (combinedContent) {
          // Store combined content for both AI use and frontend display
          guidelinesCache = {
            content: combinedContent,
            primaryContent: primaryContent, // Keep for backward compatibility
            timestamp: Date.now(),
            source: 'url'
          };
          return combinedContent; // Return combined content to match display order
        }
      } catch (error) {
        console.log(`❌ Failed to fetch from URLs: ${error.message}`);
      }
    }
  
  // Fall back to embedded rules
  guidelinesCache = {
    content: MODERATION_RULES,
    primaryContent: MODERATION_RULES,
    timestamp: Date.now(),
    source: 'embedded'
  };
  
  return MODERATION_RULES;
}

// Load guidelines synchronously (for backward compatibility)
function loadGuidelinesSync() {
  return guidelinesCache.content || MODERATION_RULES;
}

// Parse guidelines into structured format
async function parseGuidelines() {
  const rawContent = await loadGuidelines();
  
  return {
    rules: [
      { id: 1, title: 'Be Respectful', description: 'No hate speech, slurs, or harassment.' },
      { id: 2, title: 'Keep It Relevant', description: 'Posts must be relevant to the local community.' },
      { id: 3, title: 'Do Not Discriminate', description: 'No content that discriminates or promotes hate.' },
      { id: 4, title: 'No Misinformation', description: 'Do not share false or misleading information.' },
      { id: 5, title: 'Respect Privacy', description: 'Do not share private information without consent.' },
      { id: 6, title: 'No Prohibited Content', description: 'No violence, criminal acts, or adult content.' },
      { id: 7, title: 'Civil Tone', description: 'Use civil language and avoid aggressive tone.' },
      { id: 8, title: 'Incorrect Category', description: 'Items for sale should not be in main feed.' }
    ],
    localCoverage: {
      zipCodes: ['97124', '97006', '97003', '97078', '97113', '97116', '97119', '97132', '97140', '97086', '97201', '97202', '97203', '97204', '97205', '97206', '97209', '97210', '97211', '97212', '97213', '97214', '97215', '97216', '97217', '97218', '97219', '97220', '97221', '97222', '97223', '97224', '97225', '97227', '97229', '97230', '97231', '97232', '97233', '97236', '97252', '97253', '97267'],
      cities: ['Hillsboro', 'Beaverton', 'Cornelius', 'Forest Grove', 'Gaston', 'Newburg', 'Sherwood', 'Portland']
    },
    rawContent
  };
}

// Get guidelines with version info for API responses (for moderation - uses combined content for AI)
async function getGuidelinesWithMetadata() {
  const VERSION = require('../../public/version.js');
  const content = await loadGuidelines();
  
  // For moderation API calls, use the combined content from cache
  const combinedContent = guidelinesCache.content;
  const finalContent = combinedContent || content;
  
  return {
    rawContent: finalContent, // Use combined content for AI, fallback to display content
    version: VERSION.full,
    timestamp: new Date().toISOString(),
    source: guidelinesCache.source,
    cacheAge: guidelinesCache.timestamp ? Math.round((Date.now() - guidelinesCache.timestamp) / 1000) : null
  };
}

// Get guidelines for frontend display (primary Gist only - for user viewing)
async function getGuidelinesForDisplay() {
  const VERSION = require('../../public/version.js');
  
  // Check if we have cached primary content
  if (guidelinesCache.primaryContent && guidelinesCache.timestamp) {
    const now = Date.now();
    const age = now - guidelinesCache.timestamp;
    
    if (age < GUIDELINES_CONFIG.cacheTimeout) {
      return {
        rawContent: guidelinesCache.primaryContent,
        version: VERSION.full,
        timestamp: new Date().toISOString(),
        source: guidelinesCache.source,
        cacheAge: Math.round(age / 1000)
      };
    }
  }
  
  // If no cache or cache expired, fetch fresh primary content only (for Show Guidelines button)
  let displayContent = '';
  
  if (GUIDELINES_CONFIG.url && GUIDELINES_CONFIG.url !== 'embedded') {
    try {
      const primaryContent = await fetchGuidelinesFromURL(GUIDELINES_CONFIG.url);
      if (primaryContent) {
        displayContent = primaryContent;
      }
    } catch (error) {
      console.log(`❌ Failed to fetch primary guidelines for display: ${error.message}`);
    }
  }
  
  // Fall back to embedded if primary fails
  if (!displayContent) {
    displayContent = MODERATION_RULES;
  }
  
  return {
    rawContent: displayContent,
    version: VERSION.full,
    timestamp: new Date().toISOString(),
    source: displayContent === MODERATION_RULES ? 'embedded' : 'url',
    cacheAge: null
  };
}

// Force refresh guidelines from URL
async function refreshGuidelines() {
  // Clear the cache to force a fresh fetch
  guidelinesCache = {
    content: null,
    primaryContent: null,
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
  parseGuidelines,
  getGuidelinesWithMetadata,
  getGuidelinesForDisplay,
  refreshGuidelines,
  getCacheStatus,
  MODERATION_RULES // Export raw content for direct access
}; 