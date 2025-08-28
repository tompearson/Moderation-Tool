require('dotenv').config();
const { generateContent, parseModerationResponse } = require('./api/utils/ai');

async function testAI() {
  console.log('🧪 Testing AI Module...');
  console.log('📋 Environment check:');
  console.log('- GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Not set');
  console.log('- NODE_ENV:', process.env.NODE_ENV || 'development');
  
  try {
    const testPrompt = `Analyze this post for community guidelines violations:

"Lost my keys near the park on Main Street. If anyone finds them, please let me know. Thanks neighbors!"

**Decision:** [Remove], [Keep], or [Maybe Remove]  
**Reason:** [State the specific rule(s) and exactly why this post violates or does not violate them.]`;

    console.log('\n🤖 Testing AI generation...');
    const result = await generateContent(testPrompt);
    
    console.log('\n✅ AI Response:');
    console.log('- Model used:', result.model);
    console.log('- Text length:', result.text.length);
    console.log('- First 200 chars:', result.text.substring(0, 200) + '...');
    
    console.log('\n🔍 Parsing moderation response...');
    const parsed = parseModerationResponse(result.text);
    console.log('- Decision:', parsed.decision);
    console.log('- Reason:', parsed.reason);
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testAI(); 