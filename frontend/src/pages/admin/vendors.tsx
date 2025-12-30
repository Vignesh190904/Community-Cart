import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { useToast } from '../../components/ui/ToastProvider';

interface Vendor {
  _id: string;
  storeName: string;
  ownerName: string;
  vendorType: string;
  password?: string;
  contact: {
    phone: string;
    alternatePhone?: string;
    email: string;
    whatsapp?: string;
  };
  personal: {
    gender?: string;
    age?: number;
    dob?: string;
  };
  address: {
    line1: string;
    line2?: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
    geo?: {
      lat?: number;
      lng?: number;
    };
  };
  business: {
    gstNumber?: string;
    panNumber?: string;
    licenseNumber?: string;
    establishmentYear?: number;
  };
  store: {
    openingTime?: string;
    closingTime?: string;
    workingDays?: string[];
    deliveryRadiusKm?: number;
    supportsCOD?: boolean;
    supportsOnlinePayment?: boolean;
  };
  media?: {
    logoUrl?: string;
    bannerUrl?: string;
    images?: string[];
  };
  isActive: boolean;
  isVerified?: boolean;
  isBlocked?: boolean;
  tags?: string[];
  notes?: string;
  createdAt?: string;
}

const emptyVendor: Partial<Vendor> = {
  storeName: '',
  ownerName: '',
  vendorType: '',
  password: '',
  contact: {
    phone: '',
    alternatePhone: '',
    email: '',
    whatsapp: '',
  },
  personal: {
    gender: '',
    age: undefined,
    dob: '',
  },
  address: {
    line1: '',
    line2: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    geo: { lat: undefined, lng: undefined },
  },
  business: {
    gstNumber: '',
    panNumber: '',
    licenseNumber: '',
    establishmentYear: undefined,
  },
  store: {
    openingTime: '',
    closingTime: '',
    workingDays: [],
    deliveryRadiusKm: undefined,
    supportsCOD: true,
    supportsOnlinePayment: false,
  },
  media: {
    logoUrl: '',
    bannerUrl: '',
    images: [],
  },
  isActive: true,
  isVerified: false,
  isBlocked: false,
  tags: [],
  notes: '',
};

export default function VendorsManagement() {
  const { pushToast } = useToast();
  const router = useRouter();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  // Products for vendor-level filters
  interface Product { _id: string; vendor: string | { _id: string }; stock: number; }
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Vendor>>(emptyVendor);

  // Filters (List mode)
  const [vendorSearch, setVendorSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'active' | 'disabled'>('active');
  const [hasProductsFilter, setHasProductsFilter] = useState<'all' | 'has' | 'none'>('all');
  const [inventoryHealthFilter, setInventoryHealthFilter] = useState<'all' | 'low' | 'out'>('all');
  const [debouncedVendorSearch, setDebouncedVendorSearch] = useState<string>('');

  useEffect(() => {
    loadVendors();
    loadProducts();
  }, []);

  const loadVendors = async () => {
    try {
      setLoading(true);
      const data = await api.vendors.getAll();
      setVendors(data);
    } catch (error) {
      console.error('Error loading vendors:', error);
      pushToast({ type: 'error', title: 'Load Failed', message: 'Failed to load vendors' });
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await api.products.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  // Debounce vendor search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedVendorSearch(vendorSearch.trim()), 300);
    return () => clearTimeout(timer);
  }, [vendorSearch]);

  const getVendorIdFromProduct = (v: string | { _id: string }) => (typeof v === 'string' ? v : v._id);

  // Build vendor -> products map
  const vendorProductMap = useMemo(() => {
    const map = new Map<string, Product[]>();
    products.forEach((p) => {
      const vid = getVendorIdFromProduct(p.vendor);
      if (!map.has(vid)) map.set(vid, []);
      map.get(vid)!.push(p);
    });
    return map;
  }, [products]);

  // Filter vendors for list view
  const filteredVendors = useMemo(() => {
    let list = [...vendors];

    // Vendor search (storeName or email)
    if (debouncedVendorSearch) {
      const q = debouncedVendorSearch.toLowerCase();
      list = list.filter((v) => {
        const name = v.storeName?.toLowerCase() || '';
        const email = v.contact?.email?.toLowerCase() || '';
        return name.includes(q) || email.includes(q);
      });
    }

    // Status
    list = list.filter((v) => (statusFilter === 'active' ? v.isActive : !v.isActive));

    // Has products
    if (hasProductsFilter !== 'all') {
      list = list.filter((v) => {
        const count = (vendorProductMap.get(v._id) || []).length;
        if (hasProductsFilter === 'has') return count > 0;
        if (hasProductsFilter === 'none') return count === 0;
        return true;
      });
    }

    // Inventory health (vendor-level)
    if (inventoryHealthFilter !== 'all') {
      list = list.filter((v) => {
        const prods = vendorProductMap.get(v._id) || [];
        if (inventoryHealthFilter === 'low') {
          return prods.some((p) => p.stock > 0 && p.stock <= 10);
        }
        if (inventoryHealthFilter === 'out') {
          return prods.some((p) => p.stock === 0);
        }
        return true;
      });
    }

    return list;
  }, [vendors, debouncedVendorSearch, statusFilter, hasProductsFilter, inventoryHealthFilter, vendorProductMap]);

  const handleCreate = () => {
    setMode('create');
    setFormData(emptyVendor);
    setEditingId(null);
  };

  const handleEdit = async (id: string) => {
    router.push(`/admin/vendor-edit?vendorId=${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vendor?')) return;
    try {
      await api.vendors.delete(id);
      pushToast({ type: 'success', title: 'Deleted', message: 'Vendor deleted successfully' });
      loadVendors();
    } catch (error) {
      console.error('Error deleting vendor:', error);
      pushToast({ type: 'error', title: 'Delete Failed', message: 'Failed to delete vendor' });
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    try {
      setTogglingId(id);
      await api.vendors.update(id, { isActive: !current });
      await loadVendors();
      pushToast({ type: 'success', title: 'Status Updated', message: `Vendor ${!current ? 'enabled' : 'disabled'}` });
    } catch (error) {
      console.error('Error updating vendor status:', error);
      pushToast({ type: 'error', title: 'Update Failed', message: 'Failed to update vendor status' });
    } finally {
      setTogglingId((cur) => (cur === id ? null : cur));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (mode === 'create') {
        await api.vendors.create(formData);
        pushToast({ type: 'success', title: 'Saved', message: 'Vendor created successfully' });
      } else {
        await api.vendors.update(editingId!, formData);
        pushToast({ type: 'success', title: 'Saved', message: 'Vendor updated successfully' });
      }
      setMode('list');
      loadVendors();
    } catch (error) {
      console.error('Error saving vendor:', error);
      pushToast({ type: 'error', title: 'Save Failed', message: 'Failed to save vendor' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setMode('list');
    setFormData(emptyVendor);
    setEditingId(null);
  };

  const updateField = (path: string, value: any) => {
    setFormData((prev) => {
      const keys = path.split('.');
      const newData = JSON.parse(JSON.stringify(prev));
      let current: any = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  if (mode === 'list') {
    return (
      <>
        <header className="page-header">
          <div>
            <h1 className="page-title">Vendors</h1>
            <p className="page-subtitle">Manage vendor accounts</p>
          </div>
          <div>
            <button className="btn-action primary" onClick={handleCreate}>
              Add New Vendor
            </button>
          </div>
        </header>

        {loading ? (
          <div className="vendors-loading">Loading vendors...</div>
        ) : (
          <>
            {/* FILTERS SECTION - 2 ROWS */}
            <div className="vendors-filters">
              {/* ROW 1: Vendor Search + Status Toggle */}
              <div className="filters-row-1">
                <div className="vendor-search-wrapper">
                  <div className="search-input-wrapper">
                    <input
                      type="text"
                      className="vendor-search-input"
                      placeholder="Search by vendor name or email..."
                      value={vendorSearch}
                      onChange={(e) => setVendorSearch(e.target.value)}
                    />
                    {vendorSearch && (
                      <button
                        type="button"
                        className="search-clear-btn"
                        aria-label="Clear search"
                        onClick={() => setVendorSearch('')}
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

                <div className="status-tabs">
                  <button
                    className={`status-tab ${statusFilter === 'active' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('active')}
                  >
                    Active
                  </button>
                  <button
                    className={`status-tab ${statusFilter === 'disabled' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('disabled')}
                  >
                    Disabled
                  </button>
                </div>
              </div>

              {/* ROW 2: Has Products + Inventory Health + Clear */}
              <div className="filters-row-2">
                <div className="segmented-toggle">
                  <button
                    className={`segmented-pill ${hasProductsFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setHasProductsFilter('all')}
                  >
                    All
                  </button>
                  <button
                    className={`segmented-pill ${hasProductsFilter === 'has' ? 'active' : ''}`}
                    onClick={() => setHasProductsFilter('has')}
                  >
                    Has products
                  </button>
                  <button
                    className={`segmented-pill ${hasProductsFilter === 'none' ? 'active' : ''}`}
                    onClick={() => setHasProductsFilter('none')}
                  >
                    No products
                  </button>
                </div>

                <div className="segmented-toggle">
                  <button
                    className={`segmented-pill ${inventoryHealthFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setInventoryHealthFilter('all')}
                  >
                    All
                  </button>
                  <button
                    className={`segmented-pill ${inventoryHealthFilter === 'low' ? 'active' : ''}`}
                    onClick={() => setInventoryHealthFilter('low')}
                  >
                    Has low-stock
                  </button>
                  <button
                    className={`segmented-pill ${inventoryHealthFilter === 'out' ? 'active' : ''}`}
                    onClick={() => setInventoryHealthFilter('out')}
                  >
                    Has out-of-stock
                  </button>
                </div>

                <button
                  type="button"
                  className="clear-filters-btn"
                  onClick={() => {
                    setVendorSearch('');
                    setStatusFilter('active');
                    setHasProductsFilter('all');
                    setInventoryHealthFilter('all');
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="vendors-stats">
              <div className="stat-card">
                <div className="stat-label">Total Vendors</div>
                <div className="stat-value">{vendors.length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Active Vendors</div>
                <div className="stat-value">{vendors.filter((v) => v.isActive).length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Disabled Vendors</div>
                <div className="stat-value">{vendors.filter((v) => !v.isActive).length}</div>
              </div>
            </div>

            <section className="vendors-section">
              <h2 className="section-title">Vendor Leaderboard</h2>
              <div className="vendors-table-wrap">
                <table className="vendors-table">
                  <thead>
                    <tr>
                      <th>Store Name</th>
                      <th>Owner</th>
                      <th>Email</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVendors.map((vendor) => (
                      <tr key={vendor._id}>
                        <td>{vendor.storeName}</td>
                        <td>{vendor.ownerName}</td>
                        <td>{vendor.contact?.email || '—'}</td>
                        <td>{vendor.vendorType}</td>
                        <td>
                          <span className={`status-badge ${vendor.isActive ? 'active' : 'disabled'}`}>
                            {vendor.isActive ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td>
                          <div className="action-btns">
                            <button className="btn-edit" onClick={() => handleEdit(vendor._id)}>
                              Edit
                            </button>
                            <button
                              className={`btn-toggle ${vendor.isActive ? 'disable' : 'enable'}`}
                              onClick={() => toggleActive(vendor._id, vendor.isActive)}
                              disabled={togglingId === vendor._id}
                            >
                              {vendor.isActive ? 'Disable' : 'Enable'}
                            </button>
                            <button className="btn-delete" onClick={() => handleDelete(vendor._id)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredVendors.length === 0 && (
                      <tr>
                        <td colSpan={6} className="empty-state">
                          No vendors found. Create your first vendor!
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
      <div className="vendors-header">
        <h1 className="vendors-title">{mode === 'create' ? 'Create Vendor' : 'Edit Vendor'}</h1>
        <button className="btn-secondary" onClick={handleCancel}>
          Back to List
        </button>
      </div>

      <form className="vendor-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3 className="form-section-title">Basic Information</h3>
          <div className="form-grid">
            <div className="form-field">
              <label>Store Name *</label>
              <input
                type="text"
                required
                value={formData.storeName || ''}
                onChange={(e) => updateField('storeName', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Owner Name *</label>
              <input
                type="text"
                required
                value={formData.ownerName || ''}
                onChange={(e) => updateField('ownerName', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Vendor Type *</label>
              <select
                required
                value={formData.vendorType || ''}
                onChange={(e) => updateField('vendorType', e.target.value)}
              >
                <option value="">Select Type</option>
                <option value="grocery">Grocery</option>
                <option value="restaurant">Restaurant</option>
                <option value="pharmacy">Pharmacy</option>
                <option value="bakery">Bakery</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Contact Information</h3>
          <div className="form-grid">
            <div className="form-field">
              <label>Phone *</label>
              <input
                type="tel"
                required
                value={formData.contact?.phone || ''}
                onChange={(e) => updateField('contact.phone', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Alternate Phone</label>
              <input
                type="tel"
                value={formData.contact?.alternatePhone || ''}
                onChange={(e) => updateField('contact.alternatePhone', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Email *</label>
              <input
                type="email"
                required
                value={formData.contact?.email || ''}
                onChange={(e) => updateField('contact.email', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>WhatsApp</label>
              <input
                type="tel"
                value={formData.contact?.whatsapp || ''}
                onChange={(e) => updateField('contact.whatsapp', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Password {mode === 'create' ? '*' : '(leave blank to keep current)'}</label>
              <input
                type="password"
                required={mode === 'create'}
                autoComplete="new-password"
                readOnly
                onFocus={(e) => e.currentTarget.removeAttribute('readonly')}
                value={formData.password || ''}
                onChange={(e) => updateField('password', e.target.value)}
                placeholder={mode === 'edit' ? 'Enter new password to change' : ''}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Personal Details</h3>
          <div className="form-grid">
            <div className="form-field">
              <label>Gender</label>
              <select
                value={formData.personal?.gender || ''}
                onChange={(e) => updateField('personal.gender', e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-field">
              <label>Age</label>
              <input
                type="number"
                value={formData.personal?.age || ''}
                onChange={(e) => updateField('personal.age', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
            <div className="form-field">
              <label>Date of Birth</label>
              <input
                type="date"
                value={formData.personal?.dob || ''}
                onChange={(e) => updateField('personal.dob', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Address</h3>
          <div className="form-grid">
            <div className="form-field">
              <label>Address Line 1 *</label>
              <input
                type="text"
                required
                value={formData.address?.line1 || ''}
                onChange={(e) => updateField('address.line1', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Address Line 2</label>
              <input
                type="text"
                value={formData.address?.line2 || ''}
                onChange={(e) => updateField('address.line2', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Area *</label>
              <input
                type="text"
                required
                value={formData.address?.area || ''}
                onChange={(e) => updateField('address.area', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>City *</label>
              <input
                type="text"
                required
                value={formData.address?.city || ''}
                onChange={(e) => updateField('address.city', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>State *</label>
              <input
                type="text"
                required
                value={formData.address?.state || ''}
                onChange={(e) => updateField('address.state', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Pincode *</label>
              <input
                type="text"
                required
                value={formData.address?.pincode || ''}
                onChange={(e) => updateField('address.pincode', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Landmark</label>
              <input
                type="text"
                value={formData.address?.landmark || ''}
                onChange={(e) => updateField('address.landmark', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Business Details</h3>
          <div className="form-grid">
            <div className="form-field">
              <label>GST Number</label>
              <input
                type="text"
                value={formData.business?.gstNumber || ''}
                onChange={(e) => updateField('business.gstNumber', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>PAN Number</label>
              <input
                type="text"
                value={formData.business?.panNumber || ''}
                onChange={(e) => updateField('business.panNumber', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>License Number</label>
              <input
                type="text"
                value={formData.business?.licenseNumber || ''}
                onChange={(e) => updateField('business.licenseNumber', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Establishment Year</label>
              <input
                type="number"
                value={formData.business?.establishmentYear || ''}
                onChange={(e) =>
                  updateField('business.establishmentYear', e.target.value ? Number(e.target.value) : undefined)
                }
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Store Operations</h3>
          <div className="form-grid">
            <div className="form-field">
              <label>Opening Time</label>
              <input
                type="time"
                value={formData.store?.openingTime || ''}
                onChange={(e) => updateField('store.openingTime', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Closing Time</label>
              <input
                type="time"
                value={formData.store?.closingTime || ''}
                onChange={(e) => updateField('store.closingTime', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Delivery Radius (km)</label>
              <input
                type="number"
                step="0.1"
                value={formData.store?.deliveryRadiusKm || ''}
                onChange={(e) =>
                  updateField('store.deliveryRadiusKm', e.target.value ? Number(e.target.value) : undefined)
                }
              />
            </div>
            <div className="form-field form-field-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={formData.store?.supportsCOD || false}
                  onChange={(e) => updateField('store.supportsCOD', e.target.checked)}
                />
                Supports Cash on Delivery
              </label>
            </div>
            <div className="form-field form-field-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={formData.store?.supportsOnlinePayment || false}
                  onChange={(e) => updateField('store.supportsOnlinePayment', e.target.checked)}
                />
                Supports Online Payment
              </label>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Media</h3>
          <div className="form-grid">
            <div className="form-field">
              <label>Logo URL</label>
              <input
                type="url"
                value={formData.media?.logoUrl || ''}
                onChange={(e) => updateField('media.logoUrl', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Banner URL</label>
              <input
                type="url"
                value={formData.media?.bannerUrl || ''}
                onChange={(e) => updateField('media.bannerUrl', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Status & Settings</h3>
          <div className="form-grid">
            <div className="form-field form-field-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={formData.isActive || false}
                  onChange={(e) => updateField('isActive', e.target.checked)}
                />
                Active
              </label>
            </div>
            <div className="form-field form-field-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={formData.isVerified || false}
                  onChange={(e) => updateField('isVerified', e.target.checked)}
                />
                Verified
              </label>
            </div>
            <div className="form-field form-field-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={formData.isBlocked || false}
                  onChange={(e) => updateField('isBlocked', e.target.checked)}
                />
                Blocked
              </label>
            </div>
            <div className="form-field form-field-full">
              <label>Notes</label>
              <textarea
                rows={3}
                value={formData.notes || ''}
                onChange={(e) => updateField('notes', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : mode === 'create' ? 'Create Vendor' : 'Update Vendor'}
          </button>
        </div>
      </form>
    </>
  );
}
