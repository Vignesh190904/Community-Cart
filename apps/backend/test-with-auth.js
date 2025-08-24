const axios = require('axios');

const BASE_URL = 'http://localhost:8000';

// Test the new API endpoints with authentication
async function testWithAuth() {
  console.log('🧪 Testing new vendor profile API endpoints with authentication...\n');

  try {
    // First, login to get a token
    console.log('1. Logging in to get authentication token...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/admin/login`, {
      email: 'admin@admin.com',
      password: '12345678'
    });

    if (!loginResponse.data.success) {
      console.log('❌ Login failed:', loginResponse.data.message);
      return;
    }

    const token = loginResponse.data.token;
    console.log('✅ Login successful, got token\n');

    // Create axios instance with auth header
    const authAxios = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // Test 2: Get vendors list
    console.log('2. Getting vendors list...');
    try {
      const vendorsResponse = await authAxios.get('/admin/vendors');
      console.log('✅ Vendors endpoint working:', vendorsResponse.data.success);
      
      if (vendorsResponse.data.success && vendorsResponse.data.vendors && vendorsResponse.data.vendors.length > 0) {
        const vendorId = vendorsResponse.data.vendors[0].id;
        console.log(`   Found vendor ID: ${vendorId}\n`);

        // Test 3: Get vendor performance
        console.log('3. Testing GET /admin/vendors/:id/performance...');
        try {
          const performanceResponse = await authAxios.get(`/admin/vendors/${vendorId}/performance`);
          console.log('✅ Performance endpoint working:', performanceResponse.data.success);
          if (performanceResponse.data.success) {
            console.log('   Data:', performanceResponse.data.data);
          }
        } catch (error) {
          console.log('❌ Performance endpoint failed:', error.response?.data?.message || error.message);
        }

        // Test 4: Get vendor orders
        console.log('\n4. Testing GET /admin/vendors/:id/orders...');
        try {
          const ordersResponse = await authAxios.get(`/admin/vendors/${vendorId}/orders`);
          console.log('✅ Orders endpoint working:', ordersResponse.data.success);
          if (ordersResponse.data.success) {
            console.log(`   Found ${ordersResponse.data.data.orders.length} orders`);
            console.log('   Pagination:', ordersResponse.data.data.pagination);
          }
        } catch (error) {
          console.log('❌ Orders endpoint failed:', error.response?.data?.message || error.message);
        }

        // Test 5: Get vendor metrics
        console.log('\n5. Testing GET /admin/vendors/:id/metrics...');
        try {
          const metricsResponse = await authAxios.get(`/admin/vendors/${vendorId}/metrics`);
          console.log('✅ Metrics endpoint working:', metricsResponse.data.success);
          if (metricsResponse.data.success) {
            console.log('   Vendor info:', metricsResponse.data.data.vendor_info);
            console.log('   Metrics:', metricsResponse.data.data.metrics);
          }
        } catch (error) {
          console.log('❌ Metrics endpoint failed:', error.response?.data?.message || error.message);
        }

        // Test 6: Get vendor monthly revenue
        console.log('\n6. Testing GET /admin/vendors/:id/revenue/monthly...');
        try {
          const revenueResponse = await authAxios.get(`/admin/vendors/${vendorId}/revenue/monthly`);
          console.log('✅ Monthly revenue endpoint working:', revenueResponse.data.success);
          if (revenueResponse.data.success) {
            console.log(`   Found ${revenueResponse.data.data.length} months of data`);
          }
        } catch (error) {
          console.log('❌ Monthly revenue endpoint failed:', error.response?.data?.message || error.message);
        }

        // Test 7: Test performance with month/year filters
        console.log('\n7. Testing GET /admin/vendors/:id/performance with month/year filters...');
        try {
          const currentDate = new Date();
          const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
          const year = currentDate.getFullYear().toString();
          
          const filteredResponse = await authAxios.get(`/admin/vendors/${vendorId}/performance?month=${month}&year=${year}`);
          console.log('✅ Filtered performance endpoint working:', filteredResponse.data.success);
          if (filteredResponse.data.success) {
            console.log('   Filtered data:', filteredResponse.data.data);
          }
        } catch (error) {
          console.log('❌ Filtered performance endpoint failed:', error.response?.data?.message || error.message);
        }

      } else {
        console.log('❌ No vendors found. Please create some vendors first.');
      }
    } catch (error) {
      console.log('❌ Vendors endpoint failed:', error.response?.data?.message || error.message);
    }

    console.log('\n🎉 All endpoint tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testWithAuth();
