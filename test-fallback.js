// Test script to verify fallback rules functionality
const { getGuidelinesWithMetadata } = require('./api/utils/guidelines.js');

async function testFallback() {
  console.log('🧪 Testing fallback rules functionality...\n');
  
  try {
    // Test 1: Normal guidelines loading
    console.log('1️⃣ Testing normal guidelines loading:');
    const guidelines = await getGuidelinesWithMetadata();
    console.log(`   Source: ${guidelines.source}`);
    console.log(`   Content length: ${guidelines.rawContent.length}`);
    console.log(`   Cache age: ${guidelines.cacheAge}ms\n`);
    
    // Test 2: Simulate fallback by temporarily breaking the URL
    console.log('2️⃣ To test fallback, temporarily change your .env file:');
    console.log('   Change GUIDELINES_URL to: https://invalid-url-that-will-fail.com/guidelines');
    console.log('   Then restart your backend server and test moderation.\n');
    
    // Test 3: Check what fallback rules look like
    console.log('3️⃣ Fallback rules should show:');
    console.log('   - Rule Source: "Fallback Rules" (⚠️ icon)');
    console.log('   - Source badge: Orange/yellow background');
    console.log('   - Console log: "⚠️ Failed to load guidelines, using fallback"');
    
  } catch (error) {
    console.error('❌ Error testing guidelines:', error.message);
  }
}

testFallback(); 