import { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/Users';
import ProductsPage from './pages/Products';
import InquiriesPage from './pages/Inquiries';
import SettingsPage from './pages/Settings';
import LoginScreen from './components/LoginScreen';
import { Page, User, Product, Inquiry, DashboardStats } from './types';
import { getUsers, getProducts, getInquiries, getDashboardStats, updateUser, deleteUser, updateProduct, deleteProduct, updateInquiry, deleteInquiry, addUser, addProduct } from './lib/db';
import { isSupabaseConfigured } from './lib/supabase';

const ADMIN_PASSWORD = 'eric123$';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ users: 0, products: 0, inquiries: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlPassword = urlParams.get('password');
    
    if (urlPassword === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_authenticated', 'true');
      setIsAuthenticated(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (sessionStorage.getItem('admin_authenticated') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const refreshData = useCallback(async () => {
    setLoading(true);
    const [usersData, productsData, inquiriesData, statsData] = await Promise.all([
      getUsers(),
      getProducts(),
      getInquiries(),
      getDashboardStats(),
    ]);
    setUsers(usersData);
    setProducts(productsData);
    setInquiries(inquiriesData);
    setStats(statsData);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) refreshData();
  }, [isAuthenticated, refreshData]);

  const handleUpdateUser = async (id: string, updates: Partial<User>) => {
    await updateUser(id, updates);
    await refreshData();
  };

  const handleDeleteUser = async (id: string) => {
    await deleteUser(id);
    await refreshData();
  };

  const handleAddUser = async (userData: Partial<User>) => {
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

  const handleAddProduct = async (productData: Partial<Product>) => {
    await addProduct(productData);
    await refreshData();
  };

  const handleUpdateInquiry = async (id: string, updates: Partial<Inquiry>) => {
    await updateInquiry(id, updates);
    await refreshData();
  };

  const handleDeleteInquiry = async (id: string) => {
    await deleteInquiry(id);
    await refreshData();
  };

  const newInquiries = inquiries.filter(i => i.status === 'new').length;

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

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

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard stats={stats} products={products} inquiries={inquiries} />;
      case 'users':
        return <UsersPage users={users} onUpdateUser={handleUpdateUser} onDeleteUser={handleDeleteUser} onAddUser={handleAddUser} onRefresh={refreshData} />;
      case 'products':
        return <ProductsPage products={products} onUpdateProduct={handleUpdateProduct} onDeleteProduct={handleDeleteProduct} onAddProduct={handleAddProduct} onRefresh={refreshData} />;
      case 'inquiries':
        return <InquiriesPage inquiries={inquiries} onUpdateInquiry={handleUpdateInquiry} onDeleteInquiry={handleDeleteInquiry} />;
      case 'settings':
        return <SettingsPage onRefresh={refreshData} />;
      default:
        return <Dashboard stats={stats} products={products} inquiries={inquiries} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} newInquiries={newInquiries} />
      <main className="flex-1 lg:ml-0 pt-14 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {!isSupabaseConfigured() && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Supabase not configured.</strong> Create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. See SETUP_GUIDE.md.
              </p>
            </div>
          )}
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
