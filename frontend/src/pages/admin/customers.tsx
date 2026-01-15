import { useEffect, useState, useMemo } from 'react';
import { useToast } from '../../components/ui/ToastProvider';

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  personal?: {
    gender?: string;
    age?: number;
  };
  address?: {
    line1?: string;
    line2?: string;
    area?: string;
    city?: string;
    state?: string;
    pincode?: string;
    landmark?: string;
  };
  preferences?: {
    preferredPaymentMethod?: string;
    language?: string;
  };
  isActive: boolean;
  isBlocked: boolean;
  notes?: string;
  createdAt: string;
}

type Mode = 'list' | 'create' | 'edit';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    personal: { gender: '', age: '' },
    address: { line1: '', line2: '', area: '', city: '', state: '', pincode: '', landmark: '' },
    preferences: { preferredPaymentMethod: '', language: '' },
    notes: '',
  });
  const { pushToast } = useToast();

  useEffect(() => {
    loadCustomers();
    loadOrders();
  }, []);

  const loadCustomers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/customers');
      if (!res.ok) throw new Error('Failed to fetch customers');
      const data = await res.json();
      setCustomers(data);
    } catch (error: any) {
      pushToast({ type: 'error', title: 'Error', message: error.message || 'Failed to load customers' });
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/orders');
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error: any) {
      // Do not block page if orders fail
      console.warn('Orders load failed for customers filters:', error?.message || error);
    }
  };

  // ========== LIST FILTERS ==========
  const [customerSearch, setCustomerSearch] = useState<string>('');
  const [debouncedCustomerSearch, setDebouncedCustomerSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'active' | 'disabled'>('active');
  const [hasOrdersFilter, setHasOrdersFilter] = useState<'all' | 'has' | 'none'>('all');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedCustomerSearch(customerSearch.trim()), 300);
    return () => clearTimeout(t);
  }, [customerSearch]);

  const customerOrdersMap = useMemo(() => {
    const map = new Map<string, number>();
    orders.forEach((o) => {
      const cid = o.customerId?._id || o.customerId; // backend may populate or be raw ObjectId
      if (!cid) return;
      map.set(cid, (map.get(cid) || 0) + 1);
    });
    return map;
  }, [orders]);

  const filteredCustomers = useMemo(() => {
    let list = [...customers];

    // Search by name/email/phone
    if (debouncedCustomerSearch) {
      const q = debouncedCustomerSearch.toLowerCase();
      list = list.filter((c) => {
        const name = c.name?.toLowerCase() || '';
        const email = c.email?.toLowerCase() || '';
        const phone = c.phone?.toLowerCase() || '';
        return name.includes(q) || email.includes(q) || phone.includes(q);
      });
    }

    // Status
    list = list.filter((c) => (statusFilter === 'active' ? c.isActive : !c.isActive));

    // Has orders
    if (hasOrdersFilter !== 'all') {
      list = list.filter((c) => {
        const count = customerOrdersMap.get(c._id) || 0;
        if (hasOrdersFilter === 'has') return count > 0;
        if (hasOrdersFilter === 'none') return count === 0;
        return true;
      });
    }

    return list;
  }, [customers, debouncedCustomerSearch, statusFilter, hasOrdersFilter, customerOrdersMap]);

  const toggleActiveStatus = async (customerId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`http://localhost:5000/api/customers/${customerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!res.ok) throw new Error('Failed to update customer');
      const updated = await res.json();

      setCustomers((prev) => prev.map((c) => (c._id === customerId ? updated : c)));
      pushToast({
        type: 'success',
        title: 'Customer Updated',
        message: `Customer ${updated.isActive ? 'enabled' : 'disabled'} successfully`,
      });
    } catch (error: any) {
      pushToast({ type: 'error', title: 'Update Failed', message: error.message || 'Could not update customer' });
    }
  };

  const handleCreate = () => {
    setMode('create');
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      personal: { gender: '', age: '' },
      address: { line1: '', line2: '', area: '', city: '', state: '', pincode: '', landmark: '' },
      preferences: { preferredPaymentMethod: '', language: '' },
      notes: '',
    });
  };

  const handleEdit = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/customers/${id}`);
      if (!res.ok) throw new Error('Failed to fetch customer');
      const customer: Customer = await res.json();
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        password: '',
        personal: {
          gender: customer.personal?.gender || '',
          age: customer.personal?.age?.toString() || '',
        },
        address: {
          line1: customer.address?.line1 || '',
          line2: customer.address?.line2 || '',
          area: customer.address?.area || '',
          city: customer.address?.city || '',
          state: customer.address?.state || '',
          pincode: customer.address?.pincode || '',
          landmark: customer.address?.landmark || '',
        },
        preferences: {
          preferredPaymentMethod: customer.preferences?.preferredPaymentMethod || '',
          language: customer.preferences?.language || '',
        },
        notes: customer.notes || '',
      });
      setEditingId(id);
      setMode('edit');
    } catch (error: any) {
      pushToast({ type: 'error', title: 'Load Failed', message: error.message || 'Failed to load customer' });
    }
  };

  const handleCancel = () => {
    setMode('list');
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      personal: { gender: '', age: '' },
      address: { line1: '', line2: '', area: '', city: '', state: '', pincode: '', landmark: '' },
      preferences: { preferredPaymentMethod: '', language: '' },
      notes: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      pushToast({ type: 'warning', title: 'Missing fields', message: 'Name, Email and Phone are required.' });
      return;
    }

    try {
      setLoading(true);
      const payload: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        personal: {
          gender: formData.personal.gender || undefined,
          age: formData.personal.age ? parseInt(formData.personal.age) : undefined,
        },
        address: formData.address,
        preferences: formData.preferences,
        notes: formData.notes || undefined,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      if (mode === 'create') {
        const res = await fetch('http://localhost:5000/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || 'Failed to create customer');
        }

        pushToast({ type: 'success', title: 'Customer Created', message: 'New customer added successfully' });
      } else {
        const res = await fetch(`http://localhost:5000/api/customers/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || 'Failed to update customer');
        }

        pushToast({ type: 'success', title: 'Customer Updated', message: 'Customer updated successfully' });
      }

      setMode('list');
      loadCustomers();
    } catch (error: any) {
      pushToast({ type: 'error', title: mode === 'create' ? 'Create Failed' : 'Update Failed', message: error.message || 'Operation failed' });
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (customerId: string, customerName: string) => {
    if (!confirm(`Are you sure you want to delete customer "${customerName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/customers/${customerId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete customer');

      setCustomers((prev) => prev.filter((c) => c._id !== customerId));
      pushToast({ type: 'success', title: 'Customer Deleted', message: `${customerName} deleted successfully` });
    } catch (error: any) {
      pushToast({ type: 'error', title: 'Delete Failed', message: error.message || 'Could not delete customer' });
    }
  };

  if (loading && mode === 'list') {
    return (
      <div className="admin-customers-container">
        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Loading customers...
        </div>
      </div>
    );
  }

  if (mode === 'list') {
    return (
      <div className="admin-customers-container">
        <header className="page-header">
          <div>
            <h1 className="page-title">Customers</h1>
            <p className="page-subtitle">Manage customer accounts</p>
          </div>
          <div>
            <button className="btn-action primary" onClick={handleCreate}>Add New Customer</button>
          </div>
        </header>

        <div className="vendors-filters">
          <div className="filters-row-1">
            <div className="vendor-search-wrapper">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  className="vendor-search-input"
                  placeholder="Search by name, email, or phone..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                />
                {customerSearch && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    aria-label="Clear search"
                    onClick={() => setCustomerSearch('')}
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

          <div className="filters-row-2">
            <div className="segmented-toggle">
              <button
                className={`segmented-pill ${hasOrdersFilter === 'all' ? 'active' : ''}`}
                onClick={() => setHasOrdersFilter('all')}
              >
                All
              </button>
              <button
                className={`segmented-pill ${hasOrdersFilter === 'has' ? 'active' : ''}`}
                onClick={() => setHasOrdersFilter('has')}
              >
                Has placed orders
              </button>
              <button
                className={`segmented-pill ${hasOrdersFilter === 'none' ? 'active' : ''}`}
                onClick={() => setHasOrdersFilter('none')}
              >
                No orders yet
              </button>
            </div>

            <button
              type="button"
              className="clear-filters-btn"
              onClick={() => {
                setCustomerSearch('');
                setStatusFilter('active');
                setHasOrdersFilter('all');
              }}
            >
              Clear
            </button>
          </div>
        </div>

      <div className="customers-table-wrapper">
        <table className="customers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer._id}>
                <td className="customer-name-cell">{customer.name}</td>
                <td className="customer-email-cell">{customer.email}</td>
                <td className="customer-phone-cell">{customer.phone}</td>
                <td className="status-cell">
                  <span className={`customer-status-badge ${customer.isActive ? 'active' : 'disabled'}`}>
                    {customer.isActive ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="date-cell">{new Date(customer.createdAt).toLocaleDateString()}</td>
                <td className="actions-cell">
                  <button className="btn-action primary" onClick={() => handleEdit(customer._id)}>
                    Edit
                  </button>
                  <button
                    className={`btn-action ${customer.isActive ? 'warning' : 'primary'}`}
                    onClick={() => toggleActiveStatus(customer._id, customer.isActive)}
                  >
                    {customer.isActive ? 'Disable' : 'Enable'}
                  </button>
                  <button className="btn-action danger" onClick={() => deleteCustomer(customer._id, customer.name)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredCustomers.length === 0 && (
        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No customers registered yet
        </div>
      )}
    </div>
    );
  }

  // Create/Edit Form View
  return (
    <div className="admin-customers-container">
      <header className="page-header">
        <h1 className="page-title">{mode === 'create' ? 'Create Customer' : 'Edit Customer'}</h1>
        <button className="btn-action" onClick={handleCancel}>
          Back to List
        </button>
      </header>

      <form className="customer-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3 className="form-section-title">Basic Information</h3>
          <div className="form-grid">
            <div className="form-field">
              <label>Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label>Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label>Phone *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label>{mode === 'create' ? 'Password (optional)' : 'Password (leave empty to keep current)'}</label>
              <input
                type="password"
                autoComplete="new-password"
                readOnly
                onFocus={(e) => e.currentTarget.removeAttribute('readonly')}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={mode === 'create' ? 'Set initial password' : 'Enter new password to change'}
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
                value={formData.personal.gender}
                onChange={(e) => setFormData({ ...formData, personal: { ...formData.personal, gender: e.target.value } })}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-field">
              <label>Age</label>
              <input
                type="number"
                value={formData.personal.age}
                onChange={(e) => setFormData({ ...formData, personal: { ...formData.personal, age: e.target.value } })}
                placeholder="Age"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Address</h3>
          <div className="form-grid">
            <div className="form-field">
              <label>Address Line 1</label>
              <input
                type="text"
                value={formData.address.line1}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, line1: e.target.value } })}
                placeholder="Street address"
              />
            </div>
            <div className="form-field">
              <label>Address Line 2</label>
              <input
                type="text"
                value={formData.address.line2}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, line2: e.target.value } })}
                placeholder="Apartment, suite, etc."
              />
            </div>
            <div className="form-field">
              <label>Area</label>
              <input
                type="text"
                value={formData.address.area}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, area: e.target.value } })}
              />
            </div>
            <div className="form-field">
              <label>City</label>
              <input
                type="text"
                value={formData.address.city}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
              />
            </div>
            <div className="form-field">
              <label>State</label>
              <input
                type="text"
                value={formData.address.state}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
              />
            </div>
            <div className="form-field">
              <label>Pincode</label>
              <input
                type="text"
                value={formData.address.pincode}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, pincode: e.target.value } })}
              />
            </div>
            <div className="form-field form-field-full">
              <label>Landmark</label>
              <input
                type="text"
                value={formData.address.landmark}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, landmark: e.target.value } })}
                placeholder="Nearby landmark"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Preferences</h3>
          <div className="form-grid">
            <div className="form-field">
              <label>Preferred Payment Method</label>
              <select
                value={formData.preferences.preferredPaymentMethod}
                onChange={(e) => setFormData({ ...formData, preferences: { ...formData.preferences, preferredPaymentMethod: e.target.value } })}
              >
                <option value="">Select Payment Method</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
              </select>
            </div>
            <div className="form-field">
              <label>Language</label>
              <select
                value={formData.preferences.language}
                onChange={(e) => setFormData({ ...formData, preferences: { ...formData.preferences, language: e.target.value } })}
              >
                <option value="">Select Language</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
                <option value="Kannada">Kannada</option>
                <option value="Malayalam">Malayalam</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Additional Notes</h3>
          <div className="form-field form-field-full">
            <label>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes about this customer"
              rows={4}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-action" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-action primary" disabled={loading}>
            {loading ? 'Saving...' : mode === 'create' ? 'Create Customer' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
