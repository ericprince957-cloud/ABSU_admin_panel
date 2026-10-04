import { User, Product, Order, DashboardStats } from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

// Check if Supabase is configured
const useSupabase = isSupabaseConfigured();

// ============================================
// USERS
// ============================================

export async function getUsers(): Promise<User[]> {
  if (!useSupabase) {
    console.warn('Supabase not configured. Using empty data.');
    return [];
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  return (data || []).map(mapDbUserToUser);
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

  return data ? mapDbUserToUser(data) : null;
}

export async function addUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User | null> {
  if (!useSupabase) return null;

  const { data, error } = await supabase
    .from('users')
    .insert([{
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
      whatsapp: user.whatsapp,
      bio: user.bio,
      store_name: user.storeName,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error adding user:', error);
    return null;
  }

  return data ? mapDbUserToUser(data) : null;
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  if (!useSupabase) return null;

  const dbUpdates: any = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.email !== undefined) dbUpdates.email = updates.email;
  if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
  if (updates.role !== undefined) dbUpdates.role = updates.role;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.avatar !== undefined) dbUpdates.avatar = updates.avatar;
  if (updates.whatsapp !== undefined) dbUpdates.whatsapp = updates.whatsapp;
  if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
  if (updates.storeName !== undefined) dbUpdates.store_name = updates.storeName;

  const { data, error } = await supabase
    .from('users')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating user:', error);
    return null;
  }

  return data ? mapDbUserToUser(data) : null;
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

  return (data || []).map(mapDbProductToProduct);
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

  return data ? mapDbProductToProduct(data) : null;
}

export async function addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product | null> {
  if (!useSupabase) return null;

  const { data, error } = await supabase
    .from('products')
    .insert([{
      seller_id: product.sellerId,
      seller_name: product.sellerName,
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      images: product.images,
      status: product.status,
      stock: product.stock,
      condition: product.condition,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error adding product:', error);
    return null;
  }

  return data ? mapDbProductToProduct(data) : null;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  if (!useSupabase) return null;

  const dbUpdates: any = {};
  if (updates.sellerId !== undefined) dbUpdates.seller_id = updates.sellerId;
  if (updates.sellerName !== undefined) dbUpdates.seller_name = updates.sellerName;
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.price !== undefined) dbUpdates.price = updates.price;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.images !== undefined) dbUpdates.images = updates.images;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.stock !== undefined) dbUpdates.stock = updates.stock;
  if (updates.condition !== undefined) dbUpdates.condition = updates.condition;

  const { data, error } = await supabase
    .from('products')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    return null;
  }

  return data ? mapDbProductToProduct(data) : null;
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
// ORDERS
// ============================================

export async function getOrders(): Promise<Order[]> {
  if (!useSupabase) return [];

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return (data || []).map(mapDbOrderToOrder);
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (!useSupabase) return null;

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching order:', error);
    return null;
  }

  return data ? mapDbOrderToOrder(data) : null;
}

export async function addOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order | null> {
  if (!useSupabase) return null;

  const { data, error } = await supabase
    .from('orders')
    .insert([{
      buyer_id: order.buyerId,
      buyer_name: order.buyerName,
      seller_id: order.sellerId,
      seller_name: order.sellerName,
      product_id: order.productId,
      product_title: order.productTitle,
      quantity: order.quantity,
      total_price: order.totalPrice,
      status: order.status,
      payment_method: order.paymentMethod,
      notes: order.notes,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error adding order:', error);
    return null;
  }

  return data ? mapDbOrderToOrder(data) : null;
}

export async function updateOrder(id: string, updates: Partial<Order>): Promise<Order | null> {
  if (!useSupabase) return null;

  const dbUpdates: any = {};
  if (updates.buyerId !== undefined) dbUpdates.buyer_id = updates.buyerId;
  if (updates.buyerName !== undefined) dbUpdates.buyer_name = updates.buyerName;
  if (updates.sellerId !== undefined) dbUpdates.seller_id = updates.sellerId;
  if (updates.sellerName !== undefined) dbUpdates.seller_name = updates.sellerName;
  if (updates.productId !== undefined) dbUpdates.product_id = updates.productId;
  if (updates.productTitle !== undefined) dbUpdates.product_title = updates.productTitle;
  if (updates.quantity !== undefined) dbUpdates.quantity = updates.quantity;
  if (updates.totalPrice !== undefined) dbUpdates.total_price = updates.totalPrice;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.paymentMethod !== undefined) dbUpdates.payment_method = updates.paymentMethod;
  if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

  const { data, error } = await supabase
    .from('orders')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating order:', error);
    return null;
  }

  return data ? mapDbOrderToOrder(data) : null;
}

export async function deleteOrder(id: string): Promise<boolean> {
  if (!useSupabase) return false;

  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting order:', error);
    return false;
  }

  return true;
}

// ============================================
// DASHBOARD STATS
// ============================================

export async function getDashboardStats(): Promise<DashboardStats> {
  if (!useSupabase) {
    return {
      totalUsers: 0,
      totalSellers: 0,
      totalProducts: 0,
      totalOrders: 0,
      pendingSellers: 0,
      pendingProducts: 0,
      revenue: 0,
      activeOrders: 0,
    };
  }

  const [users, products, orders] = await Promise.all([
    getUsers(),
    getProducts(),
    getOrders(),
  ]);

  const sellers = users.filter(u => u.role === 'seller');
  const pendingSellers = sellers.filter(s => s.status === 'pending');
  const pendingProducts = products.filter(p => p.status === 'pending');
  const activeOrders = orders.filter(o => !['delivered', 'cancelled', 'refunded'].includes(o.status));
  const revenue = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  return {
    totalUsers: users.length,
    totalSellers: sellers.length,
    totalProducts: products.length,
    totalOrders: orders.length,
    pendingSellers: pendingSellers.length,
    pendingProducts: pendingProducts.length,
    revenue,
    activeOrders: activeOrders.length,
  };
}

// ============================================
// HELPER FUNCTIONS - Map DB to App Types
// ============================================

function mapDbUserToUser(dbUser: any): User {
  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    phone: dbUser.phone,
    role: dbUser.role as User['role'],
    status: dbUser.status as User['status'],
    avatar: dbUser.avatar,
    whatsapp: dbUser.whatsapp,
    bio: dbUser.bio,
    storeName: dbUser.store_name,
    createdAt: dbUser.created_at,
    updatedAt: dbUser.updated_at,
  };
}

function mapDbProductToProduct(dbProduct: any): Product {
  return {
    id: dbProduct.id,
    sellerId: dbProduct.seller_id,
    sellerName: dbProduct.seller_name,
    title: dbProduct.title,
    description: dbProduct.description,
    price: dbProduct.price,
    category: dbProduct.category,
    images: dbProduct.images || [],
    status: dbProduct.status as Product['status'],
    stock: dbProduct.stock,
    condition: dbProduct.condition as Product['condition'],
    createdAt: dbProduct.created_at,
    updatedAt: dbProduct.updated_at,
  };
}

function mapDbOrderToOrder(dbOrder: any): Order {
  return {
    id: dbOrder.id,
    buyerId: dbOrder.buyer_id,
    buyerName: dbOrder.buyer_name,
    sellerId: dbOrder.seller_id,
    sellerName: dbOrder.seller_name,
    productId: dbOrder.product_id,
    productTitle: dbOrder.product_title,
    quantity: dbOrder.quantity,
    totalPrice: dbOrder.total_price,
    status: dbOrder.status as Order['status'],
    paymentMethod: dbOrder.payment_method as Order['paymentMethod'],
    notes: dbOrder.notes,
    createdAt: dbOrder.created_at,
    updatedAt: dbOrder.updated_at,
  };
}
