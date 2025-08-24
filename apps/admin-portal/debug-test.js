// Debug test to check route mounting
import axios from 'axios';

async function debugTest() {
  try {
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:8000/health');
    console.log('✅ Health:', healthResponse.data.message);
    
    console.log('\n2. Testing admin auth health...');
    try {
      const adminAuthHealth = await axios.get('http://localhost:8000/admin/auth/health');
      console.log('✅ Admin auth health:', adminAuthHealth.data);
    } catch (error) {
      console.log('❌ Admin auth health failed:', error.response?.status, error.response?.data?.message);
    }
    
    console.log('\n3. Testing admin vendor health...');
    try {
      const adminVendorHealth = await axios.get('http://localhost:8000/admin/health');
      console.log('✅ Admin vendor health:', adminVendorHealth.data);
    } catch (error) {
      console.log('❌ Admin vendor health failed:', error.response?.status, error.response?.data?.message);
    }
    
    console.log('\n4. Testing login endpoint...');
    const loginResponse = await axios.post('http://localhost:8000/admin/auth/login', {
      email: 'admin@admin.com',
      password: '12345678'
    });
    console.log('✅ Login successful:', loginResponse.data.message);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

debugTest();
