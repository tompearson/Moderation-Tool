const fetch = require('node-fetch');

async function testFrontendConnection() {
  console.log('🧪 Testing frontend-backend connection...');
  
  try {
    // Test 1: Check if backend health endpoint responds
    console.log('1️⃣ Testing backend health endpoint...');
    const healthResponse = await fetch('http://127.0.0.1:3001/api/health');
    if (healthResponse.ok) {
      console.log('✅ Backend health endpoint responding');
    } else {
      console.log('❌ Backend health endpoint returned:', healthResponse.status);
    }
    
    // Test 2: Test a simple moderation request
    console.log('\n2️⃣ Testing simple moderation request...');
    const moderationResponse = await fetch('http://127.0.0.1:3001/api/moderate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: "This is a simple test post.",
        characterLimit: 300
      })
    });
    
    if (moderationResponse.ok) {
      const result = await moderationResponse.json();
      console.log('✅ Moderation endpoint responding');
      console.log('   Decision:', result.decision);
      console.log('   Response time: OK');
    } else {
      console.log('❌ Moderation endpoint returned:', moderationResponse.status);
      const errorText = await moderationResponse.text();
      console.log('   Error:', errorText.substring(0, 200));
    }
    
    console.log('\n🎉 Connection test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('   Backend server is not running on port 3001');
      console.error('   Please start your backend server first');
    }
  }
}

// Run the test
testFrontendConnection().catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});
