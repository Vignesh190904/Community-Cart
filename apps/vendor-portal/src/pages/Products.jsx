import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import { vendorApi } from '../lib/api.jsx'

function Products() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    availability: true
  })
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await vendorApi.getCategories()
      let categoriesData = []
      if (Array.isArray(response.data)) {
        categoriesData = response.data
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        categoriesData = response.data.data
      }
      
      // If no categories from API, use defaults
      if (categoriesData.length === 0) {
        categoriesData = [
          { id: 'groceries', name: 'Groceries' },
          { id: 'electronics', name: 'Electronics' },
          { id: 'clothing', name: 'Clothing' },
          { id: 'general', name: 'General' }
        ]
      }
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error fetching categories:', error)
      // Create a default category list if API fails
      setCategories([
        { id: 'groceries', name: 'Groceries' },
        { id: 'electronics', name: 'Electronics' },
        { id: 'clothing', name: 'Clothing' },
        { id: 'general', name: 'General' }
      ])
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await vendorApi.getProducts()
      // Handle different response structures
      let productsData = []
      if (Array.isArray(response.data)) {
        productsData = response.data
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        productsData = response.data.data
      } else if (response.data?.data?.products && Array.isArray(response.data.data.products)) {
        productsData = response.data.data.products
      } else if (response.data?.products && Array.isArray(response.data.products)) {
        productsData = response.data.products
      }
      setProducts(productsData)
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    try {
      const categoryId = categories.length > 0 ? categories[0].id : 'general'
      
      // Use direct API call to the correct endpoint
      const response = await fetch('http://localhost:8000/vendor/products/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProduct.name,
          description: newProduct.description,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock),
          category_id: categoryId,
          available: newProduct.availability
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('Product created:', result)
      
      setNewProduct({ name: '', description: '', price: '', stock: '', availability: true })
      setShowAddForm(false)
      fetchProducts()
    } catch (error) {
      console.error('Error adding product:', error)
      alert('Failed to add product. Please try again.')
    }
  }

  const handleToggleAvailability = async (productId, currentAvailability) => {
    try {
      await vendorApi.toggleProductAvailability(productId)
      fetchProducts()
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          {showAddForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Product</h3>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  step="0.01"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                  Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="availability"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={newProduct.availability}
                  onChange={(e) => setNewProduct({ ...newProduct, availability: e.target.checked })}
                />
                <label htmlFor="availability" className="ml-2 block text-sm text-gray-900">
                  Available
                </label>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Product List</h3>
        </div>
        <div className="border-t border-gray-200">
          {!Array.isArray(products) ? (
            <div className="text-center py-8 text-red-500">
              <p>Error loading products data</p>
              <button 
                onClick={fetchProducts}
                className="mt-2 text-indigo-600 hover:text-indigo-800 underline"
              >
                Try Again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No products found</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Availability
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.availability ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleToggleAvailability(product.id, product.availability)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        {product.availability ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default Products
