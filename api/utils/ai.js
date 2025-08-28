const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs/promises');
const path = require('path');

// Validate API key - check multiple possible names
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.error('❌ No Gemini API key found!');
  console.error('Please set one of these environment variables:');
  console.error('- GOOGLE_GENERATIVE_AI_API_KEY (preferred)');
  console.error('- GEMINI_API_KEY');
  console.error('- GOOGLE_API_KEY');
  console.error('In Vercel: Project Settings > Environment Variables');
} else {
  console.log('✅ API key found, length:', apiKey.length);
  console.log('✅ Using key from:', 
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ? 'GOOGLE_GENERATIVE_AI_API_KEY' :
    process.env.GEMINI_API_KEY ? 'GEMINI_API_KEY' : 'GOOGLE_API_KEY'
  );
}

// Initialize Gemini AI with custom configuration
const genAI = new GoogleGenerativeAI(apiKey);

// Custom fetch configuration to mimic browser behavior
const customFetch = async (url, options) => {
  const browserHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'cross-site'
  };
  
  return fetch(url, {
    ...options,
    headers: {
      ...browserHeaders,
      ...options?.headers
    }
  });
};

// Available models with fallback order (removed gemini-2.0-flash-exp as it doesn't exist)
const MODELS = ['gemini-1.5-flash', 'gemini-1.5-pro'];

// Generate content with fallback logic (no retries for rate limits)
async function generateContent(prompt, maxTokens = 1000, temperature = 0.3) {
  console.log('🚀 Starting AI content generation:', {
    promptLength: prompt.length,
    maxTokens: maxTokens,
    temperature: temperature,
    hasApiKey: !!process.env.GEMINI_API_KEY
  });
  
  let response = null;
  let usedModel = '';
  let lastRateLimitError = null;
  let lastError = null;

  for (const modelName of MODELS) {
    try {
      console.log(`🔄 Trying model: ${modelName}`);
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        // Add custom configuration to mimic browser behavior
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: temperature,
          topP: 0.8,
          topK: 40
        }
      });
      
      // Add a small delay to avoid rapid requests
      if (process.env.NODE_ENV === 'production') {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log(`📤 Making request to ${modelName} with:`, {
        promptLength: prompt.length,
        maxTokens: maxTokens,
        temperature: temperature,
        environment: process.env.NODE_ENV
      });
      
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: temperature
        }
      });
      response = result.response;
      usedModel = modelName;
      console.log(`✅ Successfully used model: ${modelName} with maxTokens: ${maxTokens}, temperature: ${temperature}`);
      break;
    } catch (error) {
      console.log(`❌ Model ${modelName} failed:`, error.message);
      
      // Log detailed error information for debugging
      console.error(`❌ Detailed error for ${modelName}:`, {
        message: error.message,
        name: error.name,
        code: error.code,
        status: error.status,
        details: error.details
      });
      
      // Check if it's a rate limit error - don't retry these
      if (error.message.includes('429') || error.message.includes('RATE_LIMIT_EXCEEDED') || 
          error.message.includes('Too Many Requests') || error.message.includes('Quota exceeded')) {
        
        console.log(`🚫 Rate limit hit for ${modelName}, skipping retry`);
        lastRateLimitError = error; // Store the last rate limit error
        continue;
      }
      
      // Check for authentication errors
      if (error.message.includes('authentication') || error.message.includes('API key') || 
          error.message.includes('invalid') || error.message.includes('unauthorized')) {
        console.error(`🔐 Authentication error for ${modelName}:`, error.message);
        throw new Error(`Authentication failed for ${modelName}: ${error.message}`);
      }
      
      // Check for quota errors
      if (error.message.includes('quota') || error.message.includes('exceeded') || 
          error.message.includes('limit') || error.message.includes('quota_limit_value')) {
        console.error(`📊 Quota error for ${modelName}:`, error.message);
        
        // Check if it's a zero quota issue
        if (error.message.includes('quota_limit_value') && error.message.includes('"0"')) {
          throw new Error(`Regional quota limit is 0. Your project has no requests allowed in this region. Please request a quota increase or change deployment region.`);
        }
        
        throw new Error(`Quota exceeded for ${modelName}: ${error.message}`);
      }
      
      lastError = error; // Store the last error encountered
      continue;
    }
  }

  if (!response) {
    // If we have a stored rate limit error, throw that instead of generic error
    if (lastRateLimitError) {
      throw lastRateLimitError;
    }
    
    // If we have any stored error, throw that
    if (lastError) {
      throw lastError;
    }
    
    throw new Error('All AI models are currently unavailable');
  }

  try {
    const responseText = response.text();
    
    // Check if the response contains HTML or error content
    if (responseText.includes('<html') || responseText.includes('<!DOCTYPE') || 
        responseText.includes('The page') || responseText.includes('<body') || 
        responseText.includes('<title') || responseText.includes('<head')) {
      console.error('AI service returned HTML content instead of text:', responseText.substring(0, 200));
      throw new Error('AI service returned HTML error page instead of moderation response');
    }
    
    // Check for common error messages
    if (responseText.toLowerCase().includes('error') || 
        responseText.toLowerCase().includes('failed') || 
        responseText.toLowerCase().includes('unable') ||
        responseText.toLowerCase().includes('service unavailable') || 
        responseText.toLowerCase().includes('rate limit') || 
        responseText.toLowerCase().includes('quota exceeded') || 
        responseText.toLowerCase().includes('timeout')) {
      console.error('AI service returned error message:', responseText.substring(0, 200));
      throw new Error('AI service encountered an error: ' + responseText.substring(0, 100));
    }
    
    return {
      text: responseText,
      model: usedModel
    };
  } catch (error) {
    console.error('❌ Error extracting text from response:', error.message);
    throw new Error(`Failed to extract text from ${usedModel} response: ${error.message}`);
  }
}

/**
 * Build AI prompt by sending the entire ai.json configuration
 * This monolithic approach gives the AI full context and control
 * 
 * @param {string} analysisType - 'quick' or 'detailed'
 * @returns {Promise<{prompt: string, config: object}>}
 */
async function buildAIPrompt(analysisType = 'quick') {
  try {
    // Read the AI configuration file (no caching to avoid race conditions in production)
    // Use process.cwd() to get the project root directory
    const configPath = path.join(process.cwd(), 'protected/prompts/ai.json');
    const configData = await fs.readFile(configPath, 'utf8');
    
    let config;
    try {
      config = JSON.parse(configData);
    } catch (parseError) {
      console.error('Failed to parse ai.json configuration file:', parseError.message);
      throw new Error(`Invalid AI configuration file (ai.json): ${parseError.message}`);
    }

    // Validate analysis type
    if (!config.analysisTypes[analysisType]) {
      throw new Error(`Invalid analysis type: ${analysisType}`);
    }

    const analysisConfig = config.analysisTypes[analysisType];
    
    // Build the monolithic prompt - send entire configuration to AI
    const monolithicPrompt = `You are a community moderation AI assistant. Here is your complete configuration:

${JSON.stringify(config, null, 2)}

ANALYSIS TYPE: ${analysisType}
MAX TOKENS: ${analysisConfig.maxTokens}
TEMPERATURE: ${analysisConfig.temperature}

CRITICAL: You MUST respond in EXACTLY this JSON format:
{
  "Decision": "Keep",
  "Reason": "Your brief explanation ending with a period."
}

DO NOT use markdown, DO NOT add explanations, DO NOT deviate from this format. Your response must be valid JSON only.`;

    // Production-safe logging
    if (process.env.NODE_ENV !== 'production') {
      console.log(`🎯 Built ${analysisType} analysis prompt using monolithic configuration`);
      console.log(`📊 Config keys:`, Object.keys(config));
      console.log(`🔍 Analysis config:`, analysisConfig);
    }
    
    // Production-safe debug file saving (only in development)
    if (process.env.NODE_ENV !== 'production' && process.env.SAVE_PROMPT_DEBUG === 'true') {
      try {
        const debugDir = path.join(process.cwd(), 'debug');
        await fs.mkdir(debugDir, { recursive: true });
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const debugFile = path.join(debugDir, `ai-prompt-${analysisType}-${timestamp}.txt`);
        
        const debugContent = `# AI Prompt Debug - ${analysisType} Analysis (Monolithic)
Generated: ${new Date().toISOString()}
Analysis Type: ${analysisType}
Configuration: ${JSON.stringify(config, null, 2)}

## Monolithic Prompt
${monolithicPrompt}
`;
        
        await fs.writeFile(debugFile, debugContent, 'utf8');
        console.log(`📁 Saved debug prompt to: ${debugFile}`);
      } catch (debugError) {
        console.warn('⚠️ Failed to save debug prompt:', debugError.message);
      }
    }
    
    const result = {
      prompt: monolithicPrompt,
      config: analysisConfig,
      fullConfig: config, // Include full config for reference
      maxTokens: analysisConfig.maxTokens
    };
    
    return result;

  } catch (error) {
    // Production-safe error logging
    if (process.env.NODE_ENV === 'production') {
      console.error('Failed to build AI prompt:', error.message);
    } else {
      console.error('❌ Failed to build AI prompt:', error);
    }
    throw error;
  }
}

// Parse AI response
function parseModerationResponse(text, characterLimit) {
  console.log('🔍 parseModerationResponse called with:', { textLength: text?.length, characterLimit });
  
  // Validate input - check if AI returned HTML or error content
  if (!text || typeof text !== 'string') {
    console.error('Invalid AI response:', text);
    return {
      decision: 'Keep',
      reason: 'Error: Invalid AI response received',
      rules: [{ id: 0, title: 'System Error', emoji: '⚠️' }],
      characterCount: 0,
      characterLimit
    };
  }
  
  // Check if AI returned HTML content (common error case)
  if (text.includes('<html') || text.includes('<!DOCTYPE') || text.includes('<body') || text.includes('The page') || 
      text.includes('<title') || text.includes('<head') || text.includes('<meta') || text.includes('<script')) {
    console.error('AI returned HTML content instead of text:', text.substring(0, 200));
    return {
      decision: 'Keep',
      reason: 'Error: AI service returned invalid response format',
      rules: [{ id: 0, title: 'System Error', emoji: '⚠️' }],
      characterCount: 0,
      characterLimit
    };
  }
  
  // Check if AI returned an error message or service unavailable
  if (text.toLowerCase().includes('error') || text.toLowerCase().includes('failed') || text.toLowerCase().includes('unable') ||
      text.toLowerCase().includes('service unavailable') || text.toLowerCase().includes('rate limit') || 
      text.toLowerCase().includes('quota exceeded') || text.toLowerCase().includes('timeout')) {
    console.error('AI returned error message:', text.substring(0, 200));
    return {
      decision: 'Keep',
      reason: 'Error: AI service encountered an error',
      rules: [{ id: 0, title: 'System Error', emoji: '⚠️' }],
      characterCount: 0,
      characterLimit
    };
  }
  
  // Check if response is too short to be valid
  if (text.trim().length < 10) {
    console.error('AI returned very short response:', text);
    return {
      decision: 'Keep',
      reason: 'Error: AI service returned incomplete response',
      rules: [{ id: 0, title: 'System Error', emoji: '⚠️' }],
      characterCount: 0,
      characterLimit
    };
  }

  // Clean up markdown code blocks if present
  let cleanedText = text;
  console.log('Original AI response:', text);
  
  if (text.includes('```json')) {
    // Extract content between ```json and ```
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      cleanedText = jsonMatch[1].trim();
      console.log('Extracted JSON from markdown block:', cleanedText);
    }
  } else if (text.includes('```')) {
    // Extract content between any ``` blocks
    const codeMatch = text.match(/```\s*([\s\S]*?)\s*```/);
    if (codeMatch) {
      cleanedText = codeMatch[1].trim();
      console.log('Extracted content from code block:', cleanedText);
    }
  }
  
  // Also try to extract JSON if it's wrapped in any other way
  if (cleanedText === text && text.includes('{') && text.includes('}')) {
    // Try to find JSON content between { and }
    const jsonContentMatch = text.match(/\{[\s\S]*\}/);
    if (jsonContentMatch) {
      cleanedText = jsonContentMatch[0];
      console.log('Extracted JSON content from text:', cleanedText);
    }
  }

  // Try to parse as JSON first (for output_contract format)
  try {
    const jsonResponse = JSON.parse(cleanedText);
    console.log('Successfully parsed JSON response:', jsonResponse);
    
    if (jsonResponse.Decision && jsonResponse.Reason) {
      const decision = jsonResponse.Decision;
      let reason = jsonResponse.Reason;
      
      // Remove trailing punctuation if present
      reason = reason.replace(/[.!?]+$/, '');
      
      // Extract rule information from the reason
      const rules = extractRulesFromReason(reason, decision);
      
      // Check if the full response exceeds character limit
      const fullResponse = `**Decision:** ${decision}\n**Reason:** ${reason}`;
      const responseLength = fullResponse.length;
      
      if (responseLength > characterLimit) {
        // Truncate the reason to fit within the limit
        const decisionPart = `**Decision:** ${decision}\n**Reason:** `;
        const availableChars = characterLimit - decisionPart.length;
        
        if (availableChars > 10) { // Ensure we have at least some space for reason
          reason = reason.substring(0, availableChars - 3) + '...';
        } else {
          reason = 'Response too long';
        }
      }
      
      return { decision, reason, rules, characterCount: fullResponse.length, characterLimit };
    } else if (jsonResponse.Reason) {
      // Handle case where only Reason is provided (like your example)
      const decision = 'Keep'; // Default decision if not specified
      let reason = jsonResponse.Reason;
      
      // Remove trailing punctuation if present
      reason = reason.replace(/[.!?]+$/, '');
      
      // Extract rule information from the reason
      const rules = extractRulesFromReason(reason, decision);
      
      // Check if the full response exceeds character limit
      const fullResponse = `**Decision:** ${decision}\n**Reason:** ${reason}`;
      const responseLength = fullResponse.length;
      
      if (responseLength > characterLimit) {
        // Truncate the reason to fit within the limit
        const decisionPart = `**Decision:** ${decision}\n**Reason:** `;
        const availableChars = characterLimit - decisionPart.length;
        
        if (availableChars > 10) { // Ensure we have at least some space for reason
          reason = reason.substring(0, availableChars - 3) + '...';
        } else {
          reason = 'Response too long';
        }
      }
      
      return { decision, reason, rules, characterCount: fullResponse.length, characterLimit };
    }
  } catch (jsonError) {
    // Not valid JSON, continue with markdown parsing
    console.log('Response is not valid JSON, trying markdown parsing. JSON error:', jsonError.message);
    console.log('Cleaned text that failed JSON parsing:', cleanedText);
  }
  
  // Look for the decision pattern
  const decisionMatch = cleanedText.match(/\*\*Decision:\*\*\s*(Remove|Keep|Maybe Remove)/i);
  
  // Look for the reason pattern - be more flexible with the matching
  let reasonMatch = cleanedText.match(/\*\*Reason:\*\*\s*(.+?)(?=\n\n|\n\*\*|$)/i);
  
  // If that doesn't work, try a simpler approach
  if (!reasonMatch) {
    reasonMatch = cleanedText.match(/\*\*Reason:\*\*\s*(.+)/i);
  }
  
  const decision = decisionMatch ? decisionMatch[1] : 'Keep';
  let reason = 'Unable to determine specific reason';
  
  if (reasonMatch && reasonMatch[1]) {
    reason = reasonMatch[1].trim();
    // Remove any trailing punctuation or extra text
    reason = reason.replace(/[.!?]+$/, '');
  }

  // Extract rule information from the reason
  const rules = extractRulesFromReason(reason, decision);

  // Check if the full response exceeds character limit
  const fullResponse = `**Decision:** ${decision}\n**Reason:** ${reason}`;
  const responseLength = fullResponse.length;
  
  if (responseLength > characterLimit) {
    // Truncate the reason to fit within the limit
    const decisionPart = `**Decision:** ${decision}\n**Reason:** `;
    const availableChars = characterLimit - decisionPart.length;
    
    if (availableChars > 10) { // Ensure we have at least some space for reason
      reason = reason.substring(0, availableChars - 3) + '...';
    } else {
      reason = 'Response too long';
    }
    
  }

  return { decision, reason, rules, characterCount: fullResponse.length, characterLimit };
}

// Extract rule information from the AI response
function extractRulesFromReason(reason, decision) {
  const ruleMappings = {
    'respectful': { id: 1, title: 'Be Respectful', emoji: '🤝' },
    'relevant': { id: 2, title: 'Keep It Relevant', emoji: '🎯' },
    'discriminate': { id: 3, title: 'Do Not Discriminate', emoji: '❌' },
    'misinformation': { id: 4, title: 'No Misinformation', emoji: '✅' },
    'privacy': { id: 5, title: 'Respect Privacy', emoji: '🔒' },
    'prohibited': { id: 6, title: 'No Prohibited Content', emoji: '🚫' },
    'civil': { id: 7, title: 'Civil Tone', emoji: '🗣️' },
    'category': { id: 8, title: 'Incorrect Category', emoji: '❌' },
    'hate speech': { id: 1, title: 'Be Respectful', emoji: '🤝' },
    'harassment': { id: 1, title: 'Be Respectful', emoji: '🤝' },
    'threats': { id: 1, title: 'Be Respectful', emoji: '🤝' },
    'personal attacks': { id: 1, title: 'Be Respectful', emoji: '🤝' },
    'profanity': { id: 1, title: 'Be Respectful', emoji: '🤝' },
    'off-topic': { id: 2, title: 'Keep It Relevant', emoji: '🎯' },
    'politics': { id: 2, title: 'Keep It Relevant', emoji: '🎯' },
    'national': { id: 2, title: 'Keep It Relevant', emoji: '🎯' },
    'false': { id: 4, title: 'No Misinformation', emoji: '✅' },
    'misleading': { id: 4, title: 'No Misinformation', emoji: '✅' },
    'doxxing': { id: 5, title: 'Respect Privacy', emoji: '🔒' },
    'private information': { id: 5, title: 'Respect Privacy', emoji: '🔒' },
    'violence': { id: 6, title: 'No Prohibited Content', emoji: '🚫' },
    'criminal': { id: 6, title: 'No Prohibited Content', emoji: '🚫' },
    'spam': { id: 6, title: 'No Prohibited Content', emoji: '🚫' },
    'scam': { id: 6, title: 'No Prohibited Content', emoji: '🚫' },
    'sale': { id: 8, title: 'Incorrect Category', emoji: '❌' },
    'for sale': { id: 8, title: 'Incorrect Category', emoji: '❌' },
    'free': { id: 8, title: 'Incorrect Category', emoji: '❌' }
  };

  const foundRules = new Set();
  const reasonLower = reason.toLowerCase();

  // Check for rule violations mentioned in the reason
  for (const [keyword, rule] of Object.entries(ruleMappings)) {
    if (reasonLower.includes(keyword)) {
      foundRules.add(rule); // Store the rule object directly, not as JSON string
    }
  }

  // If no specific rules found but decision is Remove, add a generic rule
  if (foundRules.size === 0 && decision === 'Remove') {
    foundRules.add({ id: 0, title: 'Rule Violation', emoji: '⚠️' });
  }

  // If decision is Keep and no rules mentioned, add a "No Violations" indicator
  if (foundRules.size === 0 && decision === 'Keep') {
    foundRules.add({ id: 0, title: 'No Violations', emoji: '✅' });
  }

  // Convert Set to Array directly (no JSON parsing needed)
  const result = Array.from(foundRules);
  return result;
}

module.exports = {
  generateContent,
  parseModerationResponse,
  MODELS,
  buildAIPrompt
}; 