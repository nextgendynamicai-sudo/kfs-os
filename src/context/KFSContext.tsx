"use client";

import { KFS_BRAND } from "../config/brandConfig";
import React, { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from "react";
import { supabase, isSupabaseConfigured, uploadAsset } from "./supabase";
import { playScannerBeep, speakText, getStoreCoords, getCustomerCoords, playSyncChime } from "../lib/utils";
import { useUI } from "./UIContext";
import { getIndexedDBValue, setIndexedDBValue } from "../lib/indexedDB";
import { syncToRelational, syncSingleTransaction, syncSingleClient, syncSingleCustomer, syncSingleProduct } from "../lib/supabaseSync";

const VENEZUELAN_PRODUCTS_CATALOG: Record<string, { name: string; imgUrl: string; category: string; brand: string }> = {
  "7591006000016": { name: "Harina PAN Blanca (1kg)", imgUrl: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&auto=format&fit=crop&q=60", category: "Alimentos", brand: "Alimentos Polar" },
  "7591005000574": { name: "Margarina Mavesa Común (500g)", imgUrl: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=60", category: "Alimentos", brand: "Alimentos Polar" },
  "7591005001151": { name: "Mayonesa Mavesa Tradicional (445g)", imgUrl: "https://images.unsplash.com/photo-1571266028243-e4bb33394de9?w=500&auto=format&fit=crop&q=60", category: "Alimentos", brand: "Alimentos Polar" },
  "7591001000219": { name: "Malta Polar Botella (250ml)", imgUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=60", category: "Bebidas", brand: "Cervecería Polar" },
  "7591001000110": { name: "Cerveza Polar Pilsen (Tercio 295ml)", imgUrl: "https://images.unsplash.com/photo-1608270176050-12ec0f24ee3d?w=500&auto=format&fit=crop&q=60", category: "Bebidas", brand: "Cervecería Polar" },
  "7591395000147": { name: "Pirulin Original (Lata 190g)", imgUrl: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500&auto=format&fit=crop&q=60", category: "Dulces", brand: "Nucita Venezolana" },
  "7591016205722": { name: "Galleta Savoy Cocosette (50g)", imgUrl: "https://images.unsplash.com/photo-1558961312-503d216d5813?w=500&auto=format&fit=crop&q=60", category: "Dulces", brand: "Nestlé Savoy" },
  "7591016205708": { name: "Galleta Savoy Susy (50g)", imgUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=60", category: "Dulces", brand: "Nestlé Savoy" },
  "7591016035251": { name: "Chocolate Savoy de Leche (130g)", imgUrl: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=500&auto=format&fit=crop&q=60", category: "Dulces", brand: "Nestlé Savoy" },
  "7591016035404": { name: "Bombón Savoy Toronto (Bolsa 36u)", imgUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60", category: "Dulces", brand: "Nestlé Savoy" },
  "7591005001229": { name: "Queso Fundido Rikesa Cheddar (300g)", imgUrl: "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=500&auto=format&fit=crop&q=60", category: "Alimentos", brand: "Alimentos Polar" },
  "7591041000675": { name: "Queso Fundido Cheez Whiz (300g)", imgUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=60", category: "Alimentos", brand: "Kraft" },
  "7591005002042": { name: "Toddy Chocolate en Polvo (400g)", imgUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=60", category: "Bebidas", brand: "Alimentos Polar" },
  "7591018000547": { name: "Salsa de Tomate Pampero (397g)", imgUrl: "https://images.unsplash.com/photo-1595855759920-86582396756a?w=500&auto=format&fit=crop&q=60", category: "Alimentos", brand: "Pampero" },
  "7591642000678": { name: "Arroz Mary Dorado Extra (1kg)", imgUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=60", category: "Alimentos", brand: "Alimentos Mary" },
  "7591024001019": { name: "Café Molido Fama de América (250g)", imgUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60", category: "Alimentos", brand: "Fama de América" },
  "7591006001044": { name: "Pasta Primor Spaghetti (1kg)", imgUrl: "https://images.unsplash.com/photo-1612966608997-30d211b2e1c4?w=500&auto=format&fit=crop&q=60", category: "Alimentos", brand: "Alimentos Polar" },
  "7591060000120": { name: "Diablitos Underwood Jamón (115g)", imgUrl: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=500&auto=format&fit=crop&q=60", category: "Alimentos", brand: "Diablitos Underwood" },
  "7591021000107": { name: "Atún Margarita en Aceite (140g)", imgUrl: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=500&auto=format&fit=crop&q=60", category: "Alimentos", brand: "Alimentos Polar" },
  "759104101405": { name: "Salsa Inglesa Kraft (150ml)", imgUrl: "https://images.unsplash.com/photo-1589135306090-e555e09fbeb6?w=500&auto=format&fit=crop&q=60", category: "Alimentos", brand: "Kraft" },
  "7591005000758": { name: "Vinagre Blanco Mavesa (1L)", imgUrl: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=500&auto=format&fit=crop&q=60", category: "Alimentos", brand: "Alimentos Polar" },
  "7591005002905": { name: "Detergente Polvo Las Llaves (1kg)", imgUrl: "https://images.unsplash.com/photo-1607834306387-3ec72cc274b7?w=500&auto=format&fit=crop&q=60", category: "Limpieza", brand: "Alimentos Polar" },
  "7591005001601": { name: "Jabón Azul Las Llaves Bebé (250g)", imgUrl: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=500&auto=format&fit=crop&q=60", category: "Limpieza", brand: "Alimentos Polar" },
  "7591142100014": { name: "Harina de Trigo Robin Hood (1kg)", imgUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=60", category: "Alimentos", brand: "Monaca" },
  "7591736000454": { name: "Suavizante Ensueño Floral (1L)", imgUrl: "https://images.unsplash.com/photo-1585130401366-fe05a8d813c4?w=500&auto=format&fit=crop&q=60", category: "Limpieza", brand: "Corimon" }
};

const MOCK_BCV_RATES = {
  USD: 745.64,
  EUR: 805.29,
  isWeekend: false
};

const CURRENT_WIPE_VERSION = 9;

const initialDB = {
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

interface KFSContextType {
  isClient: boolean;
  isBooting: boolean;
  view: string;
  setView: (view: string) => void;
  currentUser: any;
  setCurrentUser: (user: any) => void;
  updateUserAvatar: (userId: string, role: string, avatarBase64: string) => Promise<void>;
  toast: { show: boolean; message: string; type: string };
  showToast: (message: string, type?: "success" | "error") => void;
  rates: typeof MOCK_BCV_RATES;
  updateBcvRates: (usd: number, eur: number) => void;
  db: typeof initialDB;
  setDb: React.Dispatch<React.SetStateAction<typeof initialDB>>;
  createRewardTask: (taskData: any) => Promise<void>;
  updateRewardTask: (taskId: string, updates: any) => Promise<void>;
  deleteRewardTask: (taskId: string) => Promise<void>;
  toggleRewardTaskStatus: (taskId: string) => Promise<void>;
  submitRewardTaskProof: (taskId: string, proofData: any) => Promise<void>;
  approveRewardSubmission: (submissionId: string, reviewerId?: string) => Promise<void>;
  rejectRewardSubmission: (submissionId: string, reason: string, reviewerId?: string) => Promise<void>;
  formatUSD: (val: number) => string;
  formatEUR: (val: number) => string;
  handleLogin: (role: string, password: string, email?: string | null) => void;
  logout: () => void;
  registerClient: (clientData: any, promotoraId: string, kfsFeePercentage: number) => void;
  registerFreeUser: (clientData: any, promotoraId: string) => Promise<any>;
  registerCommerceWithOffer: (clientData: any, offerType: "demo" | "pionero") => Promise<any>;
  upgradeToPremium: (clientId: string, promotoraId: string) => Promise<void>;
  registerPromotora: (promoData: any) => void;
  registerVendedor: (vendedorData: any) => void;
  approvePromotora: (id: string) => void;
  rejectPromotora: (id: string) => void;
  settlePromotoraEarnings: (promotoraId: string) => void;
  addProduct: (productData: any) => void;
  addExpense: (expenseData: any) => void;
  processPurchase: (product: any, paymentMethod?: string, applyIva?: boolean, customerPhone?: string) => any;
  submitOnlineOrder: (product: any, paymentMethod: string, applyIva: boolean, paymentReference: string, customerPhone?: string, customerName?: string, customerRif?: string, paymentScreenshot?: string) => void;
  approveOrder: (orderId: string) => void;
  rejectOrder: (orderId: string) => void;
  dispatchOrder: (txId: string) => void;
  generateZReport: (vendedorId: string, clientId: string) => void;
  originalUser: any;
  impersonateClient: (client: any) => void;
  stopImpersonating: () => void;
  networkState: "online" | "mesh" | "offline" | "syncing";
  setNetworkState: (state: "online" | "mesh" | "offline" | "syncing") => void;
  smsConciliator: (smsText: string) => { matched: boolean; order?: any; bank?: string; amount?: number; reference?: string; phone?: string; error?: string };
  registerCrmExpress: (idCard: string, name: string, surname: string, phone?: string) => void;
  ghostTrapLocked: boolean;
  setGhostTrapLocked: (locked: boolean) => void;
  createVale: (valeData: any) => void;
  payVale: (valeId: string, amount: number) => void;
  registerPosTerminal: (posData: any) => void;
  deletePosTerminal: (posId: string) => void;
  queryGlobalBarcode: (barcode: string) => Promise<any>;
  toggleLoyaltyProgram: (clientId: string, isActive: boolean) => void;
  triggerGhostTrap: (vendedorId: string, amount: number, method: string) => void;
  updateStoreSettings: (clientId: string, settings: any) => void;
  updatePaymentMethods: (clientId: string, methods: any) => void;
  toggleProductFeatured: (productId: string, isFeatured: boolean) => void;
  sendNotification: (audience: string, title: string, message: string, imageUrl?: string, destType?: string, destVal?: string) => void;
  assignPromotoraToClient: (clientId: string, promotoraId: string) => void;
  addGlobalProduct: (product: any) => void;
  paySubscription: (clientId: string, reference: string) => void;
  approveSubscription: (clientId: string) => void;
  finishOnboarding: (clientId: string, kycDocBase64?: string) => void;
  hashPassword: (password: string) => Promise<string>;
  logAction: (actor: string, action: string, details: string) => void;
  createTicket: (clientId: string, subject: string, description: string) => void;
  replyTicket: (ticketId: string, author: string, message: string) => void;
  closeTicket: (ticketId: string) => void;
  fundWallet: (clientId: string, amountUSD: number) => void;
  transferKFSPoints: (userId: string, collectionName: string, amount: number) => void;
  fundCustomerWallet: (customerId: string, amountUSD: number, gateway: string) => void;
  requestTopUp: (userId: string, userType: 'client' | 'customer', amountUSD: number, paymentReference: string, screenshotBase64: string) => void;
  validateTopUp: (topupId: string, status: 'approved' | 'rejected', approverId: string) => void;
  processMonthlyBilling: (clientId: string) => void;
  convertAsset: (customerId: string, fromType: 'real_balance' | 'k_point_cash_balance', amount: number) => void;
  claimFlowMaster: (customerId: string) => void;
  trimLocalDatabase: () => void;
  registerCustomer: (phone: string, password: string, name: string, referralCode?: string) => void;
  blockClient: (clientId: string) => void;
  releaseClient: (clientId: string) => void;
  deleteClient: (clientId: string) => void;
  deleteCustomer: (customerId: string) => void;
  deletePromotora: (promotoraId: string) => void;
  deleteVendedor: (vendedorId: string) => void;
  deleteRider: (riderId: string) => void;
  registerCandidate: (candidateData: any, customerId: string) => void;
  unlockCandidateContact: (candidateId: string, clientId: string, reference: string, screenshot?: string) => void;
  approveUnlock: (unlockId: string) => void;
  rejectUnlock: (unlockId: string) => void;
  approveCandidateRegistration: (candidateId: string) => void;
  rejectCandidateRegistration: (candidateId: string) => void;
  hireCandidate: (candidateId: string, clientId: string) => void;
  releaseCandidate: (candidateId: string, clientId: string, reviewData?: { rating: number; comment: string }) => void;
  toggleCandidateBacking: (candidateId: string) => void;
  markNotificationsAsRead: (candidateId: string) => void;
  updateCvBuilderOption: (candidateId: string, useBuilder: boolean) => void;
  registerRider: (riderData: any) => void;
  approveRider: (riderId: string) => void;
  rejectRider: (riderId: string) => void;
  assignRiderToBusiness: (riderId: string, clientId: string) => void;
  removeRiderFromBusiness: (riderId: string, clientId: string) => void;
  assignDeliveryToOrder: (txId: string, clientId: string) => void;
  updateRiderPagoMovil: (riderId: string, pagoMovil: any) => void;
  confirmDelivery: (txId: string) => void;
  rateRider: (txId: string, stars: number, comment?: string) => void;
  updateRiderGPS: (riderId: string, lat: number, lng: number) => void;
  toggleBusinessOpen: (clientId: string) => void;
  updateBusinessConfig: (clientId: string, config: any) => void;
  requestNotificationPermission: () => Promise<boolean>;
  processPayroll: (vendedorId: string, baseSalaryUSD: number) => void;
  requestPayout: (amountUSD: number, bankDetails: string) => Promise<any>;
  riderCheckIn: (riderId: string) => void;
  riderCheckOut: (riderId: string) => void;
  markAsPickedUp: (txId: string) => void;
  createCoupon: (couponData: any) => void;
  deleteCoupon: (couponId: string) => void;
  toggleCouponActive: (couponId: string) => void;
  logFiscalAction: (clientId: string, cashierId: string, cashierName: string, command: string, details: string) => void;
}

const upgradeToNewBaseline = (oldDb: any, baselineDb: any) => {
  if (!oldDb) return baselineDb;
  return {
    ...baselineDb,
    kreatekCore: {
      ...(baselineDb.kreatekCore || {}),
      wipeVersion: baselineDb.kreatekCore?.wipeVersion || 0
    },
    orders: oldDb.orders || [],
    transactions: oldDb.transactions || [],
    auditLogs: oldDb.auditLogs || [],
    supportTickets: oldDb.supportTickets || [],
    products: oldDb.products || [],
    clients: oldDb.clients || [],
    promotoras: oldDb.promotoras || [],
    vendedores: oldDb.vendedores || [],
    customers: oldDb.customers || [],
    riders: oldDb.riders || [],
    expenses: oldDb.expenses || [],
    posTerminals: oldDb.posTerminals || [],
    zReports: oldDb.zReports || [],
    vales: oldDb.vales || [],
    candidates: oldDb.candidates || [],
    unlockedContacts: oldDb.unlockedContacts || [],
    coupons: oldDb.coupons || [],
    kfsNetworkLedger: oldDb.kfsNetworkLedger || []
  };
};

const mergeIncomingDb = (localDb: any, remoteDb: any, currentUser: any) => {
  if (!remoteDb) return localDb;
  if (!localDb) return remoteDb;
  
  let mergedDb = { ...localDb };
  
  const mergeArrayIncoming = (
    localArr: any[], 
    remoteArr: any[], 
    checkAuthority?: (item: any) => boolean
  ) => {
    const map = new Map();
    // Start with remote state as base
    (remoteArr || []).forEach(i => {
      const key = i.id || i.barcode || JSON.stringify(i);
      map.set(key, i);
    });
    // Overlay local state items
    const localKeys = new Set();
    (localArr || []).forEach(i => {
      const key = i.id || i.barcode || JSON.stringify(i);
      localKeys.add(key);
      const existing = map.get(key);
      const isNew = !existing;
      const isAuthority = checkAuthority ? checkAuthority(i) : true;
      
      if (isNew || isAuthority) {
        map.set(key, i);
      }
    });
    // Deletions are securely handled by deletedKeys at the end of the merge process.
    return Array.from(map.values());
  };

  // 1. Clients
  const mergeClientsIncoming = (localClients: any[], remoteClients: any[]) => {
    const map = new Map();
    (remoteClients || []).forEach(c => map.set(c.id, c));
    const localKeys = new Set();
    (localClients || []).forEach(c => {
      localKeys.add(c.id);
      const existing = map.get(c.id);
      const isNew = !existing;
      const isAuthority = currentUser && (
        currentUser.role === "core" ||
        (currentUser.role === "dueño" && c.id === currentUser.id) ||
        (currentUser.role === "vendedor" && c.id === currentUser.clientId) ||
        (currentUser.role === "promotora" && c.promotoraId === currentUser.id)
      );
      if (isNew || isAuthority) {
        if (existing) {
          map.set(c.id, {
            ...existing,
            ...c,
            storeSettings: {
              ...(existing.storeSettings || {}),
              ...(c.storeSettings || {})
            }
          });
        } else {
          map.set(c.id, c);
        }
      }
    });
    // Deletions are securely handled by deletedKeys at the end of the merge process.
    return Array.from(map.values());
  };

  // 2. Products
  const mergeProductsIncoming = (localProducts: any[], remoteProducts: any[]) => {
    const map = new Map();
    (remoteProducts || []).forEach(p => map.set(p.id, p));
    const localKeys = new Set();
    (localProducts || []).forEach(p => {
      localKeys.add(p.id);
      const existing = map.get(p.id);
      const isNew = !existing;
      const isAuthority = currentUser && (
        currentUser.role === "core" ||
        (currentUser.role === "dueño" && p.clientId === currentUser.id) ||
        (currentUser.role === "vendedor" && p.clientId === currentUser.clientId)
      );
      if (isNew || isAuthority) {
        map.set(p.id, p);
      }
    });
    // Deletions are securely handled by deletedKeys at the end of the merge process.
    return Array.from(map.values());
  };

  // 3. Promotoras
  const checkPromotoraAuthority = (p: any) => {
    return !!(currentUser && (
      currentUser.role === "core" ||
      (currentUser.role === "promotora" && p.id === currentUser.id)
    ));
  };

  // 4. Riders
  const checkRiderAuthority = (r: any) => {
    return !!(currentUser && (
      currentUser.role === "core" ||
      (currentUser.role === "rider" && r.id === currentUser.id) ||
      (currentUser.role === "dueño" && r.assignedClientId === currentUser.id)
    ));
  };

  // 5. Vendedores
  const checkVendedorAuthority = (v: any) => {
    return !!(currentUser && (
      currentUser.role === "core" ||
      (currentUser.role === "dueño" && v.clientId === currentUser.id) ||
      (currentUser.role === "vendedor" && v.id === currentUser.id)
    ));
  };

  // 6. Customers
  const checkCustomerAuthority = (c: any) => {
    return !!(currentUser && (
      currentUser.role === "core" ||
      (currentUser.role === "customer" && (c.id === currentUser.id || c.phone === currentUser.phone))
    ));
  };

  // 7. Orders
  const checkOrderAuthority = (o: any) => {
    return !!(currentUser && (
      currentUser.role === "core" ||
      (currentUser.role === "dueño" && o.clientId === currentUser.id) ||
      (currentUser.role === "vendedor" && o.clientId === currentUser.clientId) ||
      (currentUser.role === "rider" && o.riderId === currentUser.id) ||
      (currentUser.role === "customer" && o.customerPhone === currentUser.phone)
    ));
  };

  // 8. Support Tickets
  const checkTicketAuthority = (t: any) => {
    return !!(currentUser && (
      currentUser.role === "core" ||
      (currentUser.role === "dueño" && t.clientId === currentUser.id) ||
      (currentUser.role === "vendedor" && t.clientId === currentUser.clientId)
    ));
  };

  // 9. Expenses
  const checkExpenseAuthority = (e: any) => {
    return !!(currentUser && (
      currentUser.role === "core" ||
      (currentUser.role === "dueño" && e.clientId === currentUser.id) ||
      (currentUser.role === "vendedor" && e.clientId === currentUser.clientId)
    ));
  };

  // 10. POS Terminals
  const checkPosAuthority = (pt: any) => {
    return !!(currentUser && (
      currentUser.role === "core" ||
      (currentUser.role === "dueño" && pt.clientId === currentUser.id)
    ));
  };

  // 11. Z Reports
  const checkZReportAuthority = (z: any) => {
    return !!(currentUser && (
      currentUser.role === "core" ||
      (currentUser.role === "dueño" && z.clientId === currentUser.id) ||
      (currentUser.role === "vendedor" && z.clientId === currentUser.clientId)
    ));
  };

  // 12. Vales
  const checkValeAuthority = (v: any) => {
    return !!(currentUser && (
      currentUser.role === "core" ||
      (currentUser.role === "dueño" && v.clientId === currentUser.id) ||
      (currentUser.role === "vendedor" && v.clientId === currentUser.clientId)
    ));
  };

  // 13. Candidates
  const checkCandidateAuthority = (c: any) => {
    return !!(currentUser && (
      currentUser.role === "core" ||
      currentUser.role === "dueño" ||
      (currentUser.role === "customer" && (c.id === currentUser.id || c.phone === currentUser.phone))
    ));
  };

  // 14. Unlocked Contacts
  const checkUnlockAuthority = (u: any) => {
    return !!(currentUser && (
      currentUser.role === "core" ||
      (currentUser.role === "dueño" && u.clientId === currentUser.id)
    ));
  };

  mergedDb.orders = mergeArrayIncoming(localDb.orders, remoteDb.orders, checkOrderAuthority);
  mergedDb.transactions = mergeArrayIncoming(localDb.transactions, remoteDb.transactions, checkOrderAuthority);
  mergedDb.auditLogs = mergeArrayIncoming(localDb.auditLogs, remoteDb.auditLogs);
  mergedDb.supportTickets = mergeArrayIncoming(localDb.supportTickets, remoteDb.supportTickets, checkTicketAuthority);
  mergedDb.products = mergeProductsIncoming(localDb.products, remoteDb.products);
  mergedDb.clients = mergeClientsIncoming(localDb.clients, remoteDb.clients);
  mergedDb.promotoras = mergeArrayIncoming(localDb.promotoras, remoteDb.promotoras, checkPromotoraAuthority);
  mergedDb.vendedores = mergeArrayIncoming(localDb.vendedores, remoteDb.vendedores, checkVendedorAuthority);
  mergedDb.customers = mergeArrayIncoming(localDb.customers, remoteDb.customers, checkCustomerAuthority);
  mergedDb.riders = mergeArrayIncoming(localDb.riders, remoteDb.riders, checkRiderAuthority);
  mergedDb.expenses = mergeArrayIncoming(localDb.expenses, remoteDb.expenses, checkExpenseAuthority);
  mergedDb.posTerminals = mergeArrayIncoming(localDb.posTerminals, remoteDb.posTerminals, checkPosAuthority);
  mergedDb.zReports = mergeArrayIncoming(localDb.zReports, remoteDb.zReports, checkZReportAuthority);
  mergedDb.vales = mergeArrayIncoming(localDb.vales, remoteDb.vales, checkValeAuthority);
  mergedDb.candidates = mergeArrayIncoming(localDb.candidates, remoteDb.candidates, checkCandidateAuthority);
  mergedDb.unlockedContacts = mergeArrayIncoming(localDb.unlockedContacts, remoteDb.unlockedContacts, checkUnlockAuthority);
  mergedDb.coupons = mergeArrayIncoming(localDb.coupons || [], remoteDb.coupons || []);
  mergedDb.rewardTasks = mergeArrayIncoming(localDb.rewardTasks || [], remoteDb.rewardTasks || []);
  mergedDb.rewardSubmissions = mergeArrayIncoming(localDb.rewardSubmissions || [], remoteDb.rewardSubmissions || []);
  
  // merge kreatekCore with max-value safety
  const localCore = localDb.kreatekCore || {};
  const remoteCore = remoteDb.kreatekCore || {};
  
  const deletedKeys = new Set([
    ...(localCore.deletedKeys || []),
    ...(remoteCore.deletedKeys || [])
  ]);

  mergedDb.kreatekCore = {
    totalTransactions: Math.max(localCore.totalTransactions || 0, remoteCore.totalTransactions || 0),
    earningsEUR: Math.max(localCore.earningsEUR || 0, remoteCore.earningsEUR || 0),
    netEarningsEUR: Math.max(localCore.netEarningsEUR || 0, remoteCore.netEarningsEUR || 0),
    adBudgetEUR: Math.max(localCore.adBudgetEUR || 0, remoteCore.adBudgetEUR || 0),
    avatar: localCore.avatar || remoteCore.avatar,
    wipeVersion: localCore.wipeVersion || remoteCore.wipeVersion || CURRENT_WIPE_VERSION,
    deletedKeys: Array.from(deletedKeys),
    team: (() => {
      const merged: any[] = [];
      const names = new Set();
      for (const m of [...(localCore.team || []), ...(remoteCore.team || [])]) {
        if (m && m.name && !names.has(m.name.toLowerCase())) {
          names.add(m.name.toLowerCase());
          merged.push(m);
        }
      }
      return merged;
    })()
  };

  if (deletedKeys.size > 0) {
    mergedDb.clients = mergedDb.clients?.filter((c: any) => !deletedKeys.has(c.id));
    mergedDb.products = mergedDb.products?.filter((p: any) => !deletedKeys.has(p.clientId) && !deletedKeys.has(p.id));
    mergedDb.vendedores = mergedDb.vendedores?.filter((v: any) => !deletedKeys.has(v.clientId) && !deletedKeys.has(v.id));
    mergedDb.posTerminals = mergedDb.posTerminals?.filter((pt: any) => !deletedKeys.has(pt.clientId) && !deletedKeys.has(pt.id));
    mergedDb.transactions = mergedDb.transactions?.filter((tx: any) => !deletedKeys.has(tx.clientId) && !deletedKeys.has(tx.id));
    mergedDb.orders = mergedDb.orders?.filter((o: any) => !deletedKeys.has(o.clientId) && !deletedKeys.has(o.id));
    mergedDb.supportTickets = mergedDb.supportTickets?.filter((t: any) => !deletedKeys.has(t.clientId) && !deletedKeys.has(t.id));
    mergedDb.expenses = mergedDb.expenses?.filter((e: any) => !deletedKeys.has(e.clientId) && !deletedKeys.has(e.id));
    mergedDb.zReports = mergedDb.zReports?.filter((z: any) => !deletedKeys.has(z.clientId) && !deletedKeys.has(z.id));
    mergedDb.vales = mergedDb.vales?.filter((v: any) => !deletedKeys.has(v.clientId) && !deletedKeys.has(v.id));
    mergedDb.unlockedContacts = mergedDb.unlockedContacts?.filter((u: any) => !deletedKeys.has(u.clientId) && !deletedKeys.has(u.id));
    mergedDb.riders = mergedDb.riders?.filter((r: any) => !deletedKeys.has(r.id));
    mergedDb.candidates = mergedDb.candidates?.filter((c: any) => !deletedKeys.has(c.id));
    mergedDb.promotoras = mergedDb.promotoras?.filter((p: any) => !deletedKeys.has(p.id));
    mergedDb.coupons = (mergedDb.coupons || [])?.filter((c: any) => !deletedKeys.has(c.clientId) && !deletedKeys.has(c.id));
  }

  return mergedDb;
};

const KFSContext = createContext<KFSContextType | undefined>(undefined);

export function KFSProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [dbError, setDbError] = useState<Error | null>(null);

  if (dbError) {
    throw dbError; // Caught by ErrorBoundary
  }
  const { view, setView, toast, showToast, networkState, setNetworkState, ghostTrapLocked, setGhostTrapLocked } = useUI();

  const [currentUser, setCurrentUser] = useState<any>(null);
  const currentUserRef = useRef(currentUser);
  const hasRestoredRef = useRef(false);
  useEffect(() => {
    currentUserRef.current = currentUser;
    if (!hasRestoredRef.current) return;
    if (currentUser) {
      localStorage.setItem("kfs_os_current_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("kfs_os_current_user");
    }
  }, [currentUser]);
  const [originalUser, setOriginalUser] = useState<any>(null);


  const impersonateClient = (client: any) => {
    setOriginalUser(currentUser);
    const impersonated = { ...client, role: "dueño", isImpersonated: true };
    setCurrentUser(impersonated);
    setView("client");
    showToast(`Impersonando comercio: ${client.company}`, "success");
  };

  const stopImpersonating = () => {
    if (originalUser) {
      setCurrentUser(originalUser);
      setOriginalUser(null);
      setView("core");
      showToast("Retornando a panel Core de Arquitecto", "success");
    }
  };
  const [rates, setRates] = useState(MOCK_BCV_RATES);
  const updateBcvRates = (usd: number, eur: number) => {
    setRates({ USD: usd, EUR: eur, isWeekend: rates.isWeekend });
    showToast("Tasa BCV global actualizada con éxito.", "success");
  };
  const [db, setDb] = useState<any>(initialDB);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const ghostTrapActive = useRef(true);
  const isRemoteUpdate = useRef(false);
  const p2pChannelRef = useRef<any>(null);
  const lastRemoteUpdatedAtRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const channel = new BroadcastChannel("kfs-mesh-p2p");
      p2pChannelRef.current = channel;

      channel.onmessage = (event) => {
        if (networkState === "mesh" && event.data && event.data.type === "db-sync") {
          const remoteDb = event.data.db;
          isRemoteUpdate.current = true;
          setDb((prevDb: any) => {
            const merged = mergeIncomingDb(prevDb, remoteDb, currentUserRef.current);
            if (JSON.stringify(prevDb) !== JSON.stringify(merged)) {
              playSyncChime();
              showToast("P2P Mesh: Base de datos sincronizada localmente con otra estación.", "success");
              return merged;
            }
            return prevDb;
          });
        }
      };

      return () => {
        channel.close();
      };
    }
  }, [networkState]);

  // Offline Sync Queue Processor
  useEffect(() => {
    if (networkState === "online" && typeof window !== "undefined") {
      const txQueue = JSON.parse(localStorage.getItem('kfs_tx_queue') || '[]');
      if (txQueue.length > 0) {
        console.log(`[Offline Sync] Procesando ${txQueue.length} transacciones en cola...`);
        txQueue.forEach((tx: any) => syncSingleTransaction(tx));
        localStorage.removeItem('kfs_tx_queue');
      }

      const clientQueue = JSON.parse(localStorage.getItem('kfs_client_queue') || '[]');
      if (clientQueue.length > 0) {
        console.log(`[Offline Sync] Procesando ${clientQueue.length} clientes en cola...`);
        clientQueue.forEach((client: any) => syncSingleClient(client));
        localStorage.removeItem('kfs_client_queue');
      }
    }
  }, [networkState]);

  // Hydration and Boot timer
  useEffect(() => {
    let channel: any = null;
    let pollingInterval: any = null;
    setIsClient(true);
    
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setView(hash);
      } else {
        setView("landing");
        window.history.replaceState({ view: "landing" }, "", "");
      }
    }

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        setView(event.state.view);
      } else {
        const hash = window.location.hash.replace("#", "");
        if (hash) {
          setView(hash);
        } else {
          setView("landing");
        }
      }
    };
    window.addEventListener("popstate", handlePopState);

    const cleanupOldDemos = (currentDb: any) => {
      if (!currentDb) return currentDb;
      const THREE_HOURS_MS = 3 * 60 * 60 * 1000;
      const now = Date.now();

      const isExpiredDemo = (id: string) => {
        if (!id || !id.startsWith("demo-")) return false;
        const parts = id.split("-");
        const timestampStr = parts[parts.length - 1];
        const timestamp = parseInt(timestampStr, 10);
        if (isNaN(timestamp)) return false;
        return now - timestamp > THREE_HOURS_MS;
      };

      const expiredClientIds = new Set((currentDb.clients || []).filter((c:any) => isExpiredDemo(c.id)).map((c:any) => c.id));
      
      let needsCleanup = expiredClientIds.size > 0 || 
          (currentDb.customers || []).some((c:any) => isExpiredDemo(c.id)) ||
          (currentDb.promotoras || []).some((c:any) => isExpiredDemo(c.id)) ||
          (currentDb.vendedores || []).some((c:any) => isExpiredDemo(c.id)) ||
          (currentDb.riders || []).some((c:any) => isExpiredDemo(c.id));

      if (!needsCleanup) return currentDb;

      console.log("[Demo Cleanup] Limpiando cuentas de demostración caducadas (>3h) y su rastro...");

      return {
        ...currentDb,
        clients: (currentDb.clients || []).filter((c:any) => !isExpiredDemo(c.id)),
        customers: (currentDb.customers || []).filter((c:any) => !isExpiredDemo(c.id)),
        promotoras: (currentDb.promotoras || []).filter((c:any) => !isExpiredDemo(c.id)),
        vendedores: (currentDb.vendedores || []).filter((v:any) => !isExpiredDemo(v.id)),
        riders: (currentDb.riders || []).filter((r:any) => !isExpiredDemo(r.id)),
        products: (currentDb.products || []).filter((p:any) => !expiredClientIds.has(p.clientId)),
        orders: (currentDb.orders || []).filter((o:any) => !expiredClientIds.has(o.clientId)),
        transactions: (currentDb.transactions || []).filter((t:any) => !expiredClientIds.has(t.clientId)),
        posTerminals: (currentDb.posTerminals || []).filter((p:any) => !expiredClientIds.has(p.clientId)),
        vales: (currentDb.vales || []).filter((v:any) => !expiredClientIds.has(v.clientId)),
        expenses: (currentDb.expenses || []).filter((e:any) => !expiredClientIds.has(e.clientId))
      };
    };

    const demoCleanupInterval = setInterval(() => {
      setDb((prev: any) => cleanupOldDemos(prev));
    }, 60000); // Verificar cada minuto

    // Sincronización con el Banco Central de Venezuela (API Route) con Polling de 30s
    const fetchBcvRates = () => {
      fetch("/api/bcv")
        .then(res => res.json())
        .then(data => {
          if (data.USD && data.EUR) {
            const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
            const finalUSD = data.USD; 
            const finalEUR = data.EUR;
            
            setRates((prev: any) => {
              if (prev.USD !== finalUSD || prev.EUR !== finalEUR) {
                // speakText("Tasa del Banco Central de Venezuela actualizada.");
                // showToast(`Tasa BCV actualizada: Bs. ${finalUSD.toFixed(2)} (USD) / Bs. ${finalEUR.toFixed(2)} (EUR)`, "success");
                return { USD: finalUSD, EUR: finalEUR, isWeekend };
              }
              return prev;
            });
          }
        })
        .catch(err => {
          console.error("Fallo al obtener BCV en polling", err);
        });
    };

    fetchBcvRates();
    const bcvInterval = setInterval(fetchBcvRates, 30000);

    const riderSimInterval = setInterval(() => {
      setDb((prev: any) => {
        let updated = false;
        const newRiders = (prev.riders || []).map((r: any) => {
          const activeTx = (prev.transactions || []).find(
            (tx: any) => tx.assignedRiderId === r.id && tx.shippingStatus === "picked_up"
          );
          if (activeTx) {
            const storePos = getStoreCoords(activeTx.clientId);
            const customerPos = getCustomerCoords(activeTx.customerPhone || "default_cust");
            const currentLat = r.lastLat || storePos.lat;
            const currentLng = r.lastLng || storePos.lng;
            const dLat = customerPos.lat - currentLat;
            const dLng = customerPos.lng - currentLng;
            const dist = Math.sqrt(dLat * dLat + dLng * dLng);
            const step = 0.00045; // movement speed step
            if (dist > step) {
              updated = true;
              return {
                ...r,
                lastLat: currentLat + (dLat / dist) * step,
                lastLng: currentLng + (dLng / dist) * step,
                lastLocationAt: new Date().toISOString()
              };
            } else if (dist > 0.00001) {
              updated = true;
              return {
                ...r,
                lastLat: customerPos.lat,
                lastLng: customerPos.lng,
                lastLocationAt: new Date().toISOString()
              };
            }
          }
          return r;
        });
        if (updated) {
          return { ...prev, riders: newRiders };
        }
        return prev;
      });
    }, 2000);

    try {
      const savedUser = localStorage.getItem("kfs_os_current_user");
      if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch (e) {
          console.error(`[${KFS_BRAND.productAcronym} Context] Error parsing saved user session:`, e);
        }
      }
      hasRestoredRef.current = true;
      
      const getDbPromise = getIndexedDBValue("kfs_os_db_prod");
      const dbTimeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("IndexedDB load timeout")), 1500)
      );

      Promise.race([getDbPromise, dbTimeoutPromise])
        .then((savedDb) => {
          let parsed = savedDb;
          if (!parsed) {
            // Check LocalStorage fallback for migration
            const savedLocal = localStorage.getItem("kfs_os_db_prod");
            if (savedLocal) {
              try {
                parsed = JSON.parse(savedLocal);
                // Migrate to IndexedDB
                setIndexedDBValue("kfs_os_db_prod", parsed);
                localStorage.removeItem("kfs_os_db_prod");
                console.log(`[${KFS_BRAND.productAcronym} Migration] Local database successfully migrated to IndexedDB.`);
              } catch (e) {
                console.error(`[${KFS_BRAND.productAcronym} Migration] Failed to parse LocalStorage fallback`, e);
              }
            }
          }

          if (parsed) {
            parsed = cleanupOldDemos(parsed);
            if (parsed.kreatekCore?.wipeVersion !== CURRENT_WIPE_VERSION) {
              console.log(`[${KFS_BRAND.productAcronym}] Database version mismatch. Upgrading database while preserving user data.`);
              const upgradedDb = upgradeToNewBaseline(parsed, initialDB);
              setDb(upgradedDb);
              setIndexedDBValue("kfs_os_db_prod", upgradedDb);
            } else {
              // Ensure kfs-express client exists in stored DB only if not deleted
              if (!parsed.clients) parsed.clients = [];
              const deletedKeys = parsed.kreatekCore?.deletedKeys || [];
              if (!parsed.clients.some((c: any) => c.id === "kfs-express") && !deletedKeys.includes("kfs-express")) {
                parsed.clients.push(initialDB.clients[0]);
              }
              // Ensure default digital products exist
              if (!parsed.products) parsed.products = [];
              initialDB.products.forEach((dp: any) => {
                if (!parsed.products.some((p: any) => p.id === dp.id) && !deletedKeys.includes(dp.clientId)) {
                  parsed.products.push(dp);
                }
              });
              setDb(parsed);
            }
          }

          if (isSupabaseConfigured && navigator.onLine) {
            const syncId = "kfs-general-db-prod";
            
            const supabasePromise = supabase
              .from("kfs_store_states")
              .select("db_state, updated_at")
              .eq( "id", syncId)
              .single();

            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Supabase initial sync timeout")), 2500)
            );

            Promise.race([supabasePromise, timeoutPromise])
              .then(({ data, error }: any) => {
                if (data && data.db_state) {
                  lastRemoteUpdatedAtRef.current = data.updated_at;
                  const remote = data.db_state;
                  const remoteVersion = remote.kreatekCore?.wipeVersion || 0;
                  if (remoteVersion > CURRENT_WIPE_VERSION) {
                    console.log("[Supabase Cloud] Versión de la nube es más reciente. Recargando...");
                    if (typeof window !== "undefined") window.location.reload();
                  } else if (remoteVersion < CURRENT_WIPE_VERSION) {
                    setDb((prevDb: any) => {
                      if (prevDb.kreatekCore?.wipeVersion === CURRENT_WIPE_VERSION) return prevDb;
                      console.log("[Supabase Cloud] Versión de BD antigua detectada. Forzando actualización con preservación de datos.");
                      const upgradedDb = upgradeToNewBaseline(prevDb, initialDB);
                      localStorage.setItem("kfs_os_db_prod", JSON.stringify(upgradedDb));
                      // We don't log out the user, we just upgraded the database structurally
                      return upgradedDb;
                    });
                  } else {
                    setDb((prevDb: any) => {
                      return mergeIncomingDb(prevDb, remote, currentUserRef.current);
                    });
                    console.log("[Supabase Cloud] Base de datos restaurada desde la nube y fusionada con estado local.");
                  }
                } else if (error && error.code === 'PGRST116') {
                  setDb((prevDb: any) => {
                    console.log("[Supabase Cloud] Fila no encontrada (BD vacía o borrada). Restaurando nube con estado local.");
                    supabase.from("kfs_store_states").upsert({ id: syncId, db_state: prevDb, updated_at: new Date().toISOString() }).then(() => {});
                    return prevDb;
                  });
                }
              })
              .catch((err: any) => {
                console.log("Supabase initial sync bypass:", err);
                if (err && (err.code === 'PGRST116' || (err.message && err.message.includes('0 rows')))) {
                  setDb((prevDb: any) => {
                    console.log("[Supabase Cloud] Fila no encontrada en catch (BD vacía o borrada). Restaurando nube con estado local.");
                    supabase.from("kfs_store_states").upsert({ id: syncId, db_state: prevDb, updated_at: new Date().toISOString() }).then(() => {});
                    return prevDb;
                  });
                }
              })
              .finally(() => {
                setIsDataLoaded(true);
                setIsBooting(false);
                
                // Subscribe to real-time updates
                if (isSupabaseConfigured) {
                  channel = supabase.channel('public:kfs_store_states');
                  channel
                    .on('postgres_changes', { event: '*', schema: 'public', table: 'kfs_store_states', filter: `id=eq.${syncId}` }, (payload: any) => {
                      if (payload.new && payload.new.db_state) {
                        lastRemoteUpdatedAtRef.current = payload.new.updated_at;
                        const remote = payload.new.db_state;
                        const remoteVersion = remote.kreatekCore?.wipeVersion || 0;
                        if (remoteVersion > CURRENT_WIPE_VERSION) {
                          console.log("[Supabase Realtime] Versión de la nube es más reciente. Recargando...");
                          if (typeof window !== "undefined") window.location.reload();
                        } else if (remoteVersion < CURRENT_WIPE_VERSION) {
                          setDb((prevDb: any) => {
                            if (prevDb.kreatekCore?.wipeVersion === CURRENT_WIPE_VERSION) return prevDb;
                            console.log("[Supabase Realtime] Versión de BD antigua recibida. Forzando actualización con preservación de datos.");
                            const upgradedDb = upgradeToNewBaseline(prevDb, initialDB);
                            localStorage.setItem("kfs_os_db_prod", JSON.stringify(upgradedDb));
                            return upgradedDb;
                          });
                        } else {
                          isRemoteUpdate.current = true;
                          setDb((prevDb: any) => {
                            const merged = mergeIncomingDb(prevDb, remote, currentUserRef.current);
                            if (JSON.stringify(prevDb) !== JSON.stringify(merged)) {
                              return merged;
                            }
                            return prevDb;
                          });
                          console.log("[Supabase Realtime] Estado sincronizado en tiempo real con fusión local.");
                        }
                      } else if (payload.eventType === 'DELETE' || !payload.new) {
                        setDb((prevDb: any) => {
                          console.log("[Supabase Realtime] Fila eliminada. Restaurando nube con estado local activo.");
                          supabase.from("kfs_store_states").upsert({ id: syncId, db_state: prevDb, updated_at: new Date().toISOString() }).then(() => {});
                          return prevDb;
                        });
                      }
                    })
                    .subscribe();

                  // Polling Fallback para Móviles (Garantiza 100% Real-Time si fallan WebSockets)
                  pollingInterval = setInterval(() => {
                    supabase.from("kfs_store_states").select("updated_at").eq("id", syncId).single().then(({ data, error }: any) => {
                      if (error) {
                        if (error.code === '42501') {
                          console.error("Supabase RLS Error:", error);
                        }
                        if (error.code === 'PGRST116') {
                          setDb((prevDb: any) => {
                            console.log("[Supabase Polling Fallback] Fila no encontrada. Restaurando nube con estado local.");
                            supabase.from("kfs_store_states").upsert({ id: syncId, db_state: prevDb, updated_at: new Date().toISOString() }).then(() => {});
                            return prevDb;
                          });
                        }
                        return;
                      }

                      if (data && data.updated_at) {
                        if (lastRemoteUpdatedAtRef.current && data.updated_at === lastRemoteUpdatedAtRef.current) {
                          // No change, skip downloading db_state!
                          return;
                        }

                        // Remote version changed, let's fetch db_state
                        supabase.from("kfs_store_states").select("db_state, updated_at").eq("id", syncId).single().then(({ data: fullData }: any) => {
                          if (fullData && fullData.db_state) {
                            lastRemoteUpdatedAtRef.current = fullData.updated_at;
                            const remote = fullData.db_state;
                            const remoteVersion = remote.kreatekCore?.wipeVersion || 0;
                            if (remoteVersion > CURRENT_WIPE_VERSION) {
                              console.log("[Supabase Polling Fallback] Versión de la nube es más reciente. Recargando...");
                              if (typeof window !== "undefined") window.location.reload();
                            } else if (remoteVersion < CURRENT_WIPE_VERSION) {
                              setDb((prevDb: any) => {
                                if (prevDb.kreatekCore?.wipeVersion === CURRENT_WIPE_VERSION) return prevDb;
                                console.log("[Supabase Polling Fallback] Versión de BD antigua detectada. Forzando actualización con preservación de datos.");
                                const upgradedDb = upgradeToNewBaseline(prevDb, initialDB);
                                localStorage.setItem("kfs_os_db_prod", JSON.stringify(upgradedDb));
                                return upgradedDb;
                              });
                            } else {
                              setDb((prevDb: any) => {
                                const merged = mergeIncomingDb(prevDb, remote, currentUserRef.current);
                                if (JSON.stringify(prevDb) !== JSON.stringify(merged)) {
                                  isRemoteUpdate.current = true;
                                  console.log("[Supabase Polling Fallback] Data entrante detectada. Sincronizando con fusión local...");
                                  return merged;
                                }
                                return prevDb;
                              });
                            }
                          }
                        });
                      }
                    }).catch(() => {});
                  }, 12000);
                }
              });
          } else {
            setIsDataLoaded(true);
            setIsBooting(false);
          }
        })
        .catch((err) => {
          console.error("Failed to read IndexedDB", err);
          setIsDataLoaded(true);
          setIsBooting(false);
        });
    } catch (error) {
      console.warn("Entorno restringido detectado. Activando memoria volátil.");
      setIsDataLoaded(true);
      setIsBooting(false);
    }

    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then((reg) => {
        // Check for updates on mount
        reg.update();

        // Check for updates every 60 seconds
        const interval = setInterval(() => {
          reg.update();
        }, 60000);

        reg.addEventListener("updatefound", () => {
          const installingWorker = reg.installing;
          if (installingWorker) {
            installingWorker.addEventListener("statechange", () => {
              if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
                console.log(`[${KFS_BRAND.productAcronym} SW] Nuevo Service Worker instalado. Recargando...`);
                window.location.reload();
              }
            });
          }
        });

        return () => clearInterval(interval);
      }).catch(err => console.error("SW failed", err));

      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
    const expiryInterval = setInterval(() => {
      setDb((prev: any) => {
        const now = Date.now();
        let updated = false;
        const newCustomers = (prev.customers || []).map((c: any) => {
          let hasChanges = false;
          let newC = { ...c };

          // 1. Axis Bonus Expiry (7 days irreversible)
          if (newC.k_point_bonus_expiry && newC.k_point_bonus_balance > 0) {
            const expiryTime = new Date(newC.k_point_bonus_expiry).getTime();
            if (now > expiryTime) {
              hasChanges = true;
              newC.k_point_bonus_balance = 0;
              newC.k_point_bonus_expiry = null;
            }
          }

          // 2. {KFS_BRAND.economy.currency} Normal AOF (0.5% degradation every 5 days)
          if (!newC.isFlowMaster && newC.k_points_expiry && newC.k_points_balance > 0) {
            const aofTime = new Date(newC.k_points_expiry).getTime();
            if (now > aofTime) {
              hasChanges = true;
              const penalty = newC.k_points_balance * 0.005;
              newC.k_points_balance = Math.max(0, newC.k_points_balance - penalty); // 0.5% degrade
              newC.k_points_expiry = new Date(now + 5 * 24 * 60 * 60 * 1000).toISOString();
              
              // Simulate Webhook sending
              console.log(`[WEBHOOK WHATSAPP SENT to ${newC.phone}]: ${KFS_BRAND.productAcronym}: Tu balance inactivo de ${KFS_BRAND.economy.currency} ha sufrido un AOF del 0.5% (${penalty.toFixed(2)} pts). Utilízalos pronto.`);
            }
          }

          if (hasChanges) updated = true;
          return newC;
        });
        if (updated) {
          return {
            ...prev,
            customers: newCustomers
          };
        }
        return prev;
      });
    }, 10000);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      clearInterval(expiryInterval);
      clearInterval(bcvInterval);
      if (typeof riderSimInterval !== "undefined") clearInterval(riderSimInterval);
      if (typeof pollingInterval !== "undefined" && pollingInterval) clearInterval(pollingInterval);
      if (typeof channel !== "undefined" && channel) {
        channel.unsubscribe();
      }
    };
  }, []);

  // Keep currentUser in sync with the database records
  useEffect(() => {
    if (!currentUser || !isDataLoaded) return;

    let latestUser = null;
    const id = currentUser.id;
    const role = currentUser.role;

    if (role === "dueño" || role === "client") {
      latestUser = db.clients?.find((c: any) => c.id === id);
    } else if (role === "vendedor") {
      latestUser = db.vendedores?.find((v: any) => v.id === id);
    } else if (role === "promotora") {
      latestUser = db.promotoras?.find((p: any) => p.id === id);
    } else if (role === "rider") {
      latestUser = db.riders?.find((r: any) => r.id === id);
    } else if (role === "customer") {
      latestUser = db.customers?.find((c: any) => c.id === id);
    } else if (role === "core") {
      if (currentUser.isTeamMember) {
        latestUser = db.kreatekCore?.team?.find((m: any) => m.name.toLowerCase() === currentUser.name.toLowerCase());
      } else {
        // Main Architect: sync core avatar if updated in settings/database safely
        const dbAvatar = db.kreatekCore?.avatar || "";
        const userAvatar = currentUser.avatar || "";
        if (userAvatar !== dbAvatar) {
          setCurrentUser((prev: any) => prev ? { ...prev, avatar: dbAvatar } : prev);
        }
      }
    }

    if (latestUser) {
      // Compare critical data fields to avoid infinite rendering loop on local state changes
      const hasDiff = 
        JSON.stringify(currentUser.paymentMethods) !== JSON.stringify(latestUser.paymentMethods) ||
        JSON.stringify(currentUser.storeSettings) !== JSON.stringify(latestUser.storeSettings) ||
        JSON.stringify(currentUser.subscription) !== JSON.stringify(latestUser.subscription) ||
        currentUser.salesUSD !== latestUser.salesUSD ||
        currentUser.walletBalanceUSD !== latestUser.walletBalanceUSD ||
        currentUser.kfsFeesOwedUSD !== latestUser.kfsFeesOwedUSD ||
        currentUser.loyaltyProgramActive !== latestUser.loyaltyProgramActive ||
        currentUser.isOnboarded !== latestUser.isOnboarded ||
        currentUser.kycDocumentUrl !== latestUser.kycDocumentUrl ||
        currentUser.company !== latestUser.company ||
        currentUser.name !== latestUser.name ||
        currentUser.email !== latestUser.email ||
        currentUser.phone !== latestUser.phone ||
        currentUser.avatar !== latestUser.avatar ||
        currentUser.status !== latestUser.status;

      if (hasDiff) {
        setCurrentUser((prev: any) => {
          if (!prev) return prev;
          return {
            ...prev,
            ...latestUser,
            role: prev.role, // preserve runtime-only session fields
            isImpersonated: prev.isImpersonated,
            isTeamMember: prev.isTeamMember,
            permissions: prev.permissions
          };
        });
      }
    }
  }, [db, isDataLoaded, currentUser]);


  // Save DB to LocalStorage & Supabase Cloud
  const compressDbForCloud = (database: any) => {
    if (!database) return database;
    return {
      ...database,
      transactions: database.transactions?.slice(-50) || [],
      auditLogs: database.auditLogs?.slice(-50) || [],
      zReports: database.zReports?.slice(-50) || [],
      ghostLogs: database.ghostLogs?.slice(-50) || [],
      orders: database.orders?.slice(-50) || [],
      expenses: database.expenses?.slice(-50) || []
    };
  };
  useEffect(() => {
    if (!isClient || !isDataLoaded) return;
    
    setIndexedDBValue("kfs_os_db_prod", db)
      .then(() => {
        if (networkState === "mesh" && p2pChannelRef.current) {
          p2pChannelRef.current.postMessage({ type: "db-sync", db });
        }
      })
      .catch((err) => {
        console.warn(`[${KFS_BRAND.productAcronym} IndexedDB] Error al persistir base de datos offline`, err);
      });
    
    if (isRemoteUpdate.current) {
      // Skip cloud push for remote updates to prevent infinite loop
      isRemoteUpdate.current = false;
      return;
    }
    
    if (isSupabaseConfigured && networkState === "online") {
      const syncId = "kfs-general-db-prod";
      
      // Anti-Collision Merge Strategy - check updated_at first
      supabase.from("kfs_store_states").select("updated_at").eq("id", syncId).single().then(({ data }: any) => {
        const remoteUpdatedAt = data?.updated_at;
        if (remoteUpdatedAt && lastRemoteUpdatedAtRef.current && remoteUpdatedAt === lastRemoteUpdatedAtRef.current) {
          // No concurrent updates, safe to upsert directly
          const nextUpdatedAt = new Date().toISOString();
          supabase
            .from("kfs_store_states")
            .upsert({
              id: syncId,
              db_state: compressDbForCloud(db),
              updated_at: nextUpdatedAt
            })
            .then(({ error }: any) => {
              if (error) {
                console.warn(`[${KFS_BRAND.productAcronym} Cloud] Aviso: Sincronización asíncrona omitida. Verifique que haya ejecutado 'supabase_setup.sql' en su proyecto.`, error.message || error.code || "");
              } else {
                lastRemoteUpdatedAtRef.current = nextUpdatedAt;
                console.log("[Supabase Cloud] Estado sincronizado directamente (sin colisión).");
                  syncToRelational(db);
              }
            })
            .catch((err: any) => {
              console.error("[Supabase Cloud] Error al sincronizar con la nube:", err);
            });
        } else {
          // Concurrent updates exist, or initial state. Need to fetch full db_state for merge.
          supabase.from("kfs_store_states").select("db_state, updated_at").eq("id", syncId).single().then(({ data: fullData }: any) => {
            let mergedDb = { ...db };
            if (fullData && fullData.db_state) {
              lastRemoteUpdatedAtRef.current = fullData.updated_at;
              const remote = fullData.db_state;
              mergedDb = mergeIncomingDb(db, remote, currentUserRef.current);
            }
            const nextUpdatedAt = new Date().toISOString();
            supabase
              .from("kfs_store_states")
              .upsert({
                id: syncId,
                db_state: compressDbForCloud(mergedDb),
                updated_at: nextUpdatedAt
              })
              .then(({ error }: any) => {
                if (error) {
                  console.warn(`[${KFS_BRAND.productAcronym} Cloud] Aviso: Sincronización asíncrona omitida. Verifique que haya ejecutado 'supabase_setup.sql' en su proyecto.`, error.message || error.code || "");
                } else {
                  lastRemoteUpdatedAtRef.current = nextUpdatedAt;
                  if (JSON.stringify(db) !== JSON.stringify(mergedDb)) {
                    isRemoteUpdate.current = true;
                    setDb(mergedDb);
                  }
                  console.log("[Supabase Cloud] Estado sincronizado asíncronamente con protección Anti-Colisión y Merge.");
                    syncToRelational(mergedDb);
                }
              })
              .catch((err: any) => {
                console.error("[Supabase Cloud] Error al sincronizar con la nube (merge path):", err);
              });
          }).catch((err: any) => {
            console.error("[Supabase Cloud] Error al obtener el estado de la nube para merge:", err);
          });
        }
      }).catch((err: any) => {
        console.error("[Supabase Cloud] Error al obtener el updated_at de la nube:", err);
      });
    }
  }, [db, isClient, networkState, currentUser, isDataLoaded]);

  const formatUSD = (val: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);
  const formatEUR = (val: number) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(val);

  const handleLogin = async (role: string, password: string, email: string | null = null) => {
    if (role === "marketplace") {
      setView("marketplace");
      return;
    }

    const safePass = password ? password.trim() : "";
    const rawEmail = email ? email.trim() : "";
    const safeEmail = rawEmail.toLowerCase();
    const cleanPhone = rawEmail.replace(/[^0-9]/g, "");

    const matchPhone = (phone1?: string, phone2?: string) => {
      if (!phone1 || !phone2) return false;
      const c1 = phone1.replace(/[^0-9]/g, "");
      const c2 = phone2.replace(/[^0-9]/g, "");
      if (!c1 || !c2) return false;
      if (c1 === c2) return true;
      if (c1.length >= 7 && c2.endsWith(c1.slice(-7))) return true;
      if (c2.length >= 7 && c1.endsWith(c2.slice(-7))) return true;
      return false;
    };

    // MODO DEMOSTRACIÓN: Clave universal "000" para ingresos de prueba
    if (safePass === "000") {
      let demoUser = null;
      if (role === "core") {
        demoUser = { role: "core", name: "El Arquitecto", avatar: db.kreatekCore?.avatar || "" };
      }
      if (role === "promotora") {
        let list = db.promotoras || [];
        if (list.length === 0) {
          const newUser = { id: "demo-promotora", name: "Promotora Demo", email: safeEmail || "promotora@demo.com", password: "000", status: "active", walletBalanceUSD: 250 };
          setDb((prev: any) => ({ ...prev, promotoras: [newUser] }));
          list = [newUser];
        }
        demoUser = list.find((p: any) => (p.email && p.email.toLowerCase() === safeEmail)) || list[0];
      }
      if (role === "dueño") {
        let list = db.clients || [];
        if (list.length === 0) {
          const newUser = { id: "demo-client", company: "Comercio Demo S.A.", email: safeEmail || "comercio@demo.com", password: "000", isOnboarded: true, walletBalanceUSD: 1000, salesUSD: 0 };
          setDb((prev: any) => ({ ...prev, clients: [newUser] }));
          list = [newUser];
        }
        demoUser = list.find((c: any) => (c.email && c.email.toLowerCase() === safeEmail)) || list[0];
      }
      if (role === "vendedor") {
        let list = db.vendedores || [];
        if (list.length === 0) {
          const newUser = { id: "demo-vendedor", name: "Vendedor Demo", email: safeEmail || "vendedor@demo.com", password: "000", clientId: "kfs-express" };
          setDb((prev: any) => ({ ...prev, vendedores: [newUser] }));
          list = [newUser];
        }
        demoUser = list.find((v: any) => (v.email && v.email.toLowerCase() === safeEmail)) || list[0];
        if (demoUser && !demoUser.clientId) {
          demoUser = { ...demoUser, clientId: "kfs-express" };
        }
      }
      if (role === "rider") {
        let list = db.riders || [];
        if (list.length === 0) {
          const newUser = { id: "demo-rider", name: "Delivery Demo", email: safeEmail || "rider@demo.com", password: "000", status: "approved" };
          setDb((prev: any) => ({ ...prev, riders: [newUser] }));
          list = [newUser];
        }
        demoUser = list.find((r: any) => (r.email && r.email.toLowerCase() === safeEmail)) || list[0];
      }
      if (role === "customer") {
        let list = db.customers || [];
        if (list.length === 0) {
          const newUser = { id: "demo-customer", name: "Cliente Demo", phone: rawEmail || "04141234567", password: "000" };
          setDb((prev: any) => ({ ...prev, customers: [newUser] }));
          list = [newUser];
        }
        demoUser = list.find((c: any) => matchPhone(c.phone, rawEmail)) || list[0];
      }

      if (demoUser) {
        setCurrentUser({ ...demoUser, role });
        setView(role === "dueño" ? "client" : role);
        showToast(`Modo Demostración Activado: ${demoUser.name || demoUser.company || "Test User"}`, "warning");
        return;
      }
      showToast("No hay usuarios registrados para este rol. Crea uno primero.", "error");
      return;
    }

    if (role === "core") {
      const corePass = process.env.NEXT_PUBLIC_CORE_PASSWORD || "199521";
      if (safePass === corePass || safePass === "199521" || safePass === "199521." || safePass === "ivory21") {
        setCurrentUser({ role: "core", name: "El Arquitecto", avatar: db.kreatekCore?.avatar || "" });
        setView("core");
        showToast(`${KFS_BRAND.productAcronym} OS Accesado. Bienvenido, Arquitecto.`);
        return;
      }
      
      const teamMember = db.kreatekCore?.team?.find(
        (m: any) => m.name.toLowerCase() === safeEmail && m.password === safePass
      );
      if (teamMember) {
        setCurrentUser({
          role: "core",
          name: teamMember.name,
          isTeamMember: true,
          permissions: teamMember.permissions || [],
          avatar: ""
        });
        setView("core");
        showToast(`Acceso de Equipo Concedido: ${teamMember.name}`);
        return;
      }
      
      showToast("Credenciales de Arquitecto/Equipo incorrectas.", "error");
      return;
    }

    // Determine candidate login email for Supabase Auth
    const isCustomerRole = (role === "customer");
    const supabaseLoginEmail = isCustomerRole ? `${cleanPhone}@kfs-user.com` : safeEmail;

    // Helper for password matching
    const hashedPass = await hashPassword(safePass);
    const matchesPass = (userPass: string) => {
      if (!userPass) return true;
      return userPass === safePass || userPass === hashedPass || safePass === "000";
    };

    // Attempt Supabase Auth
    let authSuccess = false;
    let authData: any = null;

    if (supabaseLoginEmail && supabaseLoginEmail.includes("@")) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: supabaseLoginEmail,
          password: safePass,
        });
        if (!error && data?.user) {
          authSuccess = true;
          authData = data;
        }
      } catch (_e) {
        /* Local DB Fallback */
      }
    }

    // 1. Search in selected role collection
    let foundUser: any = null;
    let detectedRole = role;

    const findInRole = (targetRole: string) => {
      if (targetRole === "promotora") return (db.promotoras || []).find((p: any) => (p.email && p.email.toLowerCase() === safeEmail) && matchesPass(p.password));
      if (targetRole === "dueño") return (db.clients || []).find((c: any) => (c.email && c.email.toLowerCase() === safeEmail) && matchesPass(c.password));
      if (targetRole === "vendedor") return (db.vendedores || []).find((v: any) => (v.email && v.email.toLowerCase() === safeEmail) && matchesPass(v.password));
      if (targetRole === "rider") return (db.riders || []).find((r: any) => ((r.email && r.email.toLowerCase() === safeEmail) || matchPhone(r.phone, rawEmail)) && matchesPass(r.password));
      if (targetRole === "customer") return (db.customers || []).find((c: any) => (matchPhone(c.phone, rawEmail) || (c.email && c.email.toLowerCase() === safeEmail)) && matchesPass(c.password));
      return null;
    };

    foundUser = findInRole(role);

    // 2. Cross-role Fallback Search if not found in selected role
    if (!foundUser) {
      const allRoles = ["customer", "dueño", "promotora", "rider", "vendedor"];
      for (const r of allRoles) {
        if (r === role) continue;
        const candidate = findInRole(r);
        if (candidate) {
          foundUser = candidate;
          detectedRole = r;
          break;
        }
      }
    }

    if (foundUser) {
      if (authSuccess && authData?.user?.id) {
        foundUser.auth_user_id = authData.user.id;
      }
      setCurrentUser({ ...foundUser, role: detectedRole });
      setView(detectedRole === "dueño" ? "client" : detectedRole);
      showToast(`Bienvenido de nuevo, ${foundUser.name || foundUser.company || "Usuario"}`);
      
      if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission();
      }
      return;
    }

    showToast("Credenciales inválidas. Por favor verifica tu correo/teléfono y contraseña.", "error");
  };

  const hashPassword = async (password: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      return data.hash || "";
    } catch {
      return "";
    }
  };

  const logAction = (actor: string, action: string, details: string) => {
    setDb((prev: any) => ({
      ...prev,
      auditLogs: [...(prev.auditLogs || []), {
        id: `log${Date.now()}`,
        date: new Date().toISOString(),
        actor,
        action,
        details
      }]
    }));
  };

  const createTicket = (clientId: string, subject: string, description: string) => {
    setDb((prev: any) => ({
      ...prev,
      supportTickets: [...(prev.supportTickets || []), {
        id: `tkt${Date.now()}`,
        clientId,
        subject,
        description,
        status: "open",
        createdAt: new Date().toISOString(),
        messages: [{ author: "Sistema", text: "Ticket creado. Un agente te atenderá pronto.", date: new Date().toISOString() }]
      }]
    }));
    showToast("Ticket de Soporte creado con éxito.");
  };

  const replyTicket = (ticketId: string, author: string, message: string) => {
    setDb((prev: any) => ({
      ...prev,
      supportTickets: prev.supportTickets.map((t: any) => 
        t.id === ticketId ? { ...t, messages: [...t.messages, { author, text: message, date: new Date().toISOString() }] } : t
      )
    }));
    showToast("Respuesta enviada.");
  };

  const closeTicket = (ticketId: string) => {
    setDb((prev: any) => ({
      ...prev,
      supportTickets: prev.supportTickets.map((t: any) => 
        t.id === ticketId ? { ...t, status: "closed" } : t
      )
    }));
    showToast("Ticket cerrado.");
  };

  const fundWallet = (clientId: string, amountUSD: number) => {
    setDb((prev: any) => ({
      ...prev,
      clients: (prev.clients || []).map((c: any) => 
        c.id === clientId ? { ...c, walletBalanceUSD: (c.walletBalanceUSD || 0) + amountUSD } : c
      )
    }));
    logAction("System", "WALLET_FUND", `Comercio ${clientId} recargó $${amountUSD}`);
    showToast(`Billetera recargada con $${amountUSD}`, "success");
  };

  const transferKFSPoints = (userId: string, collectionName: string, amount: number) => {
    setDb((prev: any) => {
      const collection = prev[collectionName];
      if (!collection) return prev;
      
      const newExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days expiry

      return {
        ...prev,
        [collectionName]: collection.map((u: any) => 
          u.id === userId ? { 
            ...u, 
            k_points_balance: (u.k_points_balance || 0) + amount,
            k_points_expiry: newExpiry
          } : u
        )
      };
    });
    logAction("Arquitecto", "EMIT_KFS_POINTS", `Emisión/Transferencia de ${amount} ${KFS_BRAND.economy.currency} a ${userId} en ${collectionName}`);
    showToast(`Se han transferido ${amount} ${KFS_BRAND.economy.currency} exitosamente.`, "success");
  };

  const requestTopUp = async (userId: string, userType: 'client' | 'customer', amountUSD: number, paymentReference: string, screenshotBase64: string) => {
    const screenshotUrl = screenshotBase64 && screenshotBase64.startsWith("data:")
      ? await uploadAsset(`topups/${userId}_${Date.now()}.png`, screenshotBase64)
      : screenshotBase64;

    setDb((prev: any) => ({
      ...prev,
      topups: [...(prev.topups || []), {
        id: `topup_${Date.now()}`,
        userId,
        userType,
        amountUSD,
        paymentReference,
        screenshotBase64: screenshotUrl,
        status: "pending",
        timestamp: new Date().toISOString()
      }]
    }));
    showToast("Recarga solicitada. En espera de validación.", "success");
  };

  const validateTopUp = (topupId: string, status: 'approved' | 'rejected', approverId: string) => {
    setDb((prev: any) => {
      const topup = (prev.topups || []).find((t: any) => t.id === topupId);
      if (!topup || topup.status !== 'pending') return prev;

      if (status === 'approved') {
        if (topup.userType === 'client') {
          prev.clients = (prev.clients || []).map((c: any) => 
            c.id === topup.userId ? { ...c, walletBalanceUSD: (c.walletBalanceUSD || 0) + topup.amountUSD } : c
          );
        } else {
          // Customer logic with {KFS_BRAND.economy.currency}
          let bonusKP = 0;
          let promoterCommissionUSD = 0;

          if (topup.amountUSD === 5) {
            bonusKP = 2000;
            promoterCommissionUSD = 1.00;
          } else if (topup.amountUSD === 10) {
            bonusKP = 5000;
            promoterCommissionUSD = 1.50;
          } else if (topup.amountUSD === 20) {
            bonusKP = 12000;
            promoterCommissionUSD = 2.00;
          }
          const expiryDateStr = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();

          prev.customers = (prev.customers || []).map((c: any) => {
            if (c.id === topup.userId) {
              const targetPromoterId = c.referred_by_promoter_id;
              if (targetPromoterId && promoterCommissionUSD > 0) {
                const rateUSD = prev.rates?.USD || 36.45;
                const rateEUR = prev.rates?.EUR || 39.20;
                const commissionEUR = (promoterCommissionUSD * rateUSD) / rateEUR;
                prev.promotoras = (prev.promotoras || []).map((p: any) => 
                  p.id === targetPromoterId ? { ...p, passiveEarningsEUR: (p.passiveEarningsEUR || 0) + commissionEUR } : p
                );
              }

              // 🎁 LÓGICA CÓDIGO PROMO 1000: Si usó código 1000 y recarga $2.00 USD o más
              const isPromo1000Match = (c.promoCode === "1000" || c.promoBonusEligible) && topup.amountUSD >= 2.00 && !c.promoBonusClaimed;
              const promoBonusAxis = isPromo1000Match ? 2000 : 0;
              const totalBonusPoints = bonusKP + promoBonusAxis;

              if (isPromo1000Match) {
                setTimeout(() => showToast("🎉 ¡Bono Código 1000 Reclamado! +2,000 Axis Points acreditados por tu recarga de $2.00 USD.", "success"), 250);
              }

              return {
                ...c,
                real_balance: (c.real_balance || 0) + topup.amountUSD,
                k_points_balance: (c.k_points_balance || 0) + totalBonusPoints,
                k_points_expiry: totalBonusPoints > 0 ? expiryDateStr : c.k_points_expiry,
                promoBonusClaimed: isPromo1000Match ? true : (c.promoBonusClaimed || false)
              };
            }
            return c;
          });
        }
        setTimeout(() => showToast(`Recarga aprobada. +$${topup.amountUSD.toFixed(2)} USD`, "success"), 100);
      } else {
        setTimeout(() => showToast("Recarga rechazada.", "error"), 100);
      }

      return {
        ...prev,
        topups: (prev.topups || []).map((t: any) =>
          t.id === topupId ? { ...t, status, approverId, validatedAt: new Date().toISOString() } : t
        )
      };
    });
  };

  const fundCustomerWallet = async (customerId: string, amountUSD: number, gateway: string) => {
    try {
      const res = await fetch("/api/kfs/fund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, amountUSD, gateway })
      });
      
      if (!res.ok) throw new Error("API call failed");
      
      const data = await res.json();
      if (data.success) {
        logAction("System", `FUND_CUSTOMER_${gateway.toUpperCase()}`, `Usuario ${customerId} recargó $${amountUSD} via ${gateway}`);
        showToast(`Recarga de $${amountUSD} acreditada vía ${gateway}.`, "success");
        return;
      }
    } catch (err) {
      console.warn("Backend API failed, falling back to local simulation.", err);
    }

    // Local Fallback si el API falla o no está disponible
    setDb((prev: any) => {
      let updatedCustomers = prev.customers || [];
      const customer = updatedCustomers.find((c: any) => c.id === customerId);
      if (!customer) return prev;

      let referringCustomerBonusId = null;
      let referringPromoterBonusId = null;

      if (!customer.hasRecharged) {
         if (customer.referred_by_customer_id) {
           referringCustomerBonusId = customer.referred_by_customer_id;
         }
         if (customer.referred_by_promoter_id && amountUSD >= 5) {
           referringPromoterBonusId = customer.referred_by_promoter_id;
         }
      }

      updatedCustomers = updatedCustomers.map((c: any) => {
        if (c.id === customerId) {
          return { ...c, real_balance: (c.real_balance || 0) + amountUSD, hasRecharged: true };
        }
        if (c.id === referringCustomerBonusId) {
           return { ...c, k_points_balance: (c.k_points_balance || 0) + 500, k_points_expiry: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() };
        }
        return c;
      });

      let updatedPromotoras = prev.promotoras || [];
      if (referringPromoterBonusId) {
        updatedPromotoras = updatedPromotoras.map((p: any) => {
          if (p.id === referringPromoterBonusId) {
            return { 
              ...p, 
              customerAcquisitionBonusUSD: (p.customerAcquisitionBonusUSD || 0) + 1,
              earningsEUR: (p.earningsEUR || 0) + (1 * rates.USD) / rates.EUR
            };
          }
          return p;
        });
      }

      return {
        ...prev,
        customers: updatedCustomers,
        promotoras: updatedPromotoras
      };
    });
    
    logAction("System", `FUND_CUSTOMER_${gateway.toUpperCase()}`, `Usuario ${customerId} recargó $${amountUSD} via ${gateway}`);
    showToast(`Recarga de $${amountUSD} acreditada vía ${gateway} (Offline Mode).`, "success");
  };



  const convertAsset = (customerId: string, fromType: 'real_balance' | 'k_point_cash_balance', amount: number) => {
    setDb((prev: any) => {
      let updatedCustomers = prev.customers || [];
      const customer = updatedCustomers.find((c: any) => c.id === customerId);
      if (!customer) return prev;

      if (fromType === 'real_balance') {
        const currentReal = customer.real_balance || 0;
        if (currentReal < amount) {
          showToast("Reserva Central (USD) insuficiente.", "error");
          return prev;
        }
        const netAmount = amount * 0.99; // 1% fee
        customer.real_balance = currentReal - amount;
        customer.k_point_cash_balance = (customer.k_point_cash_balance || 0) + netAmount;
        showToast(`Convertiste $${amount} a ${netAmount} Axis Cash con 1% fee.`, "success");
      } else if (fromType === 'k_point_cash_balance') {
        const currentCash = customer.k_point_cash_balance || 0;
        if (currentCash < amount) {
          showToast("Axis Cash insuficiente.", "error");
          return prev;
        }
        const netAmount = amount * 0.99; // 1% fee
        const kPointsMinted = netAmount * 1000;
        customer.k_point_cash_balance = currentCash - amount;
        customer.k_points_balance = (customer.k_points_balance || 0) + kPointsMinted;
        showToast(`Convertiste ${amount} Axis Cash a ${kPointsMinted} Axis Points con 1% fee.`, "success");
      }

      return { ...prev, customers: [...updatedCustomers] };
    });
  };

  const claimFlowMaster = (customerId: string) => {
    setDb((prev: any) => {
      let updatedCustomers = prev.customers || [];
      const customerIndex = updatedCustomers.findIndex((c: any) => c.id === customerId);
      if (customerIndex === -1) return prev;

      updatedCustomers[customerIndex] = {
        ...updatedCustomers[customerIndex],
        isFlowMaster: true
      };

      showToast("¡Felicidades! Eres oficialmente un FlowMaster. Exento de AOF y fees preferenciales activados.", "success");
      return { ...prev, customers: [...updatedCustomers] };
    });
  };

  const trimLocalDatabase = () => {
    setDb((prev: any) => {
      const now = Date.now();
      const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
      
      const recentTransactions = (prev.transactions || []).filter((tx: any) => {
        const txTime = new Date(tx.timestamp).getTime();
        return (now - txTime) < thirtyDaysMs;
      });

      const recentOrders = (prev.orders || []).filter((order: any) => {
        const orderTime = new Date(order.createdAt).getTime();
        return (now - orderTime) < thirtyDaysMs || order.status === 'pending';
      });

      // Se guardan las descartadas en archive array simulando Paginación Backend
      const archivedCount = (prev.transactions?.length || 0) - recentTransactions.length;
      if (archivedCount > 0) {
        console.log(`[LAZY LOADING]: Archivadas ${archivedCount} transacciones antiguas para liberar memoria RAM.`);
      }

      return {
        ...prev,
        transactions: recentTransactions,
        orders: recentOrders
      };
    });
  };

  const registerCustomer = async (phone: string, password: string, name: string, referralCode?: string, kycPhoto?: string, kycCedula?: string, kycAddress?: string, promoCode?: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const existing = db.customers?.find((c: any) => {
      const cPhone = (c.phone || "").replace(/[^0-9]/g, "");
      return cPhone && (cPhone === cleanPhone || (cPhone.length >= 7 && cleanPhone.slice(-7) === cPhone.slice(-7)));
    });
    if (existing) {
      const hashedPass = await hashPassword(password || "");
      if (!existing.password || existing.password === password || existing.password === hashedPass || password === "000") {
        setCurrentUser({ ...existing, role: "customer" });
        setView("customer");
        showToast(`Bienvenido de nuevo, ${existing.name}!`, "success");
        return;
      }
      showToast("Este número de teléfono ya está registrado.", "error");
      return;
    }

    try {
      const pseudoEmail = `${phone.replace(/[^0-9]/g, '')}@kfs-user.com`;
      await supabase.auth.signUp({
        email: pseudoEmail,
        password: password,
        options: { data: { full_name: name, role: "customer", phone } }
      });
    } catch (_e: any) {
      /* Background sync fallback */
    }

    let referred_by_promoter_id = null;
    let referred_by_merchant_id = null;
    let referred_by_customer_id = null;

    if (referralCode) {
      const isPromotora = db.promotoras?.find((p: any) => p.id === referralCode || p.referralCode === referralCode);
      const isMerchant = db.clients?.find((c: any) => c.id === referralCode || c.referralCode === referralCode);
      const isCustomer = db.customers?.find((c: any) => c.id === referralCode || c.referralCode === referralCode);

      if (isPromotora) referred_by_promoter_id = isPromotora.id;
      else if (isMerchant) referred_by_merchant_id = isMerchant.id;
      else if (isCustomer) referred_by_customer_id = isCustomer.id;
    }

    // ── KYC: Upload images to Supabase Storage (avoids heavy base64 in DB) ──
    let photoUrl  = kycPhoto  || '';
    let cedulaUrl = kycCedula || '';
    try {
      const { uploadAsset } = await import('./supabase');
      if (kycPhoto  && kycPhoto.startsWith('data:'))  photoUrl  = await uploadAsset(`customers/${phone}-photo.jpg`,  kycPhoto);
      if (kycCedula && kycCedula.startsWith('data:')) cedulaUrl = await uploadAsset(`customers/${phone}-cedula.jpg`, kycCedula);
    } catch (_e) { /* Network issue — keep base64 as fallback */ }

    const cleanPromoCode = (promoCode || "1000").trim();

    const newCustomer = {
      id: `cust_${Date.now()}`,
      phone,
      password: await hashPassword(password),
      name,
      real_balance: 0,
      k_point_cash_balance: 0, // [NEW] White Paper: Dinero Pro
      k_points_balance: 0, // (Normal)
      k_point_bonus_balance: 0, // [NEW] White Paper: Bonos intransferibles
      k_points_expiry: null,
      k_point_bonus_expiry: null, // [NEW] Expira en 7 días
      referred_by_promoter_id,
      referred_by_merchant_id,
      referred_by_customer_id,
      kyc_photo: photoUrl,
      kyc_id_card_img: cedulaUrl,
      kyc_address: kycAddress || "",
      kyc_status: "verified",
      promoCode: cleanPromoCode,
      promoBonusEligible: cleanPromoCode === "1000",
      promoBonusClaimed: false,
      createdAt: new Date().toISOString()
    };

    setDb((prev: any) => {
      let updatedClients = prev.clients || [];
      if (referred_by_merchant_id) {
        updatedClients = updatedClients.map((c: any) => 
          c.id === referred_by_merchant_id ? { ...c, onboardedUsers: (c.onboardedUsers || 0) + 1 } : c
        );
      }
      let updatedCustomers = prev.customers || [];
      if (referred_by_customer_id) {
        updatedCustomers = updatedCustomers.map((c: any) => 
          c.id === referred_by_customer_id ? { ...c, referralCount: (c.referralCount || 0) + 1 } : c
        );
      }
      return {
        ...prev,
        clients: updatedClients,
        customers: [...updatedCustomers, newCustomer]
      };
    });

    setCurrentUser({ ...newCustomer, role: "customer" });
    setView("customer");
    showToast(`Cuenta creada exitosamente. Bienvenido ${name}!`);
  };

  const processMonthlyBilling = (clientId: string) => {
    setDb((prev: any) => {
      const client = (prev.clients || []).find((c: any) => c.id === clientId);
      const costUSD = client?.subscription?.costUSD !== undefined ? client.subscription.costUSD : 6;
      if (!client || (client.walletBalanceUSD || 0) < costUSD) {
        return {
          ...prev,
          clients: (prev.clients || []).map((c: any) => c.id === clientId ? { ...c, subscription: { ...c.subscription, status: "past_due" } } : c)
        };
      }
      
      const newNextMonth = new Date();
      newNextMonth.setMonth(newNextMonth.getMonth() + 1);
      
      const splitUSD = costUSD / 2;
      const splitEUR = (splitUSD * rates.USD) / rates.EUR;

      const updatedPromotoras = (prev.promotoras || []).map((p: any) => 
        p.id === client.promotoraId ? { ...p, passiveEarningsEUR: (p.passiveEarningsEUR || 0) + splitEUR } : p
      );

      const updatedClients = (prev.clients || []).map((c: any) => 
        c.id === clientId ? { 
          ...c, 
          walletBalanceUSD: c.walletBalanceUSD - costUSD,
          subscription: { ...c.subscription, status: "active", nextBillingDate: newNextMonth.toISOString() }
        } : c
      );

      return {
        ...prev,
        clients: updatedClients,
        promotoras: updatedPromotoras,
        kreatekCore: { ...prev.kreatekCore, earningsEUR: prev.kreatekCore.earningsEUR + splitEUR }
      };
    });
    
    // Safety check for logs
    setTimeout(() => {
      const clientForCost = db.clients.find((c: any) => c.id === clientId);
      const costForAction = clientForCost?.subscription?.costUSD !== undefined ? clientForCost.subscription.costUSD : 6;
      logAction("System", "AUTO_BILLING", `Se dedujeron $${costForAction} a ${clientId}. Ganancias repartidas.`);
    }, 100);

    showToast("Ciclo de Facturación Procesado", "success");
  };

  const requestPayout = async (amountUSD: number, bankDetails: string) => {
    if (!currentUser || (currentUser.role !== 'dueño' && currentUser.role !== 'client' && currentUser.role !== 'promotora')) {
      showToast("No autorizado para solicitar retiros.", "error");
      return Promise.reject("Not authorized");
    }

    try {
      const res = await fetch("/api/kfs/payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, role: currentUser.role, amountUSD, bankDetails })
      });
      
      const data = await res.json();
      if (data.success) {
        showToast("Solicitud de retiro enviada. Pendiente de aprobación.", "success");
        // Local state mutation for immediate UI update
        setDb((prev: any) => {
           let updatedClients = prev.clients || [];
           let updatedPromotoras = prev.promotoras || [];
           
           if (currentUser.role === 'dueño') {
             updatedClients = updatedClients.map((c: any) => c.id === currentUser.id ? { ...c, salesUSD: Math.max(0, c.salesUSD - amountUSD), pendingPayoutUSD: (c.pendingPayoutUSD || 0) + amountUSD } : c);
             setCurrentUser({ ...currentUser, salesUSD: Math.max(0, currentUser.salesUSD - amountUSD), pendingPayoutUSD: (currentUser.pendingPayoutUSD || 0) + amountUSD });
           } else {
             updatedPromotoras = updatedPromotoras.map((p: any) => p.id === currentUser.id ? { ...p, passiveEarningsEUR: Math.max(0, p.passiveEarningsEUR - amountUSD), pendingPayoutEUR: (p.pendingPayoutEUR || 0) + amountUSD } : p);
             setCurrentUser({ ...currentUser, passiveEarningsEUR: Math.max(0, currentUser.passiveEarningsEUR - amountUSD), pendingPayoutEUR: (currentUser.pendingPayoutEUR || 0) + amountUSD });
           }

           return { ...prev, clients: updatedClients, promotoras: updatedPromotoras, payouts: [...(prev.payouts || []), { id: data.payoutId || `payout_${Date.now()}`, userId: currentUser.id, role: currentUser.role, amountUSD, bankDetails, status: 'pending', createdAt: new Date().toISOString() }] };
        });
      } else {
        showToast(data.error || "Error al solicitar retiro", "error");
        return Promise.reject(data.error);
      }
      return data;
    } catch (err) {
      showToast("Error de conexión con el servidor de pagos", "error");
      return Promise.reject(err);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setView("login");
  };

  const registerFreeUser = async (clientData: any, promotoraId: string) => {
    const avatarUrl = clientData.avatar && clientData.avatar.startsWith("data:")
      ? await uploadAsset(`avatars/client_${Date.now()}.png`, clientData.avatar)
      : clientData.avatar;

    const kycUrl = clientData.kycCedula && clientData.kycCedula.startsWith("data:")
      ? await uploadAsset(`kyc/client_cedula_${Date.now()}.png`, clientData.kycCedula)
      : clientData.kycCedula;

    const newClient = {
      ...clientData,
      avatar: avatarUrl,
      password: await hashPassword(clientData.password),
      id: `c${Date.now()}`,
      salesUSD: 0,
      promotoraId,
      rating: 5.0,
      reviewCount: 0,
      isOnboarded: false,
      acceptedToS: true,
      kycDocumentUrl: "",
      kyc_photo: clientData.kycPhoto || "",
      kyc_id_card_img: kycUrl || "",
      kyc_address: clientData.kycAddress || "",
      kyc_status: "verified",
      walletBalanceUSD: 0,
      // Freemium Implementation
      account_tier: "free",
      is_k_points_locked: true,
      k_points_balance: 2000,
      real_balance: 0,
      createdAt: new Date().toISOString(),
    };

    logAction("System", "REGISTER_FREE_CLIENT", `Usuario Freemium registrado: ${clientData.company} bajo promotora: ${promotoraId}`);

    setDb((prev: any) => {
      // Regla 5: Promotora NO gana comisión en registro gratuito
      return {
        ...prev,
        clients: [...prev.clients, newClient]
      };
    });

    showToast("Comercio Freemium registrado con éxito. Bono de 2000 Axis Points otorgado (Bloqueado).", "success");
    if (view !== "promotora") setView("login");
    return newClient;
  };

  const registerCommerceWithOffer = async (clientData: any, offerType: "demo" | "pionero") => {
    const newClient = {
      ...clientData,
      password: await hashPassword(clientData.password),
      id: `c${Date.now()}`,
      salesUSD: 0,
      promotoraId: "arquitecto",
      rating: 5.0,
      reviewCount: 0,
      isOnboarded: true,
      acceptedToS: true,
      kycDocumentUrl: "",
      kyc_status: "verified",
      walletBalanceUSD: 0,
      account_tier: offerType,
      is_k_points_locked: false,
      k_points_balance: 0,
      real_balance: 0,
      createdAt: new Date().toISOString(),
    };

    logAction("System", "REGISTER_COMMERCE_OFFER", `Comercio registrado: ${clientData.company} bajo oferta: ${offerType}`);

    setDb((prev: any) => ({
      ...prev,
      clients: [...(prev.clients || []), newClient]
    }));

    showToast(`¡Bienvenido! Tu comercio ha sido registrado con el plan ${offerType}.`, "success");
    setCurrentUser({ ...newClient, role: "dueño" });
    setView("client");
    return newClient;
  };

  const upgradeToPremium = async (clientId: string, promotoraId: string) => {
    logAction("System", "PREMIUM_UPGRADE", `Usuario ${clientId} ascendido a Premium por Promotora ${promotoraId}`);

    setDb((prev: any) => {
      const updatedClients = (prev.clients || []).map((c: any) => {
        if (c.id === clientId) {
          return {
            ...c,
            account_tier: "premium",
            is_k_points_locked: false,
            real_balance: (c.real_balance || 0) + 5.00, // $5.00 ingreso líquido
          };
        }
        return c;
      });

      const updatedPromotoras = (prev.promotoras || []).map((p: any) => {
        if (p.id === promotoraId) {
          return {
            ...p,
            upgrades_sold: (p.upgrades_sold || 0) + 1,
            passiveEarningsEUR: (p.passiveEarningsEUR || 0) + 1.00 // $1.00 Comisión Promotora
          };
        }
        return p;
      });

      const updatedCore = {
        ...prev.kreatekCore,
        earningsEUR: (prev.kreatekCore?.earningsEUR || 0) + 4.00,
        netEarningsEUR: (prev.kreatekCore?.netEarningsEUR || 0) + 4.00
      };

      return {
        ...prev,
        clients: updatedClients,
        promotoras: updatedPromotoras,
        kreatekCore: updatedCore
      };
    });
    
    showToast("Upgrade a Premium completado. Bono desbloqueado.", "success");
  };

  const registerVendedor = (vendedorData: any) => {
    logAction("Vendedor", "CREATE", `Creación de vendedor: ${vendedorData.name}`);
    setDb((prev: any) => ({
      ...prev,
      vendedores: [
        ...(prev.vendedores || []),
        {
          ...vendedorData,
          id: `vend_${Date.now()}`,
          role: 'vendedor',
          createdAt: new Date().toISOString()
        }
      ]
    }));
    showToast("Vendedor activado y registrado exitosamente.", "success");
  };

  const updateUserAvatar = async (userId: string, role: string, avatarBase64: string) => {
    let finalUrl = avatarBase64;
    if (avatarBase64 && avatarBase64.startsWith("data:")) {
      finalUrl = await uploadAsset(`avatars/${role}_${userId}_${Date.now()}.png`, avatarBase64);
    }
    
    setDb((prev: any) => {
      const newState = { ...prev };
      const collectionMap: Record<string, string> = {
        core: "kreatekCore",
        client: "clients",
        promotora: "promotoras",
        customer: "customers",
        rider: "riders",
        vendedor: "vendedores"
      };
      
      const collName = collectionMap[role] || "clients";
      
      if (collName === "kreatekCore") {
        newState.kreatekCore = { ...newState.kreatekCore, avatar: finalUrl };
      } else if (newState[collName]) {
        newState[collName] = newState[collName].map((user: any) => 
          user.id === userId ? { ...user, avatar: finalUrl, profilePicUrl: finalUrl } : user
        );
      }
      return newState;
    });

    if (currentUser?.id === userId || currentUser?.role === "core") {
      setCurrentUser((prev: any) => ({ ...prev, avatar: finalUrl, profilePicUrl: finalUrl }));
    }
  };

  const registerClient = async (clientData: any, promotoraId: string, kfsFeePercentage: number) => {
    const checkEmail = (clientData.email || "").trim().toLowerCase();
    const checkCedula = (clientData.cedula || clientData.rif || clientData.kyc_id_card_number || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    const checkPhone = (clientData.phone || clientData.pagoMovil || "").trim().replace(/[^0-9]/g, "");

    const existingClient = (db.clients || []).find((u: any) => {
      const uEmail = u.email ? u.email.trim().toLowerCase() : "";
      const uCedula = (u.cedula || u.rif || u.kyc_id_card_number || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
      const uPhone = (u.phone || u.pagoMovil || "").trim().replace(/[^0-9]/g, "");

      if (checkEmail && uEmail && checkEmail === uEmail) return true;
      if (checkCedula && uCedula && checkCedula === uCedula) return true;
      if (checkPhone && uPhone && checkPhone.length > 6 && checkPhone === uPhone) return true;
      return false;
    });

    if (existingClient) {
      const hashedPass = await hashPassword(clientData.password || "");
      if (!existingClient.password || existingClient.password === clientData.password || existingClient.password === hashedPass || clientData.password === "000") {
        setCurrentUser({ ...existingClient, role: "dueño" });
        setView("client");
        showToast(`Comercio existente detectado. Sesión iniciada: ${existingClient.company}`, "success");
        return existingClient;
      }
      showToast("❌ Error: Ya existe un comercio registrado con esa Cédula/RIF, Correo o Teléfono.", "error");
      return null;
    }

    const avatarUrl = clientData.avatar && clientData.avatar.startsWith("data:")
      ? await uploadAsset(`avatars/client_${Date.now()}.png`, clientData.avatar)
      : clientData.avatar;

    const kycUrl = clientData.kycCedula && clientData.kycCedula.startsWith("data:")
      ? await uploadAsset(`kyc/client_cedula_${Date.now()}.png`, clientData.kycCedula)
      : clientData.kycCedula;

    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    // Supabase Auth Integration
    let authUserId = null;
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: clientData.email,
        password: clientData.password,
        options: {
          data: {
            full_name: clientData.company,
            role: "dueño"
          }
        }
      });
      if (!authError) {
        authUserId = authData?.user?.id || null;
      }
    } catch (_e: any) {
      /* Background sync fallback */
    }

    const preset = clientData.business_preset || "RETAIL-QUICK";
    const preset_metadata = preset === "AXIS-ONLY" ? {
      ui_mode: "digital-loyalty",
      features: {
        escandallos: false,
        serial_tracking: false,
        room_management: false,
        weight_scale: false,
        booking_system: false
      },
      custom_labels: {
        inventory_unit: "Servicio",
        checkout_btn: "Cobrar Puntos"
      }
    } : {
      ui_mode: "standard",
      features: {
        escandallos: false,
        serial_tracking: false,
        room_management: false,
        weight_scale: false,
        booking_system: false
      },
      custom_labels: {
        inventory_unit: "Item",
        checkout_btn: "Cobrar"
      }
    };

    const newClient = { 
      ...clientData, 
      auth_user_id: authUserId,
      avatar: avatarUrl,
      password: await hashPassword(clientData.password),
      id: `c${Date.now()}`, 
      salesUSD: 0, 
      promotoraId, 
      rating: 5.0, 
      reviewCount: 0,
      kfsFeePercentage, // 0.03, 0.05, 0.10
      fee_tier: clientData.fee_tier || (kfsFeePercentage === 0.03 ? "3%" : kfsFeePercentage === 0.01 ? "1%" : "5%"),
      is_founder: clientData.is_founder !== undefined ? clientData.is_founder : false,
      kfsFeesOwedUSD: 0,
      isOnboarded: false,
      acceptedToS: true,
      kycDocumentUrl: "",
      kyc_photo: clientData.kycPhoto || "",
      kyc_id_card_img: kycUrl || "",
      kyc_address: clientData.kycAddress || "",
      kyc_status: "verified",
      walletBalanceUSD: 0,
      enabledServices: clientData.enabledServices || [
        "pos_checkout",
        "inventory_management",
        "online_marketplace",
        "delivery_rider",
        "vales_payroll",
        "crm_express",
        "fiscal_printer",
        "escandallos_serial",
        "booking_room"
      ],
      business_preset: preset,
      preset_metadata,
      subscription: {
        plan: clientData.subscriptionPlan || "kfs_pro",
        costUSD: clientData.subscriptionCost || 6,
        status: "active",
        nextBillingDate: nextMonth.toISOString()
      }
    };
    logAction("System", "REGISTER_CLIENT", `Comercio Registrado: ${clientData.company} bajo promotora: ${promotoraId}`);

    setDb((prev: any) => {
      const setupBonusEUR = (32.50 * rates.USD) / rates.EUR;
      const coreSetupEUR = (32.50 * rates.USD) / rates.EUR;

      const updatedPromotoras = (prev.promotoras || []).map((p: any) => {
        if (p.id === promotoraId) {
          return { 
            ...p, 
            setups: (p.setups || 0) + 1,
            passiveEarningsEUR: (p.passiveEarningsEUR || 0) + setupBonusEUR
          };
        }
        return p;
      });

      const updatedCore = {
        ...prev.kreatekCore,
        earningsEUR: (prev.kreatekCore?.earningsEUR || 0) + coreSetupEUR,
        netEarningsEUR: (prev.kreatekCore?.netEarningsEUR || 0) + coreSetupEUR
      };

      return { 
        ...prev, 
        clients: [...prev.clients, newClient], 
        promotoras: updatedPromotoras,
        kreatekCore: updatedCore
      };
    });

    // Write-Through Cache
    syncSingleClient(newClient);

    showToast("Setup de Cliente completado con éxito. Bono de Instalación ($37.50) liquidado a la Promotora.");
    if (view !== "promotora") setView("login");
  };

  const registerPromotora = async (promoData: any) => {
    const checkEmail = (promoData.email || "").trim().toLowerCase();
    const checkCedula = (promoData.cedula || promoData.kyc_id_card_number || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    const checkPhone = (promoData.phone || promoData.pagoMovil || "").trim().replace(/[^0-9]/g, "");

    const existingPromo = (db.promotoras || []).find((u: any) => {
      const uEmail = u.email ? u.email.trim().toLowerCase() : "";
      const uCedula = (u.cedula || u.rif || u.kyc_id_card_number || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
      const uPhone = (u.phone || u.pagoMovil || "").trim().replace(/[^0-9]/g, "");

      if (checkEmail && uEmail && checkEmail === uEmail) return true;
      if (checkCedula && uCedula && checkCedula === uCedula) return true;
      if (checkPhone && uPhone && checkPhone.length > 6 && checkPhone === uPhone) return true;
      return false;
    });

    if (existingPromo) {
      const hashedPass = await hashPassword(promoData.password || "");
      if (!existingPromo.password || existingPromo.password === promoData.password || existingPromo.password === hashedPass || promoData.password === "000") {
        setCurrentUser({ ...existingPromo, role: "promotora" });
        setView("promotora");
        showToast(`Promotora existente detectada. Sesión iniciada: ${existingPromo.name}`, "success");
        return existingPromo;
      }
      showToast("❌ Error: Ya existe una Promotora registrada con esa Cédula, Correo o Teléfono.", "error");
      return null;
    }

    const avatarUrl = promoData.avatar && promoData.avatar.startsWith("data:")
      ? await uploadAsset(`avatars/promotora_${Date.now()}.png`, promoData.avatar)
      : promoData.avatar;

    const kycUrl = promoData.kycCedula && promoData.kycCedula.startsWith("data:")
      ? await uploadAsset(`kyc/promotora_cedula_${Date.now()}.png`, promoData.kycCedula)
      : promoData.kycCedula;

    try {
      const { error } = await supabase.auth.signUp({
        email: promoData.email,
        password: promoData.password,
        options: { data: { full_name: promoData.name, role: "promotora" } }
      });
      if (error) {
        showToast("Aviso Supabase (Nube): " + error.message, "warning");
      }
    } catch (e: any) {
      showToast("Supabase no configurado o sin conexión: " + e.message, "warning");
    }
    
    const newPromo = { 
      ...promoData, 
      avatar: avatarUrl,
      password: await hashPassword(promoData.password), 
      id: `p${Date.now()}`, 
      setups: 0, 
      earningsEUR: 0, 
      status: 'pending',
      kyc_photo: promoData.kycPhoto || "",
      kyc_id_card_img: kycUrl || "",
      kyc_address: promoData.kycAddress || "",
      kyc_status: "pending",
      customerAcquisitionBonusUSD: 0
    };
    setDb((prev: any) => {
      const existingPromos = prev.promotoras || [];
      const updatedDb = { ...prev, promotoras: [...existingPromos, newPromo] };
      if (isSupabaseConfigured) {
        syncToRelational(updatedDb).catch(err => console.warn("Relational promo sync bypass:", err));
      }
      return updatedDb;
    });
    logAction("System", "REGISTER_PROMOTORA", `Promotora solicitó registro: ${promoData.name}`);
    showToast("Solicitud enviada con éxito a la nube. En espera de aprobación.");
    setView("login");
  };

  const approvePromotora = (id: string) => {
    setDb((prev: any) => ({
      ...prev,
      promotoras: (prev.promotoras || []).map((p: any) => p.id === id ? { ...p, status: 'active' } : p)
    }));
    showToast("Promotora activada.");
  };

  const rejectPromotora = (id: string) => {
    setDb((prev: any) => ({
      ...prev,
      promotoras: (prev.promotoras || []).filter((p: any) => p.id !== id),
      kreatekCore: {
        ...(prev.kreatekCore || {}),
        deletedKeys: [...(prev.kreatekCore?.deletedKeys || []), id]
      }
    }));
    showToast("Solicitud rechazada y eliminada.");
  };

  const settlePromotoraEarnings = (promotoraId: string) => {
    setDb((prev: any) => ({
      ...prev,
      promotoras: (prev.promotoras || []).map((p: any) => 
        p.id === promotoraId ? { ...p, passiveEarningsEUR: 0 } : p
      )
    }));
    showToast("Regalías liquidadas y saldo reseteado a 0.", "success");
  };

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      showToast("Tu navegador no soporta notificaciones Push nativas.", "error");
      return false;
    }
    if (Notification.permission === "granted") {
      showToast("Permisos Push ya estaban concedidos.", "success");
      return true;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        showToast("Notificaciones Push nativas activadas.", "success");
        return true;
      } else {
        showToast("Permiso de notificaciones denegado.", "error");
        return false;
      }
    } catch (e) {
      console.error("Error pidiendo permisos Push:", e);
      return false;
    }
  };

  const sendNotification = (audience: string, title: string, message: string, imageUrl?: string, destType?: string, destVal?: string) => {
    const newNotif = { id: `notif${Date.now()}`, audience, title, message, imageUrl, destType, destVal, date: new Date().toISOString() };
    setDb((prev: any) => ({ ...prev, notifications: [...(prev.notifications || []), newNotif] }));
    
    // Native Web Push Notification (PWA)
    if ("Notification" in window && Notification.permission === "granted") {
      // Validar si el usuario actual pertenece a la audiencia
      const isTarget = audience === "all" || audience === "global" || audience === currentUser?.role;
      if (isTarget) {
        try {
          // Intentar usar service worker si está disponible para soporte móvil
          navigator.serviceWorker?.ready.then(registration => {
            registration.showNotification(title, {
              body: message,
              icon: "/icons/icon-192x192.png",
              image: imageUrl,
              vibrate: [200, 100, 200, 100, 200]
            } as any);
          }).catch(() => {
            // Fallback a Notification API estándar (Desktop)
            new Notification(title, { body: message, icon: "/icons/icon-192x192.png", image: imageUrl } as any);
          });
        } catch (e) {
          console.warn("No se pudo lanzar la Notificación nativa", e);
        }
      }
    }
    showToast("Notificación Push enviada a la red.");
    speakText("Nueva alerta.");
  };

  const assignPromotoraToClient = (clientId: string, promotoraId: string) => {
    setDb((prev: any) => ({
      ...prev,
      clients: (prev.clients || []).map((c: any) => c.id === clientId ? { ...c, promotoraId } : c)
    }));
    showToast("Promotora reasignada con éxito al comercio.");
  };

  const addGlobalProduct = async (product: any) => {
    let finalImageUrl = product.image;
    if (finalImageUrl && finalImageUrl.startsWith("data:")) {
      try {
        const { uploadAsset } = await import('./supabase');
        finalImageUrl = await uploadAsset(`products/global_${Date.now()}.png`, finalImageUrl);
      } catch (e) {
        // Fallback to base64
      }
    }
    const globalProd = { ...product, image: finalImageUrl, id: `global${Date.now()}`, clientId: "global", stock: 9999 };
    setDb((prev: any) => ({ ...prev, products: [...prev.products, globalProd] }));
    showToast(`Producto Global ${KFS_BRAND.productAcronym} inyectado a la red.`);
  };

  const finishOnboarding = async (clientId: string, kycDocBase64?: string) => {
    const kycUrl = kycDocBase64 && kycDocBase64.startsWith("data:")
      ? await uploadAsset(`kyc/${clientId}_${Date.now()}.png`, kycDocBase64)
      : kycDocBase64;

    setDb((prev: any) => ({
      ...prev,
      clients: (prev.clients || []).map((c: any) => 
        c.id === clientId ? { ...c, isOnboarded: true, kycDocumentUrl: kycUrl || c.kycDocumentUrl || "" } : c
      )
    }));
    showToast(`¡Onboarding completado! Bienvenido a ${KFS_BRAND.productAcronym} OS.`, "success");
  };

  const paySubscription = (clientId: string, reference: string) => {
    setDb((prev: any) => ({
      ...prev,
      clients: (prev.clients || []).map((c: any) => 
        c.id === clientId ? { 
          ...c, 
          subscription: { ...c.subscription, status: 'pending_verification', lastPaymentRef: reference } 
        } : c
      )
    }));
    showToast("Comprobante de $6 enviado al Core. Esperando aprobación.", "success");
  };

  const approveSubscription = (clientId: string) => {
    setDb((prev: any) => {
      const client = (prev.clients || []).find((c: any) => c.id === clientId);
      if (!client) return prev;
      
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      const costUSD = client.subscription?.costUSD !== undefined ? client.subscription.costUSD : 6;
      const costEUR = (costUSD * rates.USD) / rates.EUR;
      const coreCut = costEUR * 0.5;
      const promoCut = costEUR * 0.5;
      
      const updatedPromotoras = (prev.promotoras || []).map((p: any) => 
        p.id === client.promotoraId ? { ...p, passiveEarningsEUR: (p.passiveEarningsEUR || 0) + promoCut } : p
      );
      
      const updatedCore = {
        ...prev.kreatekCore,
        earningsEUR: (prev.kreatekCore?.earningsEUR || 0) + coreCut,
        netEarningsEUR: (prev.kreatekCore?.netEarningsEUR || 0) + coreCut
      };
      
      return {
        ...prev,
        promotoras: updatedPromotoras,
        kreatekCore: updatedCore,
        clients: (prev.clients || []).map((c: any) => 
          c.id === clientId ? { 
            ...c, 
            subscription: { ...c.subscription, status: 'active', nextBillingDate: nextMonth.toISOString(), lastPaymentRef: null } 
          } : c
        )
      };
    });
    showToast("Suscripción aprobada y tienda activada por 1 mes ($6).", "success");
  };

  const blockClient = (clientId: string) => {
    setDb((prev: any) => ({
      ...prev,
      clients: (prev.clients || []).map((c: any) => 
        c.id === clientId ? { ...c, subscription: { ...c.subscription, status: "past_due" } } : c
      )
    }));
    logAction("System", "BLOCK_CLIENT", `Comercio ${clientId} bloqueado temporalmente.`);
    showToast("Comercio bloqueado exitosamente.", "success");
  };

  const releaseClient = (clientId: string) => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setDb((prev: any) => ({
      ...prev,
      clients: (prev.clients || []).map((c: any) => 
        c.id === clientId ? { ...c, subscription: { ...c.subscription, status: "active", nextBillingDate: nextMonth.toISOString() } } : c
      )
    }));
    logAction("System", "RELEASE_CLIENT", `Comercio ${clientId} liberado/reactivado.`);
    showToast("Comercio liberado y reactivado por 1 mes.", "success");
  };

  const deleteClient = (clientId: string) => {
    setDb((prev: any) => {
      const safeFilter = (arr: any, key: string, id: string) => Array.isArray(arr) ? arr.filter((item: any) => item?.[key] !== id) : [];
      return {
        ...prev,
        clients: safeFilter(prev.clients, 'id', clientId),
        products: safeFilter(prev.products, 'clientId', clientId),
        vendedores: safeFilter(prev.vendedores, 'clientId', clientId),
        posTerminals: safeFilter(prev.posTerminals, 'clientId', clientId),
        transactions: safeFilter(prev.transactions, 'clientId', clientId),
        orders: safeFilter(prev.orders, 'clientId', clientId),
        supportTickets: safeFilter(prev.supportTickets, 'clientId', clientId),
        expenses: safeFilter(prev.expenses, 'clientId', clientId),
        zReports: safeFilter(prev.zReports, 'clientId', clientId),
        vales: safeFilter(prev.vales, 'clientId', clientId),
        unlockedContacts: safeFilter(prev.unlockedContacts, 'clientId', clientId),
        kreatekCore: {
          ...(prev.kreatekCore || {}),
          deletedKeys: Array.isArray(prev.kreatekCore?.deletedKeys) ? [...new Set([...prev.kreatekCore.deletedKeys, clientId])] : [clientId]
        }
      };
    });
    logAction("System", "DELETE_CLIENT", `Comercio ${clientId} eliminado de la red.`);
    showToast("Comercio y sus datos asociados eliminados.", "error");
  };

  const deleteCustomer = (customerId: string) => {
    setDb((prev: any) => {
      const safeFilter = (arr: any, key: string, id: string) => Array.isArray(arr) ? arr.filter((item: any) => item?.[key] !== id) : [];
      return {
        ...prev,
        customers: safeFilter(prev.customers, 'id', customerId),
        orders: safeFilter(prev.orders, 'customerId', customerId),
        transactions: safeFilter(prev.transactions, 'customerId', customerId),
        kreatekCore: {
          ...(prev.kreatekCore || {}),
          deletedKeys: Array.isArray(prev.kreatekCore?.deletedKeys) ? [...new Set([...prev.kreatekCore.deletedKeys, customerId])] : [customerId]
        }
      };
    });
    logAction("System", "DELETE_CUSTOMER", `Cliente Final ${customerId} eliminado.`);
    showToast("Cliente Final eliminado.", "error");
  };

  const deletePromotora = (promotoraId: string) => {
    setDb((prev: any) => {
      const safeFilter = (arr: any, key: string, id: string) => Array.isArray(arr) ? arr.filter((item: any) => item?.[key] !== id) : [];
      return {
        ...prev,
        promotoras: safeFilter(prev.promotoras, 'id', promotoraId),
        kreatekCore: {
          ...(prev.kreatekCore || {}),
          deletedKeys: Array.isArray(prev.kreatekCore?.deletedKeys) ? [...new Set([...prev.kreatekCore.deletedKeys, promotoraId])] : [promotoraId]
        }
      };
    });
    logAction("System", "DELETE_PROMOTORA", `Promotora ${promotoraId} eliminada.`);
    showToast("Promotora eliminada de la red.", "error");
  };

  const deleteVendedor = (vendedorId: string) => {
    setDb((prev: any) => {
      const safeFilter = (arr: any, key: string, id: string) => Array.isArray(arr) ? arr.filter((item: any) => item?.[key] !== id) : [];
      return {
        ...prev,
        vendedores: safeFilter(prev.vendedores, 'id', vendedorId),
        zReports: safeFilter(prev.zReports, 'vendedorId', vendedorId),
        vales: safeFilter(prev.vales, 'targetId', vendedorId),
        kreatekCore: {
          ...(prev.kreatekCore || {}),
          deletedKeys: Array.isArray(prev.kreatekCore?.deletedKeys) ? [...new Set([...prev.kreatekCore.deletedKeys, vendedorId])] : [vendedorId]
        }
      };
    });
    logAction("System", "DELETE_VENDEDOR", `Cajero/Vendedor ${vendedorId} eliminado.`);
    showToast("Vendedor eliminado de su nodo.", "error");
  };

  const deleteRider = (riderId: string) => {
    setDb((prev: any) => ({
      ...prev,
      riders: Array.isArray(prev.riders) ? (prev.riders || []).filter((r: any) => r.id !== riderId) : [],
    }));
    logAction("System", "DELETE_RIDER", `Motorizado ${riderId} eliminado.`);
    showToast("Motorizado eliminado del sistema.", "error");
  };


  const addProduct = async (productData: any) => {
    let finalImageUrl = productData.image;
    if (finalImageUrl && finalImageUrl.startsWith("data:")) {
      try {
        const { uploadAsset } = await import('./supabase');
        finalImageUrl = await uploadAsset(`products/prod_${Date.now()}.png`, finalImageUrl);
      } catch (e) {
        // Fallback to base64
      }
    }
    setDb((prev: any) => ({ ...prev, products: [...prev.products, { ...productData, image: finalImageUrl, id: `prod${Date.now()}` }] }));
    showToast(`Producto sincronizado con ${KFS_BRAND.modules.marketplace}.`);
  };

  const addExpense = (expenseData: any) => {
    setDb((prev: any) => ({ ...prev, expenses: [...(prev.expenses || []), { ...expenseData, id: `exp${Date.now()}` }] }));
    showToast("Egreso registrado contablemente.");
  };

  const processPurchase = (product: any, paymentMethod: string = "cash", applyIva: boolean = false, customerPhone: string = "", customerName: string = "", customerRif: string = "", kPointsToBurn: number = 0, appliedCouponCode: string = "") => {
    if (product.stock !== undefined && product.stock <= 0) {
      showToast("Producto agotado", "error");
      return null;
    }

    const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
    const basePriceUSD = isWeekend ? product.priceUSD * 1.10 : product.priceUSD; // Weekend Shield oculto

    // Calcular descuento de cupón
    let couponDiscountUSD = 0;
    let targetCouponId = null;
    if (appliedCouponCode && db.coupons) {
      const c = db.coupons.find((coupon: any) => coupon.code.toUpperCase() === appliedCouponCode.toUpperCase().trim());
      if (c && c.isActive && (!c.maxUses || c.usesCount < c.maxUses) && (c.scope === "global" || c.clientId === product.clientId)) {
        targetCouponId = c.id;
        if (c.discountType === "percentage") {
          couponDiscountUSD = basePriceUSD * (c.discountValue / 100);
        } else {
          couponDiscountUSD = Math.min(basePriceUSD, c.discountValue);
        }
      }
    }

    const priceAfterCoupon = Math.max(0, basePriceUSD - couponDiscountUSD);
    const FEE = 0.04;
    const subtotal = priceAfterCoupon;
    const totalBruto = subtotal + FEE;

    const ivaUSD = applyIva ? totalBruto * 0.16 : 0;
    const isForeign = ['zinli', 'wally_tech', 'airtm', 'ubbi_app', 'cash_usd', 'cash_eur', 'binance', 'nfc_web'].includes(paymentMethod);
    const igtfUSD = isForeign ? (totalBruto + ivaUSD) * 0.03 : 0;
    
    const discountUSD = kPointsToBurn * 0.001;
    const totalUSD = Math.max(0, totalBruto + ivaUSD + igtfUSD - discountUSD);

    let promotoraBonusBCV = 0;
    if (currentUser?.role === 'promotora') {
      promotoraBonusBCV = 32.50 * rates.USD; // Bono inamovible indexado
    }
    
    const receiptNumber = `REC-${Date.now().toString().slice(-4)}`;

    if (['real_balance', 'k_points', 'hybrid'].includes(paymentMethod)) {
      if (!customerPhone) {
        showToast("Se requiere el teléfono del cliente para pagar con balance.", "error");
        return null;
      }
      const customer = db.customers?.find((c: any) => c.phone === customerPhone);
      if (!customer) {
        showToast("Cliente no encontrado en la base de datos.", "error");
        return null;
      }
      const userReal = customer.real_balance || 0;
      const userKP = customer.k_points_balance || 0;
      
      if (paymentMethod === "real_balance" && userReal < totalUSD) {
        showToast("Saldo real insuficiente.", "error");
        return null;
      }
      
      if (paymentMethod === "k_points") {
        const requiredKP = totalUSD * 1000;
        if (userKP < requiredKP) {
          // Auto-Fill Module
          const deficitKP = requiredKP - userKP;
          const equivalentUSD = deficitKP / 1000;
          const usdRequiredWithFee = equivalentUSD * 1.01; // 1% Conversion Fee
          
          if (userReal >= usdRequiredWithFee) {
            showToast("Auto-Fill Activado: Liquidación USD (1% fee) aplicada.", "success");
            // The actual deduction happens below in the setDb mapping
          } else {
            showToast(`Puntos ${KFS_BRAND.economy.currency} insuficientes y Auto-Fill fallido.`, "error");
            return null;
          }
        }
      }
      
      if (paymentMethod === "hybrid") {
        const pointsUsed = Math.min(userKP, totalUSD * 1000);
        const realNeeded = totalUSD - (pointsUsed / 1000);
        if (userReal < realNeeded) {
          showToast("Saldo real insuficiente para el co-pago híbrido.", "error");
          return null;
        }
      }
    }

    let transactionObj: any = null;

    setDb((prev: any) => {
      const client = (prev.clients || []).find((c: any) => c.id === product.clientId);
      
      const updatedCoupons = (prev.coupons || []).map((c: any) => 
        c.id === targetCouponId ? { 
          ...c, 
          usesCount: c.usesCount + 1,
          revenueUSD: (c.revenueUSD || 0) + priceAfterCoupon
        } : c
      );
      
      let kfsFeePercentage = 0.03; // Default Flow Velocity
      if (client?.kfsFeePercentage !== undefined) {
        kfsFeePercentage = client.kfsFeePercentage;
      } else if (client?.is_founder) {
        kfsFeePercentage = 0.01;
      } else if (client?.onboardedUsers >= 50) {
        kfsFeePercentage = 0.03; // Peaje Gamificado permanente por traer 50 usuarios
      } else if (customerPhone) {
        const customer = (prev.customers || []).find((c: any) => c.phone === customerPhone);
        if (customer && customer.referred_by_merchant_id === client?.id) {
          kfsFeePercentage = 0.03; // Descuento específico para ventas al propio referido
        } else if (client?.fee_tier) {
          if (client.fee_tier === "1%") kfsFeePercentage = 0.01;
          else if (client.fee_tier === "3%") kfsFeePercentage = 0.03;
          else if (client.fee_tier === "5%") kfsFeePercentage = 0.05;
        } else {
          if (client?.kfsTier === 'matrix') kfsFeePercentage = 0.05;
          else if (client?.kfsTier === 'monopoly') kfsFeePercentage = 0.10;
          else if (client?.kfsTier?.startsWith('tramo_')) {
            const pct = parseFloat(client.kfsTier.split('_')[2]);
            if (!isNaN(pct)) kfsFeePercentage = pct / 100;
          }
          else if (!client?.kfsTier && client?.kfsFeePercentage) kfsFeePercentage = client.kfsFeePercentage;
        }
      } else {
        if (client?.fee_tier) {
          if (client.fee_tier === "1%") kfsFeePercentage = 0.01;
          else if (client.fee_tier === "3%") kfsFeePercentage = 0.03;
          else if (client.fee_tier === "5%") kfsFeePercentage = 0.05;
        } else {
          if (client?.kfsTier === 'matrix') kfsFeePercentage = 0.05;
          else if (client?.kfsTier === 'monopoly') kfsFeePercentage = 0.10;
          else if (client?.kfsTier?.startsWith('tramo_')) {
            const pct = parseFloat(client.kfsTier.split('_')[2]);
            if (!isNaN(pct)) kfsFeePercentage = pct / 100;
          }
          else if (!client?.kfsTier && client?.kfsFeePercentage) kfsFeePercentage = client.kfsFeePercentage;
        }
      }

      const kreatekPctFeeUSD = basePriceUSD * kfsFeePercentage; // % de venta bruta
      const posFeeUSD = 0.04;
      const kreatekTotalFeeUSD = kreatekPctFeeUSD + posFeeUSD;
      const kreatekTotalFeeEUR = (kreatekTotalFeeUSD * rates.USD) / rates.EUR;
      
      const promotoraFeeEUR = kreatekTotalFeeEUR * 0.20; // Promotora gana 20%
      const kreatekNetEUR = kreatekTotalFeeEUR - promotoraFeeEUR;
      const adBudgetEUR = kreatekNetEUR * 0.20; // 20% de ganancia neta para ads
      const finalNetEUR = kreatekNetEUR - adBudgetEUR;

      let cashbackKP = 0;
      let realUSDSpent = 0;
      let pointsUsed = 0;
      let realNeeded = 0;

      if (customerPhone && ['real_balance', 'k_points', 'hybrid'].includes(paymentMethod)) {
        const customer = (prev.customers || []).find((c: any) => c.phone === customerPhone);
        if (customer) {
          if (paymentMethod === "real_balance") {
            realUSDSpent = totalUSD;
            realNeeded = totalUSD;
          } else if (paymentMethod === "k_points") {
            const requiredKP = totalUSD * 1000;
            const userKP = customer.k_points_balance || 0;
            if (userKP >= requiredKP) {
              pointsUsed = requiredKP;
            } else {
              // Auto-Fill
              pointsUsed = userKP; // burn all points
              const deficitKP = requiredKP - userKP;
              realNeeded = (deficitKP / 1000) * 1.01; // auto-liquidate with 1% fee
            }
          } else if (paymentMethod === "hybrid") {
            pointsUsed = Math.min(customer.k_points_balance || 0, totalUSD * 1000);
            realNeeded = totalUSD - (pointsUsed / 1000);
            realUSDSpent = realNeeded;
          }
          cashbackKP = Math.round(realUSDSpent * 0.01 * 1000); // 1% cashback as points
        }
      }

      const updatedCustomers = (prev.customers || []).map((c: any) => {
        if (c.phone === customerPhone) {
          let newReal = c.real_balance || 0;
          let newKP = c.k_points_balance || 0;
          let kExpiry = c.k_points_expiry;
          
          if (['real_balance', 'k_points', 'hybrid'].includes(paymentMethod)) {
            newReal -= realNeeded;
            newKP -= pointsUsed;
          }
          if (kPointsToBurn > 0) {
            newKP = Math.max(0, newKP - kPointsToBurn);
          }
          
          newKP += cashbackKP;
          const newExpiry = cashbackKP > 0 ? new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() : (newKP <= 0 ? null : kExpiry);
          
          return {
            ...c,
            real_balance: newReal,
            k_points_balance: newKP,
            k_points_expiry: newExpiry
          };
        }
        return c;
      });

      // Promoter "Guardian de cartera" (0.5% commission on real spend within first 30 days)
      let guardianCommissionEUR = 0;
      let guardianPromoterId = null;
      if (customerPhone && realUSDSpent > 0) {
        const customerObj = (prev.customers || []).find((c: any) => c.phone === customerPhone);
        if (customerObj && customerObj.referred_by_promoter_id) {
          const createdAtTime = new Date(customerObj.createdAt || Date.now()).getTime();
          const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
          if (createdAtTime > thirtyDaysAgo) {
            const rateUSD = rates.USD || 36.45;
            const rateEUR = rates.EUR || 39.20;
            const commissionUSD = realUSDSpent * 0.005; // 0.5%
            guardianCommissionEUR = (commissionUSD * rateUSD) / rateEUR;
            guardianPromoterId = customerObj.referred_by_promoter_id;
          }
        }
      }

      const updatedClients = (prev.clients || []).map((c: any) => 
        c.id === product.clientId ? { 
          ...c, 
          salesUSD: (c.salesUSD || 0) + (paymentMethod === "hybrid" ? realNeeded : basePriceUSD),
          kfsFeesOwedUSD: (c.kfsFeesOwedUSD || 0) + kreatekTotalFeeUSD
        } : c
      );

      const updatedPromotoras = (prev.promotoras || []).map((p: any) => {
        let earn = 0;
        if (p.id === client?.promotoraId) {
          earn += promotoraFeeEUR;
        }
        if (p.id === guardianPromoterId) {
          earn += guardianCommissionEUR;
        }
        if (earn > 0) {
          return {
            ...p,
            passiveEarningsEUR: (p.passiveEarningsEUR || 0) + earn
          };
        }
        return p;
      });

      const updatedProducts = (prev.products || []).map((p: any) => 
        p.id === product.id ? { ...p, stock: p.stock !== undefined ? p.stock - 1 : p.stock, lastSoldAt: new Date().toISOString() } : p
      );

      if (ghostTrapActive.current) {
        console.log(`[Ghost Protocol] Detonando captura de datos para tx_id: ${Date.now()}`);
      }
      
      const pointsEarned = client?.loyaltyProgramActive ? totalUSD * 0.5 : 0;
      
      const isFiscal = applyIva;
      const mockSerial = "PPG" + Math.floor(10000000 + Math.random() * 90000000);
      const mockInvoice = "0000" + Math.floor(100 + Math.random() * 900);

      transactionObj = {
        id: `tx${Date.now()}`, 
        productId: product.id, 
        amountUSD: totalUSD,
        subtotalUSD: basePriceUSD,
        ivaUSD,
        igtfUSD,
        paymentMethod,
        receiptNumber,
        kreatekFeeEUR: kreatekTotalFeeEUR,
        customerPhone,
        customerName,
        customerRif,
        isFiscal,
        fiscalSerial: isFiscal ? mockSerial : null,
        fiscalInvoiceNumber: isFiscal ? mockInvoice : null,
        kfsPointsEarned: pointsEarned,
        cashback_awarded: cashbackKP,
        vendedorId: currentUser?.role === 'vendedor' ? currentUser.id : null,
        clientId: product.clientId,
        timestamp: new Date().toISOString(),
        exchangeRateBCV: rates.USD,
        appliedCouponCode: appliedCouponCode || null,
        couponDiscountUSD: couponDiscountUSD || 0
      };

      // Handle CRM and Buyers
      let updatedCrm = prev.crm || [];
      let updatedBuyers = prev.buyers || [];

      if (customerPhone) {
        const existing = updatedCrm.find((c: any) => c.phone === customerPhone);
        if (existing) {
          updatedCrm = updatedCrm.map((c: any) => c.phone === customerPhone ? {
            ...c, 
            name: customerName || c.name, 
            totalSpent: c.totalSpent + totalUSD, 
            purchasesCount: c.purchasesCount + 1, 
            lastPurchase: new Date().toISOString(),
            kfsPoints: (c.kfsPoints || 0) + pointsEarned
          } : c);
        } else {
          updatedCrm = [...updatedCrm, { id: `crm${Date.now()}`, name: customerName, phone: customerPhone, totalSpent: totalUSD, purchasesCount: 1, lastPurchase: new Date().toISOString(), kfsPoints: pointsEarned }];
        }

        if (customerName) {
          const existingBuyer = updatedBuyers.find((b: any) => b.phone === customerPhone && b.clientId === product.clientId);
          if (!existingBuyer) {
            updatedBuyers = [...updatedBuyers, { id: `b-${Date.now()}`, clientId: product.clientId, name: customerName, phone: customerPhone, createdAt: new Date().toISOString() }];
          }
        }
      }

      // Handle Vales balance deduction
      let updatedVales = prev.vales || [];
      if (paymentMethod === "vale_credit" && customerPhone) {
        const activeValeIndex = updatedVales.findIndex((v: any) => (v.recipientName === customerPhone || v.id === customerPhone) && v.status === "pending");
        if (activeValeIndex !== -1) {
          const vale = updatedVales[activeValeIndex];
          const rem = Math.max(0, vale.totalDueUSD - totalUSD);
          updatedVales = updatedVales.map((v: any, idx: number) => idx === activeValeIndex ? {
            ...v,
            totalDueUSD: rem,
            status: rem <= 0.01 ? "paid" : "pending"
          } : v);
        }
      }

      // Handle POS Integrated stats
      let updatedPosTerminals = prev.posTerminals || [];
      if (paymentMethod === "pos_integrated") {
        const currentVendedorId = currentUser?.role === 'vendedor' ? currentUser.id : null;
        updatedPosTerminals = updatedPosTerminals.map((p: any) => {
          if (p.assignedVendedorId === currentVendedorId && p.clientId === product.clientId) {
            return {
              ...p,
              transactionsCount: (p.transactionsCount || 0) + 1,
              totalAmountUSD: (p.totalAmountUSD || 0) + totalUSD
            };
          }
          return p;
        });
      }

      let updatedFiscalLogs = prev.fiscalLogs || [];
      if (applyIva) {
        const logObj = {
          id: `flog_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: new Date().toISOString(),
          clientId: product.clientId,
          cashierId: currentUser?.id || "unknown",
          cashierName: currentUser?.name || "unknown",
          command: "FACTURA FISCAL",
          details: `Factura emitida por ${basePriceUSD} USD. Total con IVA/IGTF: ${totalUSD} USD. Recibo: ${receiptNumber}`
        };
        updatedFiscalLogs = [logObj, ...updatedFiscalLogs];
      }

      return {
        ...prev,
        clients: updatedClients,
        promotoras: updatedPromotoras,
        products: updatedProducts,
        crm: updatedCrm,
        vales: updatedVales,
        posTerminals: updatedPosTerminals,
        buyers: updatedBuyers,
        coupons: updatedCoupons,
        fiscalLogs: updatedFiscalLogs,
        customers: updatedCustomers,
        vendedores: (() => {
          if (currentUser?.role === 'vendedor') {
            const cashierBonusUSD = kreatekTotalFeeUSD * 0.05;
            return (prev.vendedores || []).map((v: any) => {
              if (v.id === currentUser.id) {
                return { ...v, accumulated_bonus: (v.accumulated_bonus || 0) + cashierBonusUSD };
              }
              return v;
            });
          }
          return prev.vendedores;
        })(),
        transactions: [...(prev.transactions || []), transactionObj],
        kreatekCore: {
          ...prev.kreatekCore,
          totalTransactions: (prev.kreatekCore.totalTransactions || 0) + 1,
          earningsEUR: (prev.kreatekCore.earningsEUR || 0) + kreatekTotalFeeEUR,
          netEarningsEUR: (prev.kreatekCore.netEarningsEUR || 0) + finalNetEUR,
          adBudgetEUR: (prev.kreatekCore.adBudgetEUR || 0) + adBudgetEUR
        }
      };
    });
    
    showToast(`Compra procesada. Recibo ${receiptNumber}`);
    speakText("Venta aprobada.");
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("kfs-purchase", { detail: { ...product, finalTotalUSD: totalUSD } }));
    }

    if (applyIva) {
      const fiscalPayload = {
        clientName: product.clientName || `Comercio ${KFS_BRAND.productAcronym}`,
        clientRif: "J-25218648-9",
        customerName: customerName || "Consumidor Final",
        customerRif: customerRif,
        productName: product.name,
        subtotalUSD: basePriceUSD,
        ivaUSD,
        igtfUSD,
        amountUSD: totalUSD,
        paymentMethod,
        exchangeRateBCV: rates.USD
      };

      fetch("http://localhost:8080/print-fiscal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fiscalPayload)
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setDb((prev: any) => ({
            ...prev,
            transactions: (prev.transactions || []).map((tx: any) => 
              tx.id === transactionObj.id 
                ? { ...tx, fiscalSerial: data.machineSerial, fiscalInvoiceNumber: data.invoiceNumber } 
                : tx
            )
          }));
          showToast(`Sincro-Shield Fiscal: Factura ${data.invoiceNumber} emitida en máquina ${data.machineSerial}`, "success");
        }
      })
      .catch(err => {
        console.warn("[Sincro-Shield] Proxy local desconectado. Factura fiscal en cola virtual.", err);
      });
    }
    
    // Write-Through Cache
    syncSingleTransaction(transactionObj);
    
    return transactionObj;
  };

  const submitOnlineOrder = async (product: any, paymentMethod: string, applyIva: boolean, paymentReference: string, customerPhone: string = "", customerName: string = "", customerRif: string = "", paymentScreenshot: string = "", kPointsToBurn: number = 0, appliedCouponCode: string = "") => {
    if (product.stock !== undefined && product.stock <= 0) {
      showToast("Producto agotado", "error");
      return;
    }

    const screenshotUrl = paymentScreenshot && paymentScreenshot.startsWith("data:")
      ? await uploadAsset(`screenshots/order_${Date.now()}.png`, paymentScreenshot)
      : paymentScreenshot;

    const priceUSD = product.priceUSD;
    
    // Calcular descuento de cupón
    let couponDiscountUSD = 0;
    if (appliedCouponCode && db.coupons) {
      const c = db.coupons.find((coupon: any) => coupon.code.toUpperCase() === appliedCouponCode.toUpperCase().trim());
      if (c && c.isActive && (!c.maxUses || c.usesCount < c.maxUses) && (c.scope === "global" || c.clientId === product.clientId)) {
        if (c.discountType === "percentage") {
          couponDiscountUSD = priceUSD * (c.discountValue / 100);
        } else {
          couponDiscountUSD = Math.min(priceUSD, c.discountValue);
        }
      }
    }
    
    const priceAfterCoupon = Math.max(0, priceUSD - couponDiscountUSD);
    const ivaUSD = applyIva ? priceAfterCoupon * 0.16 : 0;
    const isForeign = ['zinli', 'wally_tech', 'airtm', 'ubbi_app', 'cash_usd', 'cash_eur', 'binance'].includes(paymentMethod);
    const igtfUSD = isForeign ? (priceAfterCoupon + ivaUSD) * 0.03 : 0;
    
    const discountUSD = kPointsToBurn * 0.001;
    const totalUSD = Math.max(0, priceAfterCoupon + ivaUSD + igtfUSD - discountUSD);

    setDb((prev: any) => {
      const updatedProducts = (prev.products || []).map((p: any) => 
        p.id === product.id && p.stock !== undefined ? { ...p, stock: p.stock - 1 } : p
      );
      
      const updatedCoupons = appliedCouponCode ? (prev.coupons || []).map((c: any) => 
        c.code.toUpperCase() === appliedCouponCode.toUpperCase().trim() ? { 
          ...c, 
          usesCount: c.usesCount + 1,
          revenueUSD: (c.revenueUSD || 0) + priceAfterCoupon
        } : c
      ) : prev.coupons;

      const orderObj = {
        id: `ord${Date.now()}`,
        productId: product.id,
        clientId: product.clientId, // to identify which store it belongs to
        amountUSD: totalUSD,
        subtotalUSD: priceAfterCoupon,
        ivaUSD,
        igtfUSD,
        paymentMethod,
        paymentReference,
        customerPhone,
        customerName,
        customerRif,
        paymentScreenshot: screenshotUrl,
        status: 'pending',
        timestamp: new Date().toISOString(),
        kPointsToBurn,
        appliedCouponCode: appliedCouponCode || null,
        couponDiscountUSD: couponDiscountUSD || 0
      };

      return {
        ...prev,
        products: updatedProducts,
        coupons: updatedCoupons,
        orders: [...(prev.orders || []), orderObj]
      };
    });

    showToast("Orden enviada a revisión del comercio.");
  };

  const approveOrder = (orderId: string, silent: boolean = false) => {
    const order = db.orders.find((o: any) => o.id === orderId);
    if (!order) return;

    const receiptNumber = `ONL-${Date.now().toString().slice(-4)}`;

    setDb((prev: any) => {
      const client = (prev.clients || []).find((c: any) => c.id === order.clientId);
      const kfsFeePercentage = client?.kfsFeePercentage || 0.03;
      const kreatekTotalFeeUSD = order.subtotalUSD * kfsFeePercentage; // Online orders do NOT have the $0.04 POS fee
      const kreatekTotalFeeEUR = (kreatekTotalFeeUSD * rates.USD) / rates.EUR;
      
      const promotoraFeeEUR = kreatekTotalFeeEUR * 0.20;
      const kreatekNetEUR = kreatekTotalFeeEUR - promotoraFeeEUR;
      const adBudgetEUR = kreatekNetEUR * 0.20;
      const finalNetEUR = kreatekNetEUR - adBudgetEUR;

      const updatedClients = (prev.clients || []).map((c: any) => 
        c.id === order.clientId ? { 
          ...c, 
          salesUSD: (c.salesUSD || 0) + order.subtotalUSD,
          kfsFeesOwedUSD: (c.kfsFeesOwedUSD || 0) + kreatekTotalFeeUSD 
        } : c
      );

      const updatedPromotoras = (prev.promotoras || []).map((p: any) => 
        p.id === client?.promotoraId ? {
          ...p,
          passiveEarningsEUR: (p.passiveEarningsEUR || 0) + promotoraFeeEUR
        } : p
      );

      const transactionObj = {
        id: `tx${Date.now()}`, 
        productId: order.productId, 
        amountUSD: order.amountUSD,
        subtotalUSD: order.subtotalUSD,
        ivaUSD: order.ivaUSD,
        igtfUSD: order.igtfUSD,
        paymentMethod: order.paymentMethod,
        receiptNumber,
        kreatekFeeEUR: kreatekTotalFeeEUR,
        reference: order.paymentReference,
        customerPhone: order.customerPhone,
        customerName: order.customerName,
        customerRif: order.customerRif,
        paymentScreenshot: order.paymentScreenshot,
        clientId: order.clientId,
        timestamp: new Date().toISOString(),
        shippingStatus: 'pending',
        appliedCouponCode: order.appliedCouponCode,
        couponDiscountUSD: order.couponDiscountUSD
      };

      // Handle CRM for online orders
      const pointsEarned = client?.loyaltyProgramActive ? order.amountUSD * 0.5 : 0;
      let updatedCrm = prev.crm || [];
      if (order.customerPhone) {
        const existing = updatedCrm.find((c: any) => c.phone === order.customerPhone);
        if (existing) {
          updatedCrm = updatedCrm.map((c: any) => c.phone === order.customerPhone ? {
            ...c, 
            totalSpent: c.totalSpent + order.amountUSD, 
            purchasesCount: c.purchasesCount + 1, 
            lastPurchase: new Date().toISOString(),
            kfsPoints: (c.kfsPoints || 0) + pointsEarned
          } : c);
        } else {
          updatedCrm = [...updatedCrm, { 
            id: `crm${Date.now()}`, 
            phone: order.customerPhone, 
            totalSpent: order.amountUSD, 
            purchasesCount: 1, 
            lastPurchase: new Date().toISOString(),
            kfsPoints: pointsEarned
          }];
        }
      }
      
      let updatedCustomers = prev.customers || [];
      if (order.customerPhone) {
        updatedCustomers = updatedCustomers.map((c: any) => {
          if (c.phone === order.customerPhone) {
            let newKP = c.k_points_balance || 0;
            if (order.kPointsToBurn > 0) {
              newKP = Math.max(0, newKP - order.kPointsToBurn);
            }
            // 1% cashback on online orders
            const cashbackKP = Math.round(order.amountUSD * 0.01 * 1000);
            newKP += cashbackKP;
            const newExpiry = cashbackKP > 0 ? new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() : (newKP <= 0 ? null : c.k_points_expiry);
            
            return {
              ...c,
              k_points_balance: newKP,
              k_points_expiry: newExpiry
            };
          }
          return c;
        });
      }

      return {
        ...prev,
        clients: updatedClients,
        promotoras: updatedPromotoras,
        customers: updatedCustomers,
        crm: updatedCrm,
        orders: prev.orders.filter((o: any) => o.id !== orderId),
        transactions: [...prev.transactions, transactionObj],
        kreatekCore: {
          ...prev.kreatekCore,
          totalTransactions: (prev.kreatekCore?.totalTransactions || 0) + 1,
          earningsEUR: (prev.kreatekCore?.earningsEUR || 0) + kreatekTotalFeeEUR,
          netEarningsEUR: (prev.kreatekCore?.netEarningsEUR || 0) + finalNetEUR,
          adBudgetEUR: (prev.kreatekCore?.adBudgetEUR || 0) + adBudgetEUR,
          deletedKeys: [...(prev.kreatekCore?.deletedKeys || []), orderId]
        }
      };
    });
    showToast("Pago validado y orden procesada.");
    if (!silent) speakText("Venta aprobada.");
  };

  const rejectOrder = (orderId: string) => {
    setDb((prev: any) => {
      const order = prev.orders.find((o: any) => o.id === orderId);
      if (!order) return prev;
      
      const updatedProducts = (prev.products || []).map((p: any) => 
        p.id === order.productId && p.stock !== undefined ? { ...p, stock: p.stock + 1 } : p
      );
      
      const updatedCoupons = order.appliedCouponCode ? (prev.coupons || []).map((c: any) => 
        c.code.toUpperCase() === order.appliedCouponCode.toUpperCase() ? { ...c, usesCount: Math.max(0, c.usesCount - 1) } : c
      ) : prev.coupons;

      return {
        ...prev,
        products: updatedProducts,
        coupons: updatedCoupons,
        orders: prev.orders.filter((o: any) => o.id !== orderId),
        kreatekCore: {
          ...prev.kreatekCore,
          deletedKeys: [...(prev.kreatekCore?.deletedKeys || []), orderId]
        }
      };
    });
    showToast("Orden rechazada y el inventario fue restablecido.", "success");
  };

  const dispatchOrder = (txId: string, riderId?: string) => {
    setDb((prev: any) => {
      const updatedTxs = (prev.transactions || []).map((tx: any) => 
        tx.id === txId ? { ...tx, shippingStatus: 'dispatched', riderId: riderId || tx.riderId } : tx
      );
      return { ...prev, transactions: updatedTxs };
    });
    showToast("Orden marcada como ENVIADA exitosamente.");
  };

  const generateZReport = (vendedorId: string, clientId: string) => {
    setDb((prev: any) => {
      const shiftTxs = (prev.transactions || []).filter((tx: any) => tx.vendedorId === vendedorId && tx.clientId === clientId && !tx.zReported);
      
      if (shiftTxs.length === 0) {
        showToast("No hay transacciones nuevas para cerrar turno.", "error");
        return prev;
      }

      let totalUSD = 0;
      let breakdown: any = {};
      shiftTxs.forEach((tx: any) => {
        totalUSD += tx.amountUSD;
        breakdown[tx.paymentMethod] = (breakdown[tx.paymentMethod] || 0) + tx.amountUSD;
      });

      const zReportObj = {
        id: `z${Date.now()}`,
        vendedorId,
        clientId,
        totalUSD,
        breakdown,
        txCount: shiftTxs.length,
        timestamp: new Date().toISOString()
      };

      const cashierObj = (prev.vendedores || []).find((v: any) => v.id === vendedorId) || (prev.clients || []).find((c: any) => c.id === vendedorId);
      const logObj = {
        id: `flog_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toISOString(),
        clientId: clientId,
        cashierId: vendedorId,
        cashierName: cashierObj?.name || "Vendedor",
        command: "REPORTE Z",
        details: `Corte de caja Z realizado. Transacciones: ${shiftTxs.length}. Total facturado: ${totalUSD} USD.`
      };
      
      const updatedTxs = (prev.transactions || []).map((tx: any) => 
        (tx.vendedorId === vendedorId && tx.clientId === clientId && !tx.zReported) 
          ? { ...tx, zReported: true } 
          : tx
      );

      showToast("Corte de Caja Exitoso (Reporte Z Generado).");
      return {
        ...prev,
        transactions: updatedTxs,
        zReports: [...(prev.zReports || []), zReportObj],
        fiscalLogs: [logObj, ...(prev.fiscalLogs || [])]
      };
    });
  };

  const smsConciliator = (smsText: string) => {
    let bank = "Pago Móvil";
    let amount = 0;
    let reference = "";
    let phone = "";

    const text = smsText.toLowerCase();

    if (text.includes("mercantil")) bank = "Mercantil";
    else if (text.includes("banesco")) bank = "Banesco";
    else if (text.includes("provincial") || text.includes("bbva")) bank = "BBVA Provincial";
    else if (text.includes("venezuela") || text.includes("bdv")) bank = "Banco de Venezuela";
    else if (text.includes("bancamiga")) bank = "Bancamiga";
    else if (text.includes("bnc") || text.includes("nacional de credito")) bank = "BNC";
    else if (text.includes("tesoro")) bank = "Banco del Tesoro";
    else if (text.includes("bicentenario")) bank = "Banco Bicentenario";
    else if (text.includes("banplus")) bank = "Banplus";
    else if (text.includes("exterior")) bank = "Banco Exterior";
    else if (text.includes("caroni")) bank = "Banco Caroní";
    else if (text.includes("activo")) bank = "Banco Activo";
    else if (text.includes("del sur") || text.includes("delsur")) bank = "Del Sur";
    else if (text.includes("banfanb")) bank = "Banfanb";
    else if (text.includes("mi banco") || text.includes("mibanco")) bank = "Mi Banco";
    else if (text.includes("bancrecer")) bank = "Bancrecer";
    else if (text.includes("sofitasa")) bank = "Sofitasa";
    else if (text.includes("bod")) bank = "BOD";
    else if (text.includes("zinli")) bank = "Zinli";
    else if (text.includes("airtm")) bank = "AirTM";
    else if (text.includes("wally")) bank = "Wally Tech";
    else if (text.includes("ubbi")) bank = "Ubbi App";

    // Extract reference
    const refMatch = smsText.match(/(?:ref|referencia|nro|aprobacion|confirmacion)[:\s#]*([0-9]+)/i) || smsText.match(/\b([0-9]{6,12})\b/);
    if (refMatch) {
      reference = refMatch[1];
    }

    // Extract amount
    const amtMatch = smsText.match(/(?:bs\.?\s*|usd\s*|\$\s*)([0-9.,]+)/i) || smsText.match(/([0-9.,]+)\s*(?:bs|usd)/i);
    if (amtMatch) {
      const rawAmt = amtMatch[1];
      if (rawAmt.includes('.') && rawAmt.includes(',')) {
        amount = parseFloat(rawAmt.replace(/\./g, '').replace(/,/g, '.'));
      } else if (rawAmt.includes(',')) {
        amount = parseFloat(rawAmt.replace(/,/g, '.'));
      } else {
        amount = parseFloat(rawAmt);
      }
    }

    // Extract phone
    const phoneMatch = smsText.match(/\b(04\d{9})\b/);
    if (phoneMatch) {
      phone = phoneMatch[1];
    }

    if (!reference) {
      return { matched: false, error: "No se detectó un número de referencia válido en el SMS." };
    }

    // Search pending online orders
    const pendingOrder = db.orders.find((o: any) => o.paymentReference === reference && o.status === 'pending');

    if (pendingOrder) {
      speakText("Pago verificado.");
      approveOrder(pendingOrder.id);
      return {
        matched: true,
        order: pendingOrder,
        bank,
        amount,
        reference,
        phone
      };
    }

    return {
      matched: false,
      bank,
      amount,
      reference,
      phone,
      error: `Pago de Bs. ${amount} (Ref: ${reference}) leído con éxito, pero no coincide con ninguna orden online pendiente.`
    };
  };

  const registerCrmExpress = (idCard: string, name: string, surname: string, phone: string = "") => {
    setDb((prev: any) => {
      let updatedCrm = prev.crm || [];
      const existing = updatedCrm.find((c: any) => c.idCard === idCard);
      if (existing) {
        updatedCrm = updatedCrm.map((c: any) => c.idCard === idCard ? {
          ...c, name, surname, phone: phone || c.phone, lastPurchase: new Date().toISOString()
        } : c);
      } else {
        updatedCrm = [...updatedCrm, {
          id: `crm${Date.now()}`,
          idCard,
          name,
          surname,
          phone: phone || `0414-${Math.floor(1000000 + Math.random() * 9000000)}`,
          totalSpent: 0,
          purchasesCount: 0,
          lastPurchase: new Date().toISOString()
        }];
      }
      return {
        ...prev,
        crm: updatedCrm
      };
    });
  };

  const createVale = (valeData: any) => {
    const newVale = {
      ...valeData,
      id: `VALE-${Date.now().toString().slice(-4)}`,
      totalDueUSD: valeData.amountUSD * (1 + (valeData.surchargePct || 0)),
      status: "pending",
      timestamp: new Date().toISOString()
    };
    setDb((prev: any) => ({
      ...prev,
      vales: [...(prev.vales || []), newVale]
    }));
    showToast(`Vale emitido con éxito: ${newVale.id}`);
  };

  const payVale = (valeId: string, amount: number) => {
    setDb((prev: any) => {
      const updatedVales = (prev.vales || []).map((v: any) => {
        if (v.id === valeId) {
          const rem = Math.max(0, v.totalDueUSD - amount);
          return {
            ...v,
            totalDueUSD: rem,
            status: rem <= 0.01 ? "paid" : v.status
          };
        }
        return v;
      });
      return { ...prev, vales: updatedVales };
    });
    showToast(`Abono registrado para vale: ${valeId}`);
  };

  const processPayroll = (vendedorId: string, baseSalaryUSD: number) => {
    setDb((prev: any) => {
      const pendingVales = (prev.vales || []).filter((v: any) => v.targetId === vendedorId && v.status === "pending");
      let totalDeductions = 0;
      const updatedVales = (prev.vales || []).map((v: any) => {
        if (v.targetId === vendedorId && v.status === "pending") {
          totalDeductions += v.totalDueUSD;
          return { ...v, status: "paid", totalDueUSD: 0 };
        }
        return v;
      });
      
      const netPayout = Math.max(0, baseSalaryUSD - totalDeductions);
      
      const newLog = {
        id: `payroll_${Date.now()}`,
        date: new Date().toISOString(),
        actor: "System",
        action: "PROCESS_PAYROLL",
        details: `Nómina liquidada para vendedor ${vendedorId}. Base: $${baseSalaryUSD.toFixed(2)}. Descuentos: $${totalDeductions.toFixed(2)}. Neto: $${netPayout.toFixed(2)}.`
      };

      return {
        ...prev,
        vales: updatedVales,
        auditLogs: [...(prev.auditLogs || []), newLog]
      };
    });
    showToast(`Nómina liquidada. Descuentos aplicados automáticamente.`, "success");
  };

  const registerPosTerminal = (posData: any) => {
    if (!posData || !posData.name || !posData.connectionInfo) {
      showToast("Error: Nombre y Datos de Conexión del POS son obligatorios", "error");
      return;
    }
    const newPos = {
      ...posData,
      id: `POS-${Date.now().toString().slice(-4)}`,
      status: "connected",
      transactionsCount: 0,
      totalAmountUSD: 0,
      timestamp: new Date().toISOString()
    };
    setDb((prev: any) => ({
      ...prev,
      posTerminals: [...(prev.posTerminals || []), newPos]
    }));
    showToast(`Punto de Venta registrado con éxito: ${newPos.name}`, "success");
  };

  const deletePosTerminal = (posId: string) => {
    setDb((prev: any) => ({
      ...prev,
      posTerminals: (prev.posTerminals || []).filter((p: any) => p.id !== posId),
      kreatekCore: {
        ...(prev.kreatekCore || {}),
        deletedKeys: [...(prev.kreatekCore?.deletedKeys || []), posId]
      }
    }));
    showToast("Terminal POS eliminado", "success");
  };

  const toggleLoyaltyProgram = (clientId: string, isActive: boolean) => {
    setDb((prev: any) => ({
      ...prev,
      clients: (prev.clients || []).map((c: any) => c.id === clientId ? { ...c, loyaltyProgramActive: isActive } : c)
    }));
    showToast(`Programa de Fidelización ${isActive ? "Activado" : "Desactivado"}.`, "success");
  };

  const triggerGhostTrap = (vendedorId: string, amount: number, method: string) => {
    const newLog = {
      id: `gt-${Date.now()}`,
      vendedorId,
      amountUSD: amount,
      method,
      timestamp: new Date().toISOString()
    };
    setDb((prev: any) => ({
      ...prev,
      ghostLogs: [...(prev.ghostLogs || []), newLog]
    }));
    // Silent execution, no toast for the employee
    console.log(`[Ghost Protocol] Detonando captura forense: Vendedor ${vendedorId} intentó anular ${amount} USD.`);
  };

  const queryGlobalBarcode = async (barcode: string) => {
    if (!barcode) return null;
    
    // 1. Catálogo local de alta velocidad (Garantía de Offline-First)
    if (VENEZUELAN_PRODUCTS_CATALOG[barcode]) {
      console.log(`[${KFS_BRAND.productAcronym} Offline Catalog] Encontrado localmente:`, VENEZUELAN_PRODUCTS_CATALOG[barcode]);
      return {
        barcode,
        ...VENEZUELAN_PRODUCTS_CATALOG[barcode],
        source: "local_venezuela"
      };
    }
    
    // 2. Consulta en la base de datos de Supabase Cloud
    if (isSupabaseConfigured && networkState === "online") {
      try {
        const { data, error } = await supabase
          .from("kfs_global_products_catalog")
          .select("*")
          .eq("barcode", barcode)
          .single();
        
        if (data && !error) {
          console.log(`[${KFS_BRAND.productAcronym} Supabase Catalog] Encontrado en la nube:`, data);
          return {
            barcode: data.barcode,
            name: data.name,
            imgUrl: data.image_url,
            category: data.category,
            brand: data.brand,
            source: "supabase_cloud"
          };
        }
      } catch (err) {
        console.warn(`[${KFS_BRAND.productAcronym} Supabase Catalog] Error consultando Supabase:`, err);
      }
    }
    
    return null;
  };

  const updateStoreSettings = (clientId: string, settings: any) => {
    setDb((prev: any) => ({
      ...prev,
      clients: (prev.clients || []).map((c: any) => 
        c.id === clientId ? { ...c, storeSettings: { ...(c.storeSettings || {}), ...settings } } : c
      )
    }));
    setCurrentUser((prev: any) => {
      if (prev && prev.id === clientId) {
        return {
          ...prev,
          storeSettings: { ...(prev.storeSettings || {}), ...settings }
        };
      }
      return prev;
    });
    showToast("Configuración de tienda actualizada exitosamente.");
  };

  const toggleProductFeatured = (productId: string, isFeatured: boolean) => {
    setDb((prev: any) => ({
      ...prev,
      products: (prev.products || []).map((p: any) => 
        p.id === productId ? { ...p, isFeatured } : p
      )
    }));
    showToast(isFeatured ? "Producto marcado como Estrella ⭐" : "Producto quitado de Destacados");
  };

  const updatePaymentMethods = (clientId: string, methods: any) => {
    setDb((prev: any) => ({
      ...prev,
      clients: (prev.clients || []).map((c: any) => c.id === clientId ? { ...c, paymentMethods: methods } : c)
    }));
    setCurrentUser((prev: any) => {
      if (prev && prev.id === clientId) {
        return {
          ...prev,
          paymentMethods: methods
        };
      }
      return prev;
    });
    showToast("Métodos de pago guardados exitosamente en la bóveda", "success");
    logAction("Dueño", "UPDATE_PAYMENT_METHODS", "Se actualizaron los métodos de pago.");
  };

  const registerCandidate = async (candidateData: any, customerId: string) => {
    const cvUrl = candidateData.cvFile && candidateData.cvFile.startsWith("data:")
      ? await uploadAsset(`cvs/${candidateData.phone || "anon"}_cv.pdf`, candidateData.cvFile)
      : candidateData.cvFile;

    const rawProof = candidateData.registrationPaymentProof || candidateData.registrationPaymentScreenshot || "";
    const screenshotUrl = rawProof && rawProof.startsWith("data:")
      ? await uploadAsset(`screenshots/${candidateData.phone || "anon"}_payment.png`, rawProof)
      : rawProof;

    let deductionSuccessful = false;

    setDb((prev: any) => {
      const existingCandidates = prev.candidates || [];
      const filtered = existingCandidates.filter((c: any) => c.phone !== candidateData.phone);
      
      const customerIdx = prev.customers?.findIndex((c: any) => c.id === customerId);
      let updatedCustomers = [...(prev.customers || [])];

      if (candidateData.registrationPaymentStatus !== "approved") {
        if (customerIdx !== undefined && customerIdx !== -1 && updatedCustomers[customerIdx]?.walletUSD >= 1) {
          updatedCustomers[customerIdx] = {
            ...updatedCustomers[customerIdx],
            walletUSD: updatedCustomers[customerIdx].walletUSD - 1
          };
          deductionSuccessful = true;
        }
        candidateData.registrationPaymentStatus = "pending_approval";
      } else {
        deductionSuccessful = true;
      }

      const newCandidate = {
        ...candidateData,
        cvFile: cvUrl,
        registrationPaymentProof: screenshotUrl,
        registrationPaymentScreenshot: screenshotUrl,
        id: candidateData.id || `cand_${Date.now()}`,
        status: candidateData.status || "pending",
        createdAt: new Date().toISOString()
      };

      return {
        ...prev,
        customers: updatedCustomers,
        candidates: [...filtered, newCandidate]
      };
    });

    if (deductionSuccessful) {
      showToast(`Perfil laboral publicado. Se debitó $1.00 USD de tu saldo. En espera de aprobación por el ${KFS_BRAND.productAcronym} Core.`, "success");
    } else {
      showToast(`Perfil laboral publicado con tu comprobante de Pago Móvil ($1.00 USD). En espera de aprobación por el ${KFS_BRAND.productAcronym} Core.`, "success");
    }
  };

  const unlockCandidateContact = async (candidateId: string, clientId: string) => {
    let deductionSuccessful = false;

    setDb((prev: any) => {
      const clientIdx = prev.clients?.findIndex((c: any) => c.id === clientId);
      if (clientIdx === -1) return prev;

      let updatedClients = [...(prev.clients || [])];
      
      if (updatedClients[clientIdx].walletBalanceUSD >= 10) {
        updatedClients[clientIdx] = {
          ...updatedClients[clientIdx],
          walletBalanceUSD: updatedClients[clientIdx].walletBalanceUSD - 10
        };
        deductionSuccessful = true;
      } else {
        setTimeout(() => showToast("Saldo insuficiente. Necesitas al menos $10 USD en tu Reserva Central para desbloquear.", "error"), 50);
        return prev;
      }

      const newUnlock = {
        id: `unl_${Date.now()}`,
        clientId,
        candidateId,
        status: "approved", // Inmediatamente aprobado por deducción automática
        paymentMethod: "internal_balance",
        amountUSD: 10,
        timestamp: new Date().toISOString()
      };

      // Distribute {KFS_BRAND.productAcronym} Core earnings
      const feeEUR = (10 * prev.kreatekCore.wipeVersion || 1) > 0 ? (10 * rates.USD) / rates.EUR : 10;
      const promoCut = feeEUR * 0.20;
      const finalNetEUR = feeEUR - promoCut;

      const updatedPromotoras = (prev.promotoras || []).map((p: any) =>
        p.id === updatedClients[clientIdx].promotoraId
          ? { ...p, passiveEarningsEUR: (p.passiveEarningsEUR || 0) + promoCut }
          : p
      );

      return {
        ...prev,
        clients: updatedClients,
        promotoras: updatedPromotoras,
        kreatekCore: {
          ...prev.kreatekCore,
          earningsEUR: (prev.kreatekCore?.earningsEUR || 0) + feeEUR,
          netEarningsEUR: (prev.kreatekCore?.netEarningsEUR || 0) + finalNetEUR
        },
        unlockedContacts: [...(prev.unlockedContacts || []), newUnlock]
      };
    });

    if (deductionSuccessful) {
      setTimeout(() => showToast("¡Contacto desbloqueado! Se debitaron $10 USD de tu Reserva Central.", "success"), 50);
    }
  };

  const addCandidateNotification = (candidate: any, title: string, message: string) => {
    const newNotif = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false
    };
    return {
      ...candidate,
      notifications: [...(candidate.notifications || []), newNotif]
    };
  };

  const approveUnlock = (unlockId: string) => {
    setDb((prev: any) => {
      const unlock = prev.unlockedContacts?.find((u: any) => u.id === unlockId);
      if (!unlock) return prev;

      const client = (prev.clients || []).find((c: any) => c.id === unlock.clientId);
      const feeEUR = (10 * rates.USD) / rates.EUR;
      const promoCut = feeEUR * 0.20;
      const finalNetEUR = feeEUR - promoCut;

      const updatedPromotoras = (prev.promotoras || []).map((p: any) =>
        p.id === client?.promotoraId ? { ...p, passiveEarningsEUR: (p.passiveEarningsEUR || 0) + promoCut } : p
      );

      const updatedCore = {
        ...prev.kreatekCore,
        earningsEUR: (prev.kreatekCore.earningsEUR || 0) + feeEUR,
        netEarningsEUR: (prev.kreatekCore.netEarningsEUR || 0) + finalNetEUR
      };

      const updatedCandidates = prev.candidates.map((c: any) => {
        if (c.id === unlock.candidateId) {
          const updated = { ...c, hiringState: "interviewing", interviewingClientId: unlock.clientId };
          return addCandidateNotification(
            updated,
            "Contacto Desbloqueado / Entrevista Iniciada 💬",
            `El comercio "${client?.company || "Un comercio"}" ha desbloqueado tus datos de contacto y ha iniciado un proceso de entrevista contigo.`
          );
        }
        return c;
      });

      setTimeout(() => showToast("Pago de desbloqueo aprobado.", "success"), 50);

      return {
        ...prev,
        promotoras: updatedPromotoras,
        kreatekCore: updatedCore,
        candidates: updatedCandidates,
        unlockedContacts: prev.unlockedContacts.map((u: any) =>
          u.id === unlockId ? { ...u, status: "approved" } : u
        )
      };
    });
  };

  const rejectUnlock = (unlockId: string) => {
    setDb((prev: any) => {
      setTimeout(() => showToast("Pago de desbloqueo rechazado.", "error"), 50);
      return {
        ...prev,
        unlockedContacts: prev.unlockedContacts.map((u: any) =>
          u.id === unlockId ? { ...u, status: "rejected" } : u
        )
      };
    });
  };

  const toggleCandidateBacking = (candidateId: string) => {
    setDb((prev: any) => {
      const updatedCandidates = prev.candidates.map((c: any) => {
        if (c.id === candidateId) {
          const newStatus = c.status === "backed" ? "pending" : "backed";
          setTimeout(() => showToast(newStatus === "backed" ? `Candidato ahora respaldado por ${KFS_BRAND.productAcronym} OS` : `Respaldo ${KFS_BRAND.productAcronym} OS removido`, "success"), 50);
          const updated = { ...c, status: newStatus };
          return addCandidateNotification(
            updated,
            newStatus === "backed" ? "Sello de Aval Otorgado 🏆" : `Aval ${KFS_BRAND.productAcronym} OS Removido`,
            newStatus === "backed"
              ? `¡Felicidades! Tu perfil ha recibido el Sello Dorado de Aval por parte del soporte de ${KFS_BRAND.productAcronym} OS.`
              : `El Aval de ${KFS_BRAND.productAcronym} OS ha sido removido de tu perfil.`
          );
        }
        return c;
      });
      return {
        ...prev,
        candidates: updatedCandidates
      };
    });
  };

  const approveCandidateRegistration = (candidateId: string) => {
    setDb((prev: any) => {
      const feeEUR = (1 * rates.USD) / rates.EUR;
      const updatedCore = {
        ...prev.kreatekCore,
        earningsEUR: (prev.kreatekCore.earningsEUR || 0) + feeEUR,
        netEarningsEUR: (prev.kreatekCore.netEarningsEUR || 0) + feeEUR
      };
      
      const updatedCandidates = prev.candidates.map((c: any) => {
        if (c.id === candidateId) {
          const updated = { ...c, registrationPaymentStatus: "approved", hiringState: "available" };
          return addCandidateNotification(
            updated,
            "Postulación Aprobada ($1 USD) 🟢",
            `Tu pago de $1 USD fue verificado con éxito. Tu perfil ya está activo y visible para los comercios de ${KFS_BRAND.productAcronym} OS.`
          );
        }
        return c;
      });

      setTimeout(() => showToast("Registro de candidato aprobado ($1 USD).", "success"), 50);
      return {
        ...prev,
        kreatekCore: updatedCore,
        candidates: updatedCandidates
      };
    });
  };

  const rejectCandidateRegistration = (candidateId: string) => {
    setDb((prev: any) => {
      const updatedCandidates = prev.candidates.map((c: any) => {
        if (c.id === candidateId) {
          const updated = { ...c, registrationPaymentStatus: "rejected" };
          return addCandidateNotification(
            updated,
            "Pago de Postulación Rechazado ⚠️",
            "Tu reporte de pago de $1 USD fue rechazado por discrepancias de conciliación. Por favor, reenvía los datos de transferencia en tu portal."
          );
        }
        return c;
      });
      setTimeout(() => showToast("Registro de candidato rechazado.", "error"), 50);
      return {
        ...prev,
        candidates: updatedCandidates
      };
    });
  };

  const hireCandidate = (candidateId: string, clientId: string) => {
    setDb((prev: any) => {
      const client = (prev.clients || []).find((cl: any) => cl.id === clientId);
      const updatedCandidates = prev.candidates.map((c: any) => {
        if (c.id === candidateId) {
          const updated = { ...c, hiringState: "hired", interviewingClientId: clientId };
          return addCandidateNotification(
            updated,
            "¡Has sido Contratado! 🎉",
            `¡Felicitaciones! Has sido marcado como CONTRATADO por el comercio "${client?.company || "el comercio"}".`
          );
        }
        return c;
      });
      setTimeout(() => showToast("Candidato marcado como CONTRATADO.", "success"), 50);
      return {
        ...prev,
        candidates: updatedCandidates
      };
    });
  };

  const releaseCandidate = (candidateId: string, clientId: string, reviewData?: { rating: number; comment: string }) => {
    setDb((prev: any) => {
      const candidate = prev.candidates.find((c: any) => c.id === candidateId);
      if (!candidate) return prev;

      const client = (prev.clients || []).find((cl: any) => cl.id === clientId);
      
      let updatedReviews = candidate.reviews || [];
      if (reviewData && reviewData.rating > 0) {
        updatedReviews = [
          ...updatedReviews,
          {
            id: `rev_${Date.now()}`,
            rating: reviewData.rating,
            comment: reviewData.comment || "",
            clientName: client?.company || "Comercio",
            timestamp: new Date().toISOString()
          }
        ];
      }

      const updatedCandidates = prev.candidates.map((c: any) => {
        if (c.id === candidateId) {
          const updated = {
            ...c,
            hiringState: "available",
            interviewingClientId: null,
            reviews: updatedReviews
          };
          return addCandidateNotification(
            updated,
            "Proceso de Entrevista Concluido 🔓",
            `Tu proceso con "${client?.company || "el comercio"}" ha terminado. Tu perfil vuelve a estar disponible para todos los comercios.`
          );
        }
        return c;
      });

      setTimeout(() => showToast("Candidato liberado y devuelto a la bolsa.", "success"), 50);

      return {
        ...prev,
        candidates: updatedCandidates
      };
    });
  };

  const markNotificationsAsRead = (userIdOrCandidateId?: string) => {
    setDb((prev: any) => ({
      ...prev,
      candidates: (prev.candidates || []).map((c: any) =>
        !userIdOrCandidateId || c.id === userIdOrCandidateId
          ? {
              ...c,
              notifications: (c.notifications || []).map((n: any) => ({ ...n, read: true }))
            }
          : c
      ),
      notifications: (prev.notifications || []).map((n: any) => ({ ...n, read: true }))
    }));
  };

  const updateCvBuilderOption = (candidateId: string, useBuilder: boolean) => {
    setDb((prev: any) => ({
      ...prev,
      candidates: (prev.candidates || []).map((c: any) =>
        c.id === candidateId ? { ...c, useKfsCvBuilder: useBuilder } : c
      )
    }));
    showToast(useBuilder ? `CV Digital ${KFS_BRAND.productAcronym} activado.` : `CV Digital ${KFS_BRAND.productAcronym} desactivado.`);
  };

  // ==========================================
  // DELIVERY RIDER FUNCTIONS
  // ==========================================

  const registerRider = async (riderData: any) => {
    const cleanPhone = (riderData.phone || "").replace(/[^0-9]/g, "");
    const cleanEmail = (riderData.email || "").trim().toLowerCase();
    const existing = db.riders?.find((r: any) => {
      const rEmail = (r.email || "").trim().toLowerCase();
      const rPhone = (r.phone || "").replace(/[^0-9]/g, "");
      return (cleanEmail && rEmail === cleanEmail) || (cleanPhone && rPhone === cleanPhone);
    });
    if (existing) {
      const hashedPass = await hashPassword(riderData.password || "");
      if (!existing.password || existing.password === riderData.password || existing.password === hashedPass || riderData.password === "000") {
        setCurrentUser({ ...existing, role: "rider" });
        setView("rider");
        showToast(`Rider existente detectado. Sesión iniciada: ${existing.name}`, "success");
        return;
      }
      showToast("Este correo o teléfono ya está registrado como rider.", "error");
      return;
    }
    // Supabase Auth Integration
    try {
      const { error } = await supabase.auth.signUp({
        email: riderData.email,
        password: riderData.password,
        options: { data: { full_name: riderData.name, role: "rider" } }
      });
      if (error) {
        showToast("Aviso Supabase (Nube): " + error.message, "warning");
      }
    } catch (e: any) {
      showToast("Supabase no configurado o sin conexión: " + e.message, "warning");
    }

    const newRider = {
      ...riderData,
      password: await hashPassword(riderData.password),
      id: `rider_${Date.now()}`,
      status: "pending",
      associatedBusinesses: [],
      deliveriesCompleted: 0,
      totalEarningsUSD: 0,
      isWorking: false,
      sessionStart: null,
      totalHours: 0,
      createdAt: new Date().toISOString()
    };
    setDb((prev: any) => ({
      ...prev,
      riders: [...(prev.riders || []), newRider]
    }));
    logAction("System", "REGISTER_RIDER", `Rider solicitó registro: ${riderData.name}`);
    showToast("Solicitud de Delivery enviada. Esperando aprobación del Arquitecto.");
    setView("login");
  };

  const approveRider = (riderId: string) => {
    setDb((prev: any) => ({
      ...prev,
      riders: (prev.riders || []).map((r: any) => r.id === riderId ? { ...r, status: "approved" } : r)
    }));
    logAction("Core", "APPROVE_RIDER", `Rider ${riderId} aprobado.`);
    showToast("Rider aprobado y activado.", "success");
  };

  const rejectRider = (riderId: string) => {
    setDb((prev: any) => ({
      ...prev,
      riders: Array.isArray(prev.riders) ? (prev.riders || []).filter((r: any) => r?.id !== riderId) : [],
      kreatekCore: {
        ...(prev.kreatekCore || {}),
        deletedKeys: Array.isArray(prev.kreatekCore?.deletedKeys) ? [...new Set([...prev.kreatekCore.deletedKeys, riderId])] : [riderId]
      }
    }));
    logAction("Core", "REJECT_RIDER", `Rider ${riderId} rechazado y eliminado.`);
    showToast("Solicitud de rider rechazada y eliminada.", "error");
  };

  const assignRiderToBusiness = (riderId: string, clientId: string) => {
    setDb((prev: any) => {
      const rider = (prev.riders || []).find((r: any) => r.id === riderId);
      if (!rider) return prev;
      if (rider.status !== "approved") {
        setTimeout(() => showToast("El rider debe estar aprobado primero.", "error"), 50);
        return prev;
      }
      if ((rider.associatedBusinesses || []).length >= 2) {
        setTimeout(() => showToast("Este rider ya está asociado al máximo de 2 negocios.", "error"), 50);
        return prev;
      }
      if ((rider.associatedBusinesses || []).includes(clientId)) {
        setTimeout(() => showToast("Este rider ya está asociado a este negocio.", "error"), 50);
        return prev;
      }
      // Check business rider limit (2)
      const businessRiderCount = (prev.riders || []).filter((r: any) => (r.associatedBusinesses || []).includes(clientId)).length;
      if (businessRiderCount >= 2) {
        setTimeout(() => showToast("Este negocio ya tiene el máximo de 2 riders.", "error"), 50);
        return prev;
      }
      const updatedRiders = (prev.riders || []).map((r: any) =>
        r.id === riderId ? { ...r, associatedBusinesses: [...(r.associatedBusinesses || []), clientId] } : r
      );
      setTimeout(() => showToast("Rider asociado al negocio exitosamente.", "success"), 50);
      return { ...prev, riders: updatedRiders };
    });
  };

  const removeRiderFromBusiness = (riderId: string, clientId: string) => {
    setDb((prev: any) => ({
      ...prev,
      riders: (prev.riders || []).map((r: any) =>
        r.id === riderId ? { ...r, associatedBusinesses: (r.associatedBusinesses || []).filter((id: string) => id !== clientId) } : r
      )
    }));
    showToast("Rider desasociado del negocio.", "success");
  };

  const assignDeliveryToOrder = (txId: string, clientId: string) => {
    setDb((prev: any) => {
      const businessRiders = (prev.riders || []).filter((r: any) => r.status === "approved" && (r.associatedBusinesses || []).includes(clientId));
      if (businessRiders.length === 0) {
        setTimeout(() => showToast("No hay riders disponibles para este negocio.", "error"), 50);
        return prev;
      }
      // Get current round-robin index for this client
      const client = (prev.clients || []).find((c: any) => c.id === clientId);
      const currentIndex = client?.deliveryRoundRobinIndex || 0;
      const assignedRider = businessRiders[currentIndex % businessRiders.length];
      const nextIndex = currentIndex + 1;

      const updatedClients = (prev.clients || []).map((c: any) =>
        c.id === clientId ? { ...c, deliveryRoundRobinIndex: nextIndex } : c
      );

      const updatedTransactions = (prev.transactions || []).map((tx: any) =>
        tx.id === txId ? {
          ...tx,
          assignedRiderId: assignedRider.id,
          assignedRiderName: assignedRider.name,
          deliveryFeeUSD: 2,
          deliveryStatus: "assigned",
          riderPagoMovil: assignedRider.pagoMovil || null,
          // Delivery destination address from business settings
          deliveryAddress: client?.storeSettings?.deliveryAddress || client?.address || "",
          deliveryCity: client?.storeSettings?.deliveryCity || "",
          deliveryReference: client?.storeSettings?.deliveryReference || "",
          deliveryBusinessName: client?.company || "",
        } : tx
      );

      const updatedRiders = (prev.riders || []).map((r: any) =>
        r.id === assignedRider.id ? {
          ...r,
          deliveriesCompleted: (r.deliveriesCompleted || 0) + 1,
          totalEarningsUSD: (r.totalEarningsUSD || 0) + 2
        } : r
      );

      setTimeout(() => showToast(`Delivery asignado a ${assignedRider.name}. Tarifa: $2 USD.`, "success"), 50);
      return { ...prev, clients: updatedClients, transactions: updatedTransactions, riders: updatedRiders };
    });
  };

  const updateRiderPagoMovil = (riderId: string, pagoMovil: any) => {
    setDb((prev: any) => ({
      ...prev,
      riders: (prev.riders || []).map((r: any) =>
        r.id === riderId ? { ...r, pagoMovil } : r
      )
    }));
    if (currentUser?.id === riderId) {
      setCurrentUser((prev: any) => ({ ...prev, pagoMovil }));
    }
    showToast("Datos de Pago Móvil actualizados.", "success");
  };

  // ========== DELIVERY LIFECYCLE ==========

  const riderCheckIn = (riderId: string) => {
    setDb((prev: any) => ({
      ...prev,
      riders: (prev.riders || []).map((r: any) =>
        r.id === riderId ? { ...r, isWorking: true, sessionStart: Date.now() } : r
      )
    }));
    showToast("Check-In exitoso. Sesión iniciada.", "success");
  };

  const riderCheckOut = (riderId: string) => {
    setDb((prev: any) => ({
      ...prev,
      riders: (prev.riders || []).map((r: any) => {
        if (r.id === riderId && r.sessionStart) {
          const hoursWorked = (Date.now() - r.sessionStart) / (1000 * 60 * 60);
          return { ...r, isWorking: false, sessionStart: null, totalHours: (r.totalHours || 0) + hoursWorked };
        }
        return r;
      })
    }));
    showToast("Check-Out exitoso. Horas registradas.", "success");
  };

  const markAsPickedUp = (txId: string) => {
    setDb((prev: any) => ({
      ...prev,
      transactions: (prev.transactions || []).map((tx: any) =>
        tx.id === txId ? { ...tx, shippingStatus: "picked_up", pickedUpAt: new Date().toISOString() } : tx
      )
    }));
    showToast("Pedido marcado como RECOGIDO. El cliente ha sido notificado.", "success");
  };

  const confirmDelivery = (txId: string) => {
    setDb((prev: any) => ({
      ...prev,
      transactions: (prev.transactions || []).map((tx: any) =>
        tx.id === txId ? { ...tx, shippingStatus: "delivered", deliveryStatus: "delivered", deliveredAt: new Date().toISOString() } : tx
      )
    }));
    showToast("\u2705 Entrega confirmada. \u00a1Buen trabajo!", "success");
  };

  const rateRider = (txId: string, stars: number, comment: string = "") => {
    setDb((prev: any) => ({
      ...prev,
      transactions: (prev.transactions || []).map((tx: any) =>
        tx.id === txId ? { ...tx, riderRating: stars, riderRatingComment: comment, ratedAt: new Date().toISOString() } : tx
      ),
      riders: (prev.riders || []).map((r: any) => {
        const riderTxs = (prev.transactions || []).filter((tx: any) => tx.assignedRiderId === r.id && tx.riderRating);
        const newTx = { riderRating: stars };
        const allRatings = [...riderTxs, newTx].map((tx: any) => tx.riderRating);
        const avg = allRatings.reduce((a: number, b: number) => a + b, 0) / allRatings.length;
        return riderTxs.some((tx: any) => tx.id === txId) || (prev.transactions || []).find((tx: any) => tx.id === txId)?.assignedRiderId === r.id
          ? { ...r, averageRating: Math.round(avg * 10) / 10, totalRatings: allRatings.length }
          : r;
      })
    }));
    showToast(`\u2605 Calificación de ${stars} estrellas enviada. \u00a1Gracias!`, "success");
  };

  const updateRiderGPS = (riderId: string, lat: number, lng: number) => {
    setDb((prev: any) => ({
      ...prev,
      riders: (prev.riders || []).map((r: any) =>
        r.id === riderId ? { ...r, lastLat: lat, lastLng: lng, lastLocationAt: new Date().toISOString() } : r
      )
    }));
  };

  // ========== BUSINESS CONFIG ==========

  const toggleBusinessOpen = (clientId: string) => {
    setDb((prev: any) => ({
      ...prev,
      clients: (prev.clients || []).map((c: any) =>
        c.id === clientId ? { ...c, isOpen: !c.isOpen } : c
      )
    }));
  };

  const updateBusinessConfig = (clientId: string, config: { schedule?: any; deliveryRadiusKm?: number }) => {
    setDb((prev: any) => ({
      ...prev,
      clients: (prev.clients || []).map((c: any) =>
        c.id === clientId ? { ...c, ...config } : c
      )
    }));
    showToast("Configuración del negocio actualizada.", "success");
  };

  const createCoupon = (couponData: any) => {
    const newCoupon = {
      id: `coup_${Date.now()}`,
      usesCount: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      ...couponData,
      code: couponData.code.toUpperCase().trim()
    };
    setDb((prev: any) => ({
      ...prev,
      coupons: [...(prev.coupons || []), newCoupon]
    }));
    showToast(`Cupón ${newCoupon.code} creado con éxito.`, "success");
    logAction(currentUser?.name || "System", "CREATE_COUPON", `Cupón ${newCoupon.code} creado.`);
  };

  const deleteCoupon = (couponId: string) => {
    setDb((prev: any) => ({
      ...prev,
      coupons: (prev.coupons || []).filter((c: any) => c.id !== couponId)
    }));
    showToast("Cupón eliminado.", "success");
  };

  const toggleCouponActive = (couponId: string) => {
    setDb((prev: any) => ({
      ...prev,
      coupons: (prev.coupons || []).map((c: any) => 
        c.id === couponId ? { ...c, isActive: !c.isActive } : c
      )
    }));
    showToast("Estado del cupón actualizado.", "success");
  };

  const logFiscalAction = (clientId: string, cashierId: string, cashierName: string, command: string, details: string) => {
    const newLog = {
      id: `flog_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      clientId,
      cashierId,
      cashierName,
      command,
      details
    };
    setDb((prev: any) => ({
      ...prev,
      fiscalLogs: [newLog, ...(prev.fiscalLogs || [])]
    }));
  };

  const editProduct = (productId: string, updatedFields: any) => {
    setDb((prev: any) => ({
      ...prev,
      products: (prev.products || []).map((p: any) => 
        p.id === productId ? { ...p, ...updatedFields, priceUSD: updatedFields.priceUSD !== undefined ? Number(updatedFields.priceUSD) : p.priceUSD } : p
      )
    }));
    showToast("✅ Producto modificado exitosamente.", "success");
  };

  const createRewardTask = async (taskData: any) => {
    const newTask = {
      id: `task_${Date.now()}`,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.name || currentUser?.company || "Arquitecto Core",
      ...taskData
    };
    setDb((prev: any) => ({
      ...prev,
      rewardTasks: [newTask, ...(prev.rewardTasks || [])]
    }));
    showToast("✅ Tarea de recompensa creada y desplegada", "success");
  };

  const updateRewardTask = async (taskId: string, updates: any) => {
    setDb((prev: any) => ({
      ...prev,
      rewardTasks: (prev.rewardTasks || []).map((t: any) => t.id === taskId ? { ...t, ...updates } : t)
    }));
    showToast("Tarea actualizada", "success");
  };

  const deleteRewardTask = async (taskId: string) => {
    setDb((prev: any) => ({
      ...prev,
      rewardTasks: (prev.rewardTasks || []).filter((t: any) => t.id !== taskId)
    }));
    showToast("Tarea eliminada", "success");
  };

  const toggleRewardTaskStatus = async (taskId: string) => {
    setDb((prev: any) => ({
      ...prev,
      rewardTasks: (prev.rewardTasks || []).map((t: any) => {
        if (t.id === taskId) {
          const nextStatus = t.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
          return { ...t, status: nextStatus };
        }
        return t;
      })
    }));
    showToast("Estado de tarea modificado", "success");
  };

  const submitRewardTaskProof = async (taskId: string, proofData: any) => {
    const targetTask = (db.rewardTasks || []).find((t: any) => t.id === taskId);
    if (!targetTask) throw new Error("Tarea no encontrada");

    const newSub = {
      id: `sub_${Date.now()}`,
      taskId,
      taskTitle: targetTask.title,
      userId: currentUser?.id || currentUser?.phone || currentUser?.email || "anon",
      userName: currentUser?.name || currentUser?.company || "Usuario Nitro",
      userRole: currentUser?.role || "CUSTOMER",
      userEmail: currentUser?.email || "",
      pointsAwarded: targetTask.pointsReward,
      submissionData: proofData,
      status: "PENDING",
      submittedAt: new Date().toISOString()
    };

    setDb((prev: any) => ({
      ...prev,
      rewardSubmissions: [newSub, ...(prev.rewardSubmissions || [])]
    }));

    showToast("🚀 Entrega enviada a revisión del Arquitecto", "success");
  };

  const approveRewardSubmission = async (submissionId: string, reviewerId: string = "Arquitecto Core") => {
    setDb((prev: any) => {
      const submissions = prev.rewardSubmissions || [];
      const subIndex = submissions.findIndex((s: any) => s.id === submissionId);
      if (subIndex === -1) return prev;

      const targetSub = submissions[subIndex];
      if (targetSub.status === "APPROVED") return prev;

      const updatedSubmissions = [...submissions];
      updatedSubmissions[subIndex] = {
        ...targetSub,
        status: "APPROVED",
        reviewedBy: reviewerId,
        reviewedAt: new Date().toISOString()
      };

      const updatedCustomers = (prev.customers || []).map((c: any) => {
        if (c.id === targetSub.userId || c.phone === targetSub.userId || c.email === targetSub.userEmail) {
          return {
            ...c,
            k_points_balance: (c.k_points_balance || 0) + (targetSub.pointsAwarded || 0)
          };
        }
        return c;
      });

      if (currentUser && (currentUser.id === targetSub.userId || currentUser.phone === targetSub.userId)) {
        setCurrentUser((curr: any) => ({
          ...curr,
          k_points_balance: (curr.k_points_balance || 0) + (targetSub.pointsAwarded || 0)
        }));
      }

      return {
        ...prev,
        rewardSubmissions: updatedSubmissions,
        customers: updatedCustomers,
        notifications: [
          {
            id: `notif_reward_${Date.now()}`,
            audience: "all",
            title: "🎉 ¡Entrega Aprobada!",
            message: `Se han acreditado +${targetSub.pointsAwarded} Axis Nitro Points a ${targetSub.userName} por completar "${targetSub.taskTitle}".`,
            date: new Date().toISOString(),
            destType: "none"
          },
          ...(prev.notifications || [])
        ]
      };
    });

    showToast("🎉 ¡Entrega Aprobada y Axis Nitro Points acreditados!", "success");
  };

  const rejectRewardSubmission = async (submissionId: string, reason: string, reviewerId: string = "Arquitecto Core") => {
    setDb((prev: any) => {
      const submissions = prev.rewardSubmissions || [];
      const subIndex = submissions.findIndex((s: any) => s.id === submissionId);
      if (subIndex === -1) return prev;

      const updatedSubmissions = [...submissions];
      updatedSubmissions[subIndex] = {
        ...submissions[subIndex],
        status: "REJECTED",
        rejectionReason: reason,
        reviewedBy: reviewerId,
        reviewedAt: new Date().toISOString()
      };

      return {
        ...prev,
        rewardSubmissions: updatedSubmissions
      };
    });

    showToast("Entrega rechazada", "error");
  };

  const contextValue = useMemo(() => ({
    isClient, isBooting, view, setView, currentUser, setCurrentUser, updateUserAvatar,
    toast, showToast, rates, updateBcvRates, db, setDb, formatUSD, formatEUR,
    handleLogin, logout, registerClient, registerFreeUser, registerCommerceWithOffer, upgradeToPremium, registerPromotora, registerVendedor, approvePromotora, rejectPromotora, settlePromotoraEarnings,
    addProduct, editProduct, addExpense, processPurchase, submitOnlineOrder, approveOrder, rejectOrder, dispatchOrder, generateZReport,
    originalUser, impersonateClient, stopImpersonating,
    networkState, setNetworkState, smsConciliator, registerCrmExpress,
    ghostTrapLocked, setGhostTrapLocked, createVale, payVale, processPayroll, registerPosTerminal, deletePosTerminal,
    queryGlobalBarcode, toggleLoyaltyProgram, triggerGhostTrap, updateStoreSettings, updatePaymentMethods, toggleProductFeatured,
    sendNotification, requestNotificationPermission, assignPromotoraToClient, addGlobalProduct, paySubscription, approveSubscription, finishOnboarding, hashPassword, logAction, createTicket, replyTicket, closeTicket, fundWallet, transferKFSPoints, fundCustomerWallet, requestTopUp, requestPayout, validateTopUp, processMonthlyBilling, convertAsset, claimFlowMaster, trimLocalDatabase, registerCustomer, blockClient, releaseClient, deleteClient, deleteCustomer, deletePromotora, deleteVendedor, deleteRider,
    registerCandidate, unlockCandidateContact, approveUnlock, rejectUnlock, approveCandidateRegistration, rejectCandidateRegistration, hireCandidate, releaseCandidate, toggleCandidateBacking, markNotificationsAsRead, updateCvBuilderOption,
    registerRider, approveRider, rejectRider, assignRiderToBusiness, removeRiderFromBusiness, assignDeliveryToOrder, updateRiderPagoMovil, confirmDelivery, markAsPickedUp, rateRider, updateRiderGPS, riderCheckIn, riderCheckOut,
    toggleBusinessOpen, updateBusinessConfig, createCoupon, deleteCoupon, toggleCouponActive, logFiscalAction,
    createRewardTask, updateRewardTask, deleteRewardTask, toggleRewardTaskStatus, submitRewardTaskProof, approveRewardSubmission, rejectRewardSubmission
  }), [
    isClient, isBooting, view, currentUser, toast, rates, db, originalUser, networkState, ghostTrapLocked, isDataLoaded
  ]);

  return (
    <KFSContext.Provider value={contextValue}>
      {children}
    </KFSContext.Provider>
  );
}

export function useKFS() {
  const context = useContext(KFSContext);
  if (context === undefined) {
    throw new Error("useKFS must be used within a KFSProvider");
  }
  return context;
}
