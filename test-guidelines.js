// Test script for guidelines fetching functionality
import { loadGuidelines, getCacheStatus, refreshGuidelines } from './api/utils/guidelines.js';

async function testGuidelines() {
  console.log('🧪 Testing Guidelines Fetching...\n');
  
  try {
    // Test 1: Check cache status
    console.log('1. Checking initial cache status:');
    const initialStatus = getCacheStatus();
    console.log(initialStatus);
    console.log('');
    
    // Test 2: Load guidelines
    console.log('2. Loading guidelines:');
    const guidelines = await loadGuidelines();
    console.log(`✅ Loaded ${guidelines.length} characters`);
    console.log(`Preview: ${guidelines.substring(0, 200)}...`);
    console.log('');
    
    // Test 3: Check cache status after loading
    console.log('3. Cache status after loading:');
    const statusAfterLoad = getCacheStatus();
    console.log(statusAfterLoad);
    console.log('');
    
    // Test 4: Test refresh (if URL is configured)
    if (process.env.GUIDELINES_URL && process.env.GUIDELINES_URL !== 'embedded') {
      console.log('4. Testing refresh from URL:');
      const refreshed = await refreshGuidelines();
      console.log(`✅ Refreshed ${refreshed.length} characters`);
      console.log(`Preview: ${refreshed.substring(0, 200)}...`);
      console.log('');
      
      // Test 5: Final cache status
      console.log('5. Final cache status:');
      const finalStatus = getCacheStatus();
      console.log(finalStatus);
    } else {
      console.log('4. Skipping URL refresh test (GUIDELINES_URL not configured)');
    }
    
    console.log('✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testGuidelines(); 