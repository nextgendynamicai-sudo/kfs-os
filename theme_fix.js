const fs = require('fs');

const path = 'src/components/B2BSelfOnboarding.tsx';
let content = fs.readFileSync(path, 'utf8');

// Container
content = content.replace('min-h-screen bg-white text-white', 'min-h-screen bg-slate-50 text-slate-900');

// Header
content = content.replace('bg-white/95 backdrop-blur-xl sticky', 'bg-white/90 backdrop-blur-xl border-b border-slate-200 sticky');
content = content.replace('text-gray-400 hover:text-white', 'text-slate-500 hover:text-slate-800');

// Steps Indicator
content = content.replace('bg-white/10 text-gray-400', 'bg-slate-200 text-slate-500');
content = content.replace('text-gray-200', 'text-slate-800');
content = content.replace('text-gray-500', 'text-slate-400');

// Cards
content = content.replace(/bg-white\/5 border border-white\/10/g, 'bg-white border border-slate-200');
content = content.replace(/bg-black\/40 border border-white\/10/g, 'bg-slate-50 border border-slate-200');
content = content.replace(/bg-black\/30 border border-white\/5/g, 'bg-slate-50 border border-slate-200');
content = content.replace(/bg-black\/40 border border-white\/5/g, 'bg-slate-50 border border-slate-200');

// Text Colors
content = content.replace(/text-gray-100/g, 'text-slate-900');
content = content.replace(/text-gray-200/g, 'text-slate-800');
content = content.replace(/text-gray-300/g, 'text-slate-700');
content = content.replace(/text-gray-400/g, 'text-slate-500');

// Inputs & Buttons
content = content.replace(/bg-white\/5 border-white\/5 text-gray-400 hover:border-white\/20/g, 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-100');
content = content.replace(/bg-white\/5 hover:bg-white\/10 text-white/g, 'bg-slate-100 hover:bg-slate-200 text-slate-700');
content = content.replace(/border border-white\/10 hover:border-white\/20 text-white/g, 'bg-white border border-slate-200 hover:border-slate-300 text-slate-700');

// Footer
content = content.replace(/border-t border-white\/5/g, 'border-t border-slate-200');

fs.writeFileSync(path, content, 'utf8');
console.log('Applied light theme to B2BSelfOnboarding.tsx');
