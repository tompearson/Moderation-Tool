const fs = require('fs').promises;
const path = require('path');

async function copyApiFiles() {
  try {
    console.log('📁 Copying API files for Vercel deployment...');
    
    const sourceDir = path.join(process.cwd(), 'api');
    const destDir = path.join(process.cwd(), 'dist', 'api');
    
    // Create destination directory
    await fs.mkdir(destDir, { recursive: true });
    
    // Copy API utility files
    const utilsDir = path.join(destDir, 'utils');
    await fs.mkdir(utilsDir, { recursive: true });
    
    // Copy AI utility
    await fs.copyFile(
      path.join(sourceDir, 'utils', 'ai.js'),
      path.join(utilsDir, 'ai.js')
    );
    
    // Copy guidelines utility
    await fs.copyFile(
      path.join(sourceDir, 'utils', 'guidelines.js'),
      path.join(utilsDir, 'guidelines.js')
    );
    
    // Copy protected prompts directory
    const protectedSource = path.join(process.cwd(), 'protected');
    const protectedDest = path.join(process.cwd(), 'dist', 'protected');
    
    if (await fs.stat(protectedSource).catch(() => false)) {
      await fs.mkdir(protectedDest, { recursive: true });
      
      // Copy all files from protected directory
      const files = await fs.readdir(protectedSource);
      for (const file of files) {
        const sourcePath = path.join(protectedSource, file);
        const destPath = path.join(protectedDest, file);
        
        const stat = await fs.stat(sourcePath);
        if (stat.isDirectory()) {
          await fs.mkdir(destPath, { recursive: true });
          // Recursively copy subdirectories
          await copyDirectory(sourcePath, destPath);
        } else {
          await fs.copyFile(sourcePath, destPath);
        }
      }
    }
    
    console.log('✅ API files copied successfully');
    
  } catch (error) {
    console.error('❌ Error copying API files:', error);
    process.exit(1);
  }
}

async function copyDirectory(source, destination) {
  const files = await fs.readdir(source);
  for (const file of files) {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);
    
    const stat = await fs.stat(sourcePath);
    if (stat.isDirectory()) {
      await fs.mkdir(destPath, { recursive: true });
      await copyDirectory(sourcePath, destPath);
    } else {
      await fs.copyFile(sourcePath, destPath);
    }
  }
}

copyApiFiles();
