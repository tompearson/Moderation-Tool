#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read current version
const versionPath = path.join(__dirname, '..', 'version.js');
const versionContent = fs.readFileSync(versionPath, 'utf8');

// Extract current version using regex
const versionMatch = versionContent.match(/number:\s*['"]([^'"]+)['"]/);
const currentVersion = versionMatch ? versionMatch[1] : '0.8.0-alpha';

console.log(`Current version: ${currentVersion}`);

// Parse version components
const versionParts = currentVersion.split('.');
const major = parseInt(versionParts[0]);
const minor = parseInt(versionParts[1]);
const patch = parseInt(versionParts[2].split('-')[0]);
const prerelease = versionParts[2].includes('-') ? versionParts[2].split('-')[1] : '';

// Get bump type from command line argument
const bumpType = process.argv[2] || 'patch'; // patch, minor, major

let newMajor = major;
let newMinor = minor;
let newPatch = patch;

switch (bumpType) {
  case 'major':
    newMajor++;
    newMinor = 0;
    newPatch = 0;
    break;
  case 'minor':
    newMinor++;
    newPatch = 0;
    break;
  case 'patch':
  default:
    newPatch++;
    break;
}

const newVersion = `${newMajor}.${newMinor}.${newPatch}-${prerelease}`;
const newFullVersion = newVersion;

console.log(`Bumping ${bumpType} version to: ${newVersion}`);

// Update version.js
const newVersionContent = versionContent
  .replace(/number:\s*['"][^'"]+['"]/, `number: '${newVersion}'`)
  .replace(/major:\s*\d+/, `major: ${newMajor}`)
  .replace(/minor:\s*\d+/, `minor: ${newMinor}`)
  .replace(/patch:\s*\d+/, `patch: ${newPatch}`)
  .replace(/full:\s*['"][^'"]+['"]/, `full: '${newFullVersion}'`);

fs.writeFileSync(versionPath, newVersionContent);
console.log('✅ Updated version.js');

// Run the existing update script
const { execSync } = require('child_process');
try {
  execSync('npm run update-version', { stdio: 'inherit' });
  console.log('✅ Ran update-version script');
} catch (error) {
  console.error('❌ Error running update-version script:', error.message);
}

console.log(`\n🎉 Version bumped to ${newVersion}!`);
console.log('\nNext steps:');
console.log('1. Test the application');
console.log('2. Commit your changes');
console.log(`3. Create git tag: git tag v${newVersion}`);
console.log(`4. Push tag: git push origin v${newVersion}`); 