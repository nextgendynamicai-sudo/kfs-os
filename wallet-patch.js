/**
 * wallet-patch.js
 * Adds K-Pts wallet badge to all dashboard headers that are missing it
 * and verifies/adds the Promotora 3-QR section
 */
const fs = require('fs');
let page = fs.readFileSync('src/app/page.tsx', 'utf8');

const WALLET_BADGE = `<div className="bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm border border-orange-300/50" title="Billetera KFS Points">\n                <span className="text-[10px] font-black uppercase tracking-wider text-orange-900">K-Pts</span>\n                <span className="font-black text-white text-sm">{currentUser?.kfsPoints || 0}</span>\n              </div>`;

// Unique logout button signatures per dashboard + their wrapper context
const targets = [
  // Customer Dashboard (dark bg header)
  {
    label: 'CustomerDashboard K-Pts',
    search: `          <button onClick={logout} className="p-2 bg-white/10 rounded-xl hover:bg-red-500 transition-colors cursor-pointer text-white">\r\n            <LogOut size={16} />\r\n          </button>\r\n        </div>\r\n\r\n        <div className="flex items-center gap-4">\r\n          <div className="w-16 h-16 bg-[violet-600] rounded-full`,
    replacement: `          <div className="flex items-center gap-2">\n              ${WALLET_BADGE}\n              <button onClick={logout} className="p-2 bg-white/10 rounded-xl hover:bg-red-500 transition-colors cursor-pointer text-white">\n                <LogOut size={16} />\n              </button>\n            </div>\r\n        </div>\r\n\r\n        <div className="flex items-center gap-4">\r\n          <div className="w-16 h-16 bg-[violet-600] rounded-full`,
  },
  // Promotora Dashboard (dark bg header, same pattern)
  {
    label: 'PromotoraDashboard K-Pts',
    search: `          <button onClick={logout} className="p-2 bg-white/10 rounded-xl hover:bg-red-500 transition-colors cursor-pointer text-white">\r\n            <LogOut size={16} />\r\n          </button>\r\n        </div>\r\n\r\n        <div className="flex items-center gap-4">\r\n          <div className="w-16 h-16 bg-[violet-600] rounded-full`,
    replacement: `          <div className="flex items-center gap-2">\n              ${WALLET_BADGE}\n              <button onClick={logout} className="p-2 bg-white/10 rounded-xl hover:bg-red-500 transition-colors cursor-pointer text-white">\n                <LogOut size={16} />\n              </button>\n            </div>\r\n        </div>\r\n\r\n        <div className="flex items-center gap-4">\r\n          <div className="w-16 h-16 bg-[violet-600] rounded-full`,
  },
  // Vendedor Dashboard (Salir button)
  {
    label: 'VendedorDashboard K-Pts',
    search: `          <button onClick={logout} className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition-colors text-white cursor-pointer text-xs font-bold">\r\n            Salir\r\n          </button>`,
    replacement: `<div className="flex items-center gap-2">\n            <div className="bg-gradient-to-r from-amber-400 to-orange-500 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm" title="K-Pts">\n              <span className="text-[9px] font-black text-orange-900 uppercase">K-Pts</span>\n              <span className="font-black text-white text-xs">{currentUser?.kfsPoints || 0}</span>\n            </div>\n            <button onClick={logout} className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition-colors text-white cursor-pointer text-xs font-bold">\n              Salir\n            </button>\n          </div>`,
  },
];

targets.forEach(({ label, search, replacement }) => {
  const count = page.split(search).length - 1;
  if (count === 0) {
    console.log(`⚠️  [${label}] Pattern not found — checking line endings...`);
    // Try LF-only version
    const lf = search.replace(/\r\n/g, '\n');
    if (page.includes(lf)) {
      page = page.replace(lf, replacement.replace(/\r\n/g, '\n'));
      console.log(`✅ [${label}] Applied (LF)`);
    } else {
      console.log(`❌ [${label}] FAILED`);
    }
  } else if (count === 1) {
    page = page.replace(search, replacement);
    console.log(`✅ [${label}] Applied`);
  } else {
    console.log(`⚠️  [${label}] Found ${count} occurrences — applying to first only`);
    page = page.replace(search, replacement);
  }
});

// ── CoreDashboard K-Pts: should already exist from master-patch ──────────────
const coreHasKPts = page.includes('Billetera KFS Points');
console.log(`${coreHasKPts ? '✅' : '❌'} [CoreDashboard K-Pts] (from master-patch)`);

// ── ClientDashboard K-Pts (line ~6445 and ~6475) ────────────────────────────
// The ClientDashboard has a different nav structure — find logout and add badge
const clientLogout1 = `className="text-gray-400 font-bold hover:text-red-500 transition relative`;
if (page.includes(clientLogout1) && !page.includes('ClientDash_kpts_done')) {
  // Find the div containing it and prepend the badge
  const marker = `<div className="flex items-center gap-3">`;
  // Count how many times this appears near the ClientDashboard area (around line 6200-6500)
  const sectionStart = page.indexOf('const ClientDashboard');
  const sectionEnd = page.indexOf('const VendedorDashboard');
  const section = page.slice(sectionStart, sectionEnd);
  
  if (section.includes('Billetera KFS Points')) {
    console.log('⏭️  [ClientDashboard K-Pts] Already present in section');
  } else {
    // Insert before the logout button in the client header area
    const clientLogoutBtn = `<button onClick={logout} className="text-gray-400 font-bold hover:text-red-500 transition relative`;
    const clientKPtsBadge = `<div className="bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm border border-orange-300/50">\n              <span className="text-[10px] font-black uppercase tracking-wider text-orange-900">K-Pts</span>\n              <span className="font-black text-white text-sm">{currentUser?.kfsPoints || 0}</span>\n            </div>\n            <button onClick={logout} className="text-gray-400 font-bold hover:text-red-500 transition relative`;
    
    if (page.includes(clientLogoutBtn)) {
      page = page.replace(clientLogoutBtn, clientKPtsBadge);
      console.log('✅ [ClientDashboard K-Pts] Applied');
    } else {
      console.log('⚠️  [ClientDashboard K-Pts] Logout button pattern not found');
    }
  }
}

// ── Promotora 3-QR section check ─────────────────────────────────────────────
const hasPromoQRs = page.includes("role=due\u00F1o&ref=") || page.includes('Dueños / Comercios') || page.includes('Captaci') && page.includes('Universal KFS');
console.log(`${hasPromoQRs ? '✅' : '❌'} [Promotora 3 QRs] present = ${hasPromoQRs}`);

if (!hasPromoQRs) {
  console.log('   → Need to add Promotora 3 QRs — checking location...');
  // Find where Afiliados tab content is in PromotoraDashboard  
  const afiliadosMarker = `{activeTab === "afiliados" && (`;
  if (page.includes(afiliadosMarker)) {
    // Find the content after it and inject
    console.log('   → afiliados tab found — will need targeted injection');
  }
}

// Save
fs.writeFileSync('src/app/page.tsx', page);
console.log('\n✅ wallet-patch.js done.');

// Final K-Pts count
const kptsCount = (page.match(/K-Pts/g) || []).length;
console.log(`📊 Total K-Pts occurrences: ${kptsCount}`);
