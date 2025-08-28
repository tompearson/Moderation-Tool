const fs = require('fs/promises');
const path = require('path');

async function testPromptLoading() {
  console.log('🧪 Testing prompt file loading...');
  
  try {
    // Test 1: Check if ai.json can be read
    console.log('1️⃣ Testing ai.json loading...');
    const configPath = path.join(process.cwd(), 'protected/prompts/ai.json');
    const configData = await fs.readFile(configPath, 'utf8');
    const config = JSON.parse(configData);
    console.log('✅ ai.json loaded successfully');
    console.log('   Prompts:', config.prompts.map(p => p.id));
    
    // Test 2: Check if the NextDoor prompt file can be read
    console.log('\n2️⃣ Testing NextDoor prompt file loading...');
    const promptPath = path.join(process.cwd(), 'protected/prompts/staging/NextDoor/research/token-optimized-nextdoor-community-moderation-instructions.json');
    const promptContent = await fs.readFile(promptPath, 'utf8');
    const promptData = JSON.parse(promptContent);
    console.log('✅ NextDoor prompt file loaded successfully');
    console.log('   Title:', promptData.title);
    console.log('   Content length:', promptContent.length);
    
    // Test 3: Test the buildAIPrompt function
    console.log('\n3️⃣ Testing buildAIPrompt function...');
    const { buildAIPrompt } = require('./api/utils/ai.js');
    
    console.log('   Testing quick analysis...');
    const quickResult = await buildAIPrompt('quick');
    console.log('✅ Quick analysis prompt built successfully');
    console.log('   Prompt length:', quickResult.prompt.length);
    console.log('   Config:', quickResult.config);
    
    console.log('   Testing detailed analysis...');
    const detailedResult = await buildAIPrompt('detailed');
    console.log('✅ Detailed analysis prompt built successfully');
    console.log('   Prompt length:', detailedResult.prompt.length);
    console.log('   Config:', detailedResult.config);
    
    console.log('\n🎉 All tests passed! The prompt loading is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the test
testPromptLoading().catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});
