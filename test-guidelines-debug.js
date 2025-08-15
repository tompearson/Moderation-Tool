// Debug script to test guidelines endpoint
const fetch = require('node-fetch');

async function testGuidelines() {
  try {
    console.log('Testing production guidelines endpoint...');
    
    const response = await fetch('https://moderation-assistant-tool.vercel.app/api/guidelines-endpoint');
    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Source:', data.guidelines?.source);
    console.log('Config URL:', data.config?.url);
    console.log('Content preview:', data.guidelines?.content?.substring(0, 200));
    console.log('Full response:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testGuidelines(); 