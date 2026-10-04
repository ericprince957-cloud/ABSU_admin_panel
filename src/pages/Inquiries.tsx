import { useState } from 'react';
import { Search, MessageSquare, CheckCircle, Clock, XCircle, Trash2 } from 'lucide-react';
import { Inquiry } from '../types';
import { format } from 'date-fns';

interface InquiriesPageProps {
  inquiries: Inquiry[];
  onUpdateInquiry: (id: string, updates: Partial<Inquiry>) => Promise<void>;
  onDeleteInquiry: (id: string) => Promise<void>;
}

export default function InquiriesPage({ inquiries, onUpdateInquiry, onDeleteInquiry }: InquiriesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inquiry.users?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inquiry.products?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800 border-red-200';
      case 'replied': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'replied': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleDelete = async (id: string) => {
    await onDeleteInquiry(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
        <p className="text-gray-500 mt-1">View and manage customer inquiries</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search inquiries..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="replied">Replied</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filteredInquiries.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No inquiries found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredInquiries.map((inquiry) => (
              <div key={inquiry.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{inquiry.users?.name || 'Unknown User'}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(inquiry.status)}`}>
                        {getStatusIcon(inquiry.status)} {inquiry.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{inquiry.message}</p>
                    {inquiry.products && (
                      <p className="text-xs text-blue-600 mt-2">
                        Interested in: {inquiry.products.name} (₦{inquiry.products.price?.toLocaleString()})
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-400">{format(new Date(inquiry.created_at), 'MMM d, yyyy h:mm a')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <select
                      value={inquiry.status}
                      onChange={(e) => onUpdateInquiry(inquiry.id, { status: e.target.value as Inquiry['status'] })}
                      className="text-xs px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="new">New</option>
                      <option value="replied">Replied</option>
                      <option value="resolved">Resolved</option>
                    </select>
                    <button onClick={() => setDeleteConfirm(inquiry.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900">Delete Inquiry</h3>
            <p className="text-sm text-gray-500 mt-2">Are you sure? This cannot be undone.</p>
            <div className="flex items-center gap-3 mt-6">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
