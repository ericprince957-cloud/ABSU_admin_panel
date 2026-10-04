// Shared data contract - must match marketplace app exactly

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'student' | 'seller' | 'admin';
  status: 'pending' | 'verified' | 'banned';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  whatsapp?: string;
  bio?: string;
  storeName?: string;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  stock: number;
  condition: 'new' | 'used' | 'refurbished';
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  productId: string;
  productTitle: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentMethod: 'whatsapp' | 'cash' | 'bank_transfer';
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalSellers: number;
  totalProducts: number;
  totalOrders: number;
  pendingSellers: number;
  pendingProducts: number;
  revenue: number;
  activeOrders: number;
}

export type Page = 'dashboard' | 'sellers' | 'products' | 'orders' | 'settings';
