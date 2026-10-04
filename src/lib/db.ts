import { User, Product, Order, DashboardStats } from '../types';
import { STORAGE_KEYS } from './config';
import { seedUsers, seedProducts, seedOrders } from '../data/seed';

// Initialize data in localStorage if not already present
export function initializeData(): void {
  const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  if (!initialized) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(seedUsers));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(seedProducts));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(seedOrders));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }
}

// ---- USERS ----
export function getUsers(): User[] {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
}

export function getUserById(id: string): User | undefined {
  return getUsers().find(u => u.id === id);
}

export function updateUser(id: string, updates: Partial<User>): User | undefined {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return undefined;
  users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  return users[index];
}

export function deleteUser(id: string): boolean {
  const users = getUsers();
  const filtered = users.filter(u => u.id !== id);
  if (filtered.length === users.length) return false;
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filtered));
  return true;
}

export function addUser(user: User): void {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

// ---- PRODUCTS ----
export function getProducts(): Product[] {
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  return data ? JSON.parse(data) : [];
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find(p => p.id === id);
}

export function updateProduct(id: string, updates: Partial<Product>): Product | undefined {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return undefined;
  products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  return products[index];
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) return false;
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
  return true;
}

export function addProduct(product: Product): void {
  const products = getProducts();
  products.push(product);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
}

// ---- ORDERS ----
export function getOrders(): Order[] {
  const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
  return data ? JSON.parse(data) : [];
}

export function getOrderById(id: string): Order | undefined {
  return getOrders().find(o => o.id === id);
}

export function updateOrder(id: string, updates: Partial<Order>): Order | undefined {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) return undefined;
  orders[index] = { ...orders[index], ...updates, updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  return orders[index];
}

export function deleteOrder(id: string): boolean {
  const orders = getOrders();
  const filtered = orders.filter(o => o.id !== id);
  if (filtered.length === orders.length) return false;
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(filtered));
  return true;
}

// ---- DASHBOARD STATS ----
export function getDashboardStats(): DashboardStats {
  const users = getUsers();
  const products = getProducts();
  const orders = getOrders();

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

// ---- RESET DATA ----
export function resetData(): void {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(seedUsers));
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(seedProducts));
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(seedOrders));
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
}
