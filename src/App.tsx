import { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import SellersPage from './pages/Sellers';
import ProductsPage from './pages/Products';
import OrdersPage from './pages/Orders';
import SettingsPage from './pages/Settings';
import { Page, User, Product, Order, DashboardStats } from './types';
import { initializeData, getUsers, getProducts, getOrders, getDashboardStats, updateUser, deleteUser, updateProduct, deleteProduct, updateOrder } from './lib/db';

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

  const refreshData = useCallback(() => {
    initializeData();
    setUsers(getUsers());
    setProducts(getProducts());
    setOrders(getOrders());
    setStats(getDashboardStats());
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const sellers = users.filter(u => u.role === 'seller');

  const handleUpdateSeller = (id: string, updates: Partial<User>) => {
    updateUser(id, updates);
    refreshData();
  };

  const handleDeleteSeller = (id: string) => {
    deleteUser(id);
    refreshData();
  };

  const handleUpdateProduct = (id: string, updates: Partial<Product>) => {
    updateProduct(id, updates);
    refreshData();
  };

  const handleDeleteProduct = (id: string) => {
    deleteProduct(id);
    refreshData();
  };

  const handleUpdateOrder = (id: string, updates: Partial<Order>) => {
    updateOrder(id, updates);
    refreshData();
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
        return <SettingsPage onRefresh={refreshData} />;
      default:
        return <Dashboard stats={stats} users={users} products={products} orders={orders} />;
    }
  };

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
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
