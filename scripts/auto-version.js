#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class AutoVersioner {
  constructor() {
    this.versionPath = path.join(__dirname, '..', 'public', 'version.js');
    this.packagePath = path.join(__dirname, '..', 'package.json');
  }

  // Get current version from version.js
  getCurrentVersion() {
    const content = fs.readFileSync(this.versionPath, 'utf8');
    const match = content.match(/number:\s*['"]([^'"]+)['"]/);
    return match ? match[1] : '0.8.0-alpha';
  }

  // Parse version string into components
  parseVersion(version) {
    const parts = version.split('.');
    const major = parseInt(parts[0]);
    const minor = parseInt(parts[1]);
    const patch = parseInt(parts[2].split('-')[0]);
    const prerelease = parts[2].includes('-') ? parts[2].split('-')[1] : '';
    
    return { major, minor, patch, prerelease };
  }

  // Generate new version based on commit type
  generateNewVersion(commitType) {
    const currentVersion = this.getCurrentVersion();
    const { major, minor, patch, prerelease } = this.parseVersion(currentVersion);
    
    let newMajor = major;
    let newMinor = minor;
    let newPatch = patch;

    switch (commitType) {
      case 'breaking':
      case 'major':
        newMajor++;
        newMinor = 0;
        newPatch = 0;
        break;
      case 'feat':
      case 'minor':
        newMinor++;
        newPatch = 0;
        break;
      case 'fix':
      case 'patch':
      default:
        newPatch++;
        break;
    }

    return `${newMajor}.${newMinor}.${newPatch}-${prerelease}`;
  }

  // Update version.js file
  updateVersionFile(newVersion) {
    const content = fs.readFileSync(this.versionPath, 'utf8');
    const { major, minor, patch } = this.parseVersion(newVersion);
    
    const newContent = content
      .replace(/number:\s*['"][^'"]+['"]/, `number: '${newVersion}'`)
      .replace(/major:\s*\d+/, `major: ${major}`)
      .replace(/minor:\s*\d+/, `minor: ${minor}`)
      .replace(/patch:\s*\d+/, `patch: ${patch}`)
      .replace(/full:\s*['"][^'"]+['"]/, `full: '${newVersion}'`);

    fs.writeFileSync(this.versionPath, newContent);
    console.log(`✅ Updated version.js to ${newVersion}`);
  }

  // Update package.json
  updatePackageJson(newVersion) {
    const packageJson = JSON.parse(fs.readFileSync(this.packagePath, 'utf8'));
    packageJson.version = newVersion;
    fs.writeFileSync(this.packagePath, JSON.stringify(packageJson, null, 2));
    console.log(`✅ Updated package.json to ${newVersion}`);
  }

  // Run the update script
  runUpdateScript() {
    try {
      execSync('npm run update-version', { stdio: 'inherit' });
      console.log('✅ Ran update-version script');
    } catch (error) {
      console.error('❌ Error running update-version script:', error.message);
    }
  }

  // Auto-detect version bump from commit message
  detectVersionBump(commitMessage) {
    const lowerMessage = commitMessage.toLowerCase();
    
    if (lowerMessage.includes('breaking') || lowerMessage.includes('major')) {
      return 'major';
    } else if (lowerMessage.includes('feat') || lowerMessage.includes('feature')) {
      return 'minor';
    } else if (lowerMessage.includes('fix') || lowerMessage.includes('patch')) {
      return 'patch';
    }
    
    return 'patch'; // default
  }

  // Main versioning process
  async version(commitType = 'patch', commitMessage = '') {
    console.log('🚀 Starting automated versioning...');
    
    const currentVersion = this.getCurrentVersion();
    console.log(`Current version: ${currentVersion}`);
    
    // Auto-detect if no commit type provided
    if (commitType === 'patch' && commitMessage) {
      commitType = this.detectVersionBump(commitMessage);
      console.log(`Auto-detected version bump type: ${commitType}`);
    }
    
    const newVersion = this.generateNewVersion(commitType);
    console.log(`New version: ${newVersion}`);
    
    // Update files
    this.updateVersionFile(newVersion);
    this.updatePackageJson(newVersion);
    this.runUpdateScript();
    
    console.log(`\n🎉 Successfully bumped version to ${newVersion}!`);
    
    return newVersion;
  }
}

// CLI usage
if (require.main === module) {
  const autoVersioner = new AutoVersioner();
  const commitType = process.argv[2] || 'patch';
  const commitMessage = process.argv[3] || '';
  
  autoVersioner.version(commitType, commitMessage)
    .then(newVersion => {
      console.log('\nNext steps:');
      console.log('1. Test the application');
      console.log('2. Commit your changes');
      console.log(`3. Create git tag: git tag v${newVersion}`);
      console.log(`4. Push tag: git push origin v${newVersion}`);
    })
    .catch(error => {
      console.error('❌ Versioning failed:', error.message);
      process.exit(1);
    });
}

module.exports = AutoVersioner; 