// Simple test to check if backend is responding
import axios from 'axios';

async function simpleTest() {
  try {
    console.log('Testing basic connectivity...');
    const response = await axios.get('http://localhost:8000/health');
    console.log('✅ Backend is responding:', response.data.message);
    
    console.log('\nTesting login endpoint...');
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

simpleTest();
