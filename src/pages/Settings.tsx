import { useState } from 'react';
import {
  RefreshCw,
  Database,
  Shield,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { resetData } from '../lib/db';
import { config, STORAGE_KEYS } from '../lib/config';

interface SettingsPageProps {
  onRefresh: () => void;
}

export default function SettingsPage({ onRefresh }: SettingsPageProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    resetData();
    setShowResetConfirm(false);
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
      onRefresh();
    }, 1500);
  };

  const dataInfo = {
    users: JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]').length,
    products: JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]').length,
    orders: JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your admin panel data</p>
      </div>

      {/* Success Message */}
      {resetSuccess && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <p className="text-sm text-green-700">All data has been cleared successfully!</p>
        </div>
      )}

      {/* Data Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-5 h-5 text-purple-500" />
          <h2 className="text-lg font-semibold text-gray-900">Data Overview</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-600">People</p>
            <p className="text-2xl font-bold text-blue-900">{dataInfo.users}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-xs text-purple-600">Products</p>
            <p className="text-2xl font-bold text-purple-900">{dataInfo.products}</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-xs text-orange-600">Orders</p>
            <p className="text-2xl font-bold text-orange-900">{dataInfo.orders}</p>
          </div>
        </div>
      </div>

      {/* Currency */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-green-500" />
          <h2 className="text-lg font-semibold text-gray-900">Currency</h2>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">Active Currency</p>
          <p className="text-sm font-semibold text-gray-900">{config.currency} ({config.currencyCode})</p>
        </div>
      </div>

      {/* Storage Keys Reference */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-green-500" />
          <h2 className="text-lg font-semibold text-gray-900">Storage Keys</h2>
        </div>
        <div className="space-y-2">
          {Object.entries(STORAGE_KEYS).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">{key}</span>
              <code className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600 font-mono">{value}</code>
            </div>
          ))}
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <RefreshCw className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-semibold text-gray-900">Data Management</h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-amber-800">Clear All Data</h3>
                <p className="text-xs text-amber-600 mt-1">
                  This will delete all people, products, and orders. This cannot be undone.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Clear All Data
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Clear All Data?</h3>
            </div>
            <p className="text-sm text-gray-500">
              This will permanently delete all people, products, and orders. This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
              >
                Clear Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
