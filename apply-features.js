/**
 * apply-features.js
 * Applies all 8 features to page.tsx and KFSContext.tsx without corrupting the file.
 * Run with: bun apply-features.js
 */
const fs = require('fs');

// ─────────────────────────────────────────────────────────────────────────────
// page.tsx changes
// ─────────────────────────────────────────────────────────────────────────────
let page = fs.readFileSync('src/app/page.tsx', 'utf8');

// ── FEATURE 1: Add handleClearDemos + handleInjectPoints + customizingClient state
//    Insert right after handleWipeDatabase closing brace in CoreDashboard
const wipeEndMarker = `  const [activeModal, setActiveModal] = useState<string | null>(null);`;
const wipeEndReplacement = `
  const [customizingClient, setCustomizingClient] = useState<any>(null);

  const handleClearDemos = () => {
    if (confirm("¿Estás seguro de eliminar todos los usuarios de demo del sistema?")) {
      setDb((prev: any) => ({
        ...prev,
        clients: prev.clients.filter((c: any) => !c.id.includes('demo')),
        promotoras: prev.promotoras.filter((p: any) => !p.id.includes('demo')),
        vendedores: prev.vendedores.filter((v: any) => !v.id.includes('demo')),
        customers: prev.customers.filter((c: any) => !c.id.includes('demo'))
      }));
      showToast('✅ Demos eliminados correctamente.', 'success');
    }
  };

  const handleInjectPoints = (collection: string, id: string) => {
    const amount = prompt("Cantidad de KFS Points a inyectar (ej: 500 = $0.50 USD):", "500");
    if (amount && !isNaN(Number(amount))) {
      const numAmount = parseInt(amount, 10);
      setDb((prev: any) => ({
        ...prev,
        [collection]: prev[collection].map((u: any) =>
          u.id === id ? { ...u, kfsPoints: (u.kfsPoints || 0) + numAmount } : u
        )
      }));
      showToast(\`🎁 \${numAmount} KFS Points inyectados exitosamente.\`, 'success');
    }
  };

  const [activeModal, setActiveModal] = useState<string | null>(null);`;

if (!page.includes('handleClearDemos')) {
  page = page.replace(wipeEndMarker, wipeEndReplacement);
  console.log('✅ Feature 1: handleClearDemos + handleInjectPoints injected');
} else {
  console.log('⏭️  Feature 1: Already present');
}

// ── FEATURE 2: Add 🗑️ Limpiar Demos button in auditoria grid (next to Wipe DB)
const wipeBtnMarker = `              <button onClick={handleWipeDatabase} className="bg-red-100 border border-red-200 hover:bg-red-200 p-6 rounded-2xl flex flex-col items-center gap-3 transition-colors group cursor-pointer">
                <div className="bg-red-600 text-white p-3 rounded-xl group-hover:scale-110 transition-transform"><Shield size={24} /></div>
                <span className="font-black text-red-700 text-sm text-center font-bold">Puesta a Cero (Wipe DB)</span>
              </button>`;
const wipeBtnReplacement = `              <button onClick={handleWipeDatabase} className="bg-red-100 border border-red-200 hover:bg-red-200 p-6 rounded-2xl flex flex-col items-center gap-3 transition-colors group cursor-pointer">
                <div className="bg-red-600 text-white p-3 rounded-xl group-hover:scale-110 transition-transform"><Shield size={24} /></div>
                <span className="font-black text-red-700 text-sm text-center font-bold">Puesta a Cero (Wipe DB)</span>
              </button>
              <button onClick={handleClearDemos} className="bg-orange-50 border border-orange-200 hover:bg-orange-100 p-6 rounded-2xl flex flex-col items-center gap-3 transition-colors group cursor-pointer">
                <div className="bg-orange-500 text-white p-3 rounded-xl group-hover:scale-110 transition-transform"><Trash2 size={24} /></div>
                <span className="font-black text-orange-700 text-sm text-center font-bold">🗑️ Limpiar Demos</span>
              </button>`;

if (!page.includes('Limpiar Demos')) {
  if (page.includes(wipeBtnMarker)) {
    page = page.replace(wipeBtnMarker, wipeBtnReplacement);
    console.log('✅ Feature 2: Limpiar Demos button added');
  } else {
    console.log('⚠️  Feature 2: Could not find wipe button marker');
  }
} else {
  console.log('⏭️  Feature 2: Already present');
}

// ── FEATURE 3: Add 🎨 Diseño + 🎁 K-Pts buttons in CoreDashboard clients table
//    Target: after the 💬 Cobro WA button in the client actions
const cobroWAMarker = `                              }} className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg font-bold text-[10px] hover:bg-green-200 transition-colors cursor-pointer inline-flex items-center gap-1">
                                💬 Cobro WA
                              </button>
                            </div>
                          </td>`;

const cobroWAReplacement = `                              }} className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg font-bold text-[10px] hover:bg-green-200 transition-colors cursor-pointer inline-flex items-center gap-1">
                                💬 Cobro WA
                              </button>

                              <button onClick={() => handleInjectPoints('clients', c.id)} className="bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg font-bold text-[10px] hover:bg-amber-200 transition-colors cursor-pointer inline-flex items-center gap-1 shadow-sm" title="Inyectar KFS Points">
                                🎁 K-Pts
                              </button>

                              <button onClick={() => setCustomizingClient(c)} className="bg-violet-100 text-violet-700 border border-violet-200 px-3 py-1.5 rounded-lg font-bold text-[10px] hover:bg-violet-200 transition-colors cursor-pointer inline-flex items-center gap-1 shadow-sm" title="Editar Diseño Tienda">
                                🎨 Diseño
                              </button>
                            </div>
                          </td>`;

if (!page.includes('handleInjectPoints(\'clients\', c.id)')) {
  if (page.includes(cobroWAMarker)) {
    page = page.replace(cobroWAMarker, cobroWAReplacement);
    console.log('✅ Feature 3: 🎁 K-Pts + 🎨 Diseño buttons added to clients table');
  } else {
    console.log('⚠️  Feature 3: Could not find CobroWA marker');
  }
} else {
  console.log('⏭️  Feature 3: Already present');
}

// ── FEATURE 4: Add StorefrontCustomizer modal in CoreDashboard return()
//    Insert before the final closing </div> of CoreDashboard
const coreReturnEnd = `      {activeModal === 'product' && (`;
const coreReturnEndReplacement = `      {/* Storefront Customizer Modal (Arquitecto) */}
      {customizingClient && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setCustomizingClient(null)}>
          <div className="bg-white rounded-[2rem] w-full max-w-lg relative p-2 shadow-2xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setCustomizingClient(null)} className="absolute top-4 right-4 text-gray-400 hover:text-violet-900 transition-colors cursor-pointer z-10">
              <X size={24} />
            </button>
            <StorefrontCustomizer
              client={customizingClient}
              updateStoreSettings={(id: string, settings: any) => {
                updateStoreSettings(id, settings);
                setCustomizingClient(null);
                showToast('✅ Diseño de tienda actualizado.', 'success');
              }}
            />
          </div>
        </div>
      )}

      {activeModal === 'product' && (`;

if (!page.includes('Storefront Customizer Modal (Arquitecto)')) {
  if (page.includes(coreReturnEnd)) {
    page = page.replace(coreReturnEnd, coreReturnEndReplacement);
    console.log('✅ Feature 4: StorefrontCustomizer modal added to CoreDashboard');
  } else {
    console.log('⚠️  Feature 4: Could not find activeModal product marker');
  }
} else {
  console.log('⏭️  Feature 4: Already present');
}

// ── FEATURE 5: Need updateStoreSettings in CoreDashboard useKFS destructure
const coreUseKFS = `const { impersonateClient, registerClient, assignPromotoraToClient, addGlobalProduct, sendNotification, replyTicket, closeTicket, blockClient, releaseClient, deleteClient, approveUnlock, rejectUnlock, approveCandidateRegistration, rejectCandidateRegistration, toggleCandidateBacking, approveRider, rejectRider, assignRiderToBusiness, removeRiderFromBusiness, validateTopUp, rates, updateBcvRates, transferKFSPoints } = useKFS() as any;`;
const coreUseKFSReplacement = `const { impersonateClient, registerClient, assignPromotoraToClient, addGlobalProduct, sendNotification, replyTicket, closeTicket, blockClient, releaseClient, deleteClient, approveUnlock, rejectUnlock, approveCandidateRegistration, rejectCandidateRegistration, toggleCandidateBacking, approveRider, rejectRider, assignRiderToBusiness, removeRiderFromBusiness, validateTopUp, rates, updateBcvRates, transferKFSPoints, updateStoreSettings } = useKFS() as any;`;

if (!page.includes('updateStoreSettings } = useKFS()')) {
  page = page.replace(coreUseKFS, coreUseKFSReplacement);
  console.log('✅ Feature 5: updateStoreSettings added to CoreDashboard destructure');
} else {
  console.log('⏭️  Feature 5: Already present');
}

// ── FEATURE 6: Upgrade Bono Viral Embajador to show real QR in CustomerDashboard
const bonoViralOld = `              {/* Banner P2P Viral */}
              <div className="bg-[#1A1108]/80 border border-[violet-600]/40 p-4 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 bg-[violet-600]/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Gift size={24} className="text-[violet-600]" />
                </div>
                <div>
                  <h4 className="font-black text-[violet-600] text-sm">Bono Viral Embajador</h4>
                  <p className="text-xs text-gray-300 leading-tight mt-1">
                    Comparte tu código de afiliado <span className="font-mono bg-black/50 px-1.5 py-0.5 rounded text-white">{currentUser.id}</span> con tus amigos. ¡Cuando se registren y hagan su primera recarga, recibirás <strong>500 K-Points</strong> automáticos!
                  </p>
                </div>
              </div>`;

const bonoViralNew = `              {/* Bono Viral Embajador con QR Real */}
              <div className="bg-[#1A1108]/80 border border-emerald-500/40 p-5 rounded-[1.5rem] flex flex-col sm:flex-row items-center gap-5">
                <div className="w-28 h-28 bg-white rounded-xl p-1.5 border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] flex-shrink-0">
                  <img
                    src={\`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=\${encodeURIComponent('https://kfs-os.vercel.app?role=customer&ref=' + currentUser.id)}\`}
                    alt="QR Referido"
                    className="w-full h-full object-contain rounded-lg"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <Gift size={18} className="text-emerald-400" />
                    <h4 className="font-black text-white text-base">Bono Viral Embajador</h4>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed mb-3">
                    Comparte tu QR o enlace. Cuando tu referido se registre y haga su primera recarga de <strong className="text-emerald-400">$5.00+</strong>, recibirás <strong className="text-emerald-400">500 K-Points ($0.50)</strong> automáticos en tu billetera.
                  </p>
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <span className="font-mono bg-black/70 border border-emerald-500/30 px-2 py-1 rounded-lg text-emerald-400 text-xs font-bold">ID: {currentUser.id}</span>
                    <button
                      onClick={() => { navigator.clipboard.writeText('https://kfs-os.vercel.app?role=customer&ref=' + currentUser.id); showToast('📋 Enlace copiado al portapapeles', 'success'); }}
                      className="text-[10px] font-black text-white bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                    >
                      📋 Copiar Enlace
                    </button>
                  </div>
                </div>
              </div>`;

if (!page.includes('api.qrserver.com/v1/create-qr-code/?size=200x200')) {
  if (page.includes(bonoViralOld)) {
    page = page.replace(bonoViralOld, bonoViralNew);
    console.log('✅ Feature 6: Bono Viral QR upgraded with real QR image');
  } else {
    console.log('⚠️  Feature 6: Could not find Bono Viral old widget');
  }
} else {
  console.log('⏭️  Feature 6: Already present');
}

// ── FEATURE 7: Loading screen - replace KreatekLogo with kfs-loading.png
const loadingOld = `          <KreatekLogo className="h-28 sm:h-32 w-auto animate-pulse mb-8" />`;
const loadingNew = `          <img src="/kfs-loading.png" className="h-28 sm:h-32 w-auto animate-pulse mb-8 object-contain" alt="KFS OS" />`;

if (!page.includes('kfs-loading.png')) {
  if (page.includes(loadingOld)) {
    page = page.replace(loadingOld, loadingNew);
    console.log('✅ Feature 7: Loading screen logo replaced with kfs-loading.png');
  } else {
    console.log('⚠️  Feature 7: Could not find loading logo marker');
  }
} else {
  console.log('⏭️  Feature 7: Already present');
}

// Save page.tsx
fs.writeFileSync('src/app/page.tsx', page);
console.log('\n✅ page.tsx saved.');

// ─────────────────────────────────────────────────────────────────────────────
// KFSContext.tsx changes
// ─────────────────────────────────────────────────────────────────────────────
let ctx = fs.readFileSync('src/context/KFSContext.tsx', 'utf8');

// ── FEATURE 8: KYC uploadAsset in registerCustomer
if (!ctx.includes('uploadAsset(`customers/')) {
  const kycOld = `    const newCustomer = {
      id: \`cust_\${Date.now()}\`,
      phone,
      password: hashPassword(password),
      name,
      real_balance: 0,
      k_points_balance: 0,
      k_points_expiry: null,
      referred_by_promoter_id,
      referred_by_merchant_id,
      referred_by_customer_id,
      kyc_photo: kycPhoto || "",
      kyc_id_card_img: kycCedula || "",
      kyc_address: kycAddress || "",
      kyc_status: "verified",
      createdAt: new Date().toISOString()
    };`;

  const kycNew = `    // Upload KYC assets to Supabase Storage
    let photoUrl = kycPhoto || "";
    let cedulaUrl = kycCedula || "";
    try {
      const { uploadAsset } = await import('./supabase');
      if (kycPhoto && kycPhoto.startsWith('data:')) {
        photoUrl = await uploadAsset(\`customers/\${phone}-photo.jpg\`, kycPhoto);
      }
      if (kycCedula && kycCedula.startsWith('data:')) {
        cedulaUrl = await uploadAsset(\`customers/\${phone}-cedula.jpg\`, kycCedula);
      }
    } catch (e) {
      console.warn("[KYC Upload] Fallo subiendo fotos, guardando base64 local:", e);
    }

    const newCustomer = {
      id: \`cust_\${Date.now()}\`,
      phone,
      password: hashPassword(password),
      name,
      real_balance: 0,
      k_points_balance: 0,
      k_points_expiry: null,
      referred_by_promoter_id,
      referred_by_merchant_id,
      referred_by_customer_id,
      kyc_photo: photoUrl,
      kyc_id_card_img: cedulaUrl,
      kyc_address: kycAddress || "",
      kyc_status: "verified",
      createdAt: new Date().toISOString()
    };`;

  if (ctx.includes(kycOld)) {
    ctx = ctx.replace(kycOld, kycNew);
    console.log('✅ Feature 8: KYC uploadAsset injected in registerCustomer');
  } else {
    console.log('⚠️  Feature 8: Could not find newCustomer marker in KFSContext');
  }
} else {
  console.log('⏭️  Feature 8: Already present');
}

// Save KFSContext.tsx
fs.writeFileSync('src/context/KFSContext.tsx', ctx);
console.log('✅ KFSContext.tsx saved.');

console.log('\n🚀 All features applied. Now run: bun run build');
