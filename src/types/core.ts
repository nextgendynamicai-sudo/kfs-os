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
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  referredBy?: string;
  createdAt: string;
  kpointsBalance: number;
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
