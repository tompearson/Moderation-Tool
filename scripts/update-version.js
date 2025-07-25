#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the current version from version.js
const versionPath = path.join(__dirname, '..', 'version.js');
const versionContent = fs.readFileSync(versionPath, 'utf8');

// Extract version number using regex
const versionMatch = versionContent.match(/number:\s*['"]([^'"]+)['"]/);
if (!versionMatch) {
  console.error('Could not extract version from version.js');
  process.exit(1);
}

const newVersion = versionMatch[1];
console.log(`Updating version to: ${newVersion}`);

// Update package.json
const packagePath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
packageJson.version = newVersion;
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');

console.log('✅ Updated package.json');

// Update all Postman collection files
const postmanFiles = [
  'Community Moderation API.postman_collection.json',
  'postman_collection_production.json',
  'postman_collection.json',
  '07-25-2025 Local Community Moderation API.postman_collection.json',
  '07-25-2025 Production Community Moderation API.postman_collection.json'
];

postmanFiles.forEach(filename => {
  const postmanPath = path.join(__dirname, '..', filename);
  
  // Check if file exists
  if (!fs.existsSync(postmanPath)) {
    console.log(`⚠️  Skipping ${filename} (file not found)`);
    return;
  }
  
  try {
    let postmanContent = fs.readFileSync(postmanPath, 'utf8');
    let updated = false;
    
    // Update version in info section (if it exists)
    if (postmanContent.includes('"version":')) {
      postmanContent = postmanContent.replace(
        /"version":\s*"0\.\d+\.\d+-alpha"/g,
        `"version": "${newVersion}"`
      );
      updated = true;
    }
    
    // Update version in response bodies (for example responses)
    if (postmanContent.includes('"version": "0.')) {
      postmanContent = postmanContent.replace(
        /"version":\s*"0\.\d+\.\d+-alpha"/g,
        `"version": "${newVersion}"`
      );
      updated = true;
    }
    
    // Update all timestamps to 07-25-2025T10:30:00Z
    if (postmanContent.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/)) {
      postmanContent = postmanContent.replace(
        /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/g,
        '2025-07-25T10:30:00Z'
      );
      updated = true;
    }
    
    if (updated) {
      fs.writeFileSync(postmanPath, postmanContent);
      console.log(`✅ Updated ${filename}`);
    } else {
      console.log(`ℹ️  No version or timestamp references found in ${filename}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${filename}:`, error.message);
  }
});

// Update README.md version indicator
const readmePath = path.join(__dirname, '..', 'README.md');
let readmeContent = fs.readFileSync(readmePath, 'utf8');
readmeContent = readmeContent.replace(
  /\(v0\.\d+\.\d+-alpha\)/g,
  `(v${newVersion})`
);
fs.writeFileSync(readmePath, readmeContent);

console.log('✅ Updated README.md');

// Regenerate package-lock.json
const { execSync } = require('child_process');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Regenerated package-lock.json');
} catch (error) {
  console.error('❌ Failed to regenerate package-lock.json:', error.message);
}

console.log(`\n🎉 Version update complete! All files now use version ${newVersion}`);
console.log('\nNext steps:');
console.log('1. Test the application to ensure everything works');
console.log('2. Commit your changes');
console.log('3. Create a git tag for the new version');
console.log(`   git tag v${newVersion}`);
console.log(`   git push origin v${newVersion}`); 