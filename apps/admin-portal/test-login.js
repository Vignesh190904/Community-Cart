// Script to test admin login
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Hardcoded to backend port 8000

async function testLogin() {
  console.log('Testing admin login...\n');

  const loginData = {
    email: 'admin@admin.com',
    password: '12345678'
  };

  try {
    console.log('Attempting to login with:');
    console.log('Email:', loginData.email);
    console.log('Password:', loginData.password);
    console.log('');

    const response = await axios.post(`${API_BASE_URL}/auth/admin/login`, loginData);

    if (response.data.success) {
      console.log('✅ Login successful!');
      console.log('Token received:', response.data.token ? 'Yes' : 'No');
      console.log('User ID:', response.data.user.id);
      console.log('User Name:', response.data.user.name);
      console.log('User Email:', response.data.user.email);
      console.log('');
      console.log('🎉 The admin portal is now ready to use!');
      console.log('You can access it at: http://localhost:3000');
    } else {
      console.log('❌ Login failed:', response.data.message);
    }

  } catch (error) {
    console.error('❌ Login error:');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data.message);
    } else {
      console.error('Network error:', error.message);
    }
  }
}

testLogin();
