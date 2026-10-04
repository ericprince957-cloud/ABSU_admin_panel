import {
  Users as UsersIcon,
  Package,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';
import { DashboardStats, Product, Inquiry } from '../types';
import { config } from '../lib/config';
import { format } from 'date-fns';

interface DashboardProps {
  stats: DashboardStats;
  products: Product[];
  inquiries: Inquiry[];
}

export default function Dashboard({ stats, products, inquiries }: DashboardProps) {
  const activeProducts = products.filter(p => p.is_active);
  const recentInquiries = inquiries.slice(0, 5);
  const isEmpty = stats.users === 0 && stats.products === 0 && stats.inquiries === 0;

  const statCards = [
    {
      title: 'Total Users',
      value: stats.users,
      icon: UsersIcon,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Active Products',
      value: activeProducts.length,
      icon: Package,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Total Products',
      value: stats.products,
      icon: Package,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Total Inquiries',
      value: stats.inquiries,
      icon: MessageSquare,
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
  ];

  if (isEmpty) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome to your Admin Panel</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-10 h-10 text-orange-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Let's get started!</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Connect to Supabase to start managing your marketplace.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div key={card.title} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                </div>
                <div className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center`}>
                  <card.icon className={`w-6 h-6 ${card.textColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your marketplace</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.title} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
              </div>
              <div className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center`}>
                <card.icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Products</h2>
          {products.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No products yet</p>
          ) : (
            <div className="space-y-3">
              {products.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{config.currency}{product.price.toLocaleString()}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {product.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Inquiries</h2>
          {recentInquiries.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No inquiries yet</p>
          ) : (
            <div className="space-y-3">
              {recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{inquiry.users?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{inquiry.message}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      inquiry.status === 'new' ? 'bg-red-100 text-red-800' :
                      inquiry.status === 'replied' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {inquiry.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {format(new Date(inquiry.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
