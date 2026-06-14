const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Limpiar Demos (Add function and button)
const handleClearDemosFunc = `
  const handleClearDemos = () => {
    if (confirm("¿Estás seguro de eliminar todos los demos del sistema local?")) {
      setDb((prev: any) => ({
        ...prev,
        clients: prev.clients.filter((c: any) => !c.id.includes('demo')),
        promotoras: prev.promotoras.filter((p: any) => !p.id.includes('demo')),
        vendedores: prev.vendedores.filter((v: any) => !v.id.includes('demo')),
        customers: prev.customers.filter((c: any) => !c.id.includes('demo'))
      }));
      showToast('Demos eliminados correctamente.', 'success');
    }
  };
`;
if (!content.includes('handleClearDemos')) {
  content = content.replace('const [searchPromotora, setSearchPromotora] = useState("");', handleClearDemosFunc + '\n  const [customizingClient, setCustomizingClient] = useState<any>(null);\n  const [searchPromotora, setSearchPromotora] = useState("");');
}

// StorefrontCustomizer in CoreDashboard return
const storefrontModal = `
      {customizingClient && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-lg relative p-2 shadow-2xl">
            <button onClick={() => setCustomizingClient(null)} className="absolute top-4 right-4 text-gray-400 hover:text-[violet-900] transition-colors cursor-pointer z-10">
              <X size={24} />
            </button>
            <StorefrontCustomizer client={customizingClient} updateStoreSettings={(id: string, settings: any) => {
              updateStoreSettings(id, settings);
              setCustomizingClient(null);
            }} />
          </div>
        </div>
      )}
`;
content = content.replace(/(<div className="min-h-screen bg-\[#EEF2F5\] pb-24 font-sans relative">)/, '$1\n' + storefrontModal);

// StorefrontCustomizer button in Clients table
content = content.replace(/(<button onClick=\{.*handleDeleteUser\('clients', c\.id\).*?>🗑️ Perm<\/button>)/, '$1\n                              <button onClick={() => setCustomizingClient(c)} className="bg-gray-100 hover:bg-gray-200 text-[violet-900] px-3 py-1 bg-gray-50 rounded-lg ml-2 inline-block text-[10px] font-bold cursor-pointer" title="Editar Diseño">🎨 Diseño</button>');

// 2. Promotora Universal QRs
const promotoraQRs = `            <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-[2rem] p-8 relative overflow-hidden text-[violet-900]">
              <h3 className="text-xl font-black mb-4">Captación Universal KFS</h3>
              <p className="text-sm text-gray-500 mb-6">Usa tus códigos QR para reclutar comercios, vendedores y clientes a tu red neuronal KFS.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 mb-4"><Store size={24} /></div>
                  <h4 className="font-black text-lg mb-1">Dueños / Comercios</h4>
                  <p className="text-xs text-gray-500 mb-4 h-8">Cierra setups y gana el 20% residual del BOS Fee.</p>
                  <div className="w-32 h-32 bg-gray-100 rounded-xl p-2 mb-4 border-2 border-violet-600">
                    <img src={\`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=\${encodeURIComponent('https://kfs-os.vercel.app/#landing?role=dueño&ref=' + currentUser.id)}\`} alt="QR Comercio" className="w-full h-auto object-contain rounded-lg" />
                  </div>
                  <button onClick={() => { navigator.clipboard.writeText('https://kfs-os.vercel.app/#landing?role=dueño&ref=' + currentUser.id); showToast('Link Copiado', 'success'); }} className="text-xs font-bold text-violet-600 bg-violet-50 px-4 py-2 rounded-lg hover:bg-violet-100 cursor-pointer w-full transition-colors">Copiar Enlace</button>
                </div>

                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 mb-4"><Briefcase size={24} /></div>
                  <h4 className="font-black text-lg mb-1">Fuerza de Ventas</h4>
                  <p className="text-xs text-gray-500 mb-4 h-8">Invita vendedores (cajeros) y amplia el alcance de tus comercios.</p>
                  <div className="w-32 h-32 bg-gray-100 rounded-xl p-2 mb-4 border-2 border-sky-600">
                    <img src={\`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=\${encodeURIComponent('https://kfs-os.vercel.app/#landing?role=vendedor&ref=' + currentUser.id)}\`} alt="QR Vendedor" className="w-full h-auto object-contain rounded-lg" />
                  </div>
                  <button onClick={() => { navigator.clipboard.writeText('https://kfs-os.vercel.app/#landing?role=vendedor&ref=' + currentUser.id); showToast('Link Copiado', 'success'); }} className="text-xs font-bold text-sky-600 bg-sky-50 px-4 py-2 rounded-lg hover:bg-sky-100 cursor-pointer w-full transition-colors">Copiar Enlace</button>
                </div>

                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4 mt-2"><Users size={24} /></div>
                  <h4 className="font-black text-lg mb-1">Clientes / Flow Express</h4>
                  <p className="text-[10px] text-gray-500 mb-2 h-10">Bono: <span className="font-bold text-emerald-600">$1.00 USD</span> cuando recarguen sus primeros $5.00.</p>
                  <div className="w-32 h-32 bg-gray-100 rounded-xl p-2 mb-4 border-2 border-emerald-600">
                    <img src={\`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=\${encodeURIComponent('https://kfs-os.vercel.app/#landing?role=customer&ref=' + currentUser.id)}\`} alt="QR Cliente" className="w-full h-auto object-contain rounded-lg" />
                  </div>
                  <button onClick={() => { navigator.clipboard.writeText('https://kfs-os.vercel.app/#landing?role=customer&ref=' + currentUser.id); showToast('Link Copiado', 'success'); }} className="text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg hover:bg-emerald-100 cursor-pointer w-full transition-colors">Copiar Enlace</button>
                </div>
              </div>
            </div>`;

content = content.replace(/<div className="bg-\[#EEF2F5\] shadow-\[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff\] border-none rounded-\[2rem\] p-8 relative overflow-hidden text-\[violet-900\]">[\s\S]*?<h3 className="text-lg font-black mb-4">Mis Clientes Afiliados/m, promotoraQRs + '\n\n          <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-[2rem] p-8">\n            <h3 className="text-lg font-black mb-4">Mis Clientes Afiliados');

// 3. Customer Dashboard QR
const customerQR = `
              {/* Banner P2P Viral & Referral QR */}
              <div className="bg-[#1A1108]/80 border border-[violet-600]/40 p-6 rounded-[2rem] flex flex-col md:flex-row items-center gap-6">
                <div className="w-32 h-32 bg-white rounded-xl p-2 border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] flex-shrink-0">
                  <img src={\`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=\${encodeURIComponent('https://kfs-os.vercel.app/#landing?role=customer&ref=' + currentUser.id)}\`} alt="QR Afiliado" className="w-full h-auto object-contain rounded-lg" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <Gift size={20} className="text-emerald-500" />
                    <h4 className="font-black text-white text-lg">Bono Viral Embajador</h4>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed mb-4">
                    Comparte tu código o pide que escaneen este QR. ¡Cuando tu referido se registre y haga su primera recarga de $5.00, recibirás <strong>500 K-Points ($0.50)</strong> automáticos en tu billetera!
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <span className="font-mono bg-black/80 px-3 py-1.5 rounded-lg text-emerald-400 font-bold border border-emerald-500/30">ID: {currentUser.id}</span>
                    <button onClick={() => { navigator.clipboard.writeText('https://kfs-os.vercel.app/#landing?role=customer&ref=' + currentUser.id); showToast('Link de Referido Copiado', 'success'); }} className="text-xs font-bold text-white bg-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-500 cursor-pointer transition-colors">
                      Copiar Enlace
                    </button>
                  </div>
                </div>
              </div>
`;

content = content.replace(/{\/\* Banner P2P Viral \*\/}?<div className="bg-\[#1A1108\]\/80 border border-\[violet-600\]\/40 p-4 rounded-2xl flex items-center gap-4">[\s\S]*?<\/div>\s*<\/div>/, customerQR);

fs.writeFileSync('src/app/page.tsx', content);
