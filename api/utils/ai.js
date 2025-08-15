const { GoogleGenerativeAI } = require('@google/generative-ai');

// Validate API key
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY environment variable is not set!');
  console.error('Please create a .env file with your Gemini API key.');
  console.error('See env.example for reference.');
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Available models with fallback order (removed gemini-2.0-flash-exp as it doesn't exist)
const MODELS = ['gemini-1.5-flash', 'gemini-1.5-pro'];

// Generate content with fallback
async function generateContent(prompt) {

  
  let response = null;
  let usedModel = '';



  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      response = result.response;
      usedModel = modelName;
      break;
    } catch (error) {
      continue;
    }
  }

  if (!response) {
    throw new Error('All AI models are currently unavailable');
  }

  try {
    return {
      text: response.text(),
      model: usedModel
    };
  } catch (error) {
    console.error('❌ Error extracting text from response:', error.message);
    throw new Error(`Failed to extract text from ${usedModel} response: ${error.message}`);
  }
}

// Parse AI response
function parseModerationResponse(text, characterLimit) {
  
  // Look for the decision pattern
  const decisionMatch = text.match(/\*\*Decision:\*\*\s*(Remove|Keep)/i);
  
  // Look for the reason pattern - be more flexible with the matching
  let reasonMatch = text.match(/\*\*Reason:\*\*\s*(.+?)(?=\n\n|\n\*\*|$)/i);
  
  // If that doesn't work, try a simpler approach
  if (!reasonMatch) {
    reasonMatch = text.match(/\*\*Reason:\*\*\s*(.+)/i);
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
      foundRules.add(JSON.stringify(rule));
    }
  }

  // If no specific rules found but decision is Remove, add a generic rule
  if (foundRules.size === 0 && decision === 'Remove') {
    foundRules.add(JSON.stringify({ id: 0, title: 'Rule Violation', emoji: '⚠️' }));
  }

  // If decision is Keep and no rules mentioned, add a "No Violations" indicator
  if (foundRules.size === 0 && decision === 'Keep') {
    foundRules.add(JSON.stringify({ id: 0, title: 'No Violations', emoji: '✅' }));
  }

  const result = Array.from(foundRules).map(rule => JSON.parse(rule));
  return result;
}

module.exports = {
  generateContent,
  parseModerationResponse,
  MODELS
}; 