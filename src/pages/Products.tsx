import { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Trash2,
  Edit2,
  Package,
  MoreVertical,
  X,
  Eye,
  CheckSquare,
  Square,
  Plus,
} from 'lucide-react';
import { Product, User } from '../types';
import { addProduct } from '../lib/db';
import { format } from 'date-fns';

interface ProductsPageProps {
  products: Product[];
  sellers: User[];
  onUpdateProduct: (id: string, updates: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
  onRefresh: () => void;
}

export default function ProductsPage({ products, sellers, onUpdateProduct, onDeleteProduct, onRefresh }: ProductsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);

  const categories = [...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'used':
        return 'bg-gray-100 text-gray-800';
      case 'refurbished':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApprove = (id: string) => {
    onUpdateProduct(id, { status: 'approved' });
    setActionMenu(null);
  };

  const handleReject = (id: string) => {
    onUpdateProduct(id, { status: 'rejected' });
    setActionMenu(null);
  };

  const handleDelete = (id: string) => {
    onDeleteProduct(id);
    setDeleteConfirm(null);
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProducts(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const handleBulkApprove = () => {
    selectedProducts.forEach(id => {
      onUpdateProduct(id, { status: 'approved' });
    });
    setSelectedProducts(new Set());
  };

  const handleBulkReject = () => {
    selectedProducts.forEach(id => {
      onUpdateProduct(id, { status: 'rejected' });
    });
    setSelectedProducts(new Set());
  };

  const handleBulkDelete = () => {
    selectedProducts.forEach(id => {
      onDeleteProduct(id);
    });
    setSelectedProducts(new Set());
  };

  const handleAddProduct = (productData: Partial<Product>) => {
    const now = new Date().toISOString();
    const seller = sellers.find(s => s.id === productData.sellerId);
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      sellerId: productData.sellerId || '',
      sellerName: seller?.storeName || seller?.name || '',
      title: productData.title || '',
      description: productData.description || '',
      price: productData.price || 0,
      category: productData.category || 'Other',
      images: [],
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      stock: productData.stock || 1,
      condition: (productData.condition as 'new' | 'used' | 'refurbished') || 'new',
    };
    addProduct(newProduct);
    onRefresh();
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Review and manage product listings</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.size > 0 && (
        <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <span className="text-sm font-medium text-orange-800">
            {selectedProducts.size} product{selectedProducts.size > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleBulkApprove}
              className="px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600"
            >
              Approve All
            </button>
            <button
              onClick={handleBulkReject}
              className="px-3 py-1.5 bg-yellow-500 text-white text-xs font-medium rounded-lg hover:bg-yellow-600"
            >
              Reject All
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600"
            >
              Delete All
            </button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No products yet</h3>
            <p className="text-gray-500 text-sm mb-4">Add your first product to get started</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {/* Select All */}
            <div className="px-4 py-2 bg-gray-50 flex items-center gap-3">
              <button onClick={toggleSelectAll} className="flex items-center gap-2 text-sm text-gray-600">
                {selectedProducts.size === filteredProducts.length ? (
                  <CheckSquare className="w-4 h-4 text-orange-500" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
                Select All
              </button>
              <span className="text-xs text-gray-400 ml-auto">{filteredProducts.length} products</span>
            </div>

            {filteredProducts.map((product) => (
              <div key={product.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <button onClick={() => toggleSelect(product.id)} className="mt-1 flex-shrink-0">
                    {selectedProducts.has(product.id) ? (
                      <CheckSquare className="w-5 h-5 text-orange-500" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-300" />
                    )}
                  </button>

                  {/* Product Image Placeholder */}
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-8 h-8 text-gray-300" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{product.title}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(product.status)}`}>
                        {product.status}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getConditionBadge(product.condition)}`}>
                        {product.condition}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">{product.description}</p>
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      <span className="text-sm font-semibold text-orange-600">₦{product.price.toLocaleString()}</span>
                      <span className="text-xs text-gray-500">
                        Seller: {product.sellerName}
                      </span>
                      <span className="text-xs text-gray-500">
                        Category: {product.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        Stock: {product.stock}
                      </span>
                      <span className="text-xs text-gray-400">
                        {format(new Date(product.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="relative flex-shrink-0 flex items-center gap-1">
                    {product.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(product.id)}
                          className="p-2 rounded-lg hover:bg-green-50 text-green-600"
                          title="Approve"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReject(product.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setViewProduct(product)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setActionMenu(actionMenu === product.id ? null : product.id)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                      {actionMenu === product.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActionMenu(null)} />
                          <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
                            {product.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(product.id)}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-green-700 hover:bg-green-50"
                                >
                                  <CheckCircle className="w-4 h-4" /> Approve
                                </button>
                                <button
                                  onClick={() => handleReject(product.id)}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-50"
                                >
                                  <XCircle className="w-4 h-4" /> Reject
                                </button>
                                <hr className="my-1 border-gray-100" />
                              </>
                            )}
                            {product.status !== 'pending' && (
                              <button
                                onClick={() => { onUpdateProduct(product.id, { status: 'pending' }); setActionMenu(null); }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-blue-700 hover:bg-blue-50"
                              >
                                <Edit2 className="w-4 h-4" /> Set Pending
                              </button>
                            )}
                            <button
                              onClick={() => { setDeleteConfirm(product.id); setActionMenu(null); }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <AddProductModal
          sellers={sellers}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddProduct}
        />
      )}

      {/* View Product Modal */}
      {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>
              <button onClick={() => setViewProduct(null)} className="p-1 rounded hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                <Package className="w-16 h-16 text-gray-300" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{viewProduct.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{viewProduct.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Price</p>
                  <p className="text-sm font-semibold text-gray-900">₦{viewProduct.price.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Stock</p>
                  <p className="text-sm font-semibold text-gray-900">{viewProduct.stock}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="text-sm font-semibold text-gray-900">{viewProduct.category}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Condition</p>
                  <p className="text-sm font-semibold text-gray-900 capitalize">{viewProduct.condition}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="text-sm font-semibold text-gray-900 capitalize">{viewProduct.status}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Seller</p>
                  <p className="text-sm font-semibold text-gray-900">{viewProduct.sellerName}</p>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                Created: {format(new Date(viewProduct.createdAt), 'MMM d, yyyy h:mm a')}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              {viewProduct.status === 'pending' && (
                <>
                  <button
                    onClick={() => { handleApprove(viewProduct.id); setViewProduct(null); }}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => { handleReject(viewProduct.id); setViewProduct(null); }}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={() => setViewProduct(null)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900">Delete Product</h3>
            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Add Product Modal
function AddProductModal({ sellers, onClose, onSave }: {
  sellers: User[];
  onClose: () => void;
  onSave: (data: Partial<Product>) => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    stock: '1',
    condition: 'new' as 'new' | 'used' | 'refurbished',
    sellerId: sellers.length > 0 ? sellers[0].id : '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.sellerId) newErrors.sellerId = 'Please select a seller';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave({
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock) || 1,
      });
    }
  };

  if (sellers.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-xl p-6 max-w-md w-full text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Sellers Yet</h3>
          <p className="text-sm text-gray-500 mb-4">
            You need to add a seller first before adding products. Go to the People page to add sellers.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600"
          >
            Got it
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Add New Product</h3>
            <p className="text-sm text-gray-500 mt-0.5">Fill in the product details</p>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Seller */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seller *</label>
            <select
              value={formData.sellerId}
              onChange={(e) => setFormData({ ...formData, sellerId: e.target.value })}
              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.sellerId ? 'border-red-300' : 'border-gray-200'
              }`}
            >
              <option value="">Select a seller</option>
              {sellers.map(seller => (
                <option key={seller.id} value={seller.id}>
                  {seller.storeName || seller.name}
                </option>
              ))}
            </select>
            {errors.sellerId && <p className="text-xs text-red-500 mt-1">{errors.sellerId}</p>}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Wireless Bluetooth Earbuds"
              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.title ? 'border-red-300' : 'border-gray-200'
              }`}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Describe the product..."
              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none ${
                errors.description ? 'border-red-300' : 'border-gray-200'
              }`}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0"
                min="0"
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.price ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="1"
                min="1"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Electronics, Books"
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.category ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value as 'new' | 'used' | 'refurbished' })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="new">New</option>
                <option value="used">Used</option>
                <option value="refurbished">Refurbished</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600"
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
}
