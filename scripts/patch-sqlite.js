const fs = require('fs');
const path = require('path');

const target = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native-sqlite-storage',
  'platforms',
  'android',
  'build.gradle'
);

if (!fs.existsSync(target)) {
  console.log('[patch-sqlite] build.gradle not found, skipping.');
  process.exit(0);
}

const content = fs.readFileSync(target, 'utf8');
if (content.includes('mavenCentral()') && !content.includes('jcenter()')) {
  console.log('[patch-sqlite] Already patched.');
  process.exit(0);
}

const updated = content.replace(/\bjcenter\(\)/g, 'mavenCentral()');
if (updated === content) {
  console.log('[patch-sqlite] No changes needed.');
  process.exit(0);
}

fs.writeFileSync(target, updated);
console.log('[patch-sqlite] Replaced jcenter() with mavenCentral().');
