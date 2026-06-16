/**
 * fix-afiliados.js
 * Surgically fixes the broken afiliados section using line-based replacement
 */
const fs = require('fs');
const content = fs.readFileSync('src/app/page.tsx', 'utf8');
const lines = content.split('\n');

// Find the afiliados section start and end
let afiliadosStart = -1;
let afiliadosEnd = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('activeTab === "afiliados" && (') || 
      lines[i].includes("activeTab === 'afiliados' && (")) {
    afiliadosStart = i;
    break;
  }
}

if (afiliadosStart < 0) {
  console.error('❌ Could not find afiliados tab start');
  process.exit(1);
}

// Find the closing )} of this tab block
let depth = 0;
let inJsx = false;
for (let i = afiliadosStart; i < Math.min(afiliadosStart + 300, lines.length); i++) {
  const line = lines[i];
  if (i === afiliadosStart) { inJsx = true; depth = 1; continue; }
  if (!inJsx) continue;
  
  // Count opening/closing for the ternary block
  if (line.trim().startsWith('<div')) depth++;
  if (line.trim().startsWith('</div')) { depth--; if (depth <= 0) { afiliadosEnd = i + 1; break; } }
  if (line.trim() === ')}') { afiliadosEnd = i; break; }
  if (line.includes('        )}') && depth === 1) { afiliadosEnd = i; break; }
}

// Better approach: just find "activeTab === \"vendedores\"" to know where afiliados ends
let nextTabLine = -1;
for (let i = afiliadosStart + 1; i < lines.length; i++) {
  if (lines[i].includes('activeTab === "vendedores"') || 
      lines[i].includes("activeTab === 'vendedores'")) {
    nextTabLine = i - 1; // The )} before vendedores
    break;
  }
}

if (nextTabLine < 0) {
  console.error('❌ Could not find vendedores tab start to determine afiliados end');
  process.exit(1);
}

console.log(`Afiliados section: lines ${afiliadosStart + 1} to ${nextTabLine + 1}`);
console.log('Sample lines:');
for (let i = afiliadosStart; i <= Math.min(afiliadosStart + 5, nextTabLine); i++) {
  console.log(`  ${i+1}: ${lines[i].substring(0, 80)}`);
}

// Build the replacement content
const PROMO_ID_EXPR = "' + currentUser.id)";
const newAfilidados = [
  `      {activeTab === "afiliados" && (`,
  `        <div className="space-y-6">`,
  `          {/* ── Captación Universal KFS — 3 QR Codes ─────────────────── */}`,
  `          <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-[2rem] p-8 text-[violet-900]">`,
  `            <h3 className="text-xl font-black mb-6 flex items-center gap-2"><span>📡</span> Captación Universal KFS</h3>`,
  `            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">`,
  `              <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-5 flex flex-col items-center gap-3 text-center">`,
  `                <h4 className="font-black text-lg mb-1">🏪 Dueños / Comercios</h4>`,
  `                <div className="w-36 h-36 bg-white rounded-xl border-2 border-violet-400 p-1.5 shadow-md">`,
  `                  <img src={\`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=\${encodeURIComponent('https://kfs-os.vercel.app?role=due%C3%B1o&ref=${PROMO_ID_EXPR}}\`} alt="QR Dueños" className="w-full h-full object-contain rounded-lg" loading="lazy" />`,
  `                </div>`,
  `                <p className="text-xs text-gray-500 leading-tight">Ganas <strong className="text-violet-700">50% de la cuota</strong> + 20% regalías de por vida.</p>`,
  `                <button onClick={() => { navigator.clipboard.writeText('https://kfs-os.vercel.app?role=due%C3%B1o&ref=' + currentUser.id); }} className="text-[10px] font-black text-violet-700 bg-violet-100 hover:bg-violet-200 px-3 py-1.5 rounded-lg cursor-pointer w-full">📋 Copiar Enlace Comercios</button>`,
  `              </div>`,
  `              <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-5 flex flex-col items-center gap-3 text-center">`,
  `                <h4 className="font-black text-lg mb-1">👨‍💼 Fuerza de Ventas</h4>`,
  `                <div className="w-36 h-36 bg-white rounded-xl border-2 border-blue-400 p-1.5 shadow-md">`,
  `                  <img src={\`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=\${encodeURIComponent('https://kfs-os.vercel.app?role=vendedor&ref=${PROMO_ID_EXPR}}\`} alt="QR Vendedores" className="w-full h-full object-contain rounded-lg" loading="lazy" />`,
  `                </div>`,
  `                <p className="text-xs text-gray-500 leading-tight">Recluta vendedores para tus comercios y expande tu red de ventas físicas.</p>`,
  `                <button onClick={() => { navigator.clipboard.writeText('https://kfs-os.vercel.app?role=vendedor&ref=' + currentUser.id); }} className="text-[10px] font-black text-blue-700 bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded-lg cursor-pointer w-full">📋 Copiar Enlace Vendedores</button>`,
  `              </div>`,
  `              <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-5 flex flex-col items-center gap-3 text-center">`,
  `                <h4 className="font-black text-lg mb-1">🛒 Clientes / Flow Express</h4>`,
  `                <div className="w-36 h-36 bg-white rounded-xl border-2 border-emerald-400 p-1.5 shadow-md">`,
  `                  <img src={\`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=\${encodeURIComponent('https://kfs-os.vercel.app?role=customer&ref=${PROMO_ID_EXPR}}\`} alt="QR Clientes" className="w-full h-full object-contain rounded-lg" loading="lazy" />`,
  `                </div>`,
  `                <p className="text-xs text-gray-500 leading-tight">Ganas <strong className="text-emerald-700">$1.00 USD</strong> cuando tu referido recarga sus primeros $5.00 USD.</p>`,
  `                <button onClick={() => { navigator.clipboard.writeText('https://kfs-os.vercel.app?role=customer&ref=' + currentUser.id); }} className="text-[10px] font-black text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg cursor-pointer w-full">📋 Copiar Enlace Clientes</button>`,
  `              </div>`,
  `            </div>`,
  `            <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">`,
  `              <p className="text-xs text-gray-500">Tu ID de Promotora: <span className="font-mono font-black text-violet-700">{currentUser.id}</span></p>`,
  `              <button onClick={() => setShowCustomerRegister(true)} className="bg-violet-700 text-white px-6 py-3 rounded-xl font-black shadow-md hover:bg-violet-900 transition-colors flex items-center gap-2 cursor-pointer text-sm"><UserPlus size={18} /> Registrar Cliente en Vivo</button>`,
  `            </div>`,
  `          </div>`,
];

// Find the "Mis Clientes Afiliados" section start (preserve it)
let misClientesLine = -1;
for (let i = afiliadosStart + 1; i <= nextTabLine; i++) {
  if (lines[i].includes('Mis Clientes Afiliados')) {
    misClientesLine = i;
    break;
  }
}

// Rebuild: [before afiliados] + [new afiliados start] + [Mis Clientes Afiliados onward] + [after nextTabLine]
const before = lines.slice(0, afiliadosStart);
const misClientesOnward = misClientesLine > 0 ? lines.slice(misClientesLine - 2, nextTabLine + 1) : lines.slice(nextTabLine, nextTabLine + 1);

const result = [
  ...before,
  ...newAfilidados,
  '',
  ...(misClientesLine > 0 ? lines.slice(misClientesLine - 2, nextTabLine + 1) : [`      )}`]),
  ...lines.slice(nextTabLine + 1),
].join('\n');

fs.writeFileSync('src/app/page.tsx', result);
console.log('✅ afiliados section replaced with 3-QR Captación Universal');
console.log(`📏 New file: ${result.split('\n').length} lines`);

// Verify
const check = fs.readFileSync('src/app/page.tsx', 'utf8');
console.log('✅ 3 QRs present:', check.includes('Captación Universal KFS'));
console.log('✅ Dueños QR:', check.includes('role=due'));
console.log('✅ Vendedor QR:', check.includes('role=vendedor'));
console.log('✅ Customer QR:', check.includes('role=customer'));
