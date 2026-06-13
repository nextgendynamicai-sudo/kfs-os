import { readFileSync, writeFileSync } from 'fs';

let code = readFileSync('src/app/page.tsx', 'utf8');

// Global Backgrounds
code = code.replace(/min-h-screen bg-gray-50/g, 'min-h-screen bg-[#EEF2F5]');

// Panels / Cards
code = code.replace(/bg-white rounded-\[2rem\] shadow-sm border border-gray-100/g, 'bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-[2rem]');
code = code.replace(/bg-white rounded-3xl shadow-lg border border-gray-100/g, 'bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-3xl');
code = code.replace(/bg-white p-6 rounded-3xl shadow-sm border border-gray-100/g, 'bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none p-6 rounded-3xl');
code = code.replace(/bg-white rounded-2xl shadow-sm border border-gray-100/g, 'bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-2xl');
code = code.replace(/bg-white rounded-xl shadow-sm border border-gray-100/g, 'bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-xl');
code = code.replace(/bg-gray-50 border border-gray-200 focus:ring-\[#C5A184\]/g, 'bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none focus:ring-violet-400');
code = code.replace(/bg-gray-50 border border-gray-200/g, 'bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none');

// Input fields specific
code = code.replace(/bg-gray-50 rounded-xl px-4 py-3/g, 'bg-[#EEF2F5] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border-none rounded-xl px-4 py-3');

// Color Palette Swaps (Gold -> Violet-600, Dark Blue -> Violet-900)
code = code.replace(/#0A1128/g, 'violet-900');
code = code.replace(/#C5A184/g, 'violet-600');
code = code.replace(/text-violet-900\/50/g, 'text-violet-400');
code = code.replace(/text-violet-900\/80/g, 'text-violet-700');
code = code.replace(/bg-violet-900\/5/g, 'bg-violet-100');
code = code.replace(/bg-violet-900\/10/g, 'bg-violet-100');
code = code.replace(/bg-violet-600\/10/g, 'bg-violet-100');
code = code.replace(/border-violet-600\/30/g, 'border-violet-200');
code = code.replace(/border-violet-900\/10/g, 'border-violet-100');
code = code.replace(/bg-violet-600\/20/g, 'bg-violet-200');
code = code.replace(/border-violet-600\/30/g, 'border-violet-200');

// Header gradients
code = code.replace(/from-violet-900 to-\[#1a2b5e\]/g, 'from-violet-900 to-indigo-900');
code = code.replace(/from-violet-900 to-\[#141E3A\]/g, 'from-violet-900 to-indigo-900');

// Header specific changes for Core Dashboard and others
code = code.replace(/bg-gradient-to-br from-violet-900 to-indigo-900 rounded-b-\[3rem\] shadow-\[0_10px_30px_rgba\(10,17,40,0.3\)\] text-white/g, 'bg-[#EEF2F5] rounded-b-[3rem] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none text-violet-900');

// Table Headers
code = code.replace(/bg-gray-50 text-gray-500 uppercase text-xs/g, 'bg-violet-100 text-violet-700 uppercase text-xs');
code = code.replace(/border-b border-gray-50 hover:bg-gray-50\/50/g, 'border-b border-violet-100 hover:bg-violet-50');

writeFileSync('src/app/page.tsx', code);
console.log('Styles migrated');
