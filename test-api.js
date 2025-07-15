const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = process.env.VITE_GEMINI_API_KEY || 'AIzaSyB2EyDjWFEwSAOQsnnwdoeFA3SY4Kz21hs';

async function testAPI() {
  console.log('Testing Google AI API...\n');
  
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // Test 1: List available models
    console.log('1. Testing model availability...');
    const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
    
    for (const modelName of models) {
      try {
        console.log(`   Testing ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hello, this is a test.');
        console.log(`   ✅ ${modelName} - SUCCESS`);
      } catch (err) {
        console.log(`   ❌ ${modelName} - FAILED: ${err.message}`);
      }
    }
    
    // Test 2: Simple content generation
    console.log('\n2. Testing simple content generation...');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent('Say "Hello World"');
    const response = await result.response;
    console.log(`   Response: ${response.text()}`);
    
  } catch (err) {
    console.error('❌ API Test Failed:', err.message);
    
    if (err.message.includes('API_KEY_INVALID')) {
      console.log('\n🔑 SOLUTION: You need a new API key from Google AI Studio');
      console.log('   Visit: https://makersuite.google.com/app/apikey');
    } else if (err.message.includes('PERMISSION_DENIED')) {
      console.log('\n🔑 SOLUTION: Enable the Generative AI API');
      console.log('   Visit: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com');
    } else if (err.message.includes('QUOTA_EXCEEDED')) {
      console.log('\n🔑 SOLUTION: Check your API quota and billing');
    }
  }
}

testAPI(); 