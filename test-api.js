const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGeminiAPI() {
  console.log('🧪 Testing Gemini API...\n');
  
  // Check if API key exists
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in environment variables');
    console.log('Make sure you have a .env file with: GEMINI_API_KEY=your_key_here');
    return;
  }
  
  console.log(`✅ API Key found: ${apiKey.substring(0, 10)}...`);
  
  try {
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Test with gemini-1.5-flash (most reliable)
    console.log('🔄 Testing with gemini-1.5-flash...');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = 'Say "Hello, Gemini API is working!" in one sentence.';
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ API Test Successful!');
    console.log(`Response: ${text}\n`);
    
    // Test moderation prompt
    console.log('🔄 Testing moderation prompt...');
    const moderationPrompt = `Analyze this post for community guidelines violations:

Post: "This is a test post that should be respectful and appropriate."

Please respond with just "Decision: Keep" or "Decision: Remove" and a brief reason.`;
    
    const moderationResult = await model.generateContent(moderationPrompt);
    const moderationResponse = await moderationResult.response;
    const moderationText = moderationResponse.text();
    
    console.log('✅ Moderation Test Successful!');
    console.log(`Response: ${moderationText}\n`);
    
  } catch (error) {
    console.error('❌ API Test Failed:');
    console.error(error.message);
    
    if (error.message.includes('API key')) {
      console.log('\n💡 The API key appears to be invalid. Please check:');
      console.log('1. Your API key starts with "AIza"');
      console.log('2. The key is complete (not truncated)');
      console.log('3. You have quota remaining');
    }
  }
}

// Run the test
testGeminiAPI(); 