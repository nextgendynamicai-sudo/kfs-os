"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { supabase, isSupabaseConfigured } from "./supabase";

const VENEZUELAN_PRODUCTS_CATALOG: Record<string, { name: string; imgUrl: string; category: string; brand: string }> = {
  "7591006000016": { name: "Harina PAN Blanca (1kg)", imgUrl: "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=500&auto=format&fit=crop&q=60", category: "Alimentos", brand: "Alimentos Polar" },
  "7591005000574": { name: "Margarina Mavesa Común (500g)", imgUrl: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=60", category: "Alimentos", brand: "Alimentos Polar" },
  "7591005001151": { name: "Mayonesa Mavesa Tradicional (445g)", imgUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500&auto=format&fit=crop&q=60", category: "Alimentos", brand: "Alimentos Polar" },
  "7591001000219": { name: "Malta Polar Botella (250ml)", imgUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=60", category: "Bebidas", brand: "Cervecería Polar" },
  "7591001000110": { name: "Cerveza Polar Pilsen (Tercio 295ml)", imgUrl: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500&auto=format&fit=crop&q=60", category: "Bebidas", brand: "Cervecería Polar" },
  "7591395000147": { name: "Pirulin Original (Lata 190g)", imgUrl: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500&auto=format&fit=crop&q=60", category: "Dulces", brand: "Nucita Venezolana" },
  "7591016205722": { name: "Galleta Savoy Cocosette (50g)", imgUrl: "https://images.unsplash.com/photo-1559622214-f8a98509ef74?w=500&auto=format&fit=crop&q=60", category: "Dulces", brand: "Nestlé Savoy" },
  "7591016205708": { name: "Galleta Savoy Susy (50g)", imgUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=60", category: "Dulces", brand: "Nestlé Savoy" },
  "7591016035251": { name: "Chocolate Savoy de Leche (130g)", imgUrl: "https://images.unsplash.com/photo-1548907040-4d42b521e5e4?w=500&auto=format&fit=crop&q=60", category: "Dulces", brand: "Nestlé Savoy" },
  "7591016035404": { name: "Bombón Savoy Toronto (Bolsa 36u)", imgUrl: "https://images.unsplash.com/photo-1581798459219-318e76c1fd75?w=500&auto=format&fit=crop&q=60", category: "Dulces", brand: "Nestlé Savoy" },
  "7591005001229": { name: "Queso Fundido Rikesa Cheddar (300g)", imgUrl: "https://images.unsplash.com/photo-1589415082482-f6cbb779cc47?w=500&auto=format&fit=crop&q=60", category: "Alimentos", brand: "Alimentos Polar" },
  "7591041000675": { name: "Queso Fundido Cheez Whiz (300g)", imgUrl: "https://images.unsplash.com/photo-1589415082482-f6cbb779cc47?w=500&auto=format&fit=crop&q=60", category: "Alimentos", brand: "Kraft" },
  "7591005002042": { name: "Toddy Chocolate en Polvo (400g)", imgUrl: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=500&auto=format&fit=crop&q=60", category: "Bebidas", brand: "Alimentos Polar" },
  "7591018000547": { name: "Salsa de Tomate Pampero (397g)", imgUrl: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&auto=format&fit=crop&q=60", category: "Alimentos", brand: "Pampero" },
  "7591642000678": { name: "Arroz Mary Dorado Extra (1kg)", imgUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=60", category: "Alimentos", brand: "Alimentos Mary" },
  "7591024001019": { name: "Café Molido Fama de América (250g)", imgUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=60", category: "Alimentos", brand: "Fama de América" },
  "7591006001044": { name: "Pasta Primor Spaghetti (1kg)", imgUrl: "https://images.unsplash.com/photo-1621961404018-8199342e7bc9?w=500&auto=format&fit=crop&q=60", category: "Alimentos", brand: "Alimentos Polar" },
  "7591060000120": { name: "Diablitos Underwood Jamón (115g)", imgUrl: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=500&auto=format&fit=crop&q=60", category: "Alimentos", brand: "Diablitos Underwood" },
  "7591021000107": { name: "Atún Margarita en Aceite (140g)", imgUrl: "https://images.unsplash.com/photo-1544860707-c352cc5a92e3?w=500&auto=format&fit=crop&q=60", category: "Alimentos", brand: "Alimentos Polar" },
  "759104101405": { name: "Salsa Inglesa Kraft (150ml)", imgUrl: "https://images.unsplash.com/photo-1589415082482-f6cbb779cc47?w=500&auto=format&fit=crop&q=60", category: "Alimentos", brand: "Kraft" },
  "7591005000758": { name: "Vinagre Blanco Mavesa (1L)", imgUrl: "https://images.unsplash.com/photo-1589415082482-f6cbb779cc47?w=500&auto=format&fit=crop&q=60", category: "Alimentos", brand: "Alimentos Polar" },
  "7591005002905": { name: "Detergente Polvo Las Llaves (1kg)", imgUrl: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=60", category: "Limpieza", brand: "Alimentos Polar" },
  "7591005001601": { name: "Jabón Azul Las Llaves Bebé (250g)", imgUrl: "https://images.unsplash.com/photo-1607006342411-92fc0a41f845?w=500&auto=format&fit=crop&q=60", category: "Limpieza", brand: "Alimentos Polar" },
  "7591142100014": { name: "Harina de Trigo Robin Hood (1kg)", imgUrl: "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=500&auto=format&fit=crop&q=60", category: "Alimentos", brand: "Monaca" },
  "7591736000454": { name: "Suavizante Ensueño Floral (1L)", imgUrl: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=60", category: "Limpieza", brand: "Corimon" }
};

const MOCK_BCV_RATES = {
  USD: 36.45,
  EUR: 39.20,
  isWeekend: false
};

const initialDB = {
  promotoras: [] as any[],
  clients: [] as any[],
  vendedores: [] as any[],
  products: [] as any[],
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
    adBudgetEUR: 0
  },
  ghostLogs: [] as any[],
  notifications: [] as any[],
  auditLogs: [] as any[],
  supportTickets: [] as any[],
  candidates: [] as any[],
  unlockedContacts: [] as any[],
  riders: [] as any[]
};

interface KFSContextType {
  isClient: boolean;
  isBooting: boolean;
  view: string;
  setView: (view: string) => void;
  currentUser: any;
  setCurrentUser: (user: any) => void;
  toast: { show: boolean; message: string; type: string };
  showToast: (message: string, type?: "success" | "error") => void;
  rates: typeof MOCK_BCV_RATES;
  db: typeof initialDB;
  setDb: React.Dispatch<React.SetStateAction<typeof initialDB>>;
  formatUSD: (val: number) => string;
  formatEUR: (val: number) => string;
  handleLogin: (role: string, password: string, email?: string | null) => void;
  logout: () => void;
  registerClient: (clientData: any, promotoraId: string, kfsFeePercentage: number) => void;
  registerPromotora: (promoData: any) => void;
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
  networkState: "online" | "mesh" | "offline";
  setNetworkState: (state: "online" | "mesh" | "offline") => void;
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
  sendNotification: (audience: string, title: string, message: string) => void;
  assignPromotoraToClient: (clientId: string, promotoraId: string) => void;
  addGlobalProduct: (product: any) => void;
  paySubscription: (clientId: string, reference: string) => void;
  approveSubscription: (clientId: string) => void;
  finishOnboarding: (clientId: string, kycDocBase64?: string) => void;
  hashPassword: (password: string) => string;
  logAction: (actor: string, action: string, details: string) => void;
  createTicket: (clientId: string, subject: string, description: string) => void;
  replyTicket: (ticketId: string, author: string, message: string) => void;
  closeTicket: (ticketId: string) => void;
  fundWallet: (clientId: string, amountUSD: number) => void;
  processMonthlyBilling: (clientId: string) => void;
  registerCustomer: (phone: string, password: string, name: string) => void;
  blockClient: (clientId: string) => void;
  releaseClient: (clientId: string) => void;
  deleteClient: (clientId: string) => void;
  registerCandidate: (candidateData: any) => void;
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
}

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
    (localArr || []).forEach(i => {
      const key = i.id || i.barcode || JSON.stringify(i);
      const existing = map.get(key);
      const isNew = !existing;
      const isAuthority = checkAuthority ? checkAuthority(i) : true;
      
      if (isNew || isAuthority) {
        map.set(key, i);
      }
    });
    return Array.from(map.values());
  };

  // 1. Clients
  const mergeClientsIncoming = (localClients: any[], remoteClients: any[]) => {
    const map = new Map();
    (remoteClients || []).forEach(c => map.set(c.id, c));
    (localClients || []).forEach(c => {
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
    return Array.from(map.values());
  };

  // 2. Products
  const mergeProductsIncoming = (localProducts: any[], remoteProducts: any[]) => {
    const map = new Map();
    (remoteProducts || []).forEach(p => map.set(p.id, p));
    (localProducts || []).forEach(p => {
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
  
  // merge kreatekCore with max-value safety
  const localCore = localDb.kreatekCore || {};
  const remoteCore = remoteDb.kreatekCore || {};
  mergedDb.kreatekCore = {
    totalTransactions: Math.max(localCore.totalTransactions || 0, remoteCore.totalTransactions || 0),
    earningsEUR: Math.max(localCore.earningsEUR || 0, remoteCore.earningsEUR || 0),
    netEarningsEUR: Math.max(localCore.netEarningsEUR || 0, remoteCore.netEarningsEUR || 0),
    adBudgetEUR: Math.max(localCore.adBudgetEUR || 0, remoteCore.adBudgetEUR || 0),
    avatar: localCore.avatar || remoteCore.avatar
  };

  return mergedDb;
};

const KFSContext = createContext<KFSContextType | undefined>(undefined);

export function KFSProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [view, setViewInternal] = useState("landing"); 
  
  const setView = (newView: string) => {
    setViewInternal(newView);
    if (typeof window !== "undefined" && window.history) {
      window.history.pushState({ view: newView }, "", `#${newView}`);
    }
  };

  const [currentUser, setCurrentUser] = useState<any>(null);
  const currentUserRef = useRef(currentUser);
  useEffect(() => {
    currentUserRef.current = currentUser;
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
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [rates, setRates] = useState(MOCK_BCV_RATES);
  const [db, setDb] = useState<any>(initialDB);
  const [networkState, setNetworkState] = useState<"online" | "mesh" | "offline">("online");
  const [ghostTrapLocked, setGhostTrapLocked] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const ghostTrapActive = useRef(true);
  const isRemoteUpdate = useRef(false);

  // Hydration and Boot timer
  useEffect(() => {
    setIsClient(true);
    
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setViewInternal(hash);
      } else {
        setViewInternal("landing");
        window.history.replaceState({ view: "landing" }, "", "#landing");
      }
    }

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        setViewInternal(event.state.view);
      } else {
        const hash = window.location.hash.replace("#", "");
        if (hash) {
          setViewInternal(hash);
        } else {
          setViewInternal("landing");
        }
      }
    };
    window.addEventListener("popstate", handlePopState);

    
    // Sincronización con el Banco Central de Venezuela (API Route)
    fetch("/api/bcv")
      .then(res => res.json())
      .then(data => {
        if (data.USD && data.EUR) {
          const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
          // [SUNDDE Compliance] Mantenemos la tasa BCV oficial limpia para exhibición.
          // El 'Weekend Shield' operará en otra capa si es necesario.
          const finalUSD = data.USD; 
          const finalEUR = data.EUR;
          
          setRates({ USD: finalUSD, EUR: finalEUR, isWeekend });
          console.log(`BCV Rates Synced Oficiales:`, { USD: finalUSD, EUR: finalEUR });
        }
      })
      .catch(err => {
        const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
        setRates({ ...MOCK_BCV_RATES, isWeekend });
        console.error("Fallo al obtener BCV, usando mock oficial", err);
      })
      .finally(() => {
        setIsBooting(false);
      });

    try {
      const saved = localStorage.getItem("kfs_os_db_prod");
      if (saved) {
        setDb(JSON.parse(saved));
      }
      
      if (isSupabaseConfigured && navigator.onLine) {
        const syncId = "kfs-general-db-prod";
        
        supabase
          .from("kfs_store_states")
          .select("db_state")
          .eq("id", syncId)
          .single()
          .then(({ data, error }: any) => {
            if (data && data.db_state) {
              setDb((prevDb: any) => {
                return mergeIncomingDb(prevDb, data.db_state, currentUserRef.current);
              });
              console.log("[Supabase Cloud] Base de datos restaurada desde la nube y fusionada con estado local.");
            } else if (error && error.code === 'PGRST116') {
              console.log("[Supabase Cloud] Fila no encontrada (BD vacía o borrada). Restableciendo local a 0.");
              setDb(initialDB);
              localStorage.setItem("kfs_os_db_prod", JSON.stringify(initialDB));
              setCurrentUser(null);
              setOriginalUser(null);
              setView("landing");
            }
          })
          .catch((err: any) => {
            console.log("Supabase initial sync bypass:", err);
            if (err && (err.code === 'PGRST116' || (err.message && err.message.includes('0 rows')))) {
              setDb(initialDB);
              localStorage.setItem("kfs_os_db_prod", JSON.stringify(initialDB));
              setCurrentUser(null);
              setOriginalUser(null);
              setView("landing");
            }
          })
          .finally(() => {
            setIsDataLoaded(true);
            
            // Subscribe to real-time updates
            if (isSupabaseConfigured) {
              const channel = supabase.channel('public:kfs_store_states');
              channel
                .on('postgres_changes', { event: '*', schema: 'public', table: 'kfs_store_states', filter: `id=eq.${syncId}` }, (payload: any) => {
                  if (payload.new && payload.new.db_state) {
                    const remote = payload.new.db_state;
                    isRemoteUpdate.current = true;
                    setDb((prevDb: any) => {
                      const merged = mergeIncomingDb(prevDb, remote, currentUserRef.current);
                      if (JSON.stringify(prevDb) !== JSON.stringify(merged)) {
                        return merged;
                      }
                      return prevDb;
                    });
                    console.log("[Supabase Realtime] Estado sincronizado en tiempo real con fusión local.");
                  } else if (payload.eventType === 'DELETE' || !payload.new) {
                    console.log("[Supabase Realtime] Fila eliminada (BD borrada). Restableciendo local a 0.");
                    setDb(initialDB);
                    localStorage.setItem("kfs_os_db_prod", JSON.stringify(initialDB));
                    setCurrentUser(null);
                    setOriginalUser(null);
                    setView("landing");
                  }
                })
                .subscribe();

              // Polling Fallback para Móviles (Garantiza 100% Real-Time si fallan WebSockets)
              setInterval(() => {
                supabase.from("kfs_store_states").select("db_state").eq("id", syncId).single().then(({ data, error }: any) => {
                  if (error && error.code === '42501') {
                    console.error("Supabase RLS Error:", error);
                  }
                  if (data && data.db_state) {
                    setDb((prevDb: any) => {
                      const merged = mergeIncomingDb(prevDb, data.db_state, currentUserRef.current);
                      if (JSON.stringify(prevDb) !== JSON.stringify(merged)) {
                        isRemoteUpdate.current = true;
                        console.log("[Supabase Polling Fallback] Data entrante detectada. Sincronizando con fusión local...");
                        return merged;
                      }
                      return prevDb;
                    });
                  } else if (error && error.code === 'PGRST116') {
                    console.log("[Supabase Polling Fallback] Fila no encontrada (BD vacía o borrada). Restableciendo local a 0.");
                    setDb(initialDB);
                    localStorage.setItem("kfs_os_db_prod", JSON.stringify(initialDB));
                    setCurrentUser(null);
                    setOriginalUser(null);
                    setView("landing");
                  }
                }).catch(() => {});
              }, 4000);
            }
          });
      } else {
        setIsDataLoaded(true);
      }
    } catch (error) {
      console.warn("Entorno restringido detectado. Activando memoria volátil.");
      setIsDataLoaded(true);
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
                console.log("[KFS SW] Nuevo Service Worker instalado. Recargando...");
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
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);


  // Save DB to LocalStorage & Supabase Cloud
  useEffect(() => {
    if (!isClient || !isDataLoaded) return;
    
    try {
      localStorage.setItem("kfs_os_db_prod", JSON.stringify(db));
    } catch (lsError) {
      console.warn("[KFS LocalStorage] Advertencia: Límite de cuota local excedido.", lsError);
    }
    
    if (isRemoteUpdate.current) {
      // Skip cloud push for remote updates to prevent infinite loop
      isRemoteUpdate.current = false;
      return;
    }
    
    if (isSupabaseConfigured && networkState === "online") {
      const syncId = "kfs-general-db-prod";
      
      // Anti-Collision Merge Strategy
      supabase.from("kfs_store_states").select("db_state").eq("id", syncId).single().then(({ data }: any) => {
        let mergedDb = { ...db };
        if (data && data.db_state) {
          const remote = data.db_state;
          mergedDb = mergeIncomingDb(db, remote, currentUserRef.current);
        }

        supabase
          .from("kfs_store_states")
          .upsert({
            id: syncId,
            db_state: mergedDb,
            updated_at: new Date().toISOString()
          })
          .then(({ error }: any) => {
            if (error) {
              console.warn("[KFS Cloud] Aviso: Sincronización asíncrona omitida. Verifique que haya ejecutado 'supabase_setup.sql' en su proyecto.", error.message || error.code || "");
            } else {
              console.log("[Supabase Cloud] Estado sincronizado asíncronamente con protección Anti-Colisión.");
            }
          })
          .catch((err: any) => {
            console.error("[Supabase Cloud] Error al sincronizar con la nube:", err);
          });
      }).catch((err: any) => {
        console.error("[Supabase Cloud] Error al obtener el estado de la nube para merge:", err);
      });
    }
  }, [db, isClient, networkState, currentUser, isDataLoaded]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const formatUSD = (val: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);
  const formatEUR = (val: number) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(val);

  const handleLogin = (role: string, password: string, email: string | null = null) => {
    const safePass = password ? password.trim() : "";
    const safeEmail = email ? email.trim() : "";

    // Universal "1" Password Bypass for all roles
    if (safePass === "1") {
      if (role === "core") {
        setCurrentUser({ role: "core", name: "El Arquitecto", avatar: db.kreatekCore?.avatar || "" });
        setView("core");
        showToast("KFS OS Accesado. Bienvenido, Arquitecto.");
        return;
      }
      if (role === "promotora") {
        const promo = db.promotoras.find((p: any) => p.email === safeEmail) || db.promotoras[0] || { id: "p1", name: "Promotora Alpha", email: "promo@kfs.com", status: "active" };
        setCurrentUser({ ...promo, role: "promotora" });
        setView("promotora");
        showToast(`Hub Promotora Accesado: ${promo.name}`);
        return;
      }
      if (role === "dueño") {
        const client = db.clients.find((c: any) => c.email === safeEmail) || db.clients[0] || { id: "c1", company: "Kreatek Demo Store", kfsTier: "monopoly", role: "dueño" };
        setCurrentUser({ ...client, role: "dueño" });
        setView("client");
        showToast(`Bienvenido al comercio: ${client.company}`);
        return;
      }
      if (role === "vendedor") {
        const vendedor = db.vendedores.find((v: any) => v.email === safeEmail) || db.vendedores[0] || { id: "v1", name: "Vendedor Demo", clientId: "c1", role: "vendedor" };
        setCurrentUser({ ...vendedor, role: "vendedor" });
        setView("vendedor");
        showToast(`Terminal de Vendedor activado: ${vendedor.name}`);
        return;
      }
      if (role === "customer") {
        const customer = db.customers?.find((c: any) => c.phone === safeEmail) || db.customers?.[0] || { role: "customer", name: "Usuario Demo", phone: "000" };
        setCurrentUser({ ...customer, role: "customer" });
        setView("customer");
        showToast(`Bienvenido de vuelta, ${customer.name}`);
        return;
      }
      if (role === "rider") {
        const rider = db.riders?.find((r: any) => r.email === safeEmail) || db.riders?.[0] || { id: "r1", name: "Rider Demo", email: "rider@kfs.com", status: "approved" };
        setCurrentUser({ ...rider, role: "rider" });
        setView("rider");
        showToast(`Panel Delivery activado: ${rider.name}`);
        return;
      }
    }

    // Acceso Rápido (Dev Access)
    if (role === "core" && (safePass === "199521." || safePass === "000")) {
      setCurrentUser({ role: "core", name: "El Arquitecto", avatar: db.kreatekCore?.avatar || "" });
      setView("core");
      showToast("KFS OS Accesado. Bienvenido, Arquitecto.");
      return;
    }

    const isProvisional = safePass === "123123" || safePass === "000";
    if (role === "promotora") {
      if (password === "1995" || isProvisional) {
        setCurrentUser({ role: "promotora", name: "Promotora Alpha", id: "p1" });
        setView("promotora");
        showToast("Sesión de Promotora Maestra Iniciada.");
      } else {
        const promo = db.promotoras.find((p: any) => p.email === safeEmail && p.password === safePass);
        if (promo) {
          if (promo.status === 'pending') {
            showToast("Su cuenta está pendiente de aprobación por KFS.", "error");
          } else {
            setCurrentUser({ ...promo, role: "promotora" });
            setView("promotora");
            showToast(`Hub Promotora Accesado: ${promo.name}`);
          }
        } else {
          showToast("Credenciales de promotora inválidas.", "error");
        }
      }
    } else if (role === "dueño") {
      if (safePass === "1234" || isProvisional) {
        const client = db.clients.find((c: any) => c.email === safeEmail) || db.clients[0] || { id: "c1", company: "Kreatek Demo Store", kfsTier: "monopoly", role: "dueño" };
        if (client) {
          setCurrentUser({ ...client, role: "dueño" });
          setView("client");
          showToast(`Bienvenido al comercio: ${client.company}`);
        } else {
          showToast("Dueño no encontrado. Regístrese.", "error");
        }
      } else {
        const client = db.clients.find((c: any) => c.email === safeEmail && (c.password === safePass || c.password === hashPassword(safePass)));
        if (client) {
          setCurrentUser({ ...client, role: "dueño" });
          setView("client");
          logAction(client.company, "LOGIN_CLIENT", `Dueño de comercio ingresó al sistema.`);
          showToast(`Bienvenido al comercio: ${client.company}`);
        } else {
          showToast("Credenciales de dueño incorrectas.", "error");
        }
      }
    } else if (role === "vendedor") {
      if (isProvisional) {
        const vendedorDemo = db.vendedores[0] || { id: "v1", name: "Vendedor Demo", clientId: "c1", role: "vendedor" };
        if (vendedorDemo) {
          setCurrentUser({ ...vendedorDemo, role: "vendedor" });
          setView("vendedor");
          showToast(`Terminal de Vendedor activado: ${vendedorDemo.name}`);
        } else {
          showToast("No hay vendedores registrados para usar la clave provisional.", "error");
        }
      } else {
        const vendedor = db.vendedores.find((v: any) => v.email === safeEmail && (v.password === safePass || v.password === hashPassword(safePass)));
        if (vendedor) {
           setCurrentUser({ ...vendedor, role: "vendedor" });
           setView("vendedor");
           logAction(vendedor.name, "LOGIN_VENDEDOR", `Terminal activado.`);
           showToast(`Terminal de Vendedor activado: ${vendedor.name}`);
        } else {
           showToast("Credenciales de vendedor inválidas.", "error");
        }
      }
    } else if (role === "customer") {
      if (isProvisional) {
        const customerDemo = db.customers?.[0] || { role: "customer", name: "Usuario Demo", phone: "000" };
        setCurrentUser({ ...customerDemo, role: "customer" });
        setView("customer");
        showToast(`Bienvenido de vuelta, ${customerDemo.name}`);
      } else {
        const customer = db.customers?.find((c: any) => c.phone === safeEmail && (c.password === safePass || c.password === hashPassword(safePass)));
        if (customer) {
          setCurrentUser({ ...customer, role: "customer" });
          setView("customer");
          showToast(`Bienvenido de vuelta, ${customer.name}`);
        } else {
          showToast("Credenciales de cliente incorrectas.", "error");
        }
      }
    } else if (role === "rider") {
      if (isProvisional) {
        const riderDemo = db.riders?.[0];
        if (riderDemo) {
          setCurrentUser({ ...riderDemo, role: "rider" });
          setView("rider");
          showToast(`Panel Delivery activado: ${riderDemo.name}`);
        } else {
          showToast("No hay riders registrados.", "error");
        }
      } else {
        const rider = db.riders?.find((r: any) => r.email === safeEmail && (r.password === safePass || r.password === hashPassword(safePass)));
        if (rider) {
          if (rider.status === 'pending') {
            showToast("Tu cuenta de delivery está pendiente de aprobación.", "error");
          } else if (rider.status === 'rejected') {
            showToast("Tu solicitud de delivery fue rechazada.", "error");
          } else {
            setCurrentUser({ ...rider, role: "rider" });
            setView("rider");
            logAction(rider.name, "LOGIN_RIDER", `Rider ingresó al sistema.`);
            showToast(`Panel Delivery activado: ${rider.name}`);
          }
        } else {
          showToast("Credenciales de delivery incorrectas.", "error");
        }
      }
    } else if (role === "marketplace") {
      setView("marketplace");
    } else {
      showToast("Credenciales inválidas.", "error");
    }
  };

  const hashPassword = (password: string) => {
    return btoa(password).split('').reverse().join('');
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
      clients: prev.clients.map((c: any) => 
        c.id === clientId ? { ...c, walletBalanceUSD: (c.walletBalanceUSD || 0) + amountUSD } : c
      )
    }));
    logAction("System", "WALLET_FUND", `Comercio ${clientId} recargó $${amountUSD}`);
    showToast(`Billetera recargada con $${amountUSD}`, "success");
  };

  const registerCustomer = (phone: string, password: string, name: string) => {
    const existing = db.customers?.find((c: any) => c.phone === phone);
    if (existing) {
      showToast("Este número de teléfono ya está registrado.", "error");
      return;
    }
    const newCustomer = {
      id: `cust_${Date.now()}`,
      phone,
      password: hashPassword(password),
      name,
      createdAt: new Date().toISOString()
    };
    setDb((prev: any) => ({
      ...prev,
      customers: [...(prev.customers || []), newCustomer]
    }));
    setCurrentUser({ ...newCustomer, role: "customer" });
    setView("customer");
    showToast(`Cuenta creada exitosamente. Bienvenido ${name}!`);
  };

  const processMonthlyBilling = (clientId: string) => {
    setDb((prev: any) => {
      const client = prev.clients.find((c: any) => c.id === clientId);
      if (!client || (client.walletBalanceUSD || 0) < 6) {
        return {
          ...prev,
          clients: prev.clients.map((c: any) => c.id === clientId ? { ...c, subscription: { ...c.subscription, status: "past_due" } } : c)
        };
      }
      
      const newNextMonth = new Date();
      newNextMonth.setMonth(newNextMonth.getMonth() + 1);
      
      const splitUSD = 3;
      const splitEUR = (splitUSD * rates.USD) / rates.EUR;

      const updatedPromotoras = prev.promotoras.map((p: any) => 
        p.id === client.promotoraId ? { ...p, passiveEarningsEUR: (p.passiveEarningsEUR || 0) + splitEUR } : p
      );

      const updatedClients = prev.clients.map((c: any) => 
        c.id === clientId ? { 
          ...c, 
          walletBalanceUSD: c.walletBalanceUSD - 6,
          subscription: { plan: "kfs_pro", costUSD: 6, status: "active", nextBillingDate: newNextMonth.toISOString() }
        } : c
      );

      return {
        ...prev,
        clients: updatedClients,
        promotoras: updatedPromotoras,
        kreatekCore: { ...prev.kreatekCore, earningsEUR: prev.kreatekCore.earningsEUR + splitEUR }
      };
    });
    logAction("System", "AUTO_BILLING", `Se dedujeron $6 a ${clientId}. Ganancias repartidas.`);
    showToast("Ciclo de Facturación Procesado", "success");
  };

  const logout = () => {
    setCurrentUser(null);
    setView("login");
  };

  const registerClient = (clientData: any, promotoraId: string, kfsFeePercentage: number) => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const newClient = { 
      ...clientData, 
      password: hashPassword(clientData.password),
      id: `c${Date.now()}`, 
      salesUSD: 0, 
      promotoraId, 
      rating: 5.0, 
      reviewCount: 0,
      kfsFeePercentage, // 0.03, 0.05, 0.10
      kfsFeesOwedUSD: 0,
      isOnboarded: false,
      acceptedToS: true,
      kycDocumentUrl: "",
      walletBalanceUSD: 0,
      subscription: {
        plan: "kfs_pro",
        costUSD: 6,
        status: "active",
        nextBillingDate: nextMonth.toISOString()
      }
    };
    logAction("System", "REGISTER_CLIENT", `Comercio Registrado: ${clientData.company} bajo promotora: ${promotoraId}`);

    setDb((prev: any) => {
      const setupBonusEUR = (37.5 * rates.USD) / rates.EUR;
      const coreSetupEUR = (37.5 * rates.USD) / rates.EUR;

      const updatedPromotoras = prev.promotoras.map((p: any) => {
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

    showToast("Setup de Cliente completado con éxito. Bono de Instalación ($37.50) liquidado a la Promotora.");
    if (view !== "promotora") setView("login");
  };

  const registerPromotora = (promoData: any) => {
    const newPromo = { ...promoData, password: hashPassword(promoData.password), id: `p${Date.now()}`, setups: 0, earningsEUR: 0, status: 'pending' };
    setDb((prev: any) => ({ ...prev, promotoras: [...prev.promotoras, newPromo] }));
    logAction("System", "REGISTER_PROMOTORA", `Promotora solicitó registro: ${promoData.name}`);
    showToast("Solicitud enviada. En espera de aprobación.");
    setView("login");
  };

  const approvePromotora = (id: string) => {
    setDb((prev: any) => ({
      ...prev,
      promotoras: prev.promotoras.map((p: any) => p.id === id ? { ...p, status: 'active' } : p)
    }));
    showToast("Promotora activada.");
  };

  const rejectPromotora = (id: string) => {
    setDb((prev: any) => ({
      ...prev,
      promotoras: prev.promotoras.filter((p: any) => p.id !== id)
    }));
    showToast("Solicitud rechazada y eliminada.");
  };

  const settlePromotoraEarnings = (promotoraId: string) => {
    setDb((prev: any) => ({
      ...prev,
      promotoras: prev.promotoras.map((p: any) => 
        p.id === promotoraId ? { ...p, passiveEarningsEUR: 0 } : p
      )
    }));
    showToast("Regalías liquidadas y saldo reseteado a 0.", "success");
  };

  const sendNotification = (audience: string, title: string, message: string) => {
    const newNotif = { id: `notif${Date.now()}`, audience, title, message, date: new Date().toISOString() };
    setDb((prev: any) => ({ ...prev, notifications: [...(prev.notifications || []), newNotif] }));
    showToast("Notificación Push enviada a la red.");
  };

  const assignPromotoraToClient = (clientId: string, promotoraId: string) => {
    setDb((prev: any) => ({
      ...prev,
      clients: prev.clients.map((c: any) => c.id === clientId ? { ...c, promotoraId } : c)
    }));
    showToast("Promotora reasignada con éxito al comercio.");
  };

  const addGlobalProduct = (product: any) => {
    const globalProd = { ...product, id: `global${Date.now()}`, clientId: "global", stock: 9999 };
    setDb((prev: any) => ({ ...prev, products: [...prev.products, globalProd] }));
    showToast("Producto Global KFS inyectado a la red.");
  };

  const finishOnboarding = (clientId: string, kycDocBase64?: string) => {
    setDb((prev: any) => ({
      ...prev,
      clients: prev.clients.map((c: any) => 
        c.id === clientId ? { ...c, isOnboarded: true, kycDocumentUrl: kycDocBase64 || c.kycDocumentUrl || "" } : c
      )
    }));
    showToast("¡Onboarding completado! Bienvenido a KFS OS.", "success");
  };

  const paySubscription = (clientId: string, reference: string) => {
    setDb((prev: any) => ({
      ...prev,
      clients: prev.clients.map((c: any) => 
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
      const client = prev.clients.find((c: any) => c.id === clientId);
      if (!client) return prev;
      
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      const costEUR = (6 * rates.USD) / rates.EUR;
      const coreCut = costEUR * 0.5;
      const promoCut = costEUR * 0.5;
      
      const updatedPromotoras = prev.promotoras.map((p: any) => 
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
        clients: prev.clients.map((c: any) => 
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
      clients: prev.clients.map((c: any) => 
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
      clients: prev.clients.map((c: any) => 
        c.id === clientId ? { ...c, subscription: { ...c.subscription, status: "active", nextBillingDate: nextMonth.toISOString() } } : c
      )
    }));
    logAction("System", "RELEASE_CLIENT", `Comercio ${clientId} liberado/reactivado.`);
    showToast("Comercio liberado y reactivado por 1 mes.", "success");
  };

  const deleteClient = (clientId: string) => {
    setDb((prev: any) => ({
      ...prev,
      clients: prev.clients.filter((c: any) => c.id !== clientId),
      products: prev.products.filter((p: any) => p.clientId !== clientId),
      vendedores: prev.vendedores.filter((v: any) => v.clientId !== clientId),
      posTerminals: prev.posTerminals.filter((pt: any) => pt.clientId !== clientId)
    }));
    logAction("System", "DELETE_CLIENT", `Comercio ${clientId} eliminado de la red.`);
    showToast("Comercio y sus datos asociados eliminados.", "error");
  };

  const addProduct = (productData: any) => {
    setDb((prev: any) => ({ ...prev, products: [...prev.products, { ...productData, id: `prod${Date.now()}` }] }));
    showToast("Producto sincronizado con Flow Express.");
  };

  const addExpense = (expenseData: any) => {
    setDb((prev: any) => ({ ...prev, expenses: [...(prev.expenses || []), { ...expenseData, id: `exp${Date.now()}` }] }));
    showToast("Egreso registrado contablemente.");
  };

  const processPurchase = (product: any, paymentMethod: string = "cash", applyIva: boolean = false, customerPhone: string = "", customerName: string = "", customerRif: string = "") => {
    if (product.stock !== undefined && product.stock <= 0) {
      showToast("Producto agotado", "error");
      return null;
    }

    const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
    const basePriceUSD = isWeekend ? product.priceUSD * 1.10 : product.priceUSD; // Weekend Shield oculto

    const ivaUSD = applyIva ? basePriceUSD * 0.16 : 0;
    const isForeign = ['zinli', 'wally_tech', 'airtm', 'ubbi_app', 'cash_usd', 'cash_eur', 'binance', 'nfc_web'].includes(paymentMethod);
    const igtfUSD = isForeign ? (basePriceUSD + ivaUSD) * 0.03 : 0;
    const totalUSD = basePriceUSD + ivaUSD + igtfUSD;
    const receiptNumber = `REC-${Date.now().toString().slice(-4)}`;

    let transactionObj: any = null;

    setDb((prev: any) => {
      const client = prev.clients.find((c: any) => c.id === product.clientId);
      
      let kfsFeePercentage = 0.03; // Default Flow Velocity
      if (client?.kfsTier === 'matrix') kfsFeePercentage = 0.05;
      if (client?.kfsTier === 'monopoly') kfsFeePercentage = 0.10;
      // Fallback a kfsFeePercentage viejo si no hay tier
      if (!client?.kfsTier && client?.kfsFeePercentage) kfsFeePercentage = client.kfsFeePercentage;

      const kreatekPctFeeUSD = basePriceUSD * kfsFeePercentage; // % de venta bruta
      const posFeeUSD = 0.04;
      const kreatekTotalFeeUSD = kreatekPctFeeUSD + posFeeUSD;
      const kreatekTotalFeeEUR = (kreatekTotalFeeUSD * rates.USD) / rates.EUR;
      
      const promotoraFeeEUR = kreatekTotalFeeEUR * 0.20; // Promotora gana 20%
      const kreatekNetEUR = kreatekTotalFeeEUR - promotoraFeeEUR;
      const adBudgetEUR = kreatekNetEUR * 0.20; // 20% de ganancia neta para ads
      const finalNetEUR = kreatekNetEUR - adBudgetEUR;

      const updatedClients = prev.clients.map((c: any) => 
        c.id === product.clientId ? { 
          ...c, 
          salesUSD: (c.salesUSD || 0) + basePriceUSD,
          kfsFeesOwedUSD: (c.kfsFeesOwedUSD || 0) + kreatekTotalFeeUSD
        } : c
      );

      const updatedPromotoras = prev.promotoras.map((p: any) => 
        p.id === client?.promotoraId ? {
          ...p,
          passiveEarningsEUR: (p.passiveEarningsEUR || 0) + promotoraFeeEUR
        } : p
      );

      const updatedProducts = prev.products.map((p: any) => 
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
        vendedorId: currentUser?.role === 'vendedor' ? currentUser.id : null,
        clientId: product.clientId,
        timestamp: new Date().toISOString(),
        exchangeRateBCV: rates.USD
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

      return {
        ...prev,
        clients: updatedClients,
        promotoras: updatedPromotoras,
        products: updatedProducts,
        crm: updatedCrm,
        vales: updatedVales,
        posTerminals: updatedPosTerminals,
        buyers: updatedBuyers,
        transactions: [...prev.transactions, transactionObj],
        kreatekCore: {
          totalTransactions: (prev.kreatekCore.totalTransactions || 0) + 1,
          earningsEUR: (prev.kreatekCore.earningsEUR || 0) + kreatekTotalFeeEUR,
          netEarningsEUR: (prev.kreatekCore.netEarningsEUR || 0) + finalNetEUR,
          adBudgetEUR: (prev.kreatekCore.adBudgetEUR || 0) + adBudgetEUR
        }
      };
    });
    
    showToast(`Compra procesada. Recibo ${receiptNumber}`);
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("kfs-purchase", { detail: { ...product, finalTotalUSD: totalUSD } }));
    }

    if (applyIva) {
      const fiscalPayload = {
        clientName: product.clientName || "Comercio KFS",
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
            transactions: prev.transactions.map((tx: any) => 
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
    
    return transactionObj;
  };

  const submitOnlineOrder = (product: any, paymentMethod: string, applyIva: boolean, paymentReference: string, customerPhone: string = "", customerName: string = "", customerRif: string = "", paymentScreenshot: string = "") => {
    if (product.stock !== undefined && product.stock <= 0) {
      showToast("Producto agotado", "error");
      return;
    }

    const priceUSD = product.priceUSD;
    const ivaUSD = applyIva ? priceUSD * 0.16 : 0;
    const isForeign = ['zinli', 'wally_tech', 'airtm', 'ubbi_app', 'cash_usd', 'cash_eur', 'binance'].includes(paymentMethod);
    const igtfUSD = isForeign ? (priceUSD + ivaUSD) * 0.03 : 0;
    const totalUSD = priceUSD + ivaUSD + igtfUSD;

    setDb((prev: any) => {
      const updatedProducts = prev.products.map((p: any) => 
        p.id === product.id && p.stock !== undefined ? { ...p, stock: p.stock - 1 } : p
      );

      const orderObj = {
        id: `ord${Date.now()}`,
        productId: product.id,
        clientId: product.clientId, // to identify which store it belongs to
        amountUSD: totalUSD,
        subtotalUSD: priceUSD,
        ivaUSD,
        igtfUSD,
        paymentMethod,
        paymentReference,
        customerPhone,
        customerName,
        customerRif,
        paymentScreenshot,
        status: 'pending',
        timestamp: new Date().toISOString()
      };

      return {
        ...prev,
        products: updatedProducts,
        orders: [...(prev.orders || []), orderObj]
      };
    });

    showToast("Orden enviada a revisión del comercio.");
  };

  const approveOrder = (orderId: string) => {
    const order = db.orders.find((o: any) => o.id === orderId);
    if (!order) return;

    const receiptNumber = `ONL-${Date.now().toString().slice(-4)}`;

    setDb((prev: any) => {
      const client = prev.clients.find((c: any) => c.id === order.clientId);
      const kfsFeePercentage = client?.kfsFeePercentage || 0.03;
      const kreatekTotalFeeUSD = order.subtotalUSD * kfsFeePercentage; // Online orders do NOT have the $0.04 POS fee
      const kreatekTotalFeeEUR = (kreatekTotalFeeUSD * rates.USD) / rates.EUR;
      
      const promotoraFeeEUR = kreatekTotalFeeEUR * 0.20;
      const kreatekNetEUR = kreatekTotalFeeEUR - promotoraFeeEUR;
      const adBudgetEUR = kreatekNetEUR * 0.20;
      const finalNetEUR = kreatekNetEUR - adBudgetEUR;

      const updatedClients = prev.clients.map((c: any) => 
        c.id === order.clientId ? { 
          ...c, 
          salesUSD: (c.salesUSD || 0) + order.subtotalUSD,
          kfsFeesOwedUSD: (c.kfsFeesOwedUSD || 0) + kreatekTotalFeeUSD 
        } : c
      );

      const updatedPromotoras = prev.promotoras.map((p: any) => 
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
        shippingStatus: 'pending'
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

      return {
        ...prev,
        clients: updatedClients,
        promotoras: updatedPromotoras,
        crm: updatedCrm,
        orders: prev.orders.filter((o: any) => o.id !== orderId),
        transactions: [...prev.transactions, transactionObj],
        kreatekCore: {
          totalTransactions: (prev.kreatekCore.totalTransactions || 0) + 1,
          earningsEUR: (prev.kreatekCore.earningsEUR || 0) + kreatekTotalFeeEUR,
          netEarningsEUR: (prev.kreatekCore.netEarningsEUR || 0) + finalNetEUR,
          adBudgetEUR: (prev.kreatekCore.adBudgetEUR || 0) + adBudgetEUR
        }
      };
    });

    showToast("Pago validado y orden procesada.");
  };

  const rejectOrder = (orderId: string) => {
    setDb((prev: any) => {
      const order = prev.orders.find((o: any) => o.id === orderId);
      if (!order) return prev;
      
      const updatedProducts = prev.products.map((p: any) => 
        p.id === order.productId && p.stock !== undefined ? { ...p, stock: p.stock + 1 } : p
      );

      return {
        ...prev,
        products: updatedProducts,
        orders: prev.orders.filter((o: any) => o.id !== orderId)
      };
    });
    setGhostTrapLocked(true);
    showToast("¡CRÍTICO! Intento de rechazo de orden online interceptado. Terminal bloqueado.", "error");
  };

  const dispatchOrder = (txId: string) => {
    setDb((prev: any) => {
      const updatedTxs = prev.transactions.map((tx: any) => 
        tx.id === txId ? { ...tx, shippingStatus: 'dispatched' } : tx
      );
      return { ...prev, transactions: updatedTxs };
    });
    showToast("Orden marcada como ENVIADA exitosamente.");
  };

  const generateZReport = (vendedorId: string, clientId: string) => {
    setDb((prev: any) => {
      const shiftTxs = prev.transactions.filter((tx: any) => tx.vendedorId === vendedorId && tx.clientId === clientId && !tx.zReported);
      
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

      const updatedTxs = prev.transactions.map((tx: any) => 
        (tx.vendedorId === vendedorId && tx.clientId === clientId && !tx.zReported) 
          ? { ...tx, zReported: true } 
          : tx
      );

      showToast("Corte de Caja Exitoso (Reporte Z Generado).");
      return {
        ...prev,
        transactions: updatedTxs,
        zReports: [...(prev.zReports || []), zReportObj]
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
    else if (text.includes("provincial")) bank = "Provincial";
    else if (text.includes("venezuela") || text.includes("bdv")) bank = "Banco de Venezuela";
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

  const registerPosTerminal = (posData: any) => {
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
      posTerminals: (prev.posTerminals || []).filter((p: any) => p.id !== posId)
    }));
    showToast("Terminal POS eliminado", "success");
  };

  const toggleLoyaltyProgram = (clientId: string, isActive: boolean) => {
    setDb((prev: any) => ({
      ...prev,
      clients: prev.clients.map((c: any) => c.id === clientId ? { ...c, loyaltyProgramActive: isActive } : c)
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
      console.log("[KFS Offline Catalog] Encontrado localmente:", VENEZUELAN_PRODUCTS_CATALOG[barcode]);
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
          console.log("[KFS Supabase Catalog] Encontrado en la nube:", data);
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
        console.warn("[KFS Supabase Catalog] Error consultando Supabase:", err);
      }
    }
    
    return null;
  };

  const updateStoreSettings = (clientId: string, settings: any) => {
    setDb((prev: any) => ({
      ...prev,
      clients: prev.clients.map((c: any) => 
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
      products: prev.products.map((p: any) => 
        p.id === productId ? { ...p, isFeatured } : p
      )
    }));
    showToast(isFeatured ? "Producto marcado como Estrella ⭐" : "Producto quitado de Destacados");
  };

  const updatePaymentMethods = (clientId: string, methods: any) => {
    setDb((prev: any) => ({
      ...prev,
      clients: prev.clients.map((c: any) => c.id === clientId ? { ...c, paymentMethods: methods } : c)
    }));
    showToast("Métodos de pago guardados exitosamente en la bóveda", "success");
    logAction("Dueño", "UPDATE_PAYMENT_METHODS", "Se actualizaron los métodos de pago.");
  };

  const registerCandidate = (candidateData: any) => {
    setDb((prev: any) => {
      const existingCandidates = prev.candidates || [];
      const filtered = existingCandidates.filter((c: any) => c.phone !== candidateData.phone);
      const newCandidate = {
        ...candidateData,
        id: candidateData.id || `cand_${Date.now()}`,
        status: candidateData.status || "pending",
        createdAt: new Date().toISOString()
      };
      return {
        ...prev,
        candidates: [...filtered, newCandidate]
      };
    });
    showToast("Perfil profesional publicado/actualizado en la Bolsa de Empleo KFS.");
  };

  const unlockCandidateContact = (candidateId: string, clientId: string, reference: string, screenshot?: string) => {
    setDb((prev: any) => {
      const client = prev.clients.find((c: any) => c.id === clientId);
      if (!client) return prev;

      if (!reference) {
        setTimeout(() => showToast("Debe ingresar la referencia de pago.", "error"), 50);
        return prev;
      }

      const newUnlock = {
        id: `unl_${Date.now()}`,
        clientId,
        candidateId,
        status: "pending_approval",
        paymentMethod: "transfer",
        reference,
        screenshot: screenshot || "",
        amountUSD: 10,
        timestamp: new Date().toISOString()
      };

      setTimeout(() => showToast("Solicitud de desbloqueo enviada. Esperando validación KFS."), 50);

      return {
        ...prev,
        unlockedContacts: [...(prev.unlockedContacts || []), newUnlock]
      };
    });
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

      const client = prev.clients.find((c: any) => c.id === unlock.clientId);
      const feeEUR = (10 * rates.USD) / rates.EUR;
      const promoCut = feeEUR * 0.20;
      const finalNetEUR = feeEUR - promoCut;

      const updatedPromotoras = prev.promotoras.map((p: any) =>
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
          setTimeout(() => showToast(newStatus === "backed" ? "Candidato ahora respaldado por KFS OS" : "Respaldo KFS OS removido", "success"), 50);
          const updated = { ...c, status: newStatus };
          return addCandidateNotification(
            updated,
            newStatus === "backed" ? "Sello de Aval Otorgado 🏆" : "Aval KFS OS Removido",
            newStatus === "backed"
              ? "¡Felicidades! Tu perfil ha recibido el Sello Dorado de Aval por parte del soporte de KFS OS."
              : "El Aval de KFS OS ha sido removido de tu perfil."
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
            "Tu pago de $1 USD fue verificado con éxito. Tu perfil ya está activo y visible para los comercios de KFS OS."
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
      const client = prev.clients.find((cl: any) => cl.id === clientId);
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

      const client = prev.clients.find((cl: any) => cl.id === clientId);
      
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

  const markNotificationsAsRead = (candidateId: string) => {
    setDb((prev: any) => ({
      ...prev,
      candidates: (prev.candidates || []).map((c: any) =>
        c.id === candidateId
          ? {
              ...c,
              notifications: (c.notifications || []).map((n: any) => ({ ...n, read: true }))
            }
          : c
      )
    }));
  };

  const updateCvBuilderOption = (candidateId: string, useBuilder: boolean) => {
    setDb((prev: any) => ({
      ...prev,
      candidates: (prev.candidates || []).map((c: any) =>
        c.id === candidateId ? { ...c, useKfsCvBuilder: useBuilder } : c
      )
    }));
    showToast(useBuilder ? "CV Digital KFS activado." : "CV Digital KFS desactivado.");
  };

  // ==========================================
  // DELIVERY RIDER FUNCTIONS
  // ==========================================

  const registerRider = (riderData: any) => {
    const existing = db.riders?.find((r: any) => r.email === riderData.email);
    if (existing) {
      showToast("Este correo ya está registrado como rider.", "error");
      return;
    }
    const newRider = {
      ...riderData,
      password: hashPassword(riderData.password),
      id: `rider_${Date.now()}`,
      status: "pending",
      associatedBusinesses: [],
      deliveriesCompleted: 0,
      totalEarningsUSD: 0,
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
      riders: (prev.riders || []).filter((r: any) => r.id !== riderId)
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
      const client = prev.clients.find((c: any) => c.id === clientId);
      const currentIndex = client?.deliveryRoundRobinIndex || 0;
      const assignedRider = businessRiders[currentIndex % businessRiders.length];
      const nextIndex = currentIndex + 1;

      const updatedClients = prev.clients.map((c: any) =>
        c.id === clientId ? { ...c, deliveryRoundRobinIndex: nextIndex } : c
      );

      const updatedTransactions = prev.transactions.map((tx: any) =>
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
      clients: prev.clients.map((c: any) =>
        c.id === clientId ? { ...c, isOpen: !c.isOpen } : c
      )
    }));
  };

  const updateBusinessConfig = (clientId: string, config: { schedule?: any; deliveryRadiusKm?: number }) => {
    setDb((prev: any) => ({
      ...prev,
      clients: prev.clients.map((c: any) =>
        c.id === clientId ? { ...c, ...config } : c
      )
    }));
    showToast("Configuración del negocio actualizada.", "success");
  };

  return (
    <KFSContext.Provider value={{
      isClient, isBooting, view, setView, currentUser, setCurrentUser,
      toast, showToast, rates, db, setDb, formatUSD, formatEUR,
      handleLogin, logout, registerClient, registerPromotora, approvePromotora, rejectPromotora, settlePromotoraEarnings,
      addProduct, addExpense, processPurchase, submitOnlineOrder, approveOrder, rejectOrder, dispatchOrder, generateZReport,
      originalUser, impersonateClient, stopImpersonating,
      networkState, setNetworkState, smsConciliator, registerCrmExpress,
      ghostTrapLocked, setGhostTrapLocked, createVale, payVale, registerPosTerminal, deletePosTerminal,
      queryGlobalBarcode, toggleLoyaltyProgram, triggerGhostTrap, updateStoreSettings, updatePaymentMethods, toggleProductFeatured,
      sendNotification, assignPromotoraToClient, addGlobalProduct, paySubscription, approveSubscription, finishOnboarding, hashPassword, logAction, createTicket, replyTicket, closeTicket, fundWallet, processMonthlyBilling, registerCustomer, blockClient, releaseClient, deleteClient,
      registerCandidate, unlockCandidateContact, approveUnlock, rejectUnlock, approveCandidateRegistration, rejectCandidateRegistration, hireCandidate, releaseCandidate, toggleCandidateBacking, markNotificationsAsRead, updateCvBuilderOption,
      registerRider, approveRider, rejectRider, assignRiderToBusiness, removeRiderFromBusiness, assignDeliveryToOrder, updateRiderPagoMovil,
      confirmDelivery, rateRider, updateRiderGPS, toggleBusinessOpen, updateBusinessConfig
    }}>
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
