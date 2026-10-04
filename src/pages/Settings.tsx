import { useState } from 'react';
import { RefreshCw, Database, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { config, STORAGE_KEYS } from '../lib/config';
import { isSupabaseConfigured } from '../lib/supabase';

interface SettingsPageProps {
  onRefresh: () => Promise<void>;
}

export default function SettingsPage({ onRefresh }: SettingsPageProps) {
  const dataInfo = {
    users: JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]').length,
    products: JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]').length,
    inquiries: JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Admin panel configuration</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className={`w-5 h-5 ${isSupabaseConfigured() ? 'text-green-500' : 'text-red-500'}`} />
          <h2 className="text-lg font-semibold text-gray-900">Connection Status</h2>
        </div>
        <div className={`p-4 rounded-lg border ${isSupabaseConfigured() ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center gap-2">
            {isSupabaseConfigured() ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                <p className="text-sm font-medium text-green-800">Connected to Supabase</p>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <p className="text-sm font-medium text-red-800">Not connected. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-5 h-5 text-purple-500" />
          <h2 className="text-lg font-semibold text-gray-900">Currency</h2>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">Active Currency</p>
          <p className="text-sm font-semibold text-gray-900">{config.currency} ({config.currencyCode})</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <RefreshCw className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900">Actions</h2>
        </div>
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Data
        </button>
      </div>
    </div>
  );
}
