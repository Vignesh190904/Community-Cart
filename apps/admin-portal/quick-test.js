// Quick test to check server connectivity
import axios from 'axios';

async function quickTest() {
  try {
    console.log('Testing server connectivity...');
    const response = await axios.get('http://localhost:8000/health', { timeout: 5000 });
    console.log('✅ Server is responding:', response.data.message);
    
    console.log('\nTesting new auth endpoint...');
    const loginResponse = await axios.post('http://localhost:8000/auth/admin/login', {
      email: 'admin@admin.com',
      password: '12345678'
    }, { timeout: 5000 });
    console.log('✅ Login successful:', loginResponse.data.message);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

quickTest();
