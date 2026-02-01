import { useState, useEffect, useMemo } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../components/ui/ToastProvider';
import { useAuth } from '../../context/AuthContext';

interface Product {
  _id: string;
  vendor: string | { _id: string };
  name: string;
  description?: string;
  price: number;
  mrp?: number;
  category?: string;
  quantity: number;
  unit: 'g' | 'kg' | 'ml' | 'l' | 'pcs' | '';
  threshold?: number;
  image?: string;
  isAvailable: boolean;
  stock: number;
  createdAt?: string;
}

const emptyProduct: Partial<Product> = {
  name: '',
  description: '',
  price: 0,
  mrp: 0,
  category: '',
  quantity: 0,
  unit: '',
  threshold: 0,
  image: '',
  isAvailable: true,
  stock: 0,
};

type StockStatus = 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';

export default function VendorProducts() {
  const { pushToast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>(emptyProduct);
  const [vendorCategory, setVendorCategory] = useState<string>('');

  // Filter states
  const [productSearch, setProductSearch] = useState<string>('');
  const [debouncedProductSearch, setDebouncedProductSearch] = useState<string>('');
  const [stockStatus, setStockStatus] = useState<StockStatus>('all');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [isUnitDropdownOpen, setIsUnitDropdownOpen] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Product, string>>>({});

  const unitOptions = [
    { value: 'pcs', label: 'Piece' },
    { value: 'g', label: 'Gram' },
    { value: 'kg', label: 'Kilogram' },
    { value: 'ml', label: 'Millilitre' },
    { value: 'l', label: 'Litre' }
  ];


  // Debounce product search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedProductSearch(productSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [productSearch]);

  useEffect(() => {
    // Wait for auth to finish loading before fetching data
    if (!authLoading && user?.id) {
      loadVendorMeta();
      loadProducts();
    }
  }, [user, authLoading]);



  const loadVendorMeta = async () => {
    if (!user?.id) return;
    try {
      const vendor = await api.vendors.getById(user.id);
      setVendorCategory(vendor?.vendorType || vendor?.storeName || '');
    } catch (error) {
      console.error('Error loading vendor details:', error);
    }
  };

  const loadProducts = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await api.products.getAll();
      // Filter products for current vendor
      const vendorProducts = data.filter((p: Product) => {
        if (!p.vendor) return false;
        // p.vendor can be either a string (ID) or an object (populated)
        const pVendorId = typeof p.vendor === 'object' ? (p.vendor as any)._id : p.vendor;
        return String(pVendorId) === String(user.id);
      });
      /*console.log('Vendor Products Debug:', {
        totalFetched: data.length,
        filtered: vendorProducts.length,
        myVendorId: user.id
      });*/
      setProducts(vendorProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      pushToast({ type: 'error', message: 'Load Failed: Failed to load products' });
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search and filters
  const filteredProducts: Product[] = (() => {
    let filtered = [...products];

    // Product search
    if (debouncedProductSearch.trim()) {
      const search = debouncedProductSearch.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(search));
    }

    // Stock status filter
    if (stockStatus !== 'all') {
      filtered = filtered.filter(p => {
        if (stockStatus === 'in-stock') return p.stock > 10;
        if (stockStatus === 'low-stock') return p.stock > 0 && p.stock <= 10;
        if (stockStatus === 'out-of-stock') return p.stock === 0;
        return true;
      });
    }

    // Price range filter
    const min = minPrice ? parseFloat(minPrice) : null;
    const max = maxPrice ? parseFloat(maxPrice) : null;
    if (min !== null || max !== null) {
      filtered = filtered.filter(p => {
        if (min !== null && p.price < min) return false;
        if (max !== null && p.price > max) return false;
        return true;
      });
    }

    // Availability filter
    if (availabilityFilter === 'active') {
      filtered = filtered.filter(p => p.isAvailable);
    } else if (availabilityFilter === 'disabled') {
      filtered = filtered.filter(p => !p.isAvailable);
    }

    return filtered;
  })();

  const handleCreate = () => {
    setMode('create');
    setFormData({ ...emptyProduct, vendor: user?.id, category: vendorCategory });
    setEditingId(null);
  };

  const handleEdit = async (id: string) => {
    try {
      const product = await api.products.getById(id);
      setFormData(product);
      setEditingId(id);
      setMode('edit');
    } catch (error) {
      console.error('Error loading product:', error);
      pushToast({ type: 'error', message: 'Load Failed: Failed to load product details' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.products.delete(id);
      pushToast({ type: 'success', message: 'Product deleted successfully' });
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      pushToast({ type: 'error', message: 'Delete Failed: Failed to delete product' });
    }
  };

  const handleToggleAvailability = async (product: Product) => {
    try {
      await api.products.update(product._id, {
        ...product,
        isAvailable: !product.isAvailable,
      });
      loadProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      pushToast({ type: 'error', message: 'Update Failed: Failed to update product availability' });
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof Product, string>> = {};
    let isValid = true;

    if (!formData.name?.trim()) {
      newErrors.name = 'Product name is required';
      isValid = false;
    }
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Quantity is required';
      isValid = false;
    }
    if (!formData.unit) {
      newErrors.unit = 'Unit is required';
      isValid = false;
    }
    if (!formData.price || formData.price < 0) {
      newErrors.price = 'Valid price is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      pushToast({ type: 'error', message: 'Please fill in all required fields' });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        vendor: user?.id,
        category: vendorCategory || formData.category,
      };
      if (mode === 'create') {
        await api.products.create(payload);
        pushToast({ type: 'success', message: 'Product created successfully' });
      } else {
        await api.products.update(editingId!, payload);
        pushToast({ type: 'success', message: 'Product updated successfully' });
      }
      setMode('list');
      loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      pushToast({ type: 'error', message: 'Save Failed: Failed to save product' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setMode('list');
    setFormData(emptyProduct);
    setEditingId(null);
    setErrors({});
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field as keyof Product]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageFile = (file: File | null) => {
    if (!file) {
      updateField('image', '');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updateField('image', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  if (authLoading) {
    return <div className="products-loading">Loading authentication...</div>;
  }

  if (mode === 'list') {
    return (
      <>
        <div className="products-header">
          <h1 className="products-title">Products</h1>
          <button className="btn-primary" onClick={handleCreate}>
            Add New Product
          </button>
        </div>

        {loading ? (
          <div className="products-loading">Loading products...</div>
        ) : (
          <>
            {/* FILTERS SECTION */}
            <div className="products-filters">
              {/* ROW 1: Product Search + Stock Status Tabs */}
              <div className="filters-row-1">
                <div className="product-search-wrapper">
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search by product name..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                </div>

                <div className="stock-status-tabs">
                  <button
                    className={`status-tab ${stockStatus === 'all' ? 'active' : ''}`}
                    onClick={() => setStockStatus('all')}
                  >
                    All
                  </button>
                  <button
                    className={`status-tab ${stockStatus === 'in-stock' ? 'active' : ''}`}
                    onClick={() => setStockStatus('in-stock')}
                  >
                    In Stock
                  </button>
                  <button
                    className={`status-tab ${stockStatus === 'low-stock' ? 'active' : ''}`}
                    onClick={() => setStockStatus('low-stock')}
                  >
                    Low Stock
                  </button>
                  <button
                    className={`status-tab ${stockStatus === 'out-of-stock' ? 'active' : ''}`}
                    onClick={() => setStockStatus('out-of-stock')}
                  >
                    Out of Stock
                  </button>
                </div>
              </div>

              {/* ROW 2: Price Range + Availability + Clear */}
              <div className="filters-row-2">
                <div className="price-range-wrapper">
                  <input
                    type="number"
                    className="price-input"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    min="0"
                  />
                  <input
                    type="number"
                    className="price-input"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    min="0"
                  />
                </div>

                <div className="availability-toggle">
                  <button
                    className={`availability-pill ${availabilityFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setAvailabilityFilter('all')}
                  >
                    All
                  </button>
                  <button
                    className={`availability-pill ${availabilityFilter === 'active' ? 'active' : ''}`}
                    onClick={() => setAvailabilityFilter('active')}
                  >
                    Active
                  </button>
                  <button
                    className={`availability-pill ${availabilityFilter === 'disabled' ? 'active' : ''}`}
                    onClick={() => setAvailabilityFilter('disabled')}
                  >
                    Disabled
                  </button>
                </div>

                <button
                  type="button"
                  className="clear-filters-btn"
                  onClick={() => {
                    setProductSearch('');
                    setStockStatus('all');
                    setMinPrice('');
                    setMaxPrice('');
                    setAvailabilityFilter('all');
                  }}
                >
                  Clear
                </button>
              </div>
            </div>

            {/* STATS CARDS */}
            <div className="products-stats">
              <div className="stat-card">
                <div className="stat-label">Total Products</div>
                <div className="stat-value">{filteredProducts.length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Available</div>
                <div className="stat-value">{filteredProducts.filter((p) => p.isAvailable).length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Out of Stock</div>
                <div className="stat-value">{filteredProducts.filter((p) => p.stock === 0).length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Low Stock</div>
                <div className="stat-value">{filteredProducts.filter((p) => p.stock > 0 && p.stock < 10).length}</div>
              </div>
            </div>

            <section className="products-section">
              <h2 className="section-title">Product List</h2>
              <div className="products-table-wrap">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product._id}>
                        <td>
                          <div className="product-name-cell">
                            {product.image && (
                              <img src={product.image} alt={product.name} className="product-thumb" />
                            )}
                            <div>
                              <div className="product-name">{product.name}</div>
                              {product.description && (
                                <div className="product-desc">{product.description.substring(0, 50)}...</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>{vendorCategory || product.category || '—'}</td>
                        <td>
                          ₹{product.price.toFixed(2)}
                          <span style={{ fontSize: '0.8em', color: '#666', marginLeft: '4px' }}>
                            / {product.quantity} {product.unit}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`stock-badge ${product.stock === 0 ? 'out' : product.stock < 10 ? 'low' : 'good'
                              }`}
                          >
                            {product.stock}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${product.isAvailable ? 'active' : 'inactive'}`}>
                            {product.isAvailable ? 'Available' : 'Disabled'}
                          </span>
                        </td>
                        <td>
                          <div className="action-btns">
                            <button className="btn-edit" onClick={() => handleEdit(product._id)}>
                              Edit
                            </button>
                            <button
                              className={`btn-toggle ${product.isAvailable ? 'disable' : 'enable'}`}
                              onClick={() => handleToggleAvailability(product)}
                            >
                              {product.isAvailable ? 'Disable' : 'Enable'}
                            </button>
                            <button className="btn-delete" onClick={() => handleDelete(product._id)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td colSpan={6} className="empty-state">
                          No products found. Add your first product to get started!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </>
    );
  }


  return (
    <>
      <div className="products-header">
        <h1 className="products-title">{mode === 'create' ? 'Add New Product' : 'Edit Product'}</h1>
        <button className="btn-secondary" onClick={handleCancel}>
          Back to List
        </button>
      </div>

      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3 className="form-section-title">Product Information</h3>
          <div className="form-grid">
            <div className="form-field">
              <label>Product Name *</label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => updateField('name', e.target.value)}
                className={errors.name ? 'error-input' : ''}
              />
              {errors.name && <span className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.name}</span>}
            </div>
            <div className="form-field">
              <label>Quantity *</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
                  <input
                    type="number"
                    required
                    min="0"
                    style={{ width: '100%' }}
                    placeholder="Value (e.g. 500)"
                    value={formData.quantity || ''}
                    onChange={(e) => updateField('quantity', Number(e.target.value))}
                    className={errors.quantity ? 'error-input' : ''}
                  />
                  {errors.quantity && <span className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.quantity}</span>}
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div
                    className="custom-dropdown-container"
                    style={{ position: 'relative' }}
                    ref={(node) => {
                      // Simple click outside handler logic could be added here or via useEffect if needed
                      // For now, relies on explicit toggling 
                    }}
                  >
                    <div
                      className={`custom-dropdown-trigger ${isUnitDropdownOpen ? 'open' : ''} ${errors.unit ? 'error-border' : ''}`}
                      onClick={() => setIsUnitDropdownOpen(!isUnitDropdownOpen)}
                      style={{
                        padding: '12px',
                        border: errors.unit ? '1px solid red' : '1px solid var(--border)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#fff'
                      }}
                    >
                      <span style={{ color: formData.unit ? 'inherit' : '#999' }}>
                        {formData.unit ? unitOptions.find(o => o.value === formData.unit)?.label : 'Select Unit'}
                      </span>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          transform: isUnitDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s ease'
                        }}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>

                    {isUnitDropdownOpen && (
                      <div
                        className="custom-dropdown-options"
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          marginTop: '4px',
                          backgroundColor: '#fff',
                          border: '1px solid var(--border)',
                          borderRadius: '6px',
                          zIndex: 10,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          maxHeight: '200px',
                          overflowY: 'auto'
                        }}
                      >
                        {unitOptions.map((option) => (
                          <div
                            key={option.value}
                            onClick={() => {
                              updateField('unit', option.value);
                              setIsUnitDropdownOpen(false);
                            }}
                            style={{
                              padding: '10px 12px',
                              cursor: 'pointer',
                              backgroundColor: formData.unit === option.value ? '#f5f5f5' : 'transparent',
                              color: formData.unit === option.value ? 'var(--primary-color)' : 'inherit',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = formData.unit === option.value ? '#f5f5f5' : 'transparent'}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.unit && <span className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.unit}</span>}
                </div>
              </div>
            </div>
            <div className="form-field">
              <label>Price (₹) *</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price || ''}
                onChange={(e) => updateField('price', Number(e.target.value))}
                className={errors.price ? 'error-input' : ''}
              />
              {errors.price && <span className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.price}</span>}
            </div>
            <div className="form-field">
              <label>MRP (₹)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.mrp || ''}
                onChange={(e) => updateField('mrp', Number(e.target.value))}
              />
            </div>
            <div className="form-field">
              <label>Stock Quantity *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock || ''}
                onChange={(e) => updateField('stock', Number(e.target.value))}
              />
            </div>
            <div className="form-field">
              <label>Threshold</label>
              <input
                type="number"
                min="0"
                value={formData.threshold || ''}
                onChange={(e) => updateField('threshold', Number(e.target.value))}
              />
            </div>
            <div className="form-field">
              <label>Category (from vendor)</label>
              <input type="text" value={vendorCategory || 'Not set'} disabled />
            </div>
            <div className="form-field form-field-full">
              <label>Description</label>
              <textarea
                rows={3}
                value={formData.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
              />
            </div>
            <div className="form-field form-field-full">
              <label>Product Image (optional)</label>
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={(e) => handleImageFile(e.target.files?.[0] || null)}
              />
              {formData.image && (
                <div className="image-preview">
                  <img src={formData.image} alt="Preview" />
                </div>
              )}
            </div>
            <div className="form-field form-field-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={formData.isAvailable || false}
                  onChange={(e) => updateField('isAvailable', e.target.checked)}
                />
                Available for Sale
              </label>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : mode === 'create' ? 'Add Product' : 'Update Product'}
          </button>
        </div>
      </form>
    </>
  );
}
