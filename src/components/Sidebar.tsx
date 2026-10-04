import { useState } from 'react';
import { LayoutDashboard, Users, Package, MessageSquare, Settings, Menu, X, Shield } from 'lucide-react';
import { Page } from '../types';
import { config } from '../lib/config';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  newInquiries: number;
}

const navItems: { id: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ currentPage, onNavigate, newInquiries }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const getBadge = (id: Page) => {
    if (id === 'inquiries' && newInquiries > 0) return newInquiries;
    return 0;
  };

  const handleNavigate = (page: Page) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-orange-500" />
          <span className="font-bold text-gray-900">Admin Panel</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-gray-100">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)} />}

      <aside className={`fixed top-0 left-0 z-40 h-full w-64 bg-gray-900 text-white transform transition-transform duration-200 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>
        <div className="flex flex-col h-full">
          <div className="px-6 py-5 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Admin Panel</h1>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const badge = getBadge(item.id);
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {badge > 0 && <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{badge}</span>}
                </button>
              );
            })}
          </nav>

          <div className="px-3 py-4 border-t border-gray-700">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-gray-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-gray-300">Admin Panel</p>
                <p className="text-xs text-gray-500 truncate">v{config.dataVersion}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
