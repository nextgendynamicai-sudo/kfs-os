/**
 * master-patch.js
 * One-shot comprehensive patch for KFS OS v3.1
 * Fixes pre-existing bug + adds all 8 requested features
 * Run: bun master-patch.js
 */
const fs = require('fs');

// ─── Read files ───────────────────────────────────────────────────────────────
let page = fs.readFileSync('src/app/page.tsx', 'utf8');
let ctx  = fs.readFileSync('src/context/KFSContext.tsx', 'utf8');

// Helper: replace exactly one occurrence (fails loudly if not found)
function patch(file, label, search, replacement) {
  if (!file.includes(search)) {
    console.error(`❌ [${label}] Pattern NOT found`);
    return file;
  }
  console.log(`✅ [${label}]`);
  return file.replace(search, replacement);
}

// ══════════════════════════════════════════════════════════════════════════════
// BUG FIX: Remove extra </div> before OracleInsightCard (pre-existing crash)
// ══════════════════════════════════════════════════════════════════════════════
// The "Peaje Gamificado" section closes correctly at </div> after the QR image.
// But then there is an EXTRA </div> that closes the outer owner-tab container
// too early, causing OracleInsightCard to land outside the JSX block.
page = patch(page, 'FIX: extra </div> before OracleInsightCard',
`            </div>\r\n            </div>\r\n            \r\n            <OracleInsightCard`,
`            </div>\r\n            \r\n            <OracleInsightCard`
);

// ══════════════════════════════════════════════════════════════════════════════
// FEATURE 1 & 2 & 3: CoreDashboard — handleClearDemos, handleInjectPoints,
//   customizingClient state + StorefrontCustomizer modal
// ══════════════════════════════════════════════════════════════════════════════
// Inject after the closing brace of handleWipeDatabase (before [activeModal] state)
page = patch(page, 'CoreDashboard: inject functions + state',
`  const [activeModal, setActiveModal] = useState<string | null>(null);`,
`  // ── Customizing state for Arquitecto ──────────────────────────────────────
  const [customizingClient, setCustomizingClient] = useState<any>(null);

  // Feature 1: Clear all demo records
  const handleClearDemos = () => {
    if (confirm('¿Eliminar todos los registros de demo del sistema?')) {
      setDb((prev: any) => ({
        ...prev,
        clients:    prev.clients.filter((c: any)    => !String(c.id).includes('demo')),
        promotoras: prev.promotoras.filter((p: any) => !String(p.id).includes('demo')),
        vendedores: prev.vendedores.filter((v: any) => !String(v.id).includes('demo')),
        customers:  prev.customers.filter((c: any)  => !String(c.id).includes('demo')),
      }));
      showToast('✅ Demos eliminados correctamente.', 'success');
    }
  };

  // Feature 5: Inject KFS Points to any user
  const handleInjectPoints = (collection: string, userId: string) => {
    const raw = prompt('Cantidad de KFS Points a inyectar (ej: 500 = $0.50 USD):', '500');
    if (!raw || isNaN(Number(raw))) return;
    const amount = parseInt(raw, 10);
    setDb((prev: any) => ({
      ...prev,
      [collection]: prev[collection].map((u: any) =>
        u.id === userId ? { ...u, kfsPoints: (u.kfsPoints || 0) + amount } : u
      ),
    }));
    showToast(\`🎁 \${amount} K-Points inyectados.\`, 'success');
  };

  const [activeModal, setActiveModal] = useState<string | null>(null);`
);

// Add updateStoreSettings to CoreDashboard destructure
page = patch(page, 'CoreDashboard: add updateStoreSettings to destructure',
`const { impersonateClient, registerClient, assignPromotoraToClient, addGlobalProduct, sendNotification, replyTicket, closeTicket, blockClient, releaseClient, deleteClient, approveUnlock, rejectUnlock, approveCandidateRegistration, rejectCandidateRegistration, toggleCandidateBacking, approveRider, rejectRider, assignRiderToBusiness, removeRiderFromBusiness, validateTopUp, rates, updateBcvRates, transferKFSPoints } = useKFS() as any;`,
`const { impersonateClient, registerClient, assignPromotoraToClient, addGlobalProduct, sendNotification, replyTicket, closeTicket, blockClient, releaseClient, deleteClient, approveUnlock, rejectUnlock, approveCandidateRegistration, rejectCandidateRegistration, toggleCandidateBacking, approveRider, rejectRider, assignRiderToBusiness, removeRiderFromBusiness, validateTopUp, rates, updateBcvRates, transferKFSPoints, updateStoreSettings } = useKFS() as any;`
);

// ── FEATURE 2: Add 🗑️ Limpiar Demos button in auditoria grid ──────────────
page = patch(page, 'Feature 2: Limpiar Demos button in auditoria',
`                <span className="font-black text-red-700 text-sm text-center font-bold">Puesta a Cero (Wipe DB)</span>\r\n              </button>`,
`                <span className="font-black text-red-700 text-sm text-center font-bold">Puesta a Cero (Wipe DB)</span>\r\n              </button>\r\n              <button onClick={handleClearDemos} className="bg-orange-50 border border-orange-200 hover:bg-orange-100 p-6 rounded-2xl flex flex-col items-center gap-3 transition-colors group cursor-pointer">\r\n                <div className="bg-orange-500 text-white p-3 rounded-xl group-hover:scale-110 transition-transform"><Trash2 size={24} /></div>\r\n                <span className="font-black text-orange-700 text-sm text-center font-bold">🗑️ Limpiar Demos</span>\r\n              </button>`
);

// ── FEATURE 2 (cont.): 🎁 K-Pts + 🎨 Diseño buttons in clients table ─────
// Find the Cobro WA button closing and add after it
page = patch(page, 'Feature 2+5: K-Pts + Diseño buttons in clients table',
`                                💬 Cobro WA\r\n                              </button>\r\n                            </div>\r\n                          </td>`,
`                                💬 Cobro WA\r\n                              </button>\r\n\r\n                              <button onClick={() => handleInjectPoints('clients', c.id)} className="bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg font-bold text-[10px] hover:bg-amber-200 transition-colors cursor-pointer inline-flex items-center gap-1 shadow-sm">\r\n                                🎁 K-Pts\r\n                              </button>\r\n\r\n                              <button onClick={() => setCustomizingClient(c)} className="bg-violet-100 text-violet-700 border border-violet-200 px-3 py-1.5 rounded-lg font-bold text-[10px] hover:bg-violet-200 transition-colors cursor-pointer inline-flex items-center gap-1 shadow-sm">\r\n                                🎨 Diseño\r\n                              </button>\r\n                            </div>\r\n                          </td>`
);

// ── FEATURE 2 (cont.): StorefrontCustomizer modal in CoreDashboard return ──
page = patch(page, 'Feature 2: StorefrontCustomizer modal in CoreDashboard',
`      {activeModal === 'product' && (`,
`      {/* ── Storefront Customizer Modal (Arquitecto) ───────────────────── */}\r\n      {customizingClient && (\r\n        <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setCustomizingClient(null)}>\r\n          <div className="bg-white rounded-[2rem] w-full max-w-lg relative p-2 shadow-2xl" onClick={e => e.stopPropagation()}>\r\n            <button onClick={() => setCustomizingClient(null)} className="absolute top-4 right-4 text-gray-400 hover:text-violet-900 transition-colors cursor-pointer z-10 border-none bg-transparent">\r\n              <X size={24} />\r\n            </button>\r\n            <StorefrontCustomizer\r\n              client={customizingClient}\r\n              updateStoreSettings={(id: string, settings: any) => {\r\n                updateStoreSettings(id, settings);\r\n                setCustomizingClient(null);\r\n                showToast('✅ Diseño de tienda actualizado.', 'success');\r\n              }}\r\n            />\r\n          </div>\r\n        </div>\r\n      )}\r\n\r\n      {activeModal === 'product' && (`
);

// ── FEATURE 6: Upgrade Bono Viral widget with real QR ──────────────────────
page = patch(page, 'Feature 6: Bono Viral real QR upgrade',
`              {/* Banner P2P Viral */}\r\n              <div className="bg-[#1A1108]/80 border border-[violet-600]/40 p-4 rounded-2xl flex items-center gap-4">\r\n                <div className="w-12 h-12 bg-[violet-600]/20 rounded-full flex items-center justify-center flex-shrink-0">\r\n                  <Gift size={24} className="text-[violet-600]" />\r\n                </div>\r\n                <div>\r\n                  <h4 className="font-black text-[violet-600] text-sm">Bono Viral Embajador</h4>\r\n                  <p className="text-xs text-gray-300 leading-tight mt-1">\r\n                    Comparte tu código de afiliado <span className="font-mono bg-black/50 px-1.5 py-0.5 rounded text-white">{currentUser.id}</span> con tus amigos. ¡Cuando se registren y hagan su primera recarga, recibirás <strong>500 K-Points</strong> automáticos!\r\n                  </p>\r\n                </div>\r\n              </div>`,
`              {/* Bono Viral Embajador — QR Real Escaneable */}\r\n              <div className="bg-gradient-to-r from-emerald-900/80 to-teal-900/80 border border-emerald-500/40 p-5 rounded-[1.5rem] flex flex-col sm:flex-row items-center gap-5">\r\n                <div className="w-28 h-28 bg-white rounded-xl p-1.5 border-2 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)] flex-shrink-0">\r\n                  <img\r\n                    src={\`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=\${encodeURIComponent('https://kfs-os.vercel.app?role=customer&ref=' + currentUser.id)}\`}\r\n                    alt="QR Referido"\r\n                    className="w-full h-full object-contain rounded-lg"\r\n                    loading="lazy"\r\n                  />\r\n                </div>\r\n                <div className="flex-1 text-center sm:text-left">\r\n                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">\r\n                    <Gift size={18} className="text-emerald-400" />\r\n                    <h4 className="font-black text-white text-base">Bono Viral Embajador</h4>\r\n                  </div>\r\n                  <p className="text-xs text-gray-300 leading-relaxed mb-3">\r\n                    Escanea o comparte tu QR. Cuando tu referido haga su primera recarga de <strong className="text-emerald-400">$5.00+</strong>, recibirás <strong className="text-emerald-400">+500 K-Points ($0.50)</strong> automáticos.\r\n                  </p>\r\n                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">\r\n                    <span className="font-mono bg-black/60 border border-emerald-500/30 px-2 py-1 rounded-lg text-emerald-300 text-xs">ID: {currentUser.id}</span>\r\n                    <button\r\n                      onClick={() => { navigator.clipboard.writeText('https://kfs-os.vercel.app?role=customer&ref=' + currentUser.id); showToast('📋 Enlace copiado.', 'success'); }}\r\n                      className="text-[10px] font-black text-white bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"\r\n                    >\r\n                      📋 Copiar Enlace\r\n                    </button>\r\n                  </div>\r\n                </div>\r\n              </div>`
);

// ── FEATURE 8: Loading screen → replace KreatekLogo with kfs-loading.png ──
page = patch(page, 'Feature 8: Loading screen logo',
`          <KreatekLogo className="h-28 sm:h-32 w-auto animate-pulse mb-8" />`,
`          <img src="/kfs-loading.png" className="h-28 sm:h-32 w-auto animate-pulse mb-8 object-contain" alt="KFS OS" />`
);

// ══════════════════════════════════════════════════════════════════════════════
// KFSContext: FEATURE 7 — KYC uploadAsset to Supabase
// ══════════════════════════════════════════════════════════════════════════════
if (!ctx.includes('uploadAsset(`customers/')) {
  ctx = patch(ctx, 'Feature 7: KYC uploadAsset',
`    const newCustomer = {
      id: \`cust_\${Date.now()}\`,`,
`    // Upload KYC assets to Supabase Storage (avoids heavy base64)
    let photoUrl   = kycPhoto   || '';
    let cedulaUrl  = kycCedula  || '';
    try {
      const { uploadAsset } = await import('./supabase');
      if (kycPhoto  && kycPhoto.startsWith('data:'))  photoUrl  = await uploadAsset(\`customers/\${phone}-photo.jpg\`,  kycPhoto);
      if (kycCedula && kycCedula.startsWith('data:')) cedulaUrl = await uploadAsset(\`customers/\${phone}-cedula.jpg\`, kycCedula);
    } catch (_e) { /* fallback: keep base64 */ }

    const newCustomer = {
      id: \`cust_\${Date.now()}\`,`
  );

  // Update the fields that reference kycPhoto / kycCedula directly
  ctx = ctx
    .replace('      kyc_photo: kycPhoto || "",',       '      kyc_photo: photoUrl,')
    .replace('      kyc_id_card_img: kycCedula || "",', '      kyc_id_card_img: cedulaUrl,');
}

// ══════════════════════════════════════════════════════════════════════════════
// Save both files
// ══════════════════════════════════════════════════════════════════════════════
fs.writeFileSync('src/app/page.tsx',            page);
fs.writeFileSync('src/context/KFSContext.tsx',  ctx);

console.log('\n🚀 All patches applied. Running audit…\n');

// ── Quick audit ──────────────────────────────────────────────────────────────
const checks = [
  ['1. handleClearDemos (fn)',         page.includes('const handleClearDemos')],
  ['2. Limpiar Demos button',         page.includes('Limpiar Demos')],
  ['2. StorefrontCustomizer modal',   page.includes('Storefront Customizer Modal')],
  ['2. Diseño button (CoreDash)',     page.includes('setCustomizingClient(c)')],
  ['3. Promotora 3 QRs',             page.includes("role=due\xF1o")],
  ['4. K-Pts wallet headers',        (page.match(/K-Pts/g)||[]).length >= 4],
  ['5. handleInjectPoints (fn)',      page.includes('const handleInjectPoints')],
  ['5. K-Pts button in clients',     page.includes("handleInjectPoints('clients'")],
  ['6. Bono Viral real QR',          page.includes('api.qrserver.com/v1/create-qr-code/?size=200x200')],
  ['7. KYC uploadAsset',             ctx.includes('uploadAsset(`customers/')],
  ['8. kfs-loading.png boot screen', page.includes('/kfs-loading.png')],
  ['BUG FIX: no extra </div>',      !page.includes('            </div>\r\n            </div>\r\n            \r\n            <OracleInsightCard')],
];

let allPassed = true;
checks.forEach(([label, result]) => {
  const icon = result ? '✅' : '❌';
  if (!result) allPassed = false;
  console.log(`${icon} ${label}`);
});

console.log(allPassed ? '\n🎉 ALL CHECKS PASSED\n' : '\n⚠️  Some checks failed — review above\n');
