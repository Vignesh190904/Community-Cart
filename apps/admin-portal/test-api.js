// Simple test script to verify API connectivity
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Hardcoded to backend port 8000

async function testAPI() {
  console.log('Testing API connectivity...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health endpoint working:', healthResponse.data);

    // Test admin health endpoint
    console.log('\n2. Testing admin health endpoint...');
    const adminHealthResponse = await axios.get(`${API_BASE_URL}/admin/health`);
    console.log('✅ Admin health endpoint working:', adminHealthResponse.data);

    // Test API health endpoint
    console.log('\n3. Testing API health endpoint...');
    const apiHealthResponse = await axios.get(`${API_BASE_URL}/api/health`);
    console.log('✅ API health endpoint working:', apiHealthResponse.data);

    console.log('\n🎉 All API endpoints are working correctly!');
  } catch (error) {
    console.error('\n❌ API test failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testAPI();
