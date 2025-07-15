const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyCjosDYs15EFppjV2iP2JNdkz5bU-5Qylc');

// Available models with fallback order
const MODELS = ['gemini-2.0-flash-exp', 'gemini-1.5-pro', 'gemini-1.5-flash'];

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

  return {
    text: response.text(),
    model: usedModel
  };
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