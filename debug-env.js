console.log('🔍 Vercel Environment Variables Debug:\n');

// Check if GEMINI_API_KEY exists
if (process.env.GEMINI_API_KEY) {
  console.log('✅ GEMINI_API_KEY found:');
  console.log(`   Length: ${process.env.GEMINI_API_KEY.length} characters`);
  console.log(`   Starts with: ${process.env.GEMINI_API_KEY.substring(0, 10)}...`);
  console.log(`   Ends with: ...${process.env.GEMINI_API_KEY.substring(process.env.GEMINI_API_KEY.length - 4)}`);
} else {
  console.log('❌ GEMINI_API_KEY NOT FOUND');
  console.log('   This means the environment variable is not set in Vercel');
}

// Check other environment variables
console.log('\n📋 All Environment Variables:');
Object.keys(process.env).forEach(key => {
  if (key.includes('GEMINI') || key.includes('API') || key.includes('KEY')) {
    console.log(`   ${key}: ${process.env[key] ? 'SET' : 'NOT SET'}`);
  }
});

// Check NODE_ENV
console.log(`\n🌍 NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);

// Check if we're in production
console.log(`🏭 Production: ${process.env.NODE_ENV === 'production' ? 'YES' : 'NO'}`);

// Check Vercel-specific variables
console.log(`\n🚀 Vercel Variables:`);
console.log(`   VERCEL: ${process.env.VERCEL || 'not set'}`);
console.log(`   VERCEL_ENV: ${process.env.VERCEL_ENV || 'not set'}`);
console.log(`   VERCEL_URL: ${process.env.VERCEL_URL || 'not set'}`); 