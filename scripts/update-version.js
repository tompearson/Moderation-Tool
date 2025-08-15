#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get current date in get_date.bat format (MM-DD-YYYY)
function getCurrentDateFormatted() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const year = now.getFullYear();
  return `${month}-${day}-${year}`;
}

// Get current date in ISO format for Postman collections
function getCurrentDateISO() {
  const now = new Date();
  return now.toISOString();
}

// Function to add or update "Last Updated" section in markdown files
function updateMarkdownFile(filePath, newVersion, currentDateFormatted) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    // First, update any version references within the markdown content
    const versionPatterns = [
      /v0\.\d+\.\d+-alpha/g,
      /0\.\d+\.\d+-alpha/g,
      /Version.*0\.\d+\.\d+-alpha/g
    ];
    
    versionPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        content = content.replace(pattern, (match) => {
          if (match.startsWith('v')) {
            return `v${newVersion}`;
          } else if (match.startsWith('Version')) {
            return `Version ${newVersion}`;
          } else {
            return newVersion;
          }
        });
        updated = true;
      }
    });
    
    // Check if "Last Updated" section already exists
    if (content.includes('## Last Updated')) {
      // Update existing section
      content = content.replace(
        /## Last Updated\n- \*\*Date\*\*: .*\n- \*\*Version\*\*: .*\n- \*\*Status\*\*: .*\n- \*\*Next Action\*\*: .*/g,
        `## Last Updated
- **Date**: ${currentDateFormatted}
- **Version**: v${newVersion}
- **Status**: Documentation updated for version ${newVersion}
- **Next Action**: Ready for production deployment`
      );
      updated = true;
    } else {
      // Add new "Last Updated" section at the end
      const lastUpdatedSection = `\n\n---\n\n## Last Updated
- **Date**: ${currentDateFormatted}
- **Version**: v${newVersion}
- **Status**: Documentation updated for version ${newVersion}
- **Next Action**: Ready for production deployment`;
      
      content += lastUpdatedSection;
      updated = true;
    }
    
    if (updated) {
      fs.writeFileSync(filePath, content);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error updating ${path.basename(filePath)}:`, error.message);
    return false;
  }
}

// Function to find all markdown files recursively
function findMarkdownFiles(dir, excludePatterns = []) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...findMarkdownFiles(fullPath, excludePatterns));
    } else if (item.endsWith('.md')) {
      // Skip commit message files and release notes
      const shouldExclude = excludePatterns.some(pattern => 
        item.includes(pattern) || fullPath.includes(pattern)
      );
      
      if (!shouldExclude) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

// Read the current version from version.js
const versionPath = path.join(__dirname, '..', 'public', 'version.js');
const versionContent = fs.readFileSync(versionPath, 'utf8');

// Extract version number using regex
const versionMatch = versionContent.match(/number:\s*['"]([^'"]+)['"]/);
if (!versionMatch) {
  console.error('Could not extract version from version.js');
  process.exit(1);
}

const newVersion = versionMatch[1];
const currentDateFormatted = getCurrentDateFormatted(); // MM-DD-YYYY for markdown
const currentDateISO = getCurrentDateISO(); // ISO format for Postman
console.log(`Updating version to: ${newVersion}`);
console.log(`Using formatted date: ${currentDateFormatted} (MM-DD-YYYY)`);
console.log(`Using ISO date: ${currentDateISO}`);

// Update package.json
const packagePath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
packageJson.version = newVersion;
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');

console.log('✅ Updated package.json');

// Update Postman collection files (only if they exist)
const postmanFiles = [
  'Community Moderation API.postman_collection.json'
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
    
    // Update all timestamps to current ISO date (for Postman)
    if (postmanContent.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/)) {
      postmanContent = postmanContent.replace(
        /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/g,
        currentDateISO
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
if (fs.existsSync(readmePath)) {
  let readmeContent = fs.readFileSync(readmePath, 'utf8');
  
  // Update version references in various formats
  const versionPatterns = [
    /v0\.\d+\.\d+-alpha/g,
    /0\.\d+\.\d+-alpha/g,
    /Version.*0\.\d+\.\d+-alpha/g
  ];
  
  let updated = false;
  versionPatterns.forEach(pattern => {
    if (pattern.test(readmeContent)) {
      readmeContent = readmeContent.replace(pattern, newVersion);
      updated = true;
    }
  });
  
  if (updated) {
    fs.writeFileSync(readmePath, readmeContent);
    console.log('✅ Updated README.md');
  } else {
    console.log('ℹ️  No version references found in README.md');
  }
} else {
  console.log('⚠️  README.md not found, skipping');
}

// Automatically find and update ALL markdown files
console.log('\n🔍 Scanning for markdown files...');
const excludePatterns = [
  'COMMIT_MESSAGE',
  'RELEASE_NOTES',
  'V0.',
  'guidelines-content'
];

const markdownFiles = findMarkdownFiles(path.join(__dirname, '..'), excludePatterns);
console.log(`Found ${markdownFiles.length} markdown files to process`);

let markdownUpdated = 0;
markdownFiles.forEach(filePath => {
  const fileName = path.basename(filePath);
  if (updateMarkdownFile(filePath, newVersion, currentDateFormatted)) {
    console.log(`✅ Updated ${fileName}`);
    markdownUpdated++;
  } else {
    console.log(`ℹ️  No changes needed for ${fileName}`);
  }
});

console.log(`\n📝 Updated ${markdownUpdated} markdown files with "Last Updated" sections`);

// Regenerate package-lock.json
try {
  console.log('🔄 Regenerating package-lock.json...');
  execSync('npm install', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
  console.log('✅ Regenerated package-lock.json');
} catch (error) {
  console.error('❌ Error regenerating package-lock.json:', error.message);
}

console.log('\n🎉 Version update complete!');
console.log(`\nNext steps:`);
console.log(`1. Test your application: npm run build`);
console.log(`2. Commit changes: git add . && git commit -m "v${newVersion}: Version update"`);
console.log(`3. Create git tag: git tag v${newVersion} && git push origin v${newVersion}`);
console.log(`4. Deploy to production: npm run build && vercel --prod`); 