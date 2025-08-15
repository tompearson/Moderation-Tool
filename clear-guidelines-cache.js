// Clear guidelines cache script
const { refreshGuidelines } = require('./api/utils/guidelines.js');

async function clearCache() {
  console.log('🔄 Clearing guidelines cache...');
  
  try {
    const result = await refreshGuidelines();
    console.log('✅ Cache cleared successfully!');
    console.log(`📋 New content length: ${result.length} characters`);
    console.log(`📋 Content preview: ${result.substring(0, 200)}...`);
  } catch (error) {
    console.error('❌ Error clearing cache:', error.message);
  }
}

clearCache(); 