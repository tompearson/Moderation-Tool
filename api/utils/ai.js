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
      response = await result.response;
      usedModel = modelName;
      console.log(`✅ Successfully used model: ${modelName}`);
      break;
    } catch (error) {
      console.log(`❌ Model ${modelName} failed:`, error.message);
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

  // Check if the full response exceeds character limit
  const fullResponse = `**Decision:** ${decision}\n**Reason:** ${reason}`;
  const responseLength = fullResponse.length;
  
  console.log(`Response length: ${responseLength} characters (limit: ${characterLimit})`);
  
  if (responseLength > characterLimit) {
    // Truncate the reason to fit within the limit
    const decisionPart = `**Decision:** ${decision}\n**Reason:** `;
    const availableChars = characterLimit - decisionPart.length;
    
    if (availableChars > 20) { // Ensure we have at least some space for reason
      // Try to find a natural break point (sentence end)
      const truncatedReason = reason.substring(0, availableChars - 3);
      const lastPeriod = truncatedReason.lastIndexOf('.');
      const lastExclamation = truncatedReason.lastIndexOf('!');
      const lastQuestion = truncatedReason.lastIndexOf('?');
      
      const lastBreak = Math.max(lastPeriod, lastExclamation, lastQuestion);
      
      if (lastBreak > availableChars * 0.7) { // If we found a good break point
        reason = truncatedReason.substring(0, lastBreak + 1);
      } else {
        reason = truncatedReason + '...';
      }
    } else {
      reason = 'Response too long';
    }
    
    console.log(`Response truncated to fit ${characterLimit} character limit`);
  }

  return { decision, reason, characterCount: fullResponse.length, characterLimit, model: null };
}

module.exports = {
  generateContent,
  parseModerationResponse,
  MODELS
}; 