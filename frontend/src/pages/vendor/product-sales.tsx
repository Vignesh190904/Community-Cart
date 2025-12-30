import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { useToast } from '../../components/ui/ToastProvider';
// Styles provided by global import in _app.tsx: ./vendor/product-sales.css

interface ProductSale {
  _id: string;
  name: string;
  category: string;
  unitsSold: number;
  revenue: number;
  avgSellingPrice: number;
  ordersCount: number;
  currentStock: number;
  stockStatus: 'in' | 'low' | 'out';
}

interface KPIs {
  totalUnitsSold: number;
  totalRevenue: number;
  bestSellingProduct: string;
  zeroSalesProducts: number;
  cancellationRate: number;
}

export default function ProductSalesPage() {
  const router = useRouter();
  const { productId: productIdQuery } = router.query as { productId?: string };
  const { pushToast } = useToast();
  const [vendorId, setVendorId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [search, setSearch] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');
  const [category, setCategory] = useState('');
  const [stockStatus, setStockStatus] = useState('');
  const [minUnitsSold, setMinUnitsSold] = useState('');
  const [minRevenue, setMinRevenue] = useState('');
  const [zeroSalesOnly, setZeroSalesOnly] = useState(false);
  
  const [products, setProducts] = useState<ProductSale[]>([]);
  const [kpis, setKPIs] = useState<KPIs>({
    totalUnitsSold: 0,
    totalRevenue: 0,
    bestSellingProduct: '—',
    zeroSalesProducts: 0,
    cancellationRate: 0,
  });
  
  const [sortBy, setSortBy] = useState('revenue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const ALL_LIMIT = 1000000; // fetch all records in one page

  const formatDateInput = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [isTodayQuick, setIsTodayQuick] = useState(false);
  const [lastCustomStart, setLastCustomStart] = useState('');
  const [lastCustomEnd, setLastCustomEnd] = useState('');

  const handleTodayClick = () => {
    const todayStr = formatDateInput(new Date());
    if (!isTodayQuick) {
      setLastCustomStart(startDate);
      setLastCustomEnd(endDate);
      setStartDate(todayStr);
      setEndDate(todayStr);
      setIsTodayQuick(true);
    } else {
      setStartDate(lastCustomStart);
      setEndDate(lastCustomEnd);
      setIsTodayQuick(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('cc_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          setVendorId(parsed.id);
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounced(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (vendorId) {
      loadData();
    }
  }, [vendorId, startDate, endDate, searchDebounced, category, stockStatus, minUnitsSold, minRevenue, zeroSalesOnly, sortBy, sortOrder, productIdQuery]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        search: searchDebounced || undefined,
        category: category || undefined,
        stockStatus: stockStatus || undefined,
        minUnitsSold: minUnitsSold ? Number(minUnitsSold) : undefined,
        minRevenue: minRevenue ? Number(minRevenue) : undefined,
        zeroSalesOnly: zeroSalesOnly || undefined,
        page: 1,
        limit: ALL_LIMIT,
        sortBy,
        sortOrder,
        productId: productIdQuery || undefined,
      };

      const [analyticsData, kpisData] = await Promise.all([
        api.productSales.getAnalytics(vendorId, filters),
        api.productSales.getKPIs(vendorId, { startDate, endDate }),
      ]);

      setProducts(analyticsData.products || []);
      setKPIs(kpisData);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
      pushToast({ type: 'error', title: 'Load Failed', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return '⇅';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => p.category && cats.add(p.category));
    return Array.from(cats).sort();
  }, [products]);

  if (error) {
    return (
      <div className="ps-page">
        <div className="ps-error-state">
          <h3>Error Loading Data</h3>
          <p>{error}</p>
          <button className="ps-retry-button" onClick={loadData}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ps-page">
      <div className="ps-header">
        <h1 className="ps-title">Product Sales Analytics</h1>
      </div>

      {/* Move toolbar above KPI grid */}
      <div className="ps-toolbar">
        <div className="ps-toolbar-row-1">
          <div className="ps-search">
            <input type="text" className="ps-search-input" placeholder="Search by product name ..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div
            className={`ps-toggle-card ${isTodayQuick ? 'active' : ''}`} 
            role="button" 
            aria-pressed={isTodayQuick}
            onClick={handleTodayClick}
          >
            Today
          </div> 
          <div
            className={`ps-toggle-card ${zeroSalesOnly ? 'active' : ''}`}
            role="button"
            aria-pressed={zeroSalesOnly}
            onClick={() => setZeroSalesOnly(!zeroSalesOnly)}
          >
            Zero-sales only
          </div>
        </div>
        <div className="ps-toolbar-row-2">
          <div className="ps-filter">
            <label className="ps-filter-label">Custom range</label>
            <div className="ps-date">
              <label>From:</label>
              <input type="date" className="ps-input-date" value={startDate} onChange={(e) => { const v = e.target.value; setStartDate(v); const todayStr = formatDateInput(new Date()); setIsTodayQuick(v === todayStr && endDate === todayStr); }} />
              <label>To:</label>
              <input type="date" className="ps-input-date" value={endDate} onChange={(e) => { const v = e.target.value; setEndDate(v); const todayStr = formatDateInput(new Date()); setIsTodayQuick(startDate === todayStr && v === todayStr); }} />
            </div>
          </div>
          <div className="ps-filter">
            <label className="ps-filter-label">Stock Status</label>
            <select className="ps-filter-select" value={stockStatus} onChange={(e) => setStockStatus(e.target.value)}>
              <option value="">All</option>
              <option value="in">In Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>
          <div className="ps-filter">
            <label className="ps-filter-label">Min Units Sold</label>
            <input type="number" className="ps-filter-input" value={minUnitsSold} onChange={(e) => setMinUnitsSold(e.target.value)} min="0" />
          </div>
          <div className="ps-filter">
            <label className="ps-filter-label">Min Revenue (₹)</label>
            <input type="number" className="ps-filter-input" value={minRevenue} onChange={(e) => setMinRevenue(e.target.value)} min="0" />
          </div>
        </div>
      </div>

      {loading && !products.length ? (
        <div className="ps-kpi-grid">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="ps-kpi-card ps-skeleton ps-skeleton-kpi" />
          ))}
        </div>
      ) : (
        <div className="ps-kpi-grid">
          <div className="ps-kpi-card">
            <div className="ps-kpi-label">Total Units Sold</div>
            <div className="ps-kpi-value">{kpis.totalUnitsSold.toLocaleString()}</div>
            <div className="ps-kpi-subtext">Across all products</div>
          </div>
          <div className="ps-kpi-card">
            <div className="ps-kpi-label">Total Revenue</div>
            <div className="ps-kpi-value">₹{kpis.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <div className="ps-kpi-subtext">From completed orders</div>
          </div>
          <div className="ps-kpi-card">
            <div className="ps-kpi-label">Best Selling Product</div>
            <div className="ps-kpi-value">{kpis.bestSellingProduct}</div>
            <div className="ps-kpi-subtext">By units sold</div>
          </div>
          <div className="ps-kpi-card">
            <div className="ps-kpi-label">Zero-Sales Products</div>
            <div className="ps-kpi-value">{kpis.zeroSalesProducts}</div>
            <div className="ps-kpi-subtext">No sales in period</div>
          </div>
          <div className="ps-kpi-card">
            <div className="ps-kpi-label">Cancellation Rate</div>
            <div className="ps-kpi-value">{kpis.cancellationRate.toFixed(1)}%</div>
            <div className="ps-kpi-subtext">Orders cancelled</div>
          </div>
        </div>
      )}

      

      <div>
        {loading ? (
          <div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="ps-skeleton ps-skeleton-row" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="ps-empty-state">
            <h3>No Sales Data</h3>
            <p>No products match your filters or no sales have been recorded yet.</p>
          </div>
        ) : (
          <>
            <table className="ps-table">
              <thead className="ps-table-head">
                <tr>
                  <th onClick={() => handleSort('name')}>
                    Product Name <span className="ps-sort-icon">{getSortIcon('name')}</span>
                  </th>
                  <th onClick={() => handleSort('category')}>
                    Category <span className="ps-sort-icon">{getSortIcon('category')}</span>
                  </th>
                  <th className="num" onClick={() => handleSort('unitsSold')}>
                    Units Sold <span className="ps-sort-icon">{getSortIcon('unitsSold')}</span>
                  </th>
                  <th className="num" onClick={() => handleSort('revenue')}>
                    Revenue <span className="ps-sort-icon">{getSortIcon('revenue')}</span>
                  </th>
                  <th className="num" onClick={() => handleSort('avgSellingPrice')}>
                    Avg Price <span className="ps-sort-icon">{getSortIcon('avgSellingPrice')}</span>
                  </th>
                  <th className="num" onClick={() => handleSort('ordersCount')}>
                    Orders <span className="ps-sort-icon">{getSortIcon('ordersCount')}</span>
                  </th>
                  <th className="num" onClick={() => handleSort('currentStock')}>
                    Stock <span className="ps-sort-icon">{getSortIcon('currentStock')}</span>
                  </th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className="ps-product-name">{product.name}</td>
                    <td>{product.category || '—'}</td>
                    <td className="num">{product.unitsSold.toLocaleString()}</td>
                    <td className="num">₹{product.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="num">₹{product.avgSellingPrice.toFixed(2)}</td>
                    <td className="num">{product.ordersCount}</td>
                    <td className="num">{product.currentStock}</td>
                    <td>
                      <span className={`ps-status-badge ${product.stockStatus}`}>
                        {product.stockStatus === 'in' ? 'In Stock' : product.stockStatus === 'low' ? 'Low Stock' : 'Out'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination removed: show all records in a single page */}
          </>
        )}
      </div>
    </div>
  );
}
