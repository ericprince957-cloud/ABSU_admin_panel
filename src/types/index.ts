// Database types matching actual Supabase schema

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  status?: string;
  avatar?: string;
  whatsapp?: string;
  bio?: string;
  store_name?: string;
  created_at: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  seller_id?: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  image_url?: string;
  is_active: boolean;
  stock: number;
  created_at: string;
  updated_at?: string;
}

export interface Inquiry {
  id: string;
  user_id: string;
  product_id: string;
  message: string;
  status: 'new' | 'replied' | 'resolved';
  created_at: string;
  updated_at?: string;
  // Joined data
  users?: { name: string; email: string };
  products?: { name: string; price: number };
}

export interface DashboardStats {
  users: number;
  products: number;
  inquiries: number;
}

export type Page = 'dashboard' | 'users' | 'products' | 'inquiries' | 'settings';
