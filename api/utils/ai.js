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
function parseModerationResponse(text) {
  const decisionMatch = text.match(/\*\*Decision:\*\*\s*(Remove|Keep)/i);
  const reasonMatch = text.match(/\*\*Reason:\*\*\s*(.+)/i);
  
  const decision = decisionMatch ? decisionMatch[1] : 'Keep';
  const reason = reasonMatch ? reasonMatch[1].trim() : 'Unable to determine specific reason';

  return { decision, reason };
}

module.exports = {
  generateContent,
  parseModerationResponse,
  MODELS
}; 