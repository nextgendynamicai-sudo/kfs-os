const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const replacement = `<div className="flex items-center gap-3">
  <div className="bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm border border-orange-300" title="Billetera KFS Points">
    <span className="text-[10px] font-black uppercase tracking-wider text-orange-900">K-Pts</span>
    <span className="font-black text-white text-sm">{currentUser?.kfsPoints || 0}</span>
  </div>
  $1
</div>`;

// 1. Standard logout
content = content.replace(/(<button onClick=\{logout\} className="p-2 bg-white\/10 rounded-xl hover:bg-red-500 transition-colors cursor-pointer text-white">\s*<LogOut size=\{16\} \/>\s*<\/button>)/g, (match, p1, offset) => {
  if (offset > 2000) return replacement.replace('$1', match);
  return match;
});

// 2. Vendedor logout
content = content.replace(/(<button onClick=\{logout\} className="flex items-center gap-1\.5 bg-white\/10 hover:bg-white\/20 px-3 py-1\.5 rounded-xl transition-colors text-white cursor-pointer text-xs font-bold">\s*Salir\s*<\/button>)/g, (match, p1, offset) => {
  if (offset > 2000) return replacement.replace('$1', match);
  return match;
});

// 3. Core logout
content = content.replace(/(<button onClick=\{logout\} className="p-2 bg-white shadow-sm rounded-xl hover:text-red-500 transition-colors cursor-pointer text-gray-500 border-none">\s*<LogOut size=\{16\} \/>\s*<\/button>)/g, (match, p1, offset) => {
  if (offset > 2000) return replacement.replace('$1', match);
  return match;
});

fs.writeFileSync('src/app/page.tsx', content);
