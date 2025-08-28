const fs = require('fs');
const path = require('path');

function updateAIJson(updates) {
  try {
    const aiJsonPath = path.join(__dirname, '..', 'protected', 'prompts', 'ai.json');
    
    // Read and parse the current JSON
    const jsonContent = fs.readFileSync(aiJsonPath, 'utf8');
    const aiConfig = JSON.parse(jsonContent);
    
    // Apply updates
    Object.keys(updates).forEach(key => {
      if (key.includes('.')) {
        // Handle nested properties like 'metadata.lastUpdated'
        const parts = key.split('.');
        let current = aiConfig;
        for (let i = 0; i < parts.length - 1; i++) {
          current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = updates[key];
      } else {
        aiConfig[key] = updates[key];
      }
    });
    
    // Validate the updated JSON by stringifying it
    const updatedJson = JSON.stringify(aiConfig, null, 2);
    
    // Write back to file
    fs.writeFileSync(aiJsonPath, updatedJson, 'utf8');
    
    console.log('✅ Successfully updated ai.json');
    return true;
  } catch (error) {
    console.error('❌ Failed to update ai.json:', error.message);
    return false;
  }
}

// If run directly, update the lastUpdated date
if (require.main === module) {
  const currentDate = new Date().toISOString().split('T')[0].replace(/-/g, '-');
  updateAIJson({ 'metadata.lastUpdated': currentDate });
}

module.exports = { updateAIJson };

