const fs = require('fs/promises');
const path = require('path');

async function buildAIPrompt(analysisType = 'quick') {
  try {
    // Read the AI configuration file
    const configPath = path.join(__dirname, 'protected/prompts/ai.json');
    const configData = await fs.readFile(configPath, 'utf8');
    const config = JSON.parse(configData);

    // Validate analysis type
    if (!config.analysisTypes[analysisType]) {
      throw new Error(`Invalid analysis type: ${analysisType}`);
    }

    const analysisConfig = config.analysisTypes[analysisType];
    const promptIds = analysisConfig.promptIds;
    
    // Build the combined prompt
    let combinedPrompt = '';
    const promptsDir = path.join(__dirname, 'protected/prompts');
    const prompts = {}; // To store individual prompt content for debugging

    for (const promptId of promptIds) {
      // Find the prompt file by ID
      const promptConfig = config.prompts.find(p => p.id === promptId);
      if (!promptConfig || !promptConfig.enabled) {
        console.warn(`Prompt ${promptId} not found or disabled`);
        continue;
      }

      // Read the prompt file
      const promptPath = path.join(promptsDir, promptConfig.path);
      try {
        const promptContent = await fs.readFile(promptPath, 'utf8');
        prompts[promptId] = promptContent; // Store for debugging
        
        // Add separator and header for each prompt section
        if (combinedPrompt) {
          combinedPrompt += '\n\n' + '='.repeat(50) + '\n';
        }
        combinedPrompt += `# ${promptConfig.description}\n`;
        combinedPrompt += `# Source: ${promptConfig.path}\n\n`;
        combinedPrompt += promptContent;
        
        console.log(`✅ Loaded prompt: ${promptConfig.path}`);
      } catch (error) {
        console.error(`❌ Failed to load prompt ${promptConfig.path}:`, error.message);
        if (promptConfig.required) {
          throw new Error(`Required prompt ${promptConfig.path} could not be loaded`);
        }
      }
    }

    if (!combinedPrompt.trim()) {
      throw new Error('No prompts were successfully loaded');
    }

    console.log(`🎯 Built ${analysisType} analysis prompt (${promptIds.length} prompts)`);
    
    return {
      prompt: combinedPrompt,
      config: analysisConfig,
      prompts: prompts // Include individual prompts for debugging
    };

  } catch (error) {
    console.error('❌ Failed to build AI prompt:', error);
    throw error;
  }
}

async function testAIPromptDebug() {
  console.log('🔍 AI Prompt Debug Test\n');
  
  try {
    // Test quick analysis
    console.log('📋 Testing Quick Analysis:');
    console.log('=' .repeat(50));
    const quickResult = await buildAIPrompt('quick');
    console.log(`✅ Quick Analysis Prompt Built Successfully`);
    console.log(`📏 Total Length: ${quickResult.prompt.length} characters`);
    console.log(`🎯 Prompt IDs: ${quickResult.config.promptIds.join(', ')}`);
    console.log(`🔥 Max Tokens: ${quickResult.config.maxTokens}`);
    console.log(`🌡️ Temperature: ${quickResult.config.temperature}`);
    
    console.log('\n📄 Combined Prompt Preview (first 500 chars):');
    console.log('-'.repeat(50));
    console.log(quickResult.prompt.substring(0, 500) + '...');
    
    console.log('\n📁 Individual Prompt Files:');
    Object.keys(quickResult.prompts).forEach(id => {
      console.log(`   - ${id}: ${quickResult.prompts[id].length} characters`);
      console.log(`     Preview: ${quickResult.prompts[id].substring(0, 100).replace(/\n/g, ' ')}...`);
    });
    
    console.log('\n' + '='.repeat(50));
    
    // Test detailed analysis
    console.log('\n📋 Testing Detailed Analysis:');
    console.log('=' .repeat(50));
    const detailedResult = await buildAIPrompt('detailed');
    console.log(`✅ Detailed Analysis Prompt Built Successfully`);
    console.log(`📏 Total Length: ${detailedResult.prompt.length} characters`);
    console.log(`🎯 Prompt IDs: ${detailedResult.config.promptIds.join(', ')}`);
    console.log(`🔥 Max Tokens: ${detailedResult.config.maxTokens}`);
    console.log(`🌡️ Temperature: ${detailedResult.config.temperature}`);
    
    console.log('\n📄 Combined Prompt Preview (first 500 chars):');
    console.log('-'.repeat(50));
    console.log(detailedResult.prompt.substring(0, 500) + '...');
    
    console.log('\n📁 Individual Prompt Files:');
    Object.keys(detailedResult.prompts).forEach(id => {
      console.log(`   - ${id}: ${detailedResult.prompts[id].length} characters`);
      console.log(`     Preview: ${detailedResult.prompts[id].substring(0, 100).replace(/\n/g, ' ')}...`);
    });
    
    console.log('\n' + '='.repeat(50));
    
    // Show the difference
    console.log('\n📊 Analysis Comparison:');
    console.log(`Quick Analysis: ${quickResult.prompt.length} chars vs Detailed Analysis: ${detailedResult.prompt.length} chars`);
    console.log(`Difference: ${detailedResult.prompt.length - quickResult.prompt.length} characters`);
    
    // Show what gets added in detailed analysis
    const quickPromptIds = new Set(quickResult.config.promptIds);
    const detailedPromptIds = new Set(detailedResult.config.promptIds);
    const additionalPrompts = Array.from(detailedPromptIds).filter(id => !quickPromptIds.has(id));
    
    if (additionalPrompts.length > 0) {
      console.log(`\n➕ Additional prompts in detailed analysis: ${additionalPrompts.join(', ')}`);
    }
    
    // Save the combined prompts to files for inspection
    console.log('\n💾 Saving prompt to file for inspection...');
    try {
      await fs.mkdir('debug', { recursive: true });
      
      // Create a new file with timestamp-based naming
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const debugFile = `debug/ai-prompt-combined-${timestamp}.txt`;
      await fs.writeFile(debugFile, quickResult.prompt, 'utf8');
      
      console.log(`✅ Combined prompt saved to: ${debugFile}`);
      console.log(`📏 File size: ${quickResult.prompt.length} characters`);
      console.log(`📋 This is the exact prompt that gets sent to the AI`);
      
      // Also create a "latest" symlink-style file for easy access
      const latestFile = 'debug/ai-prompt-combined-latest.txt';
      await fs.writeFile(latestFile, quickResult.prompt, 'utf8');
      console.log(`✅ Latest prompt also saved to: ${latestFile}`);
      
    } catch (saveError) {
      console.warn('⚠️ Failed to save debug file:', saveError.message);
    }
    
  } catch (error) {
    console.error('❌ Error testing AI prompt:', error);
  }
}

// Run the test
testAIPromptDebug();
