import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { useToast } from '../../components/ui/ToastProvider';
import styles from './inventory.module.css';

interface Product {
  _id: string;
  vendor: string | { _id: string };
  name: string;
  price: number;
  category?: string;
  image?: string;
  isAvailable: boolean;
  stock: number;
}

interface EditState {
  [productId: string]: {
    stock: number;
    price: number;
    original: { stock: number; price: number };
    loading: boolean;
  };
}

export default function VendorInventory() {
    const router = useRouter();
  const { pushToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [vendorId, setVendorId] = useState('');
  const [editState, setEditState] = useState<EditState>({});
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<'all' | 'out' | 'low' | 'high'>('all');

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
    if (vendorId) {
      loadProducts();
    }
  }, [vendorId]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.products.getAll();
      const vendorProducts = data.filter((p: Product) => {
        if (!p.vendor) return false;
        const pVendorId = typeof p.vendor === 'object' ? (p.vendor as any)._id : p.vendor;
        return pVendorId === vendorId;
      });
      setProducts(vendorProducts);
    } catch (error) {
      pushToast({ type: 'error', title: 'Load Failed', message: 'Failed to load products' });
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (stock: number): 'out' | 'low' | 'medium' | 'high' => {
    if (stock === 0) return 'out';
    if (stock <= 5) return 'low';
    if (stock <= 20) return 'medium';
    return 'high';
  };

  const getStockLabel = (stock: number): string => {
    const status = getStockStatus(stock);
    if (status === 'out') return 'Out of Stock';
    if (status === 'low') return 'Low Stock';
    if (status === 'medium') return 'Medium Stock';
    return 'High Stock';
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const status = getStockStatus(p.stock);

      let matchesFilter = true;
      if (filters === 'out') matchesFilter = status === 'out';
      else if (filters === 'low') matchesFilter = status === 'low';
      else if (filters === 'high') matchesFilter = status === 'high';

      return matchesSearch && matchesFilter;
    });
  }, [products, search, filters]);

  const initEdit = (product: Product) => {
    if (!editState[product._id]) {
      setEditState((prev) => ({
        ...prev,
        [product._id]: {
          stock: product.stock,
          price: product.price,
          original: { stock: product.stock, price: product.price },
          loading: false,
        },
      }));
    }
  };

  const handleStockChange = (productId: string, value: number) => {
    const sanitized = isNaN(value) ? 0 : Math.max(0, Math.floor(value));
    setEditState((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], stock: sanitized },
    }));
  };

  const handlePriceChange = (productId: string, value: number) => {
    const sanitized = isNaN(value) ? 0 : Math.max(0, value);
    setEditState((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], price: sanitized },
    }));
  };

  const hasChanged = (productId: string): boolean => {
    const edit = editState[productId];
    if (!edit || !edit.original) return false;
    return edit.stock !== edit.original.stock || edit.price !== edit.original.price;
  };

  const handleUpdate = async (productId: string) => {
    const edit = editState[productId];
    if (!edit || !hasChanged(productId)) return;

    const product = products.find((p) => p._id === productId);
    if (!product) return;

    setEditState((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], loading: true },
    }));

    try {
      await api.products.update(productId, {
        stock: edit.stock,
        price: edit.price,
      });

      setProducts((prev) =>
        prev.map((p) => {
          if (p._id === productId) {
            return { ...p, stock: edit.stock, price: edit.price };
          }
          return p;
        })
      );

      setEditState((prev) => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });

      pushToast({ type: 'success', title: 'Updated', message: `${product.name} inventory updated` });
    } catch (error) {
      setEditState((prev) => ({
        ...prev,
        [productId]: { ...prev[productId], loading: false },
      }));
      pushToast({ type: 'error', title: 'Update Failed', message: 'Failed to update product' });
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setFilters('all');
  };

  if (loading) {
    return <div className={styles.inventoryPage}><div className="page-state">Loading inventory…</div></div>;
  }

  return (
    <div className={styles.inventoryPage}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Inventory Management</h1>
          <p className={styles.pageSubtitle}>Update stock and pricing for your products</p>
        </div>
      </div>

      <div className={styles.searchFilterBar}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search by product name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filterButtons}>
          <button
            className={`${styles.filterBtn} ${filters === 'all' ? styles.active : ''}`}
            onClick={() => setFilters('all')}
          >
            All
          </button>
          <button
            className={`${styles.filterBtn} ${filters === 'out' ? styles.active : ''}`}
            onClick={() => setFilters('out')}
          >
            Out of Stock
          </button>
          <button
            className={`${styles.filterBtn} ${filters === 'low' ? styles.active : ''}`}
            onClick={() => setFilters('low')}
          >
            Low Stock
          </button>
          <button
            className={`${styles.filterBtn} ${filters === 'high' ? styles.active : ''}`}
            onClick={() => setFilters('high')}
          >
            High Stock
          </button>
        </div>
        {(search || filters !== 'all') && (
          <button className={styles.clearBtn} onClick={handleClearFilters}>
            Clear Filters
          </button>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="page-state">
          {products.length === 0 ? 'No products in your inventory.' : 'No products match your filters.'}
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.inventoryTable}>
            <thead>
              <tr>
                <th>Product Image</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Stock Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                initEdit(product);
                const edit = editState[product._id];
                const isEditing = !!edit;
                const changed = isEditing && hasChanged(product._id);

                return (
                  <tr key={product._id}>
                    <td className={styles.imageCell}>
                      {product.image ? (
                        <img src={product.image} alt={product.name} className={styles.productImage} />
                      ) : (
                        <div className={styles.imagePlaceholder}>–</div>
                      )}
                    </td>
                    <td className={styles.nameCell}>{product.name}</td>
                    <td className={styles.categoryCell}>{product.category || '–'}</td>
                    <td className={styles.stockCell}>
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          value={edit.stock || 0}
                          onChange={(e) => handleStockChange(product._id, parseInt(e.target.value, 10) || 0)}
                          className={styles.numberInput}
                          disabled={edit.loading}
                        />
                      ) : (
                        product.stock
                      )}
                    </td>
                    <td className={styles.priceCell}>
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={edit.price || 0}
                          onChange={(e) => handlePriceChange(product._id, parseFloat(e.target.value) || 0)}
                          className={styles.numberInput}
                          disabled={edit.loading}
                        />
                      ) : (
                        `₹${product.price.toFixed(2)}`
                      )}
                    </td>
                    <td className={styles.statusCell}>
                      <span className={`${styles.statusBadge} ${styles[getStockStatus(isEditing ? edit.stock : product.stock)]}`}>
                        {getStockLabel(isEditing ? edit.stock : product.stock)}
                      </span>
                    </td>
                    <td className={styles.actionCell}>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {isEditing ? (
                          <button
                            className={styles.updateBtn}
                            onClick={() => handleUpdate(product._id)}
                            disabled={!changed || edit.loading}
                          >
                            {edit.loading ? 'Updating…' : 'Update'}
                          </button>
                        ) : (
                          <>
                            <button className={styles.editBtn} onClick={() => initEdit(product)}>
                              Edit
                            </button>
                            <button
                              className={styles.viewSalesBtn}
                              onClick={() => router.push(`/vendor/product-sales?productId=${product._id}`)}
                              title="View Sales Analytics"
                            >
                              View Sales
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
