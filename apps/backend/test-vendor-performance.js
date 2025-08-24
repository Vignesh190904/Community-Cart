const axios = require('axios');
const { supabase } = require('./src/config/supabaseClient');

const BASE_URL = 'http://localhost:8000';

async function testVendorPerformance() {
  console.log('🧪 Testing vendor performance endpoints...\n');

  try {
    // Get a vendor ID
    console.log('1. Getting vendor ID...');
    const { data: vendors, error: vendorsError } = await supabase
      .from('vendors')
      .select('id, name, email')
      .limit(1)
      .single();

    if (vendorsError) {
      console.log('❌ Error fetching vendor:', vendorsError.message);
      return;
    }

    const vendorId = vendors.id;
    console.log(`✅ Using vendor: ${vendors.name} (${vendors.email})`);

    // Login as admin
    console.log('\n2. Logging in as admin...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/admin/login`, {
      email: 'admin@admin.com',
      password: '12345678'
    });

    if (loginResponse.status !== 200) {
      console.log('❌ Admin login failed');
      return;
    }

    const adminToken = loginResponse.data.token;
    console.log('✅ Admin login successful');

    // Test vendor performance endpoint
    console.log('\n3. Testing vendor performance endpoint...');
    try {
      const performanceResponse = await axios.get(`${BASE_URL}/admin/vendors/${vendorId}/performance`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      console.log('✅ Vendor performance endpoint working');
      console.log('   Response:', performanceResponse.data);
    } catch (error) {
      console.log('❌ Vendor performance endpoint failed:', error.response?.data?.message || error.message);
    }

    // Test vendor metrics endpoint
    console.log('\n4. Testing vendor metrics endpoint...');
    try {
      const metricsResponse = await axios.get(`${BASE_URL}/admin/vendors/${vendorId}/metrics`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      console.log('✅ Vendor metrics endpoint working');
      console.log('   Response:', metricsResponse.data);
    } catch (error) {
      console.log('❌ Vendor metrics endpoint failed:', error.response?.data?.message || error.message);
    }

    // Test vendor performance with month/year filters
    console.log('\n5. Testing vendor performance with filters...');
    try {
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      
      const filteredResponse = await axios.get(`${BASE_URL}/admin/vendors/${vendorId}/performance?month=${month}&year=${year}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      console.log('✅ Vendor performance with filters working');
      console.log('   Response:', filteredResponse.data);
    } catch (error) {
      console.log('❌ Vendor performance with filters failed:', error.response?.data?.message || error.message);
    }

    console.log('\n🎉 Vendor performance testing completed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testVendorPerformance();
