#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 Community Moderation Tool - Environment Setup');
console.log('===============================================\n');

// Check if .env already exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists!');
  rl.question('Do you want to overwrite it? (y/N): ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      createEnvFile();
    } else {
      console.log('Setup cancelled.');
      rl.close();
    }
  });
} else {
  createEnvFile();
}

function createEnvFile() {
  console.log('\n📝 Setting up environment variables...\n');
  
  rl.question('Enter your Gemini API key: ', (apiKey) => {
    if (!apiKey.trim()) {
      console.log('❌ API key is required!');
      rl.close();
      return;
    }

    rl.question('Server port (default: 3000): ', (port) => {
      const serverPort = port.trim() || '3000';
      
      rl.question('Environment (development/production, default: development): ', (env) => {
        const environment = env.trim() || 'development';
        
        // Create .env content
        const envContent = `# Community Moderation Tool Environment Variables
# Generated on ${new Date().toISOString()}

# Google Gemini API Key
GEMINI_API_KEY=${apiKey}

# Server Configuration
PORT=${serverPort}

# Environment
NODE_ENV=${environment}
`;

        // Write .env file
        try {
          fs.writeFileSync(envPath, envContent);
          console.log('\n✅ .env file created successfully!');
          console.log('📁 Location:', envPath);
          console.log('\n🚀 You can now start the server with:');
          console.log('   npm run start');
          console.log('\n🔒 Your API key is now securely stored in the .env file');
          console.log('   (This file is ignored by git for security)');
        } catch (error) {
          console.error('❌ Error creating .env file:', error.message);
        }
        
        rl.close();
      });
    });
  });
} 