const axios = require('axios');

const BASE_URL = 'http://localhost:8000';

// Test the new API endpoints
async function testNewEndpoints() {
  console.log('🧪 Testing new vendor profile API endpoints...\n');

  try {
    // First, let's get a list of vendors to get an ID
    console.log('1. Getting vendors list...');
    const vendorsResponse = await axios.get(`${BASE_URL}/admin/vendors`);
    
    if (!vendorsResponse.data.success || !vendorsResponse.data.data.length) {
      console.log('❌ No vendors found. Please create some vendors first.');
      return;
    }

    const vendorId = vendorsResponse.data.data[0].id;
    console.log(`✅ Found vendor ID: ${vendorId}\n`);

    // Test 2: Get vendor performance
    console.log('2. Testing GET /admin/vendors/:id/performance...');
    try {
      const performanceResponse = await axios.get(`${BASE_URL}/admin/vendors/${vendorId}/performance`);
      console.log('✅ Performance endpoint working:', performanceResponse.data.success);
      if (performanceResponse.data.success) {
        console.log('   Data:', performanceResponse.data.data);
      }
    } catch (error) {
      console.log('❌ Performance endpoint failed:', error.response?.data?.message || error.message);
    }

    // Test 3: Get vendor orders
    console.log('\n3. Testing GET /admin/vendors/:id/orders...');
    try {
      const ordersResponse = await axios.get(`${BASE_URL}/admin/vendors/${vendorId}/orders`);
      console.log('✅ Orders endpoint working:', ordersResponse.data.success);
      if (ordersResponse.data.success) {
        console.log(`   Found ${ordersResponse.data.data.orders.length} orders`);
        console.log('   Pagination:', ordersResponse.data.data.pagination);
      }
    } catch (error) {
      console.log('❌ Orders endpoint failed:', error.response?.data?.message || error.message);
    }

    // Test 4: Get vendor metrics
    console.log('\n4. Testing GET /admin/vendors/:id/metrics...');
    try {
      const metricsResponse = await axios.get(`${BASE_URL}/admin/vendors/${vendorId}/metrics`);
      console.log('✅ Metrics endpoint working:', metricsResponse.data.success);
      if (metricsResponse.data.success) {
        console.log('   Vendor info:', metricsResponse.data.data.vendor_info);
        console.log('   Metrics:', metricsResponse.data.data.metrics);
      }
    } catch (error) {
      console.log('❌ Metrics endpoint failed:', error.response?.data?.message || error.message);
    }

    // Test 5: Get vendor monthly revenue
    console.log('\n5. Testing GET /admin/vendors/:id/revenue/monthly...');
    try {
      const revenueResponse = await axios.get(`${BASE_URL}/admin/vendors/${vendorId}/revenue/monthly`);
      console.log('✅ Monthly revenue endpoint working:', revenueResponse.data.success);
      if (revenueResponse.data.success) {
        console.log(`   Found ${revenueResponse.data.data.length} months of data`);
      }
    } catch (error) {
      console.log('❌ Monthly revenue endpoint failed:', error.response?.data?.message || error.message);
    }

    // Test 6: Test performance with month/year filters
    console.log('\n6. Testing GET /admin/vendors/:id/performance with month/year filters...');
    try {
      const currentDate = new Date();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const year = currentDate.getFullYear().toString();
      
      const filteredResponse = await axios.get(`${BASE_URL}/admin/vendors/${vendorId}/performance?month=${month}&year=${year}`);
      console.log('✅ Filtered performance endpoint working:', filteredResponse.data.success);
      if (filteredResponse.data.success) {
        console.log('   Filtered data:', filteredResponse.data.data);
      }
    } catch (error) {
      console.log('❌ Filtered performance endpoint failed:', error.response?.data?.message || error.message);
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
testNewEndpoints();
