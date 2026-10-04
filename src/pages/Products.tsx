import { useState } from 'react';
import { Search, Package, Plus, Eye, Edit2, Trash2, MoreVertical, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { Product } from '../types';
import { config } from '../lib/config';
import { format } from 'date-fns';

interface ProductsPageProps {
  products: Product[];
  onUpdateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onAddProduct: (productData: Partial<Product>) => Promise<void>;
  onRefresh: () => Promise<void>;
}

export default function ProductsPage({ products, onUpdateProduct, onDeleteProduct, onAddProduct }: ProductsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState<string>('all');
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterActive === 'all' || (filterActive === 'active' ? p.is_active : !p.is_active);
    return matchesSearch && matchesFilter;
  });

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await onUpdateProduct(id, { is_active: !isActive });
    setActionMenu(null);
  };

  const handleDelete = async (id: string) => {
    await onDeleteProduct(id);
    setDeleteConfirm(null);
  };

  const handleAddProduct = async (productData: Partial<Product>) => {
    await onAddProduct(productData);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Manage product listings</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        <select value={filterActive} onChange={(e) => setFilterActive(e.target.value)} className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
          <option value="all">All Products</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No products yet</h3>
            <p className="text-gray-500 text-sm mb-4">Add your first product to get started</p>
            <button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600">
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                    <Package className="w-12 h-12 text-gray-300" />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
                    <div className="relative flex-shrink-0">
                      <button onClick={() => setActionMenu(actionMenu === product.id ? null : product.id)} className="p-1 rounded hover:bg-gray-100">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                      {actionMenu === product.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActionMenu(null)} />
                          <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
                            <button onClick={() => { handleToggleActive(product.id, product.is_active); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                              {product.is_active ? <ToggleLeft className="w-4 h-4" /> : <ToggleRight className="w-4 h-4" />}
                              {product.is_active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button onClick={() => { setViewProduct(product); setActionMenu(null); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                              <Eye className="w-4 h-4" /> View Details
                            </button>
                            <button onClick={() => { setDeleteConfirm(product.id); setActionMenu(null); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-red-50">
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-lg font-bold text-orange-600">{config.currency}{product.price.toLocaleString()}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    {product.category && <span>{product.category}</span>}
                    <span>{product.stock} in stock</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && <AddProductModal onClose={() => setShowAddModal(false)} onSave={handleAddProduct} />}

      {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>
              <button onClick={() => setViewProduct(null)} className="p-1 rounded hover:bg-gray-100"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            {viewProduct.image_url && <img src={viewProduct.image_url} alt={viewProduct.name} className="w-full h-48 object-cover rounded-lg mb-4" />}
            <h4 className="font-bold text-xl text-gray-900">{viewProduct.name}</h4>
            <p className="text-gray-600 mt-2">{viewProduct.description}</p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 bg-gray-50 rounded-lg"><p className="text-xs text-gray-500">Price</p><p className="text-sm font-semibold">{config.currency}{viewProduct.price.toLocaleString()}</p></div>
              <div className="p-3 bg-gray-50 rounded-lg"><p className="text-xs text-gray-500">Stock</p><p className="text-sm font-semibold">{viewProduct.stock}</p></div>
              <div className="p-3 bg-gray-50 rounded-lg"><p className="text-xs text-gray-500">Category</p><p className="text-sm font-semibold">{viewProduct.category || '-'}</p></div>
              <div className="p-3 bg-gray-50 rounded-lg"><p className="text-xs text-gray-500">Status</p><p className="text-sm font-semibold">{viewProduct.is_active ? 'Active' : 'Inactive'}</p></div>
            </div>
            <button onClick={() => setViewProduct(null)} className="w-full mt-6 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Close</button>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900">Delete Product</h3>
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

function AddProductModal({ onClose, onSave }: { onClose: () => void; onSave: (data: Partial<Product>) => void }) {
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '', image_url: '', stock: '1', is_active: true });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Valid price is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave({ ...formData, price: Number(formData.price), stock: Number(formData.stock) || 1 });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Add Product</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100"><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.name ? 'border-red-300' : 'border-gray-200'}`} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Price (₦) *</label><input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.price ? 'border-red-300' : 'border-gray-200'}`} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Stock</label><input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><input type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label><input type="url" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="https://..." className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
        </div>
        <div className="flex items-center gap-3 mt-6">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button onClick={handleSubmit} className="flex-1 px-4 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600">Add Product</button>
        </div>
      </div>
    </div>
  );
}
