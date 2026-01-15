import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Setup() {
  const [activeTab, setActiveTab] = useState('vendor');
  const [vendors, setVendors] = useState([]);
  
  const [vendorForm, setVendorForm] = useState({
    storeName: '',
    ownerName: '',
    vendorType: 'grocery',
    contact: { phone: '', email: '' },
    address: { city: '', area: '', pincode: '' },
  });

  const [customerForm, setCustomerForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: { city: '', area: '', pincode: '' },
  });

  const [productForm, setProductForm] = useState({
    vendor: '',
    name: '',
    category: '',
    description: '',
    mrp: '',
    price: '',
    image: '',
    stock: '',
    isAvailable: true,
  });

  const [imagePreview, setImagePreview] = useState('');

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'product') {
      loadVendors();
    }
  }, [activeTab]);

  const loadVendors = async () => {
    try {
      const data = await api.vendors.getAll();
      setVendors(data);
    } catch (error) {
      console.error('Failed to load vendors:', error);
    }
  };

  const handleVendorChange = (e: any) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setVendorForm(prev => ({
        ...prev,
        [parent]: { ...prev[parent as any], [child]: value }
      }));
    } else {
      setVendorForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCustomerChange = (e: any) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCustomerForm(prev => ({
        ...prev,
        [parent]: { ...prev[parent as any], [child]: value }
      }));
    } else {
      setCustomerForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleProductChange = (e: any) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProductForm(prev => ({
        ...prev,
        [parent]: { ...prev[parent as any], [child]: value }
      }));
    } else {
      setProductForm(prev => ({ ...prev, [name]: value }));
      
      // Auto-populate category when vendor is selected
      if (name === 'vendor' && value) {
        const selectedVendor = vendors.find((v: any) => v._id === value);
        if (selectedVendor) {
          setProductForm(prev => ({ ...prev, vendor: value, category: selectedVendor.vendorType }));
        }
      }
    }
  };

  const handleImageUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setProductForm(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVendorSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.vendors.create(vendorForm);
      setMessage('✅ Vendor created successfully!');
      setMessageType('success');
      setVendorForm({
        storeName: '',
        ownerName: '',
        vendorType: 'grocery',
        contact: { phone: '', email: '' },
        address: { city: '', area: '', pincode: '' },
      });
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.customers.create(customerForm);
      setMessage('✅ Customer created successfully!');
      setMessageType('success');
      setCustomerForm({
        name: '',
        phone: '',
        email: '',
        address: { city: '', area: '', pincode: '' },
      });
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.products.create(productForm);
      setMessage('✅ Product created successfully!');
      setMessageType('success');
      setProductForm({
        vendor: '',
        name: '',
        category: '',
        description: '',
        mrp: '',
        price: '',
        image: '',
        stock: '',
        isAvailable: true,
      });
      setImagePreview('');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Community Cart</h1>
      <p className="subtitle">Add test vendors and customers</p>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'vendor' ? 'active' : ''}`}
          onClick={() => setActiveTab('vendor')}
        >
          ➕ Vendor
        </button>
        <button
          className={`tab ${activeTab === 'customer' ? 'active' : ''}`}
          onClick={() => setActiveTab('customer')}
        >
          ➕ Customer
        </button>
        <button
          className={`tab ${activeTab === 'product' ? 'active' : ''}`}
          onClick={() => setActiveTab('product')}
        >
          ➕ Product
        </button>
      </div>

      {message && <div className={`message ${messageType}`}>{message}</div>}

      {activeTab === 'vendor' && (
        <form onSubmit={handleVendorSubmit} className="form">
          <h2>Add New Vendor</h2>
          
          <input
            type="text"
            name="storeName"
            placeholder="Store Name"
            value={vendorForm.storeName}
            onChange={handleVendorChange}
            required
          />
          
          <input
            type="text"
            name="ownerName"
            placeholder="Owner Name"
            value={vendorForm.ownerName}
            onChange={handleVendorChange}
            required
          />

          <select
            name="vendorType"
            value={vendorForm.vendorType}
            onChange={handleVendorChange}
          >
            <option value="grocery">Grocery</option>
            <option value="restaurant">Restaurant</option>
            <option value="pharmacy">Pharmacy</option>
            <option value="clothing">Clothing</option>
            <option value="electronics">Electronics</option>
          </select>

          <input
            type="tel"
            name="contact.phone"
            placeholder="Phone"
            value={vendorForm.contact.phone}
            onChange={handleVendorChange}
            required
          />

          <input
            type="email"
            name="contact.email"
            placeholder="Email"
            value={vendorForm.contact.email}
            onChange={handleVendorChange}
          />

          <input
            type="text"
            name="address.city"
            placeholder="City"
            value={vendorForm.address.city}
            onChange={handleVendorChange}
          />

          <input
            type="text"
            name="address.area"
            placeholder="Area"
            value={vendorForm.address.area}
            onChange={handleVendorChange}
          />

          <input
            type="text"
            name="address.pincode"
            placeholder="Pincode"
            value={vendorForm.address.pincode}
            onChange={handleVendorChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Vendor'}
          </button>
        </form>
      )}

      {activeTab === 'customer' && (
        <form onSubmit={handleCustomerSubmit} className="form">
          <h2>Add New Customer</h2>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={customerForm.name}
            onChange={handleCustomerChange}
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={customerForm.phone}
            onChange={handleCustomerChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={customerForm.email}
            onChange={handleCustomerChange}
          />

          <input
            type="text"
            name="address.city"
            placeholder="City"
            value={customerForm.address.city}
            onChange={handleCustomerChange}
          />

          <input
            type="text"
            name="address.area"
            placeholder="Area"
            value={customerForm.address.area}
            onChange={handleCustomerChange}
          />

          <input
            type="text"
            name="address.pincode"
            placeholder="Pincode"
            value={customerForm.address.pincode}
            onChange={handleCustomerChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Customer'}
          </button>
        </form>
      )}

      {activeTab === 'product' && (
        <form onSubmit={handleProductSubmit} className="form">
          <h2>Add New Product</h2>

          <select
            name="vendor"
            value={productForm.vendor}
            onChange={handleProductChange}
            required
          >
            <option value="">Select Vendor</option>
            {vendors.map((vendor: any) => (
              <option key={vendor._id} value={vendor._id}>
                {vendor.storeName}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={productForm.name}
            onChange={handleProductChange}
            required
          />

          <input
            type="text"
            name="category"
            placeholder="Category (auto-filled from vendor)"
            value={productForm.category}
            readOnly
            style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
          />

          <textarea
            name="description"
            placeholder="Description"
            value={productForm.description}
            onChange={handleProductChange}
            rows={3}
          />

          <input
            type="number"
            name="mrp"
            placeholder="MRP"
            value={productForm.mrp}
            onChange={handleProductChange}
            min="0"
            step="0.01"
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={productForm.price}
            onChange={handleProductChange}
            min="0"
            step="0.01"
            required
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500' }}>Product Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ padding: '8px' }}
            />
            {imagePreview && (
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  objectFit: 'cover', 
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }} 
              />
            )}
          </div>

          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            value={productForm.stock}
            onChange={handleProductChange}
            min="0"
            required
          />

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <div style={{
              position: 'relative',
              width: '50px',
              height: '24px',
              backgroundColor: productForm.isAvailable ? '#4CAF50' : '#ccc',
              borderRadius: '12px',
              transition: 'background-color 0.3s',
              cursor: 'pointer'
            }}>
              <div style={{
                position: 'absolute',
                top: '2px',
                left: productForm.isAvailable ? '26px' : '2px',
                width: '20px',
                height: '20px',
                backgroundColor: 'white',
                borderRadius: '50%',
                transition: 'left 0.3s'
              }} />
            </div>
            <input
              type="checkbox"
              name="isAvailable"
              checked={productForm.isAvailable}
              onChange={(e) => setProductForm(prev => ({ ...prev, isAvailable: e.target.checked }))}
              style={{ display: 'none' }}
            />
            <span style={{ fontWeight: '500' }}>
              {productForm.isAvailable ? 'Active' : 'Inactive'}
            </span>
          </label>

          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </form>
      )}
    </div>
  );
}
