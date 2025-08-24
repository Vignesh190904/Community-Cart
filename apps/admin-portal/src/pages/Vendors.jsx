import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { apiService, formatCurrency, formatNumber } from '../services/api'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal,
  Phone,
  Mail,
  MapPin,
  Store,
  TrendingUp,
  Package,
  AlertCircle
} from 'lucide-react'

const Vendors = () => {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    shop_name: '',
    business_name: '',
    phone: '',
    category: 'general',
    description: '',
    community_name: 'Default Community'
  })
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const fetchVendors = async () => {
    try {
      setLoading(true)
      const data = await apiService.getVendors(searchQuery)
      setVendors(data)
    } catch (error) {
      console.error('Error fetching vendors:', error)
      setVendors([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVendors()
  }, [searchQuery])

  const validateForm = (isCreate = true) => {
    const errors = {}
    
    // Required fields: name, email, password (for create), phone
    if (!formData.name?.trim()) {
      errors.name = 'Name is required'
    } else if (formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }
    
    if (!formData.email?.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email'
    }
    
    if (isCreate && !formData.password?.trim()) {
      errors.password = 'Password is required'
    } else if (isCreate && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    
    if (!formData.phone?.trim()) {
      errors.phone = 'Phone number is required'
    } else if (formData.phone.length < 8) {
      errors.phone = 'Phone number must be at least 8 characters'
    }
    
    // Optional fields - only validate length if provided
    if (formData.shop_name && formData.shop_name.trim() && formData.shop_name.length > 100) {
      errors.shop_name = 'Shop name cannot exceed 100 characters'
    }
    
    if (formData.business_name && formData.business_name.trim() && formData.business_name.length > 100) {
      errors.business_name = 'Business name cannot exceed 100 characters'
    }
    
    if (formData.description && formData.description.trim() && formData.description.length > 500) {
      errors.description = 'Description cannot exceed 500 characters'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      shop_name: '',
      business_name: '',
      phone: '',
      category: 'general',
      description: '',
      community_name: 'Default Community'
    })
    setFormErrors({})
  }

  const handleCreateVendor = async (e) => {
    e.preventDefault()
    
    if (!validateForm(true)) {
      console.log('❌ Frontend validation failed:', formErrors)
      return
    }
    
    try {
      setSubmitting(true)
      
      // Prepare create data - handle empty fields properly
      const createData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        shop_name: formData.shop_name || '',
        business_name: formData.business_name || '',
        category: formData.category || 'general',
        description: formData.description || '',
        community_name: formData.community_name || 'Default Community'
      }
      
      console.log('📤 Sending create vendor data:', createData)
      
      const response = await apiService.createVendor(createData)
      
      if (response.success) {
        console.log('✅ Vendor created successfully:', response)
        setShowCreateModal(false)
        resetForm()
        fetchVendors()
        
        // Show success message with login credentials
        const vendor = response.vendor
        const credentials = vendor.login_credentials
        
        const successMessage = `Vendor created successfully!

Login Credentials:
Email: ${credentials.email}
Password: ${credentials.password}

Please share these credentials with the vendor for login access.`
        
        alert(successMessage)
      } else {
        console.log('❌ Create vendor failed:', response)
        alert('Failed to create vendor: ' + (response.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('❌ Error creating vendor:', error)
      console.error('❌ Error response:', error.response?.data)
      
      // Handle validation errors from backend
      if (error.response?.data?.fields) {
        console.log('❌ Backend validation errors:', error.response.data.fields)
        setFormErrors(error.response.data.fields)
      } else {
        alert('Failed to create vendor: ' + (error.response?.data?.message || error.message))
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateVendor = async (e) => {
    e.preventDefault()
    
    if (!validateForm(false)) {
      console.log('❌ Frontend validation failed:', formErrors)
      return
    }
    
    try {
      setSubmitting(true)
      
      // Prepare update data - handle empty fields properly
      const updateData = {}
      
      // Include all fields that are provided, even if empty
      if (formData.name !== undefined) updateData.name = formData.name.trim()
      if (formData.email !== undefined) updateData.email = formData.email.trim()
      if (formData.shop_name !== undefined) updateData.shop_name = formData.shop_name || ''
      if (formData.business_name !== undefined) updateData.business_name = formData.business_name || ''
      if (formData.phone !== undefined) updateData.phone = formData.phone.trim()
      if (formData.category !== undefined) updateData.category = formData.category
      if (formData.description !== undefined) updateData.description = formData.description || ''
      
      console.log('📤 Sending update vendor data:', { id: selectedVendor.id, data: updateData })
      
      const response = await apiService.updateVendor(selectedVendor.id, updateData)
      
      if (response.success) {
        console.log('✅ Vendor updated successfully:', response)
        setShowEditModal(false)
        setSelectedVendor(null)
        resetForm()
        fetchVendors()
        alert('Vendor updated successfully!')
      } else {
        console.log('❌ Update vendor failed:', response)
        alert('Failed to update vendor: ' + (response.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('❌ Error updating vendor:', error)
      console.error('❌ Error response:', error.response?.data)
      
      // Handle validation errors from backend
      if (error.response?.data?.fields) {
        console.log('❌ Backend validation errors:', error.response.data.fields)
        setFormErrors(error.response.data.fields)
      } else {
        alert('Failed to update vendor: ' + (error.response?.data?.message || error.message))
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteVendor = async (id) => {
    if (confirm('Are you sure you want to delete this vendor?')) {
      try {
        const response = await apiService.deleteVendor(id)
        if (response.success) {
          fetchVendors()
          alert('Vendor deleted successfully!')
        }
      } catch (error) {
        console.error('Error deleting vendor:', error)
        alert('Failed to delete vendor: ' + (error.response?.data?.message || error.message))
      }
    }
  }

  const openEditModal = (vendor) => {
    setSelectedVendor(vendor)
    setFormData({
      name: vendor.name || '',
      email: vendor.email || '',
      password: '', // Don't populate password for edit
      shop_name: vendor.shop_name || '',
      business_name: vendor.business_name || '',
      phone: vendor.phone || '',
      category: vendor.category || 'general',
      description: vendor.description || '',
      community_name: '' // Don't populate community_name for edit
    })
    setFormErrors({})
    setShowEditModal(true)
  }

  const openCreateModal = () => {
    resetForm()
    setShowCreateModal(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          <span className="text-lg">Loading vendors...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendors</h1>
          <p className="text-gray-600">Manage vendor accounts and information</p>
        </div>
        <Button onClick={openCreateModal} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Vendor</span>
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor) => (
          <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{vendor.name}</CardTitle>
                  <p className="text-sm text-gray-600">{vendor.shop_name}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    vendor.status 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {vendor.status ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{vendor.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{vendor.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Store className="h-4 w-4 text-gray-400" />
                  <span>{vendor.category || 'general'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Package className="h-4 w-4 text-gray-400" />
                    <span>{formatNumber(vendor.total_orders || 0)} orders</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                    <span>{formatCurrency(vendor.total_revenue || 0)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(vendor)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteVendor(vendor.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Vendor Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create New Vendor</h2>
            <form onSubmit={handleCreateVendor} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={formErrors.name ? 'border-red-500' : ''}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {formErrors.name}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={formErrors.email ? 'border-red-500' : ''}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {formErrors.email}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Password *</label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className={formErrors.password ? 'border-red-500' : ''}
                />
                {formErrors.password && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {formErrors.password}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Shop Name *</label>
                <Input
                  value={formData.shop_name}
                  onChange={(e) => setFormData({...formData, shop_name: e.target.value})}
                  className={formErrors.shop_name ? 'border-red-500' : ''}
                />
                {formErrors.shop_name && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {formErrors.shop_name}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Business Name</label>
                <Input
                  value={formData.business_name}
                  onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Phone *</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className={formErrors.phone ? 'border-red-500' : ''}
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {formErrors.phone}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="general">General</option>
                  <option value="grocery">Grocery</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="bakery">Bakery</option>
                  <option value="food">Food</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows="3"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  type="submit" 
                  className="flex-1" 
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : 'Create Vendor'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Vendor Modal */}
      {showEditModal && selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Vendor</h2>
            <form onSubmit={handleUpdateVendor} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={formErrors.name ? 'border-red-500' : ''}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {formErrors.name}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={formErrors.email ? 'border-red-500' : ''}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {formErrors.email}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Shop Name *</label>
                <Input
                  value={formData.shop_name}
                  onChange={(e) => setFormData({...formData, shop_name: e.target.value})}
                  className={formErrors.shop_name ? 'border-red-500' : ''}
                />
                {formErrors.shop_name && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {formErrors.shop_name}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Business Name</label>
                <Input
                  value={formData.business_name}
                  onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Phone *</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className={formErrors.phone ? 'border-red-500' : ''}
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {formErrors.phone}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="general">General</option>
                  <option value="grocery">Grocery</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="bakery">Bakery</option>
                  <option value="food">Food</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows="3"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={submitting}
                >
                  {submitting ? 'Updating...' : 'Update Vendor'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowEditModal(false)}
                  className="flex-1"
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Vendors
