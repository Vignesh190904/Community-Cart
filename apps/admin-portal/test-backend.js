// Simple test to check backend connectivity
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Hardcoded to backend port 8000

async function testBackend() {
  console.log('Testing backend connectivity...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health endpoint working:', healthResponse.data.message);

    // Test admin health endpoint
    console.log('\n2. Testing admin health endpoint...');
    const adminHealthResponse = await axios.get(`${API_BASE_URL}/admin/health`);
    console.log('✅ Admin health endpoint working:', adminHealthResponse.data.message);

    // Test direct login endpoint
    console.log('\n3. Testing login endpoint directly...');
    const loginResponse = await axios.post(`${API_BASE_URL}/admin/auth/login`, {
      email: 'admin@communitycart.com',
      password: 'admin123456'
    });
    console.log('✅ Login endpoint working:', loginResponse.data.message);

  } catch (error) {
    console.error('\n❌ Backend test failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testBackend();
