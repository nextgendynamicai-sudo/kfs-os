export interface CommerceSubscription {
  plan_type?: 'standard_kfs' | 'contract_b2b_chacao';
  monthly_fee_usd: number; // Default: 100.00
  contract_duration_days: number; // Default: 90
  billing_day_of_month: number; // Rango: 1 al 5
  contract_start_date: string;
  contract_end_date: string; // created_at + 90 days
  is_trial_active: boolean; // true si actual <= created_at + 7 days
  payment_status: 'settled' | 'pending' | 'overdue';
  cancellation_pending?: boolean;
  lastPaymentRef?: string | null;
  status?: string;
  nextBillingDate?: string;
  costUSD?: number;
}

export interface Client {
  id: string;
  name: string;
  idCard: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  avatar?: string;
  kycCedula?: string;
  business_preset?: string;
  kfsFeePercentage: number;
  referredBy?: string;
  createdAt: string;
  vales?: any[];
  kpointsBalance?: number;
  salesVolume?: number;
  slug?: string;
  tenant_id?: string;
  storeSettings?: any;
  status?: string;
  plan?: string;
  rating?: number;
  reviewCount?: number;
  isArchitectStore?: boolean;
  created_by?: string;
  subscription?: CommerceSubscription;
  digitalCardSettings?: {
    enableNfcCard?: boolean;
    showWhatsApp?: boolean;
    showMaps?: boolean;
    showPagoMovil?: boolean;
    customBio?: string;
    customTitle?: string;
    instagramUrl?: string;
    tiktokUrl?: string;
    facebookUrl?: string;
  };
}

export interface Promotora {
  id: string;
  name: string;
  email: string;
  pagoMovil?: string;
  binanceId?: string;
  avatar?: string;
  kycCedula?: string;
  kycAddress?: string;
  referredBy?: string;
  createdAt: string;
  earnings?: number;
  referralsCount?: number;
}

export interface Rider {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicleType: string;
  cedulaImg?: string;
  medCertImg?: string;
  licenseImg?: string;
  pagoMovil?: {
    banco: string;
    telefono: string;
    cedula: string;
  };
  referredBy?: string;
  createdAt: string;
  deliveries?: number;
  earnings?: number;
  kpointsBalance?: number;
  tenantId?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  referredBy?: string;
  createdAt: string;
  kpointsBalance: number;
  tenantId?: string;
}

export interface BundleItem {
  productId: string;
  qty: number;
  name?: string;
  priceUSD?: number;
}

export interface Product {
  id: string;
  sellerId: string;
  name: string;
  price: number;
  stock: number;
  description?: string;
  image?: string;
  createdAt: string;
  clientId?: string;
  tenantId?: string;
  priceUSD?: number;
  costUSD?: number;
  category?: string;
  minStockAlert?: number;
  isBundle?: boolean;
  bundleItems?: BundleItem[];
}

export interface KFSDBState {
  clients: Client[];
  promotoras: Promotora[];
  riders: Rider[];
  customers: Customer[];
  products: Product[];
  transactions: any[];
  vales: any[];
  version: number;
}

