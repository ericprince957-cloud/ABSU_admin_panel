import {
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  UserPlus,
  PackagePlus,
} from 'lucide-react';
import { DashboardStats, User, Product, Order } from '../types';
import { config } from '../lib/config';
import { format } from 'date-fns';

interface DashboardProps {
  stats: DashboardStats;
  users: User[];
  products: Product[];
  orders: Order[];
}

export default function Dashboard({ stats, users, products, orders }: DashboardProps) {
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const pendingSellers = users.filter(u => u.role === 'seller' && u.status === 'pending');
  const pendingProducts = products.filter(p => p.status === 'pending');

  const isEmpty = users.length === 0 && products.length === 0 && orders.length === 0;

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Total Sellers',
      value: stats.totalSellers,
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
    {
      title: 'Revenue',
      value: `${config.currency}${stats.revenue.toLocaleString()}`,
      icon: TrendingUp,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      title: 'Active Orders',
      value: stats.activeOrders,
      icon: TrendingUp,
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-600',
    },
    {
      title: 'Pending Sellers',
      value: stats.pendingSellers,
      icon: AlertTriangle,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      title: 'Pending Products',
      value: stats.pendingProducts,
      icon: Clock,
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-600',
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  if (isEmpty) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome to {config.siteName} Admin Panel</p>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-10 h-10 text-orange-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Let's get started!</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Your admin panel is ready. Start by adding people (sellers and students) to your marketplace.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
              <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
              Add sellers & students from People page
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
              <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
              Verify sellers to activate them
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
              <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
              <PackagePlus className="w-4 h-4" />
              Add products for verified sellers
            </div>
          </div>
        </div>

        {/* Stats (all zeros) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
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

      {/* Pending Actions & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Actions</h2>
          
          {pendingSellers.length === 0 && pendingProducts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-500">All caught up! No pending actions.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingSellers.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {pendingSellers.length} seller{pendingSellers.length > 1 ? 's' : ''} awaiting verification
                      </p>
                      <p className="text-xs text-gray-500">
                        {pendingSellers.map(s => s.storeName || s.name).join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {pendingProducts.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {pendingProducts.length} product{pendingProducts.length > 1 ? 's' : ''} awaiting approval
                      </p>
                      <p className="text-xs text-gray-500">
                        {pendingProducts.map(p => p.title).join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
          
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No orders yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.productTitle}</p>
                    <p className="text-xs text-gray-500">
                      {order.buyerName} → {order.sellerName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{config.currency}{order.totalPrice.toLocaleString()}</p>
                    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Activity */}
      {users.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {getRecentActivity(users, products, orders).map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                  <activity.icon className={`w-4 h-4 ${activity.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {format(new Date(activity.timestamp), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getRecentActivity(users: User[], products: Product[], orders: Order[]) {
  const activities: { message: string; timestamp: string; icon: typeof Users; color: string; iconColor: string }[] = [];

  users.slice(-3).forEach(user => {
    activities.push({
      message: `${user.name} ${user.status === 'verified' ? 'was verified' : user.status === 'pending' ? 'was added' : 'was banned'} as ${user.role}`,
      timestamp: user.updatedAt,
      icon: Users,
      color: user.status === 'verified' ? 'bg-green-100' : user.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100',
      iconColor: user.status === 'verified' ? 'text-green-600' : user.status === 'pending' ? 'text-yellow-600' : 'text-red-600',
    });
  });

  products.slice(-3).forEach(product => {
    activities.push({
      message: `Product "${product.title}" ${product.status === 'approved' ? 'was approved' : product.status === 'pending' ? 'is pending review' : 'was rejected'}`,
      timestamp: product.updatedAt,
      icon: Package,
      color: product.status === 'approved' ? 'bg-green-100' : product.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100',
      iconColor: product.status === 'approved' ? 'text-green-600' : product.status === 'pending' ? 'text-yellow-600' : 'text-red-600',
    });
  });

  orders.slice(-3).forEach(order => {
    activities.push({
      message: `Order #${order.id.split('-')[1]} for "${order.productTitle}" is ${order.status}`,
      timestamp: order.updatedAt,
      icon: ShoppingCart,
      color: order.status === 'delivered' ? 'bg-green-100' : order.status === 'pending' ? 'bg-yellow-100' : 'bg-blue-100',
      iconColor: order.status === 'delivered' ? 'text-green-600' : order.status === 'pending' ? 'text-yellow-600' : 'text-blue-600',
    });
  });

  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8);
}
