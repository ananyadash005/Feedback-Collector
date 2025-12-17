const fs = require('fs');
const path = require('path');

const frontendDistPath = path.join(__dirname, '../../feedback-collector-frontend/dist');
const backendPublicPath = path.join(__dirname, '../public');

// Function to copy directory recursively
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

try {
  // Check if frontend dist exists
  if (!fs.existsSync(frontendDistPath)) {
    console.error('Frontend dist folder not found. Please build the frontend first.');
    process.exit(1);
  }

  // Remove old public folder if exists
  if (fs.existsSync(backendPublicPath)) {
    fs.rmSync(backendPublicPath, { recursive: true, force: true });
  }

  // Copy frontend dist to backend public
  copyRecursiveSync(frontendDistPath, backendPublicPath);
  
  console.log('✅ Frontend files copied successfully to backend/public');
} catch (error) {
  console.error('❌ Error copying frontend files:', error);
  process.exit(1);
}
