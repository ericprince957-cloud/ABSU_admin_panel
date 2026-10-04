import { User, Product, Inquiry, DashboardStats } from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

const useSupabase = isSupabaseConfigured();

// ============================================
// USERS
// ============================================

export async function getUsers(): Promise<User[]> {
  if (!useSupabase) return [];

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  return data || [];
}

export async function getUserById(id: string): Promise<User | null> {
  if (!useSupabase) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return data;
}

export async function addUser(user: Partial<User>): Promise<User | null> {
  if (!useSupabase) return null;

  const { data, error } = await supabase
    .from('users')
    .insert([user])
    .select()
    .single();

  if (error) {
    console.error('Error adding user:', error);
    return null;
  }

  return data;
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  if (!useSupabase) return null;

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating user:', error);
    return null;
  }

  return data;
}

export async function deleteUser(id: string): Promise<boolean> {
  if (!useSupabase) return false;

  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting user:', error);
    return false;
  }

  return true;
}

// ============================================
// PRODUCTS
// ============================================

export async function getProducts(): Promise<Product[]> {
  if (!useSupabase) return [];

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data || [];
}

export async function getActiveProducts(): Promise<Product[]> {
  if (!useSupabase) return [];

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching active products:', error);
    return [];
  }

  return data || [];
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!useSupabase) return null;

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
}

export async function addProduct(product: Partial<Product>): Promise<Product | null> {
  if (!useSupabase) return null;

  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();

  if (error) {
    console.error('Error adding product:', error);
    return null;
  }

  return data;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  if (!useSupabase) return null;

  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    return null;
  }

  return data;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (!useSupabase) return false;

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    return false;
  }

  return true;
}

// ============================================
// INQUIRIES
// ============================================

export async function getInquiries(): Promise<Inquiry[]> {
  if (!useSupabase) return [];

  const { data, error } = await supabase
    .from('inquiries')
    .select(`
      *,
      users:user_id (name, email),
      products:product_id (name, price)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching inquiries:', error);
    return [];
  }

  return data || [];
}

export async function updateInquiry(id: string, updates: Partial<Inquiry>): Promise<Inquiry | null> {
  if (!useSupabase) return null;

  const { data, error } = await supabase
    .from('inquiries')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating inquiry:', error);
    return null;
  }

  return data;
}

export async function deleteInquiry(id: string): Promise<boolean> {
  if (!useSupabase) return false;

  const { error } = await supabase
    .from('inquiries')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting inquiry:', error);
    return false;
  }

  return true;
}

// ============================================
// DASHBOARD STATS
// ============================================

export async function getDashboardStats(): Promise<DashboardStats> {
  if (!useSupabase) {
    return { users: 0, products: 0, inquiries: 0 };
  }

  const { count: userCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

  const { count: productCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  const { count: inquiryCount } = await supabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true });

  return {
    users: userCount || 0,
    products: productCount || 0,
    inquiries: inquiryCount || 0,
  };
}
