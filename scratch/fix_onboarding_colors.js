const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/B2BSelfOnboarding.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace old bronze theme colors with unified purple/violet theme colors
content = content.replace(/#C5A184/g, '#7c3aed'); // violet-600
content = content.replace(/rgba\(197,161,132/g, 'rgba(124,58,237'); // violet-600 RGB
content = content.replace(/#0A1128/g, '#1e1b4b'); // indigo-950 text/bg
content = content.replace(/bg-\[#C5A184\]/g, 'bg-violet-600 hover:bg-violet-700 text-white');
content = content.replace(/text-\[#C5A184\]/g, 'text-violet-600');
content = content.replace(/focus:border-\[#C5A184\]/g, 'focus:border-violet-400');
content = content.replace(/border-\[#C5A184\]/g, 'border-violet-600');
content = content.replace(/bg-violet-600 hover:bg-violet-700 text-white\/15/g, 'bg-violet-600/15');
content = content.replace(/text-\[#1e1b4b\] bg-\[#7c3aed\]/g, 'text-white bg-[#7c3aed] hover:bg-violet-700');
content = content.replace(/bg-\[#7c3aed\] text-\[#1e1b4b\]/g, 'bg-[#7c3aed] text-white hover:bg-violet-700 shadow-lg shadow-violet-600/20');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully fixed onboarding colors.');
