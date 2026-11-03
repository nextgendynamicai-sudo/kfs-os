// src/config/demoCommerceDB.ts
// Datos de Demostración Completa 100% Offline para Venta a Comercios

export const DEMO_COMMERCE_ID = "demo-comercio-kfs";

export const DEMO_COMMERCE_CLIENT = {
  id: DEMO_COMMERCE_ID,
  company: "Bodegón & Market Gourmet Caracas",
  email: "comercio@demo.com",
  password: "05c7a8802c74b9f7ed07821d82015d1178ca3e5ed1e708bb5246ec01f635b7a6", // Hash de '000'
  rif: "J-40819284-1",
  phone: "0412-5551234",
  address: "Av. Francisco de Miranda, Edif. Parque Cristal, Nivel C1, Chacao, Caracas",
  rating: 4.95,
  reviewCount: 184,
  kfsFeePercentage: 0.01,
  fee_tier: "1%",
  is_founder: true,
  kfsFeesOwedUSD: 0,
  isOnboarded: true,
  mustChangePassword: false,
  requirePasswordChangeOnFirstLogin: false,
  hasCompletedOnboardingTour: true,
  walletBalanceUSD: 1420.50,
  salesUSD: 1845.50,
  business_preset: "RETAIL-QUICK",
  deliveryRadiusKm: 12,
  subscription: {
    plan_type: "contract_b2b_chacao",
    monthly_fee_usd: 100.00,
    contract_duration_days: 90,
    billing_day_of_month: 5,
    contract_start_date: new Date(Date.now() - 30 * 86400000).toISOString(),
    contract_end_date: new Date(Date.now() + 60 * 86400000).toISOString(),
    is_trial_active: false,
    payment_status: "settled",
    cancellation_pending: false,
    status: "active"
  },
  storeSettings: {
    bioText: "Tu market gourmet favorito en Caracas. Víveres nacionales e importados, delicateses, licores y despacho express.",
    themeColor: "#8B5CF6",
    typography: "font-sans",
    layoutType: "grid",
    profilePicUrl: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=60",
    bannerUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80",
    isOpen: true
  },
  paymentMethods: {
    pagoMovil: { enabled: true, bank: "Banesco (0134)", phone: "0412-5551234", idCard: "J-408192841" },
    zelle: { enabled: true, email: "pagos@bodegongourmet.com", holder: "Bodegon Gourmet Caracas LLC" },
    cashUSD: { enabled: true },
    cashBS: { enabled: true },
    posBancario: { enabled: true, terminal: "Bancamiga Dual Biopago" },
    vales: { enabled: true }
  }
};

export const DEMO_COMMERCE_PRODUCTS = [
  {
    id: "prod_demo_01",
    barcode: "7591006000016",
    name: "Harina PAN Blanca (1kg)",
    priceUSD: 1.25,
    costUSD: 0.95,
    stock: 48,
    category: "Alimentos",
    brand: "Alimentos Polar",
    clientId: DEMO_COMMERCE_ID,
    imgUrl: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&auto=format&fit=crop&q=60",
    description: "Harina de maíz blanco precocida tradicional, infaltable en los hogares venezolanos.",
    isFeatured: true
  },
  {
    id: "prod_demo_02",
    barcode: "7591005000574",
    name: "Margarina Mavesa Común (500g)",
    priceUSD: 1.80,
    costUSD: 1.40,
    stock: 32,
    category: "Alimentos",
    brand: "Alimentos Polar",
    clientId: DEMO_COMMERCE_ID,
    imgUrl: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=60",
    description: "Margarina suave con sal tradicional venezolana, perfecta para untar.",
    isFeatured: true
  },
  {
    id: "prod_demo_03",
    barcode: "7591005001151",
    name: "Mayonesa Mavesa Tradicional (445g)",
    priceUSD: 2.30,
    costUSD: 1.80,
    stock: 24,
    category: "Alimentos",
    brand: "Alimentos Polar",
    clientId: DEMO_COMMERCE_ID,
    imgUrl: "https://images.unsplash.com/photo-1571266028243-e4bb33394de9?w=500&auto=format&fit=crop&q=60",
    description: "Mayonesa cremosa de sabor balanceado para ensaladas y snacks.",
    isFeatured: false
  },
  {
    id: "prod_demo_04",
    barcode: "7591001000219",
    name: "Malta Polar Botella (250ml)",
    priceUSD: 0.90,
    costUSD: 0.65,
    stock: 60,
    category: "Bebidas",
    brand: "Cervecería Polar",
    clientId: DEMO_COMMERCE_ID,
    imgUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=60",
    description: "Bebida a base de malta de cebada, nutritiva y refrescante.",
    isFeatured: true
  },
  {
    id: "prod_demo_05",
    barcode: "7591001000110",
    name: "Cerveza Polar Pilsen (Tercio 295ml)",
    priceUSD: 1.10,
    costUSD: 0.80,
    stock: 72,
    category: "Bebidas",
    brand: "Cervecería Polar",
    clientId: DEMO_COMMERCE_ID,
    imgUrl: "https://images.unsplash.com/photo-1608270176050-12ec0f24ee3d?w=500&auto=format&fit=crop&q=60",
    description: "Cerveza tipo pilsen tradicional, bien fría.",
    isFeatured: true
  },
  {
    id: "prod_demo_06",
    barcode: "7591395000147",
    name: "Pirulin Original (Lata 190g)",
    priceUSD: 4.50,
    costUSD: 3.50,
    stock: 18,
    category: "Dulces",
    brand: "Nucita Venezolana",
    clientId: DEMO_COMMERCE_ID,
    imgUrl: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500&auto=format&fit=crop&q=60",
    description: "Barquillas crujientes rellenas de crema de chocolate y avellanas.",
    isFeatured: true
  },
  {
    id: "prod_demo_07",
    barcode: "7591016205722",
    name: "Galleta Savoy Cocosette (50g)",
    priceUSD: 0.85,
    costUSD: 0.60,
    stock: 45,
    category: "Dulces",
    brand: "Nestlé Savoy",
    clientId: DEMO_COMMERCE_ID,
    imgUrl: "https://images.unsplash.com/photo-1558961312-503d216d5813?w=500&auto=format&fit=crop&q=60",
    description: "Galleta wafer crujiente rellena con crema de coco natural.",
    isFeatured: false
  },
  {
    id: "prod_demo_08",
    barcode: "7591016205708",
    name: "Galleta Savoy Susy (50g)",
    priceUSD: 0.85,
    costUSD: 0.60,
    stock: 45,
    category: "Dulces",
    brand: "Nestlé Savoy",
    clientId: DEMO_COMMERCE_ID,
    imgUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=60",
    description: "Galleta wafer crujiente rellena con suave crema de chocolate.",
    isFeatured: false
  },
  {
    id: "prod_demo_09",
    barcode: "7591016035251",
    name: "Chocolate Savoy con Leche (130g)",
    priceUSD: 2.20,
    costUSD: 1.65,
    stock: 30,
    category: "Dulces",
    brand: "Nestlé Savoy",
    clientId: DEMO_COMMERCE_ID,
    imgUrl: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=500&auto=format&fit=crop&q=60",
    description: "Auténtico chocolate venezolano con leche, con el sabor tradicional Savoy.",
    isFeatured: true
  },
  {
    id: "prod_demo_10",
    barcode: "7591016035404",
    name: "Bombón Savoy Toronto (Bolsa 36u)",
    priceUSD: 5.80,
    costUSD: 4.50,
    stock: 14,
    category: "Dulces",
    brand: "Nestlé Savoy",
    clientId: DEMO_COMMERCE_ID,
    imgUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60",
    description: "Avellana entera tostada envuelta en chocolate suave y bañada en chocolate con leche.",
    isFeatured: true
  },
  {
    id: "prod_demo_11",
    barcode: "7591005001229",
    name: "Queso Fundido Rikesa Cheddar (300g)",
    priceUSD: 2.60,
    costUSD: 2.00,
    stock: 22,
    category: "Alimentos",
    brand: "Alimentos Polar",
    clientId: DEMO_COMMERCE_ID,
    imgUrl: "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=500&auto=format&fit=crop&q=60",
    description: "Queso fundido para untar tipo cheddar, el clásico de las meriendas.",
    isFeatured: false
  },
  {
    id: "prod_demo_12",
    barcode: "7591041000675",
    name: "Queso Fundido Cheez Whiz (300g)",
    priceUSD: 3.20,
    costUSD: 2.50,
    stock: 18,
    category: "Alimentos",
    brand: "Kraft",
    clientId: DEMO_COMMERCE_ID,
    imgUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=60",
    description: "Salsa de queso fundido original Kraft, deliciosa y cremosa.",
    isFeatured: false
  },
  {
    id: "prod_demo_13",
    barcode: "7591005002042",
    name: "Toddy Chocolate en Polvo (400g)",
    priceUSD: 3.90,
    costUSD: 3.00,
    stock: 20,
    category: "Bebidas",
    brand: "Alimentos Polar",
    clientId: DEMO_COMMERCE_ID,
    imgUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=60",
    description: "Bebida chocolatada fortificada en polvo de sabor inconfundible.",
    isFeatured: true
  },
  {
    id: "prod_demo_14",
    barcode: "7591018000547",
    name: "Salsa de Tomate Pampero (397g)",
    priceUSD: 1.50,
    costUSD: 1.10,
    stock: 28,
    category: "Alimentos",
    brand: "Pampero",
    clientId: DEMO_COMMERCE_ID,
    imgUrl: "https://images.unsplash.com/photo-1595855759920-86582396756a?w=500&auto=format&fit=crop&q=60",
    description: "Salsa de tomate tipo ketchup tradicional de tomates seleccionados.",
    isFeatured: false
  },
  {
    id: "prod_demo_15",
    barcode: "7591642000678",
    name: "Arroz Mary Dorado Extra (1kg)",
    priceUSD: 1.45,
    costUSD: 1.15,
    stock: 40,
    category: "Alimentos",
    brand: "Alimentos Mary",
    clientId: DEMO_COMMERCE_ID,
    imgUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=60",
    description: "Arroz blanco de grano entero seleccionado, rinde más y no se pasa.",
    isFeatured: true
  },
  {
    id: "prod_demo_16",
    barcode: "7591024001019",
    name: "Café Molido Fama de América (250g)",
    priceUSD: 2.40,
    costUSD: 1.90,
    stock: 35,
    category: "Alimentos",
    brand: "Fama de América",
    clientId: DEMO_COMMERCE_ID,
    imgUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60",
    description: "Café tostado y molido de aroma intenso y cuerpo balanceado.",
    isFeatured: true
  },
  {
    id: "prod_demo_17",
    barcode: "7591006001044",
    name: "Pasta Primor Spaghetti (1kg)",
    priceUSD: 1.60,
    costUSD: 1.20,
    stock: 36,
    category: "Alimentos",
    brand: "Alimentos Polar",
    clientId: DEMO_COMMERCE_ID,
    imgUrl: "https://images.unsplash.com/photo-1612966608997-30d211b2e1c4?w=500&auto=format&fit=crop&q=60",
    description: "Pasta larga 100% sémola de trigo durum, textura al dente perfecta.",
    isFeatured: false
  },
  {
    id: "prod_demo_18",
    barcode: "7591060000120",
    name: "Diablitos Underwood Jamón (115g)",
    priceUSD: 1.75,
    costUSD: 1.35,
    stock: 38,
    category: "Alimentos",
    brand: "Diablitos Underwood",
    clientId: DEMO_COMMERCE_ID,
    imgUrl: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=500&auto=format&fit=crop&q=60",
    description: "La mejor forma de comer jamón. Pasta de pernil untable condimentada.",
    isFeatured: true
  },
  {
    id: "prod_demo_19",
    barcode: "7591021000107",
    name: "Atún Margarita en Aceite (140g)",
    priceUSD: 1.85,
    costUSD: 1.45,
    stock: 30,
    category: "Alimentos",
    brand: "Alimentos Polar",
    clientId: DEMO_COMMERCE_ID,
    imgUrl: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=500&auto=format&fit=crop&q=60",
    description: "Lomitos de atún claro en aceite vegetal de alta calidad.",
    isFeatured: false
  },
  {
    id: "prod_demo_20",
    barcode: "7591005002905",
    name: "Detergente Polvo Las Llaves (1kg)",
    priceUSD: 2.50,
    costUSD: 1.95,
    stock: 24,
    category: "Limpieza",
    brand: "Alimentos Polar",
    clientId: DEMO_COMMERCE_ID,
    imgUrl: "https://images.unsplash.com/photo-1607834306387-3ec72cc274b7?w=500&auto=format&fit=crop&q=60",
    description: "Detergente en polvo con poder desmanchador para todo tipo de ropa.",
    isFeatured: false
  },
  {
    id: "prod_demo_21",
    barcode: "7591005001601",
    name: "Jabón Azul Las Llaves (250g)",
    priceUSD: 1.15,
    costUSD: 0.85,
    stock: 35,
    category: "Limpieza",
    brand: "Alimentos Polar",
    clientId: DEMO_COMMERCE_ID,
    imgUrl: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=500&auto=format&fit=crop&q=60",
    description: "Jabón en panela azul tradicional, cuida las telas y la piel.",
    isFeatured: false
  },
  {
    id: "prod_demo_22",
    barcode: "7591142100014",
    name: "Harina de Trigo Robin Hood (1kg)",
    priceUSD: 1.70,
    costUSD: 1.30,
    stock: 28,
    category: "Alimentos",
    brand: "Monaca",
    clientId: DEMO_COMMERCE_ID,
    imgUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=60",
    description: "Harina de trigo todo uso leudante, ideal para repostería y panes.",
    isFeatured: false
  },
  {
    id: "prod_demo_23",
    barcode: "7591888000011",
    name: "Queso Guayanés Fresco (1kg)",
    priceUSD: 6.50,
    costUSD: 4.80,
    stock: 2, // ALERTA: STOCK BAJO DEMO
    category: "Alimentos",
    brand: "Lácteos del Llano",
    clientId: DEMO_COMMERCE_ID,
    imgUrl: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&auto=format&fit=crop&q=60",
    description: "Queso de pasta hilada suave, cremoso y fresco del día.",
    isFeatured: true
  },
  {
    id: "prod_demo_24",
    barcode: "7591999000022",
    name: "Whisky Old Parr 12 Años (750ml)",
    priceUSD: 32.00,
    costUSD: 26.50,
    stock: 3, // ALERTA: STOCK BAJO DEMO
    category: "Licores",
    brand: "Diageo",
    clientId: DEMO_COMMERCE_ID,
    imgUrl: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=500&auto=format&fit=crop&q=60",
    description: "Whisky escocés blended premium 12 años, botella clásica craquelada.",
    isFeatured: true
  }
];

export const DEMO_COMMERCE_VENDEDORES = [
  {
    id: "vendedor-demo-1",
    name: "Carlos Gómez (Caja 1 - Mostrador)",
    email: "carlos@demo.com",
    password: "000",
    clientId: DEMO_COMMERCE_ID,
    merchantId: DEMO_COMMERCE_ID,
    pin: "1111",
    role: "vendedor",
    salesCount: 22,
    totalSalesUSD: 980.50,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: "vendedor-demo-2",
    name: "María Rivas (Caja 2 - Rápida)",
    email: "maria@demo.com",
    password: "000",
    clientId: DEMO_COMMERCE_ID,
    merchantId: DEMO_COMMERCE_ID,
    pin: "2222",
    role: "vendedor",
    salesCount: 14,
    totalSalesUSD: 645.00,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80"
  }
];

export const DEMO_COMMERCE_VALES = [
  {
    id: "vale-demo-1",
    clientId: DEMO_COMMERCE_ID,
    customerName: "Dr. Roberto Mendoza",
    customerPhone: "0414-2345678",
    amountUSD: 45.00,
    totalLimitUSD: 150.00,
    status: "pending",
    notes: "Compras quincenales víveres y charcutería",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: "vale-demo-2",
    clientId: DEMO_COMMERCE_ID,
    customerName: "Lic. Elena Castillo",
    customerPhone: "0424-9876543",
    amountUSD: 18.50,
    totalLimitUSD: 80.00,
    status: "pending",
    notes: "Desayunos y café de oficina",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: "vale-demo-3",
    clientId: DEMO_COMMERCE_ID,
    customerName: "Ing. Alejandro Morales",
    customerPhone: "0412-1112233",
    amountUSD: 0.00,
    totalLimitUSD: 200.00,
    status: "settled",
    notes: "Saldado ayer mediante Pago Móvil Banesco",
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
  }
];

export const DEMO_COMMERCE_RIDERS = [
  {
    id: "rider-demo-1",
    name: "Pedro Delivery (Bera SBR 150)",
    email: "rider@demo.com",
    phone: "0416-3334455",
    password: "000",
    role: "rider",
    status: "approved",
    vehicle: "Moto Bera SBR 2024 Azul",
    plate: "AA1B23",
    assignedClientId: DEMO_COMMERCE_ID,
    rating: 4.96,
    totalDeliveries: 342,
    walletBalanceUSD: 165.00,
    lastLat: 10.4950,
    lastLng: -66.8520,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
  }
];

export const DEMO_COMMERCE_TRANSACTIONS = [
  {
    id: "tx-demo-01",
    clientId: DEMO_COMMERCE_ID,
    clientName: "Bodegón & Market Gourmet Caracas",
    customerName: "Valeria Domínguez",
    customerPhone: "0414-8889900",
    amountUSD: 28.50,
    totalUSD: 28.50,
    paymentMethod: "pago_movil",
    paymentReference: "PM-BANESCO-784920",
    shippingStatus: "picked_up",
    assignedRiderId: "rider-demo-1",
    deliveryAddress: "Altamira Sur, Res. Ávila, Apto 4-B, Caracas",
    status: "completed",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    items: [
      { name: "Harina PAN Blanca (1kg)", qty: 2, priceUSD: 1.25 },
      { name: "Queso Guayanés Fresco (1kg)", qty: 1, priceUSD: 6.50 },
      { name: "Pirulin Original (Lata 190g)", qty: 1, priceUSD: 4.50 },
      { name: "Diablitos Underwood Jamón (115g)", qty: 2, priceUSD: 1.75 },
      { name: "Café Molido Fama de América (250g)", qty: 2, priceUSD: 2.40 },
      { name: "Toddy Chocolate en Polvo (400g)", qty: 1, priceUSD: 3.90 },
      { name: "Malta Polar Botella (250ml)", qty: 4, priceUSD: 0.90 }
    ]
  },
  {
    id: "tx-demo-02",
    clientId: DEMO_COMMERCE_ID,
    clientName: "Bodegón & Market Gourmet Caracas",
    customerName: "Carlos Pérez",
    customerPhone: "0412-3456789",
    amountUSD: 15.20,
    totalUSD: 15.20,
    paymentMethod: "cash_usd",
    paymentReference: "EFECTIVO-USD-20 (Vuelto: $4.80)",
    status: "completed",
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    items: [
      { name: "Harina PAN Blanca (1kg)", qty: 4, priceUSD: 1.25 },
      { name: "Margarina Mavesa Común (500g)", qty: 2, priceUSD: 1.80 },
      { name: "Mayonesa Mavesa Tradicional (445g)", qty: 2, priceUSD: 2.30 },
      { name: "Salsa de Tomate Pampero (397g)", qty: 1, priceUSD: 1.50 }
    ]
  },
  {
    id: "tx-demo-03",
    clientId: DEMO_COMMERCE_ID,
    clientName: "Bodegón & Market Gourmet Caracas",
    customerName: "Mariana Albornoz",
    customerPhone: "0424-5556677",
    amountUSD: 42.00,
    totalUSD: 42.00,
    paymentMethod: "zelle",
    paymentReference: "ZELLE-CONF-89104",
    status: "completed",
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    items: [
      { name: "Whisky Old Parr 12 Años (750ml)", qty: 1, priceUSD: 32.00 },
      { name: "Pirulin Original (Lata 190g)", qty: 1, priceUSD: 4.50 },
      { name: "Bombón Savoy Toronto (Bolsa 36u)", qty: 1, priceUSD: 5.50 }
    ]
  },
  {
    id: "tx-demo-04",
    clientId: DEMO_COMMERCE_ID,
    clientName: "Bodegón & Market Gourmet Caracas",
    customerName: "Dr. Roberto Mendoza",
    customerPhone: "0414-2345678",
    amountUSD: 18.50,
    totalUSD: 18.50,
    paymentMethod: "vale",
    paymentReference: "VALE-CREDITO-AUTO-01",
    status: "completed",
    timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
    items: [
      { name: "Café Molido Fama de América (250g)", qty: 2, priceUSD: 2.40 },
      { name: "Arroz Mary Dorado Extra (1kg)", qty: 3, priceUSD: 1.45 },
      { name: "Atún Margarita en Aceite (140g)", qty: 3, priceUSD: 1.85 },
      { name: "Pasta Primor Spaghetti (1kg)", qty: 2, priceUSD: 1.60 }
    ]
  },
  {
    id: "tx-demo-05",
    clientId: DEMO_COMMERCE_ID,
    clientName: "Bodegón & Market Gourmet Caracas",
    customerName: "Andrés Velásquez",
    customerPhone: "0416-7778899",
    amountUSD: 11.00,
    totalUSD: 11.00,
    paymentMethod: "punto_bancario",
    paymentReference: "PUNTO-BANCAMIGA-LOTE-012",
    status: "completed",
    timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
    items: [
      { name: "Cerveza Polar Pilsen (Tercio 295ml)", qty: 10, priceUSD: 1.10 }
    ]
  },
  {
    id: "tx-demo-06",
    clientId: DEMO_COMMERCE_ID,
    clientName: "Bodegón & Market Gourmet Caracas",
    customerName: "Sofía Cárdenas",
    customerPhone: "0412-9990011",
    amountUSD: 9.60,
    totalUSD: 9.60,
    paymentMethod: "pago_movil",
    paymentReference: "PM-MERCANTIL-339182",
    status: "completed",
    timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
    items: [
      { name: "Chocolate Savoy con Leche (130g)", qty: 2, priceUSD: 2.20 },
      { name: "Galleta Savoy Cocosette (50g)", qty: 3, priceUSD: 0.85 },
      { name: "Galleta Savoy Susy (50g)", qty: 3, priceUSD: 0.85 }
    ]
  }
];

export const DEMO_COMMERCE_CUSTOMERS = [
  {
    id: "cust-demo-1",
    name: "Dr. Roberto Mendoza",
    phone: "04142345678",
    email: "roberto.mendoza@email.com",
    k_point_cash_balance: 1450,
    totalSpentUSD: 620.00,
    ordersCount: 16
  },
  {
    id: "cust-demo-2",
    name: "Valeria Domínguez",
    phone: "04148889900",
    email: "valeria.dominguez@email.com",
    k_point_cash_balance: 890,
    totalSpentUSD: 340.50,
    ordersCount: 9
  },
  {
    id: "cust-demo-3",
    name: "Lic. Elena Castillo",
    phone: "04249876543",
    email: "elena.castillo@email.com",
    k_point_cash_balance: 520,
    totalSpentUSD: 185.00,
    ordersCount: 7
  },
  {
    id: "cust-demo-4",
    name: "Ing. Alejandro Morales",
    phone: "04121112233",
    email: "alejandro.morales@email.com",
    k_point_cash_balance: 2300,
    totalSpentUSD: 890.00,
    ordersCount: 21
  }
];

export const DEMO_COMMERCE_ZREPORT = {
  id: "z-demo-yesterday",
  clientId: DEMO_COMMERCE_ID,
  vendedorId: "vendedor-demo-1",
  date: new Date(Date.now() - 86400000).toLocaleDateString(),
  timestamp: new Date(Date.now() - 86400000).toISOString(),
  totalSalesUSD: 1280.00,
  taxUSD: 204.80,
  invoiceCount: 34,
  breakdown: {
    pagoMovilUSD: 560.00,
    cashUSD: 420.00,
    puntoBancarioUSD: 210.00,
    zelleUSD: 90.00
  },
  firstTicket: "00004120",
  lastTicket: "00004154",
  status: "closed"
};

export const DEMO_COMMERCE_BLIND_AUDIT = {
  id: "audit-demo-1",
  clientId: DEMO_COMMERCE_ID,
  vendedorId: "vendedor-demo-1",
  timestamp: new Date(Date.now() - 86400000).toISOString(),
  declaredUSD: 420.00,
  systemExpectedUSD: 420.00,
  discrepancyUSD: 0.00,
  status: "CUADRADO_PERFECTO"
};
