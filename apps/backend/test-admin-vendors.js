const axios = require('axios');

const BASE_URL = 'http://localhost:8000';

async function testAdminVendors() {
  console.log('🧪 Testing admin vendors endpoint...\n');

  try {
    // Step 1: Login to get token
    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/admin/login`, {
      email: 'admin@admin.com',
      password: '12345678'
    });

    if (!loginResponse.data.success) {
      console.log('❌ Login failed:', loginResponse.data.message);
      return;
    }

    const token = loginResponse.data.token;
    console.log('✅ Login successful');

    // Step 2: Call admin vendors endpoint
    console.log('\n2. Calling admin vendors endpoint...');
    const vendorsResponse = await axios.get(`${BASE_URL}/admin/vendors`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Vendors endpoint response:');
    console.log('Status:', vendorsResponse.status);
    console.log('Success:', vendorsResponse.data.success);
    console.log('Vendors count:', vendorsResponse.data.vendors?.length || 0);
    
    if (vendorsResponse.data.vendors && vendorsResponse.data.vendors.length > 0) {
      console.log('\nSample vendor:');
      console.log(JSON.stringify(vendorsResponse.data.vendors[0], null, 2));
    }

  } catch (error) {
    console.log('❌ Error:', error.message);
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    }
  }
}

testAdminVendors();
