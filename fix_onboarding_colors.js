const fs = require('fs');
const file = 'src/components/B2BSelfOnboarding.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace slate text colors with exact hex values to ensure high contrast in any theme
content = content.replace(/text-slate-900/g, 'text-[#0A1128]');
content = content.replace(/text-slate-800/g, 'text-[#1e293b]');
content = content.replace(/text-slate-700/g, 'text-[#334155]');
content = content.replace(/text-slate-500/g, 'text-[#64748b]');
content = content.replace(/text-slate-400/g, 'text-[#94a3b8]');
content = content.replace(/bg-slate-200/g, 'bg-[#e2e8f0]');
content = content.replace(/border-slate-200/g, 'border-[#e2e8f0]');

// Add explicit text colors to inputs to prevent them inheriting white in forced dark mode
content = content.replace(/<input([^>]*?)className=\"([^\"]*?)\"/g, '<input$1className=\"$2 text-[#0A1128] placeholder:text-[#94a3b8]\"');
content = content.replace(/<textarea([^>]*?)className=\"([^\"]*?)\"/g, '<textarea$1className=\"$2 text-[#0A1128] placeholder:text-[#94a3b8]\"');

fs.writeFileSync(file, content);
console.log('Fixes applied to B2BSelfOnboarding.tsx');
