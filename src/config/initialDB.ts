import { KFS_BRAND } from "./brandConfig";

export const CURRENT_WIPE_VERSION = 10;

export const initialDB = {
  clients: [
    {
      id: "kfs-express",
      company: "Arquitecto Axis Points Reward",
      email: "arquitecto@kfs.com",
      password: "05c7a8802c74b9f7ed07821d82015d1178ca3e5ed1e708bb5246ec01f635b7a6", // Hash for '000'
      address: `Soporte Central ${KFS_BRAND.productAcronym}`,
      rating: 5.0,
      reviewCount: 0,
      kfsFeePercentage: 0.01,
      fee_tier: "1%",
      is_founder: true,
      kfsFeesOwedUSD: 0,
      isOnboarded: true,
      walletBalanceUSD: 0,
      salesUSD: 0,
      subscription: {
        plan_type: 'contract_b2b_chacao',
        monthly_fee_usd: 100.00,
        contract_duration_days: 90,
        billing_day_of_month: 5,
        contract_start_date: new Date().toISOString(),
        contract_end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        is_trial_active: true,
        payment_status: 'settled',
        cancellation_pending: false,
        status: 'active'
      },
      storeSettings: {
        bioText: "En esta tienda podrás canjear tus Axis Points. Mira todo lo que tenemos para ti",
        themeColor: "#C5A184",
        typography: "font-sans",
        layoutType: "grid",
        profilePicUrl: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png"
      }
    }
  ] as any[],
  vendedores: [] as any[],
  products: [
    {
      id: "prod_dig_1",
      name: "Curso Express",
      image: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=500&auto=format&fit=crop&q=60",
      stock: 9998,
      costUSD: 0,
      category: "Servicios",
      clientId: "kfs-express",
      priceUSD: 0.5,
      description: "Aprende los fundamentos del float financiero y la liquidez prepagada en 15 minutos."
    },
    {
      id: "prod_dig_2",
      name: "Plantillas Legales SENIAT (B2B)",
      image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=500&auto=format&fit=crop&q=60",
      stock: 9999,
      costUSD: 0,
      category: "Servicios",
      clientId: "kfs-express",
      priceUSD: 5,
      description: "Contratos de co-pago y formatos de facturación fiscal listos para imprimir y usar."
    },
    {
      id: "prod_dig_3",
      name: "Asesoría 1-a-1 Kreatek",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&auto=format&fit=crop&q=60",
      stock: 9999,
      costUSD: 0,
      category: "Servicios",
      clientId: "kfs-express",
      priceUSD: 8,
      description: "Sesión estratégica remota con un asesor especializado en escalamiento y optimización de caja."
    },
    {
      id: "prod_dig_4",
      name: "Modelo IA + Guía de Negocio",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=60",
      stock: 9999,
      costUSD: 0,
      category: "Servicios",
      clientId: "kfs-express",
      priceUSD: 10,
      description: "Script generativo de IA para descripciones de tienda e integraciones de API BCV."
    },
    {
      id: "prod_dig_5",
      name: "Asesoría con CEO y Fundador",
      image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=500&auto=format&fit=crop&q=60",
      stock: 9999,
      costUSD: 0,
      category: "Servicios",
      clientId: "kfs-express",
      priceUSD: 30,
      description: "Reunión ejecutiva para evaluar la visión, escalabilidad y oportunidades de tu negocio directamente con el CEO."
    },
    {
      id: "prod_dig_6",
      name: "20 Diseños para Marketing",
      image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&auto=format&fit=crop&q=60",
      stock: 9999,
      costUSD: 0,
      category: "Servicios",
      clientId: "kfs-express",
      priceUSD: 25,
      description: "Paquete de 20 diseños gráficos premium adaptados a tu marca para redes sociales y campañas publicitarias."
    },
    {
      id: "prod_dig_7",
      name: "8 Reels Profesionales",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&auto=format&fit=crop&q=60",
      stock: 9999,
      costUSD: 0,
      category: "Servicios",
      clientId: "kfs-express",
      priceUSD: 90,
      description: "Creación, edición y montaje de 8 Reels/TikToks dinámicos enfocados en conversión y viralidad."
    },
    {
      id: "prod_dig_8",
      name: "5 Pautas Publicitarias (Grabación y Edición)",
      image: "https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?w=500&auto=format&fit=crop&q=60",
      stock: 9999,
      costUSD: 0,
      category: "Servicios",
      clientId: "kfs-express",
      priceUSD: 300,
      description: "Producción completa de 5 pautas publicitarias de alto impacto con equipo profesional (grabación y edición incluidas)."
    }
  ] as any[],
  transactions: [] as any[],
  orders: [] as any[],
  expenses: [] as any[],
  crm: [] as any[],
  vales: [] as any[],
  posTerminals: [] as any[],
  zReports: [] as any[],
  blindAudits: [] as any[],
  buyers: [] as any[],
  customers: [] as any[],
  kreatekCore: {
    totalTransactions: 0,
    earningsEUR: 0,
    netEarningsEUR: 0,
    adBudgetEUR: 0,
    wipeVersion: CURRENT_WIPE_VERSION,
    team: [
      {
        name: "Ivory21",
        password: "Ivory21",
        permissions: ["panel", "soporte", "kyc", "vista_dios", "db_manager", "tienda_oficial", "red", "auditoria", "nodos", "axis_nitro_pos", "equipo"]
      },
      {
        name: "gaby21",
        password: "gaby21",
        permissions: ["red", "auditoria", "nodos", "axis_nitro_pos", "db_manager", "soporte"]
      },
      {
        name: "valle21.",
        password: "valle21.",
        permissions: ["axis_nitro_pos", "nodos", "db_manager", "red", "soporte", "auditoria"]
      }
    ]
  },
  promotoras: [] as any[],
  riders: [] as any[],
  coupons: [] as any[],
  fiscalLogs: [] as any[],
  rewardTasks: [
    {
      id: "task_starter_1",
      title: "Escaneo QR en Tienda Axis Nitro",
      description: "Visita un comercio afiliado de la red Axis Nitro y escanea el código QR del punto de venta.",
      pointsReward: 250,
      category: "SCAN_QR",
      verificationType: "AUTOMATIC_QR",
      status: "ACTIVE",
      targetAudience: "ALL",
      requirements: "Escanear el QR físico en el comercio",
      qrCodeSecret: "AXIS-NITRO-OFFICIAL-STORE-QR",
      createdAt: new Date().toISOString(),
      createdBy: "System Core"
    },
    {
      id: "task_starter_2",
      title: "Check-in Presencial por GPS",
      description: "Confirma tu visita presencial a uno de los comercios afiliados verificando tu ubicación GPS.",
      pointsReward: 150,
      category: "VISIT_MERCHANT",
      verificationType: "LOCATION_GPS",
      status: "ACTIVE",
      targetAudience: "ALL",
      requirements: "Ubicación GPS a menos de 50 metros",
      createdAt: new Date().toISOString(),
      createdBy: "System Core"
    },
    {
      id: "task_starter_3",
      title: "Subida de Comprobante de Compra",
      description: "Realiza una compra superior a $5 en cualquier comercio KFS y sube la foto de tu factura.",
      pointsReward: 500,
      category: "BUY_PRODUCT",
      verificationType: "RECEIPT_UPLOAD",
      status: "ACTIVE",
      targetAudience: "CUSTOMERS",
      requirements: "Adjuntar foto clara del ticket de compra",
      createdAt: new Date().toISOString(),
      createdBy: "System Core"
    }
  ] as any[],
  rewardSubmissions: [] as any[],
  notifications: [
    {
      id: "notif_welcome_1",
      audience: "all",
      title: "🚀 Bienvenido al Ecosistema KFS OS",
      message: "Sistema en vivo con arquitectura telemétrica, Bóveda Financiera y conciliación automática activa.",
      date: new Date().toISOString(),
      destType: "none"
    },
    {
      id: "notif_bcv_2",
      audience: "all",
      title: "📊 Cotización Oficial BCV Sincronizada",
      message: "Las tasas de cambio oficiales están calibradas en tiempo real para todos los puntos de venta y cobros.",
      date: new Date().toISOString(),
      destType: "none"
    }
  ] as any[]
};
