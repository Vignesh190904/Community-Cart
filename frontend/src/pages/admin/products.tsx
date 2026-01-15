import { useState, useEffect, useMemo } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../components/ui/ToastProvider';

interface Product {
  _id: string;
  vendor: string | { _id: string; storeName: string; email?: string };
  name: string;
  description?: string;
  price: number;
  category?: string;
  image?: string;
  isAvailable: boolean;
  stock: number;
  createdAt?: string;
}

interface Vendor {
  _id: string;
  storeName: string;
  email?: string;
}

type StockStatus = 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';

export default function AdminInventory() {
  const { pushToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Filters
  const [vendorSearch, setVendorSearch] = useState<string>('');
  const [productSearch, setProductSearch] = useState<string>('');
  const [stockStatus, setStockStatus] = useState<StockStatus>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lastUpdated, setLastUpdated] = useState<string>('any');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, vendorsData] = await Promise.all([
        api.products.getAll(),
        api.vendors.getAll(),
      ]);
      setProducts(productsData);
      setVendors(vendorsData);
    } catch (error) {
      console.error('Error loading data:', error);
      pushToast({ type: 'error', title: 'Load Failed', message: 'Failed to load inventory data' });
    } finally {
      setLoading(false);
    }
  };

  const getVendorName = (vendor: string | { _id: string; storeName: string; email?: string }): string => {
    if (typeof vendor === 'string') {
      const vendorObj = vendors.find((v) => v._id === vendor);
      return vendorObj?.storeName || 'Unknown Vendor';
    }
    return vendor.storeName || 'Unknown Vendor';
  };

  const getVendorEmail = (vendor: string | { _id: string; storeName: string; email?: string }): string => {
    if (typeof vendor === 'string') {
      const vendorObj = vendors.find((v) => v._id === vendor);
      return vendorObj?.email || '';
    }
    return vendor.email || '';
  };

  const getVendorId = (vendor: string | { _id: string; storeName: string; email?: string }): string => {
    if (typeof vendor === 'string') {
      return vendor;
    }
    return vendor._id;
  };

  // Debounced vendor search
  const [debouncedVendorSearch, setDebouncedVendorSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedVendorSearch(vendorSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [vendorSearch]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats).sort();
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Vendor search
    if (debouncedVendorSearch.trim()) {
      const search = debouncedVendorSearch.toLowerCase();
      filtered = filtered.filter(product => {
        const vendorName = getVendorName(product.vendor).toLowerCase();
        const vendorEmail = getVendorEmail(product.vendor).toLowerCase();
        return vendorName.includes(search) || vendorEmail.includes(search);
      });
    }

    // Product search
    if (productSearch.trim()) {
      const search = productSearch.toLowerCase();
      filtered = filtered.filter(product => {
        return product.name.toLowerCase().includes(search);
      });
    }

    // Stock status filter
    if (stockStatus !== 'all') {
      filtered = filtered.filter(product => {
        if (stockStatus === 'in-stock') return product.stock > 0;
        if (stockStatus === 'low-stock') return product.stock > 0 && product.stock <= 10;
        if (stockStatus === 'out-of-stock') return product.stock === 0;
        return true;
      });
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Last updated filter
    if (lastUpdated !== 'any') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      filtered = filtered.filter(product => {
        if (!product.createdAt) return false;
        const productDate = new Date(product.createdAt);
        if (lastUpdated === 'today') return productDate >= today;
        if (lastUpdated === 'week') return productDate >= last7Days;
        if (lastUpdated === 'month') return productDate >= last30Days;
        return true;
      });
    }

    // Price range filter
    const min = minPrice ? parseFloat(minPrice) : null;
    const max = maxPrice ? parseFloat(maxPrice) : null;
    if (min !== null || max !== null) {
      filtered = filtered.filter(product => {
        if (min !== null && product.price < min) return false;
        if (max !== null && product.price > max) return false;
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
  }, [products, debouncedVendorSearch, productSearch, stockStatus, selectedCategory, lastUpdated, minPrice, maxPrice, availabilityFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: filteredProducts.length,
      available: filteredProducts.filter(p => p.isAvailable).length,
      outOfStock: filteredProducts.filter(p => p.stock === 0).length,
      lowStock: filteredProducts.filter(p => p.stock > 0 && p.stock <= 10).length,
    };
  }, [filteredProducts]);

  return (
    <>
      <div className="inventory-header">
        <h1 className="inventory-title">Product Inventory</h1>
        <p className="inventory-subtitle">Manage product inventory across all vendors</p>
      </div>

      {loading ? (
        <div className="inventory-loading">Loading inventory...</div>
      ) : (
        <>
          {/* FILTERS SECTION - 2 ROWS */}
          <div className="inventory-filters">
            {/* ROW 1: Vendor Search + Product Search + Stock Tabs */}
            <div className="filters-row-1">
              <div className="vendor-search-wrapper">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by vendor name or email..."
                  value={vendorSearch}
                  onChange={(e) => setVendorSearch(e.target.value)}
                />
              </div>

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

            {/* ROW 2: Category + Last Updated + Price Range + Availability + Clear */}
            <div className="filters-row-2">
              <div className="category-filter">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="last-updated-filter">
                <select
                  value={lastUpdated}
                  onChange={(e) => setLastUpdated(e.target.value)}
                  className="filter-select"
                >
                  <option value="any">Any time</option>
                  <option value="today">Updated today</option>
                  <option value="week">Updated in last 7 days</option>
                  <option value="month">Updated in last 30 days</option>
                </select>
              </div>

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
                  setVendorSearch('');
                  setProductSearch('');
                  setStockStatus('all');
                  setSelectedCategory('all');
                  setLastUpdated('any');
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
          <div className="inventory-stats">
            <div className="stat-card">
              <span className="stat-label">Total Products</span>
              <span className="stat-value">{stats.total}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Available</span>
              <span className="stat-value">{stats.available}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Out of Stock</span>
              <span className="stat-value">{stats.outOfStock}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Low Stock</span>
              <span className="stat-value">{stats.lowStock}</span>
            </div>
          </div>

          {/* PRODUCT TABLE */}
          <section className="inventory-section">
            <div className="inventory-table-wrap">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Vendor</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
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
                      <td>{getVendorName(product.vendor)}</td>
                      <td>{product.category || '—'}</td>
                      <td>₹{product.price.toFixed(2)}</td>
                      <td>
                        <span
                          className={`stock-badge ${
                            product.stock === 0 ? 'out' : product.stock <= 10 ? 'low' : 'good'
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
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="empty-state">
                        No products match the selected filters.
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
