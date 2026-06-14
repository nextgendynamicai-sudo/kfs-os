const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Add handleInjectPoints in CoreDashboard
const injectPointsFunc = `
  const handleInjectPoints = (collection: string, id: string) => {
    const amount = prompt("Cantidad de KFS Points a inyectar a este usuario (ej: 500 = $0.50 USD):", "500");
    if (amount && !isNaN(Number(amount))) {
      const numAmount = parseInt(amount, 10);
      setDb((prev: any) => ({
        ...prev,
        [collection]: prev[collection].map((u: any) => u.id === id ? { ...u, kfsPoints: (u.kfsPoints || 0) + numAmount } : u)
      }));
      showToast('KFS Points Inyectados Exitosamente', 'success');
      import('../context/supabase').then(({ supabase }) => {
        if (supabase) {
          supabase.rpc('increment_kfs_points', { target_id: id, amount: numAmount }).catch(() => {});
        }
      });
    }
  };
`;

content = content.replace('const handleClearDemos = () => {', injectPointsFunc + '\\n  const handleClearDemos = () => {');

// Add "🎁 K-Pts" button in Promotoras
content = content.replace(/(<button onClick=\{() => handleDeleteUser\('promotoras', p.id\)\} className="text-red-500 hover:text-white font-bold px-3 py-1 bg-red-50 hover:bg-red-500 rounded-lg ml-2.*?>🗑️<\/button>)/g, 
  '$1<button onClick={() => handleInjectPoints("promotoras", p.id)} className="text-orange-500 hover:text-white font-bold px-3 py-1 bg-orange-50 hover:bg-orange-500 rounded-lg ml-2 inline-block text-[10px]" title="Regalar KFS Points">🎁 K-Pts</button>'
);

// Add "🎁 K-Pts" button in Clients
content = content.replace(/(<button onClick=\{() => handleDeleteUser\('clients', c.id\)\} className="text-red-500 hover:text-white font-bold px-3 py-1 bg-red-50 hover:bg-red-500 rounded-lg ml-2.*?<\/button>)/g, 
  '$1<button onClick={() => handleInjectPoints("clients", c.id)} className="text-orange-500 hover:text-white font-bold px-3 py-1 bg-orange-50 hover:bg-orange-500 rounded-lg ml-2 inline-block text-[10px]" title="Regalar KFS Points">🎁 K-Pts</button>'
);

// Add "🎁 K-Pts" button in Vendedores
content = content.replace(/(<button onClick=\{() => handleDeleteUser\('vendedores', vend.id\)\} className="text-red-500 hover:text-white font-bold px-3 py-1 bg-red-50 hover:bg-red-500 rounded-lg ml-2.*?<\/button>)/g, 
  '$1<button onClick={() => handleInjectPoints("vendedores", vend.id)} className="text-orange-500 hover:text-white font-bold px-3 py-1 bg-orange-50 hover:bg-orange-500 rounded-lg ml-2 inline-block text-[10px]" title="Regalar KFS Points">🎁 K-Pts</button>'
);

fs.writeFileSync('src/app/page.tsx', content);
