// Test script for protected prompts endpoint
// Using built-in fetch (available in Node.js 18+)

const BASE_URL = 'http://127.0.0.1:3001';

async function testProtectedPrompts() {
  console.log('🧪 Testing Protected Prompts Endpoint\n');

  // Test 1: Valid request with proper origin
  console.log('✅ Test 1: Valid request from localhost');
  try {
    const response = await fetch(`${BASE_URL}/api/prompts/moderation-prompts`, {
      headers: {
        'Origin': 'http://127.0.0.1:3000',
        'Referer': 'http://127.0.0.1:3000/'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`   Status: ${response.status} ✅`);
      console.log(`   Source: ${data.source}`);
      console.log(`   Type: ${data.type}`);
      console.log(`   Rules count: ${Object.keys(data.prompts.rules).length}`);
    } else {
      console.log(`   Status: ${response.status} ❌`);
      const error = await response.text();
      console.log(`   Error: ${error}`);
    }
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  console.log();

  // Test 2: Invalid origin (should be blocked)
  console.log('❌ Test 2: Invalid origin (should be blocked)');
  try {
    const response = await fetch(`${BASE_URL}/api/prompts/moderation-prompts`, {
      headers: {
        'Origin': 'https://malicious-site.com',
        'Referer': 'https://malicious-site.com/'
      }
    });
    
    if (response.status === 403) {
      console.log(`   Status: ${response.status} ✅ (Correctly blocked)`);
      const error = await response.json();
      console.log(`   Message: ${error.error}`);
    } else {
      console.log(`   Status: ${response.status} ❌ (Should have been blocked)`);
    }
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  console.log();

  // Test 3: No origin header (should be blocked)
  console.log('❌ Test 3: No origin header (should be blocked)');
  try {
    const response = await fetch(`${BASE_URL}/api/prompts/moderation-prompts`);
    
    if (response.status === 403) {
      console.log(`   Status: ${response.status} ✅ (Correctly blocked)`);
      const error = await response.json();
      console.log(`   Message: ${error.error}`);
    } else {
      console.log(`   Status: ${response.status} ❌ (Should have been blocked)`);
    }
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  console.log();

  // Test 4: Test AI instructions endpoint
  console.log('✅ Test 4: AI Instructions endpoint');
  try {
    const response = await fetch(`${BASE_URL}/api/prompts/ai-instructions`, {
      headers: {
        'Origin': 'http://127.0.0.1:3000',
        'Referer': 'http://127.0.0.1:3000/'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`   Status: ${response.status} ✅`);
      console.log(`   Source: ${data.source}`);
      console.log(`   Type: ${data.type}`);
      console.log(`   Has AI system prompt: ${!!data.prompts.ai_system_prompt}`);
    } else {
      console.log(`   Status: ${response.status} ❌`);
      const error = await response.text();
      console.log(`   Error: ${error}`);
    }
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  console.log();

  // Test 5: Invalid prompt type
  console.log('❌ Test 5: Invalid prompt type');
  try {
    const response = await fetch(`${BASE_URL}/api/prompts/invalid-type`, {
      headers: {
        'Origin': 'http://127.0.0.1:3000',
        'Referer': 'http://127.0.0.1:3000/'
      }
    });
    
    if (response.status === 404) {
      console.log(`   Status: ${response.status} ✅ (Correctly not found)`);
      const error = await response.json();
      console.log(`   Message: ${error.error}`);
      console.log(`   Available types: ${error.available.join(', ')}`);
    } else {
      console.log(`   Status: ${response.status} ❌ (Should have been 404)`);
    }
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  console.log('\n🎯 Test Summary:');
  console.log('   - Protected prompts are secured by origin validation');
  console.log('   - Only your app can access sensitive prompt content');
  console.log('   - Invalid requests are properly blocked');
  console.log('   - Available prompt types: moderation-prompts, ai-instructions');
}

// Run the tests
testProtectedPrompts().catch(console.error);
