"use client";

import { KFS_BRAND } from "../config/brandConfig";
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { supabase, isSupabaseConfigured, uploadAsset } from "./supabase";
import { playScannerBeep, speakText, getStoreCoords, getCustomerCoords, playSyncChime } from "../lib/utils";
import { getIndexedDBValue, setIndexedDBValue } from "../lib/indexedDB";
import { syncToRelational } from "../lib/supabaseSync";

const VENEZUELAN_PRODUCTS_CATALOG: Record<string, { name: string; imgUrl: string; category: string; brand: string }> = {
  "7591006000016": { name: "Harina PAN Blanca (1kg)", imgUrl: "", category: "Alimentos", brand: "Alimentos Polar" },
  "7591005000574": { name: "Margarina Mavesa Común (500g)", imgUrl: "", category: "Alimentos", brand: "Alimentos Polar" },
  "7591005001151": { name: "Mayonesa Mavesa Tradicional (445g)", imgUrl: "", category: "Alimentos", brand: "Alimentos Polar" },
  "7591001000219": { name: "Malta Polar Botella (250ml)", imgUrl: "", category: "Bebidas", brand: "Cervecería Polar" },
  "7591001000110": { name: "Cerveza Polar Pilsen (Tercio 295ml)", imgUrl: "", category: "Bebidas", brand: "Cervecería Polar" },
  "7591395000147": { name: "Pirulin Original (Lata 190g)", imgUrl: "", category: "Dulces", brand: "Nucita Venezolana" },
  "7591016205722": { name: "Galleta Savoy Cocosette (50g)", imgUrl: "", category: "Dulces", brand: "Nestlé Savoy" },
  "7591016205708": { name: "Galleta Savoy Susy (50g)", imgUrl: "", category: "Dulces", brand: "Nestlé Savoy" },
  "7591016035251": { name: "Chocolate Savoy de Leche (130g)", imgUrl: "", category: "Dulces", brand: "Nestlé Savoy" },
  "7591016035404": { name: "Bombón Savoy Toronto (Bolsa 36u)", imgUrl: "", category: "Dulces", brand: "Nestlé Savoy" },
  "7591005001229": { name: "Queso Fundido Rikesa Cheddar (300g)", imgUrl: "", category: "Alimentos", brand: "Alimentos Polar" },
  "7591041000675": { name: "Queso Fundido Cheez Whiz (300g)", imgUrl: "", category: "Alimentos", brand: "Kraft" },
  "7591005002042": { name: "Toddy Chocolate en Polvo (400g)", imgUrl: "", category: "Bebidas", brand: "Alimentos Polar" },
  "7591018000547": { name: "Salsa de Tomate Pampero (397g)", imgUrl: "", category: "Alimentos", brand: "Pampero" },
  "7591642000678": { name: "Arroz Mary Dorado Extra (1kg)", imgUrl: "", category: "Alimentos", brand: "Alimentos Mary" },
  "7591024001019": { name: "Café Molido Fama de América (250g)", imgUrl: "", category: "Alimentos", brand: "Fama de América" },
  "7591006001044": { name: "Pasta Primor Spaghetti (1kg)", imgUrl: "", category: "Alimentos", brand: "Alimentos Polar" },
  "7591060000120": { name: "Diablitos Underwood Jamón (115g)", imgUrl: "", category: "Alimentos", brand: "Diablitos Underwood" },
  "7591021000107": { name: "Atún Margarita en Aceite (140g)", imgUrl: "", category: "Alimentos", brand: "Alimentos Polar" },
  "759104101405": { name: "Salsa Inglesa Kraft (150ml)", imgUrl: "", category: "Alimentos", brand: "Kraft" },
  "7591005000758": { name: "Vinagre Blanco Mavesa (1L)", imgUrl: "", category: "Alimentos", brand: "Alimentos Polar" },
  "7591005002905": { name: "Detergente Polvo Las Llaves (1kg)", imgUrl: "", category: "Limpieza", brand: "Alimentos Polar" },
  "7591005001601": { name: "Jabón Azul Las Llaves Bebé (250g)", imgUrl: "", category: "Limpieza", brand: "Alimentos Polar" },
  "7591142100014": { name: "Harina de Trigo Robin Hood (1kg)", imgUrl: "", category: "Alimentos", brand: "Monaca" },
  "7591736000454": { name: "Suavizante Ensueño Floral (1L)", imgUrl: "", category: "Limpieza", brand: "Corimon" }
};

const MOCK_BCV_RATES = {
  USD: 36.45,
  EUR: 39.20,
  isWeekend: false
};

const CURRENT_WIPE_VERSION = 6;

const initialDB = {
  promotoras: [] as any[],
  clients: [
    {
      id: "kfs-express",
      company: "Arquitecto Flow Express",
      email: "arquitecto@kfs.com",
      password: "000",
      address: "Soporte Central {KFS_BRAND.productAcronym}",
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
        bioText: "En esta tienda podrás canjear tus KF Points. Mira todo lo que tenemos para ti",
        themeColor: "#C5A184",
        typography: "font-sans",
        layoutType: "grid",
        profilePicUrl: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png"
      }
    }
  ] as any[],
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
    adBudgetEUR: 0,
    wipeVersion: CURRENT_WIPE_VERSION
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
  updateUserAvatar: (userId: string, role: string, avatarBase64: string) => Promise<void>;
  toast: { show: boolean; message: string; type: string };
  showToast: (message: string, type?: "success" | "error") => void;
  rates: typeof MOCK_BCV_RATES;
  updateBcvRates: (usd: number, eur: number) => void;
  db: typeof initialDB;
  setDb: React.Dispatch<React.SetStateAction<typeof initialDB>>;
  formatUSD: (val: number) => string;
  formatEUR: (val: number) => string;
  handleLogin: (role: string, password: string, email?: string | null) => void;
  logout: () => void;
  registerClient: (clientData: any, promotoraId: string, kfsFeePercentage: number) => void;
  registerFreeUser: (clientData: any, promotoraId: string) => Promise<any>;
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
    // Handle deletions: if item is remote but not local, and current user has authority, remove it
    if (checkAuthority) {
      (remoteArr || []).forEach(i => {
        const key = i.id || i.barcode || JSON.stringify(i);
        if (!localKeys.has(key) && checkAuthority(i)) {
          map.delete(key);
        }
      });
    }
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
    // Handle client deletions
    (remoteClients || []).forEach(c => {
      if (!localKeys.has(c.id)) {
        const isAuthority = currentUser && (
          currentUser.role === "core" ||
          (currentUser.role === "dueño" && c.id === currentUser.id) ||
          (currentUser.role === "vendedor" && c.id === currentUser.clientId) ||
          (currentUser.role === "promotora" && c.promotoraId === currentUser.id)
        );
        if (isAuthority) {
          map.delete(c.id);
        }
      }
    });
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
    // Handle product deletions
    (remoteProducts || []).forEach(p => {
      if (!localKeys.has(p.id)) {
        const isAuthority = currentUser && (
          currentUser.role === "core" ||
          (currentUser.role === "dueño" && p.clientId === currentUser.id) ||
          (currentUser.role === "vendedor" && p.clientId === currentUser.clientId)
        );
        if (isAuthority) {
          map.delete(p.id);
        }
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
    deletedKeys: Array.from(deletedKeys)
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
  const [view, setViewInternal] = useState("landing"); 
  
  const setView = (newView: string) => {
    setViewInternal(newView);
    if (typeof window !== "undefined" && window.history) {
      window.history.pushState({ view: newView }, "", `#${newView}`);
    }
  };

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
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [rates, setRates] = useState(MOCK_BCV_RATES);
  const updateBcvRates = (usd: number, eur: number) => {
    setRates({ USD: usd, EUR: eur, isWeekend: rates.isWeekend });
    showToast("Tasa BCV global actualizada con éxito.", "success");
  };
  const [db, setDb] = useState<any>(initialDB);
  const [networkState, setNetworkState] = useState<"online" | "mesh" | "offline">("online");
  const [ghostTrapLocked, setGhostTrapLocked] = useState(false);
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
          console.error("[{KFS_BRAND.productAcronym} Context] Error parsing saved user session:", e);
        }
      }
      hasRestoredRef.current = true;
      
      getIndexedDBValue("kfs_os_db_prod")
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
                console.log("[{KFS_BRAND.productAcronym} Migration] Local database successfully migrated to IndexedDB.");
              } catch (e) {
                console.error("[{KFS_BRAND.productAcronym} Migration] Failed to parse LocalStorage fallback", e);
              }
            }
          }

          if (parsed) {
            parsed = cleanupOldDemos(parsed);
            if (parsed.kreatekCore?.wipeVersion !== CURRENT_WIPE_VERSION) {
              console.log("[{KFS_BRAND.productAcronym}] Database version mismatch. Resetting database to 0.");
              setDb(initialDB);
              setIndexedDBValue("kfs_os_db_prod", initialDB);
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

          // Next, run Supabase initial sync if online & configured
          if (isSupabaseConfigured && navigator.onLine) {
            const syncId = "kfs-general-db-prod";
            
            supabase
              .from("kfs_store_states")
              .select("db_state, updated_at")
              .eq( "id", syncId)
              .single()
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
                      console.log("[Supabase Cloud] Versión de BD antigua detectada. Forzando reinicio local y en la nube.");
                      localStorage.setItem("kfs_os_db_prod", JSON.stringify(initialDB));
                      setCurrentUser(null);
                      setOriginalUser(null);
                      if (currentUserRef.current) setView("landing");
                      return initialDB;
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
                  const channel = supabase.channel('public:kfs_store_states');
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
                            console.log("[Supabase Realtime] Versión de BD antigua recibida. Forzando reinicio.");
                            localStorage.setItem("kfs_os_db_prod", JSON.stringify(initialDB));
                            setCurrentUser(null);
                            setOriginalUser(null);
                            if (currentUserRef.current) setView("landing");
                            return initialDB;
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
                  setInterval(() => {
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
                                console.log("[Supabase Polling Fallback] Versión de BD antigua detectada. Forzando reinicio.");
                                localStorage.setItem("kfs_os_db_prod", JSON.stringify(initialDB));
                                setCurrentUser(null);
                                setOriginalUser(null);
                                if (currentUserRef.current) setView("landing");
                                return initialDB;
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
                console.log("[{KFS_BRAND.productAcronym} SW] Nuevo Service Worker instalado. Recargando...");
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

          // 1. K-Point Bonus Expiry (7 days irreversible)
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
              console.log(`[WEBHOOK WHATSAPP SENT to ${newC.phone}]: {KFS_BRAND.productAcronym}: Tu balance inactivo de {KFS_BRAND.economy.currency} ha sufrido un AOF del 0.5% (${penalty.toFixed(2)} pts). Utilízalos pronto.`);
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
    };
  }, []);


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
        console.warn("[{KFS_BRAND.productAcronym} IndexedDB] Error al persistir base de datos offline", err);
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
                console.warn("[{KFS_BRAND.productAcronym} Cloud] Aviso: Sincronización asíncrona omitida. Verifique que haya ejecutado 'supabase_setup.sql' en su proyecto.", error.message || error.code || "");
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
                  console.warn("[{KFS_BRAND.productAcronym} Cloud] Aviso: Sincronización asíncrona omitida. Verifique que haya ejecutado 'supabase_setup.sql' en su proyecto.", error.message || error.code || "");
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

  const showToast = (message: string, type: "success" | "error" | "warning" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
    
    // Native Push Notification Support
    if ("Notification" in window && Notification.permission === "granted" && type === "success") {
      try {
        new Notification("{KFS_BRAND.productAcronym} OS", { body: message, icon: "/kfs-logo.png" });
      } catch (e) {
        console.warn("Native notification failed", e);
      }
    }
  };

  const formatUSD = (val: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);
  const formatEUR = (val: number) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(val);

  const handleLogin = async (role: string, password: string, email: string | null = null) => {
    if (role === "marketplace") {
      setView("marketplace");
      return;
    }

    const safePass = password ? password.trim() : "";
    const safeEmail = email ? email.trim() : "";

    // Auth Real con Supabase
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: safeEmail,
        password: safePass,
      });

      if (error) {
        // Fallback local for Core Architect only if Auth is not fully set up
        const corePass = process.env.NEXT_PUBLIC_CORE_PASSWORD || "199521.";
        if (role === "core" && safePass === corePass) {
          setCurrentUser({ role: "core", name: "El Arquitecto", avatar: db.kreatekCore?.avatar || "" });
          setView("core");
          showToast("{KFS_BRAND.productAcronym} OS Accesado. Bienvenido, Arquitecto.");
          return;
        }
        
        // Fallback a base de datos local JSON (Transición)
        let foundUser = null;
        const hashedPass = hashPassword(safePass);
        if (role === "promotora") foundUser = db.promotoras.find((p: any) => p.email === safeEmail && (p.password === safePass || p.password === hashedPass));
        if (role === "dueño") foundUser = db.clients.find((c: any) => c.email === safeEmail && (c.password === safePass || c.password === hashedPass));
        if (role === "vendedor") foundUser = db.vendedores.find((v: any) => v.email === safeEmail && (v.password === safePass || v.password === hashedPass));
        if (role === "rider") foundUser = db.riders?.find((r: any) => r.email === safeEmail && (r.password === safePass || r.password === hashedPass));
        if (role === "customer") foundUser = db.customers?.find((c: any) => c.phone === safeEmail && (c.password === safePass || c.password === hashedPass));

        if (foundUser) {
          setCurrentUser({ ...foundUser, role });
          setView(role === "dueño" ? "client" : role);
          showToast(`Sesión local iniciada: ${foundUser.name || foundUser.company}`);
          
          // Solicitar permisos Push al login exitoso
          if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
          }
        } else {
          showToast("Credenciales inválidas o Auth no configurado.", "error");
        }
        return;
      }

      // Si Supabase Auth fue exitoso, buscar el perfil en nuestra BD JSON local usando el email
      let userProfile = null;
      if (role === "promotora") userProfile = db.promotoras.find((p: any) => p.email === safeEmail);
      if (role === "dueño") userProfile = db.clients.find((c: any) => c.email === safeEmail);
      if (role === "vendedor") userProfile = db.vendedores.find((v: any) => v.email === safeEmail);
      if (role === "rider") userProfile = db.riders?.find((r: any) => r.email === safeEmail);
      
      if (userProfile) {
        setCurrentUser({ ...userProfile, role });
        setView(role === "dueño" ? "client" : role);
        showToast(`Sesión segura iniciada: ${userProfile.name || userProfile.company}`);
        
        // Solicitar permisos Push
        if ("Notification" in window && Notification.permission !== "granted") {
          Notification.requestPermission();
        }
      } else {
        showToast("Usuario autenticado pero perfil no encontrado en {KFS_BRAND.productAcronym} OS.", "error");
      }
    } catch (err) {
      showToast("Error de conexión al autenticar.", "error");
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
    logAction("Arquitecto", "EMIT_KFS_POINTS", `Emisión/Transferencia de ${amount} {KFS_BRAND.economy.currency} a ${userId} en ${collectionName}`);
    showToast(`Se han transferido ${amount} {KFS_BRAND.economy.currency} exitosamente.`, "success");
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
          prev.clients = prev.clients.map((c: any) => 
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

          prev.customers = prev.customers.map((c: any) => {
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

              return {
                ...c,
                real_balance: (c.real_balance || 0) + topup.amountUSD,
                k_points_balance: (c.k_points_balance || 0) + bonusKP,
                k_points_expiry: bonusKP > 0 ? expiryDateStr : c.k_points_expiry
              };
            }
            return c;
          });
        }
        setTimeout(() => showToast(`Recarga aprobada. +$${topup.amountUSD}`, "success"), 100);
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
        showToast(`Convertiste $${amount} a ${netAmount} K$ (Cash) con 1% fee.`, "success");
      } else if (fromType === 'k_point_cash_balance') {
        const currentCash = customer.k_point_cash_balance || 0;
        if (currentCash < amount) {
          showToast("K-Point Cash insuficiente.", "error");
          return prev;
        }
        const netAmount = amount * 0.99; // 1% fee
        const kPointsMinted = netAmount * 1000;
        customer.k_point_cash_balance = currentCash - amount;
        customer.k_points_balance = (customer.k_points_balance || 0) + kPointsMinted;
        showToast(`Convertiste ${amount} K$ a ${kPointsMinted} KP con 1% fee.`, "success");
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

  const registerCustomer = async (phone: string, password: string, name: string, referralCode?: string, kycPhoto?: string, kycCedula?: string, kycAddress?: string) => {
    const existing = db.customers?.find((c: any) => c.phone === phone);
    if (existing) {
      showToast("Este número de teléfono ya está registrado.", "error");
      return;
    }

    try {
      const pseudoEmail = `${phone}@kfs-user.com`;
      const { error } = await supabase.auth.signUp({
        email: pseudoEmail,
        password: password,
        options: { data: { full_name: name, role: "customer", phone } }
      });
      if (error) {
        showToast("Aviso Supabase: " + error.message + " (Guardando en modo Offline)", "error");
      }
    } catch (e: any) {
      showToast("Supabase no configurado o sin conexión: " + e.message, "error");
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

    const newCustomer = {
      id: `cust_${Date.now()}`,
      phone,
      password: hashPassword(password),
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

  const requestPayout = async (amountUSD: number, bankDetails: string) => {
    if (!currentUser || (currentUser.role !== 'dueño' && currentUser.role !== 'promotora')) {
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
      password: hashPassword(clientData.password),
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

    showToast("Comercio Freemium registrado con éxito. Bono de 2000 KP otorgado (Bloqueado).", "success");
    if (view !== "promotora") setView("login");
    return newClient;
  };

  const upgradeToPremium = async (clientId: string, promotoraId: string) => {
    logAction("System", "PREMIUM_UPGRADE", `Usuario ${clientId} ascendido a Premium por Promotora ${promotoraId}`);

    setDb((prev: any) => {
      const updatedClients = prev.clients.map((c: any) => {
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

      const updatedPromotoras = prev.promotoras.map((p: any) => {
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
    const avatarUrl = clientData.avatar && clientData.avatar.startsWith("data:")
      ? await uploadAsset(`avatars/client_${Date.now()}.png`, clientData.avatar)
      : clientData.avatar;

    const kycUrl = clientData.kycCedula && clientData.kycCedula.startsWith("data:")
      ? await uploadAsset(`kyc/client_cedula_${Date.now()}.png`, clientData.kycCedula)
      : clientData.kycCedula;

    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    // Supabase Auth Integration
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
      if (authError) {
        showToast("Error en registro Supabase (Nube): " + authError.message, "error");
      }
    } catch (e: any) {
      showToast("Supabase no configurado o sin conexión: " + e.message, "error");
    }

    const newClient = { 
      ...clientData, 
      avatar: avatarUrl,
      password: hashPassword(clientData.password),
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
      subscription: {
        plan: "kfs_pro",
        costUSD: 6,
        status: "active",
        nextBillingDate: nextMonth.toISOString()
      }
    };
    logAction("System", "REGISTER_CLIENT", `Comercio Registrado: ${clientData.company} bajo promotora: ${promotoraId}`);

    setDb((prev: any) => {
      const setupBonusEUR = (32.50 * rates.USD) / rates.EUR;
      const coreSetupEUR = (32.50 * rates.USD) / rates.EUR;

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

  const registerPromotora = async (promoData: any) => {
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
      password: hashPassword(promoData.password), 
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
      promotoras: prev.promotoras.filter((p: any) => p.id !== id),
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
      promotoras: prev.promotoras.map((p: any) => 
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

  const sendNotification = (audience: string, title: string, message: string) => {
    const newNotif = { id: `notif${Date.now()}`, audience, title, message, date: new Date().toISOString() };
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
              vibrate: [200, 100, 200, 100, 200]
            } as any);
          }).catch(() => {
            // Fallback a Notification API estándar (Desktop)
            new Notification(title, { body: message, icon: "/icons/icon-192x192.png" });
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
      clients: prev.clients.map((c: any) => c.id === clientId ? { ...c, promotoraId } : c)
    }));
    showToast("Promotora reasignada con éxito al comercio.");
  };

  const addGlobalProduct = (product: any) => {
    const globalProd = { ...product, id: `global${Date.now()}`, clientId: "global", stock: 9999 };
    setDb((prev: any) => ({ ...prev, products: [...prev.products, globalProd] }));
    showToast("Producto Global {KFS_BRAND.productAcronym} inyectado a la red.");
  };

  const finishOnboarding = async (clientId: string, kycDocBase64?: string) => {
    const kycUrl = kycDocBase64 && kycDocBase64.startsWith("data:")
      ? await uploadAsset(`kyc/${clientId}_${Date.now()}.png`, kycDocBase64)
      : kycDocBase64;

    setDb((prev: any) => ({
      ...prev,
      clients: prev.clients.map((c: any) => 
        c.id === clientId ? { ...c, isOnboarded: true, kycDocumentUrl: kycUrl || c.kycDocumentUrl || "" } : c
      )
    }));
    showToast("¡Onboarding completado! Bienvenido a {KFS_BRAND.productAcronym} OS.", "success");
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
      riders: Array.isArray(prev.riders) ? prev.riders.filter((r: any) => r.id !== riderId) : [],
    }));
    logAction("System", "DELETE_RIDER", `Motorizado ${riderId} eliminado.`);
    showToast("Motorizado eliminado del sistema.", "error");
  };


  const addProduct = (productData: any) => {
    setDb((prev: any) => ({ ...prev, products: [...prev.products, { ...productData, id: `prod${Date.now()}` }] }));
    showToast("Producto sincronizado con Flow Express.");
  };

  const addExpense = (expenseData: any) => {
    setDb((prev: any) => ({ ...prev, expenses: [...(prev.expenses || []), { ...expenseData, id: `exp${Date.now()}` }] }));
    showToast("Egreso registrado contablemente.");
  };

  const processPurchase = (product: any, paymentMethod: string = "cash", applyIva: boolean = false, customerPhone: string = "", customerName: string = "", customerRif: string = "", kPointsToBurn: number = 0) => {
    if (product.stock !== undefined && product.stock <= 0) {
      showToast("Producto agotado", "error");
      return null;
    }

    const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
    const basePriceUSD = isWeekend ? product.priceUSD * 1.10 : product.priceUSD; // Weekend Shield oculto

    const FEE = 0.04;
    const subtotal = basePriceUSD;
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
            showToast("Puntos {KFS_BRAND.economy.currency} insuficientes y Auto-Fill fallido.", "error");
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
      const client = prev.clients.find((c: any) => c.id === product.clientId);
      
      let kfsFeePercentage = 0.03; // Default Flow Velocity
      if (client?.is_founder) {
        kfsFeePercentage = 0.01;
      } else if (client?.onboardedUsers >= 50) {
        kfsFeePercentage = 0.03; // Peaje Gamificado permanente por traer 50 usuarios
      } else if (customerPhone) {
        const customer = prev.customers?.find((c: any) => c.phone === customerPhone);
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
        const customer = prev.customers?.find((c: any) => c.phone === customerPhone);
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
        const customerObj = prev.customers?.find((c: any) => c.phone === customerPhone);
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

      const updatedClients = prev.clients.map((c: any) => 
        c.id === product.clientId ? { 
          ...c, 
          salesUSD: (c.salesUSD || 0) + (paymentMethod === "hybrid" ? realNeeded : basePriceUSD),
          kfsFeesOwedUSD: (c.kfsFeesOwedUSD || 0) + kreatekTotalFeeUSD
        } : c
      );

      const updatedPromotoras = prev.promotoras.map((p: any) => {
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
        cashback_awarded: cashbackKP,
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
    speakText("Venta aprobada.");
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("kfs-purchase", { detail: { ...product, finalTotalUSD: totalUSD } }));
    }

    if (applyIva) {
      const fiscalPayload = {
        clientName: product.clientName || "Comercio {KFS_BRAND.productAcronym}",
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

  const submitOnlineOrder = async (product: any, paymentMethod: string, applyIva: boolean, paymentReference: string, customerPhone: string = "", customerName: string = "", customerRif: string = "", paymentScreenshot: string = "", kPointsToBurn: number = 0) => {
    if (product.stock !== undefined && product.stock <= 0) {
      showToast("Producto agotado", "error");
      return;
    }

    const screenshotUrl = paymentScreenshot && paymentScreenshot.startsWith("data:")
      ? await uploadAsset(`screenshots/order_${Date.now()}.png`, paymentScreenshot)
      : paymentScreenshot;

    const priceUSD = product.priceUSD;
    const ivaUSD = applyIva ? priceUSD * 0.16 : 0;
    const isForeign = ['zinli', 'wally_tech', 'airtm', 'ubbi_app', 'cash_usd', 'cash_eur', 'binance'].includes(paymentMethod);
    const igtfUSD = isForeign ? (priceUSD + ivaUSD) * 0.03 : 0;
    
    const discountUSD = kPointsToBurn * 0.001;
    const totalUSD = Math.max(0, priceUSD + ivaUSD + igtfUSD - discountUSD);

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
        paymentScreenshot: screenshotUrl,
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

  const approveOrder = (orderId: string, silent: boolean = false) => {
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
      
      const updatedProducts = prev.products.map((p: any) => 
        p.id === order.productId && p.stock !== undefined ? { ...p, stock: p.stock + 1 } : p
      );

      return {
        ...prev,
        products: updatedProducts,
        orders: prev.orders.filter((o: any) => o.id !== orderId),
        kreatekCore: {
          ...prev.kreatekCore,
          deletedKeys: [...(prev.kreatekCore?.deletedKeys || []), orderId]
        }
      };
    });
    showToast("Orden rechazada y el inventario fue restablecido.", "success");
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
      console.log("[{KFS_BRAND.productAcronym} Offline Catalog] Encontrado localmente:", VENEZUELAN_PRODUCTS_CATALOG[barcode]);
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
          console.log("[{KFS_BRAND.productAcronym} Supabase Catalog] Encontrado en la nube:", data);
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
        console.warn("[{KFS_BRAND.productAcronym} Supabase Catalog] Error consultando Supabase:", err);
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

  const registerCandidate = async (candidateData: any, customerId: string) => {
    const cvUrl = candidateData.cvFile && candidateData.cvFile.startsWith("data:")
      ? await uploadAsset(`cvs/${candidateData.phone || "anon"}_cv.pdf`, candidateData.cvFile)
      : candidateData.cvFile;

    const screenshotUrl = candidateData.registrationPaymentScreenshot && candidateData.registrationPaymentScreenshot.startsWith("data:")
      ? await uploadAsset(`screenshots/${candidateData.phone || "anon"}_payment.png`, candidateData.registrationPaymentScreenshot)
      : candidateData.registrationPaymentScreenshot;

    let deductionSuccessful = false;

    setDb((prev: any) => {
      const existingCandidates = prev.candidates || [];
      const filtered = existingCandidates.filter((c: any) => c.phone !== candidateData.phone);
      
      const customerIdx = prev.customers?.findIndex((c: any) => c.id === customerId);
      let updatedCustomers = [...(prev.customers || [])];

      // Si no ha sido aprobado/pagado antes, intentamos cobrar 1 USD
      if (candidateData.registrationPaymentStatus !== "approved") {
        if (customerIdx !== -1 && updatedCustomers[customerIdx].walletUSD >= 1) {
          updatedCustomers[customerIdx] = {
            ...updatedCustomers[customerIdx],
            walletUSD: updatedCustomers[customerIdx].walletUSD - 1
          };
          deductionSuccessful = true;
          candidateData.registrationPaymentStatus = "pending_approval"; // Pasa a revisión del core
        } else {
          return prev; // Falla silenciosamente, el componente maneja el Toast antes
        }
      } else {
        deductionSuccessful = true; // Ya estaba pagado
      }

      const newCandidate = {
        ...candidateData,
        cvFile: cvUrl,
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
      showToast("Perfil enviado. Se debitó $1.00 USD de tu Reserva Central. En espera de revisión por el {KFS_BRAND.productAcronym} Core.", "success");
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

      const updatedPromotoras = prev.promotoras.map((p: any) =>
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
          setTimeout(() => showToast(newStatus === "backed" ? "Candidato ahora respaldado por {KFS_BRAND.productAcronym} OS" : "Respaldo {KFS_BRAND.productAcronym} OS removido", "success"), 50);
          const updated = { ...c, status: newStatus };
          return addCandidateNotification(
            updated,
            newStatus === "backed" ? "Sello de Aval Otorgado 🏆" : "Aval {KFS_BRAND.productAcronym} OS Removido",
            newStatus === "backed"
              ? "¡Felicidades! Tu perfil ha recibido el Sello Dorado de Aval por parte del soporte de {KFS_BRAND.productAcronym} OS."
              : "El Aval de {KFS_BRAND.productAcronym} OS ha sido removido de tu perfil."
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
            "Tu pago de $1 USD fue verificado con éxito. Tu perfil ya está activo y visible para los comercios de {KFS_BRAND.productAcronym} OS."
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
    showToast(useBuilder ? "CV Digital {KFS_BRAND.productAcronym} activado." : "CV Digital {KFS_BRAND.productAcronym} desactivado.");
  };

  // ==========================================
  // DELIVERY RIDER FUNCTIONS
  // ==========================================

  const registerRider = async (riderData: any) => {
    const existing = db.riders?.find((r: any) => r.email === riderData.email);
    if (existing) {
      showToast("Este correo ya está registrado como rider.", "error");
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
      password: hashPassword(riderData.password),
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
      riders: Array.isArray(prev.riders) ? prev.riders.filter((r: any) => r?.id !== riderId) : [],
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
      isClient, isBooting, view, setView, currentUser, setCurrentUser, updateUserAvatar,
      toast, showToast, rates, updateBcvRates, db, setDb, formatUSD, formatEUR,
      handleLogin, logout, registerClient, registerFreeUser, upgradeToPremium, registerPromotora, registerVendedor, approvePromotora, rejectPromotora, settlePromotoraEarnings,
      addProduct, addExpense, processPurchase, submitOnlineOrder, approveOrder, rejectOrder, dispatchOrder, generateZReport,
      originalUser, impersonateClient, stopImpersonating,
      networkState, setNetworkState, smsConciliator, registerCrmExpress,
      ghostTrapLocked, setGhostTrapLocked, createVale, payVale, processPayroll, registerPosTerminal, deletePosTerminal,
      queryGlobalBarcode, toggleLoyaltyProgram, triggerGhostTrap, updateStoreSettings, updatePaymentMethods, toggleProductFeatured,
      sendNotification, requestNotificationPermission, assignPromotoraToClient, addGlobalProduct, paySubscription, approveSubscription, finishOnboarding, hashPassword, logAction, createTicket, replyTicket, closeTicket, fundWallet, transferKFSPoints, fundCustomerWallet, requestTopUp, requestPayout, validateTopUp, processMonthlyBilling, convertAsset, claimFlowMaster, trimLocalDatabase, registerCustomer, blockClient, releaseClient, deleteClient, deleteCustomer, deletePromotora, deleteVendedor, deleteRider,
      registerCandidate, unlockCandidateContact, approveUnlock, rejectUnlock, approveCandidateRegistration, rejectCandidateRegistration, hireCandidate, releaseCandidate, toggleCandidateBacking, markNotificationsAsRead, updateCvBuilderOption,
      registerRider, approveRider, rejectRider, assignRiderToBusiness, removeRiderFromBusiness, assignDeliveryToOrder, updateRiderPagoMovil, confirmDelivery, markAsPickedUp, rateRider, updateRiderGPS, riderCheckIn, riderCheckOut,
      toggleBusinessOpen, updateBusinessConfig
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
