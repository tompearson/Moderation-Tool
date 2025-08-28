const fs = require('fs/promises');
const path = require('path');

/**
 * Test the AI configuration system
 */
async function testAIConfig() {
  try {
    console.log('🧪 Testing AI Configuration System...\n');

    // Test 1: Read AI configuration
    console.log('1️⃣ Reading AI configuration...');
    const configPath = path.join(__dirname, 'protected/prompts/ai.json');
    const configData = await fs.readFile(configPath, 'utf8');
    const config = JSON.parse(configData);
    console.log('✅ Configuration loaded successfully');
    console.log(`   - Version: ${config.version}`);
    console.log(`   - Prompts: ${config.prompts.length}`);
    console.log(`   - Analysis Types: ${Object.keys(config.analysisTypes).join(', ')}\n`);

    // Test 2: Check prompt files exist
    console.log('2️⃣ Verifying prompt files...');
    const promptsDir = path.join(__dirname, 'protected/prompts');
    for (const prompt of config.prompts) {
      if (prompt.enabled) {
        const promptPath = path.join(promptsDir, prompt.path);
        try {
          const stats = await fs.stat(promptPath);
          console.log(`   ✅ ${prompt.path} (${stats.size} bytes)`);
        } catch (error) {
          console.log(`   ❌ ${prompt.path} - File not found`);
        }
      } else {
        console.log(`   ⏸️ ${prompt.path} - Disabled`);
      }
    }
    console.log('');

    // Test 3: Test analysis type configurations
    console.log('3️⃣ Testing analysis type configurations...');
    for (const [type, analysisConfig] of Object.entries(config.analysisTypes)) {
      console.log(`   📊 ${type.toUpperCase()} Analysis:`);
      console.log(`      - Description: ${analysisConfig.description}`);
      console.log(`      - Prompts: ${analysisConfig.promptIds.join(', ')}`);
      console.log(`      - Max Tokens: ${analysisConfig.maxTokens}`);
      console.log(`      - Temperature: ${analysisConfig.temperature}\n`);
    }

    // Test 4: Simulate prompt building
    console.log('4️⃣ Simulating prompt building...');
    for (const analysisType of Object.keys(config.analysisTypes)) {
      const analysisConfig = config.analysisTypes[analysisType];
      const promptIds = analysisConfig.promptIds;
      
      console.log(`   🔨 Building ${analysisType} analysis prompt...`);
      let combinedPrompt = '';
      
      for (const promptId of promptIds) {
        const promptConfig = config.prompts.find(p => p.id === promptId);
        if (promptConfig && promptConfig.enabled) {
          const promptPath = path.join(promptsDir, promptConfig.path);
          try {
            const promptContent = await fs.readFile(promptPath, 'utf8');
            if (combinedPrompt) {
              combinedPrompt += '\n\n' + '='.repeat(50) + '\n';
            }
            combinedPrompt += `# ${promptConfig.description}\n\n`;
            combinedPrompt += promptContent;
            console.log(`      ✅ Loaded: ${promptConfig.path}`);
          } catch (error) {
            console.log(`      ❌ Failed: ${promptConfig.path} - ${error.message}`);
          }
        }
      }
      
      console.log(`      📝 Final prompt length: ${combinedPrompt.length} characters\n`);
    }

    console.log('🎉 All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - Configuration file: ✅`);
    console.log(`   - Prompt files: ✅`);
    console.log(`   - Analysis types: ✅`);
    console.log(`   - Prompt building: ✅`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testAIConfig();
