// Script to create the first admin user
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

async function createAdmin() {
  console.log('Creating admin user...\n');

  const adminData = {
    email: 'admin@communitycart.com',
    password: 'admin123456',
    name: 'Admin User',
    phone: '+1234567890'
  };

  try {
    console.log('Attempting to create admin user...');
    console.log('Email:', adminData.email);
    console.log('Password:', adminData.password);
    console.log('Name:', adminData.name);
    console.log('Phone:', adminData.phone);
    console.log('');

    const response = await axios.post(`${API_BASE_URL}/admin/auth/signup`, adminData);

    if (response.data.success) {
      console.log('✅ Admin user created successfully!');
      console.log('User ID:', response.data.user.id);
      console.log('Email:', response.data.user.email);
      console.log('Name:', response.data.user.name);
      console.log('');
      console.log('You can now login to the admin portal with:');
      console.log('Email: admin@communitycart.com');
      console.log('Password: admin123456');
    } else {
      console.log('❌ Failed to create admin user:', response.data.message);
    }

  } catch (error) {
    console.error('❌ Error creating admin user:');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data.message);
      
      if (error.response.data.fields) {
        console.error('Validation errors:');
        Object.entries(error.response.data.fields).forEach(([field, message]) => {
          console.error(`  ${field}: ${message}`);
        });
      }
    } else {
      console.error('Network error:', error.message);
    }
    
    console.log('');
    console.log('💡 If the admin already exists, you can try logging in directly.');
    console.log('💡 Make sure the backend server is running on port 8000.');
  }
}

createAdmin();
