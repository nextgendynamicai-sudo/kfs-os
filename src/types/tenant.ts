export interface TenantBranding {
  themeColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
  bannerUrl?: string;
  profilePicUrl?: string;
  bioText?: string;
  typography?: string;
  layoutType?: 'grid' | 'list' | 'compact';
  socialLinks?: {
    instagram?: string;
    whatsapp?: string;
    facebook?: string;
    twitter?: string;
    website?: string;
  };
}

export interface TenantSettings {
  currencyDefault: 'USD' | 'VES' | 'EUR';
  taxRate: number;
  customDomain?: string;
  subdomain?: string;
  allowVales: boolean;
  allowDelivery: boolean;
  allowGhostTrap: boolean;
  isMultiCashier: boolean;
  autoPrintReceipts?: boolean;
  // Funciones Exclusivas Tiendas de Arquitecto (7, 9, 10, 13)
  enableSmartChange?: boolean;
  enableLowStockAlerts?: boolean;
  enableCombos?: boolean;
  enableDigitalCard?: boolean;
  isArchitectStore?: boolean;
}

export interface TenantStats {
  totalSalesUSD: number;
  productsCount: number;
  vendedoresCount: number;
  valesCount: number;
  transactionsCount: number;
}

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
  status: 'active' | 'suspended' | 'trial' | 'pending';
  plan: 'free' | 'pionero' | 'premium' | 'enterprise';
  kfsFeePercentage: number;
  walletBalanceUSD: number;
  salesVolumeUSD: number;
  rating: number;
  reviewCount: number;
  promotoraId?: string;
  branding: TenantBranding;
  settings: TenantSettings;
  stats?: TenantStats;
  createdAt: string;
}
