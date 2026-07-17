const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

const colorReplacements = [
  // replace sky with violet
  { from: /sky-/g, to: 'violet-' },
  { from: /sky\b/g, to: 'violet' },
  // replace blue with fuchsia/indigo/purple to give it synthetic neon vibes
  { from: /blue-50/g, to: 'violet-50' },
  { from: /blue-100/g, to: 'violet-100' },
  { from: /blue-200/g, to: 'violet-200' },
  { from: /blue-300/g, to: 'violet-300' },
  { from: /blue-400/g, to: 'violet-400' },
  { from: /blue-500/g, to: 'fuchsia-500' },
  { from: /blue-600/g, to: 'fuchsia-600' },
  { from: /blue-700/g, to: 'fuchsia-700' },
  { from: /blue-800/g, to: 'indigo-800' },
  { from: /blue-900/g, to: 'indigo-900' },
  { from: /blue-950/g, to: 'indigo-950' },
  { from: /blue\b/g, to: 'fuchsia' },
];

let updatedCount = 0;

walkDir(SRC_DIR, (filePath) => {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts') && !filePath.endsWith('.css')) {
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;
  
  for (const rep of colorReplacements) {
    content = content.replace(rep.from, rep.to);
  }
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated colors in: ${path.relative(SRC_DIR, filePath)}`);
    updatedCount++;
  }
});

console.log(`Done! Updated colors in ${updatedCount} files.`);
