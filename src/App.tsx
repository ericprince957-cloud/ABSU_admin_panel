import { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import SellersPage from './pages/Sellers';
import ProductsPage from './pages/Products';
import OrdersPage from './pages/Orders';
import SettingsPage from './pages/Settings';
import { Page, User, Product, Order, DashboardStats } from './types';
import { getUsers, getProducts, getOrders, getDashboardStats, updateUser, deleteUser, updateProduct, deleteProduct, updateOrder, deleteOrder, addUser, addProduct } from './lib/db';
import { isSupabaseConfigured } from './lib/supabase';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalSellers: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingSellers: 0,
    pendingProducts: 0,
    revenue: 0,
    activeOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    setLoading(true);
    const [usersData, productsData, ordersData, statsData] = await Promise.all([
      getUsers(),
      getProducts(),
      getOrders(),
      getDashboardStats(),
    ]);
    setUsers(usersData);
    setProducts(productsData);
    setOrders(ordersData);
    setStats(statsData);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const sellers = users.filter(u => u.role === 'seller');

  const handleUpdateSeller = async (id: string, updates: Partial<User>) => {
    await updateUser(id, updates);
    await refreshData();
  };

  const handleDeleteSeller = async (id: string) => {
    await deleteUser(id);
    await refreshData();
  };

  const handleAddUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    await addUser(userData);
    await refreshData();
  };

  const handleUpdateProduct = async (id: string, updates: Partial<Product>) => {
    await updateProduct(id, updates);
    await refreshData();
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id);
    await refreshData();
  };

  const handleAddProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    await addProduct(productData);
    await refreshData();
  };

  const handleUpdateOrder = async (id: string, updates: Partial<Order>) => {
    await updateOrder(id, updates);
    await refreshData();
  };

  const handleClearAllData = async () => {
    // Delete all orders first (has foreign key constraints)
    for (const order of orders) {
      await deleteOrder(order.id);
    }
    // Then products
    for (const product of products) {
      await deleteProduct(product.id);
    }
    // Then users
    for (const user of users) {
      await deleteUser(user.id);
    }
    await refreshData();
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard stats={stats} users={users} products={products} orders={orders} />;
      case 'sellers':
        return (
          <SellersPage
            sellers={sellers}
            allUsers={users}
            onUpdateSeller={handleUpdateSeller}
            onDeleteSeller={handleDeleteSeller}
            onAddUser={handleAddUser}
            onRefresh={refreshData}
          />
        );
      case 'products':
        return (
          <ProductsPage
            products={products}
            sellers={sellers}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onAddProduct={handleAddProduct}
            onRefresh={refreshData}
          />
        );
      case 'orders':
        return (
          <OrdersPage
            orders={orders}
            onUpdateOrder={handleUpdateOrder}
          />
        );
      case 'settings':
        return <SettingsPage onRefresh={refreshData} onClearAll={handleClearAllData} />;
      default:
        return <Dashboard stats={stats} users={users} products={products} orders={orders} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        pendingSellers={stats.pendingSellers}
        pendingProducts={stats.pendingProducts}
      />
      <main className="flex-1 lg:ml-0 pt-14 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {!isSupabaseConfigured() && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Supabase not configured.</strong> Please set up your Supabase credentials in the .env file. See SETUP_GUIDE.md for instructions.
              </p>
            </div>
          )}
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
