// Test script to check GUIDELINES_URL configuration
require('dotenv').config();

console.log('🔍 Testing GUIDELINES_URL configuration...');
console.log('Environment variables:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- GUIDELINES_URL:', process.env.GUIDELINES_URL);

// Test the fetch function
const { loadGuidelines } = require('./api/utils/guidelines.js');

async function testFetch() {
  const url = process.env.GUIDELINES_URL;
  if (!url) {
    console.log('❌ GUIDELINES_URL not set');
    return;
  }
  
  console.log(`🔄 Testing fetch from: ${url}`);
  
  try {
    const content = await loadGuidelines();
    if (content) {
      console.log('✅ Fetch successful!');
      console.log(`📏 Content length: ${content.length} characters`);
      console.log(`📄 Content preview: ${content.substring(0, 200)}...`);
    } else {
      console.log('❌ Fetch returned null/empty content');
    }
  } catch (error) {
    console.log('❌ Fetch failed:', error.message);
  }
}

testFetch(); 