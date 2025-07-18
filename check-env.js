require('dotenv').config();

console.log('🔍 Environment Variables Check:\n');

// Check if GEMINI_API_KEY exists
if (process.env.GEMINI_API_KEY) {
  console.log('✅ GEMINI_API_KEY found:');
  console.log(`   Length: ${process.env.GEMINI_API_KEY.length} characters`);
  console.log(`   Starts with: ${process.env.GEMINI_API_KEY.substring(0, 10)}...`);
  console.log(`   Ends with: ...${process.env.GEMINI_API_KEY.substring(process.env.GEMINI_API_KEY.length - 4)}`);
} else {
  console.log('❌ GEMINI_API_KEY not found');
}

// Check other relevant environment variables
console.log('\n📋 Other Environment Variables:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`   PORT: ${process.env.PORT || 'not set'}`);

// Check if .env file was loaded
console.log('\n📁 .env file status:');
try {
  const fs = require('fs');
  if (fs.existsSync('.env')) {
    console.log('✅ .env file exists');
    const envContent = fs.readFileSync('.env', 'utf8');
    console.log(`   Size: ${envContent.length} characters`);
    console.log(`   Contains GEMINI_API_KEY: ${envContent.includes('GEMINI_API_KEY')}`);
  } else {
    console.log('❌ .env file does not exist');
  }
} catch (error) {
  console.log('❌ Error checking .env file:', error.message);
} 