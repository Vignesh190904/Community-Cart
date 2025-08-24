const axios = require('axios');
const { supabase } = require('./src/config/supabaseClient');

const BASE_URL = 'http://localhost:8000';

// Test all API endpoints systematically
async function auditApiEndpoints() {
  console.log('🔍 Starting comprehensive API audit...\n');

  try {
    // Step 1: Test health endpoints
    console.log('1. Testing health endpoints...');
    try {
      const healthResponse = await axios.get(`${BASE_URL}/health`);
      console.log('✅ Health endpoint working:', healthResponse.data.success);
    } catch (error) {
      console.log('❌ Health endpoint failed:', error.message);
    }

    try {
      const apiHealthResponse = await axios.get(`${BASE_URL}/api/health`);
      console.log('✅ API health endpoint working:', apiHealthResponse.data.success);
    } catch (error) {
      console.log('❌ API health endpoint failed:', error.message);
    }

    // Step 2: Test admin authentication
    console.log('\n2. Testing admin authentication...');
    let adminToken = null;
    try {
      const loginResponse = await axios.post(`${BASE_URL}/auth/admin/login`, {
        email: 'admin@admin.com',
        password: '12345678'
      });
      
      if (loginResponse.data.success) {
        adminToken = loginResponse.data.token;
        console.log('✅ Admin login working');
      } else {
        console.log('❌ Admin login failed:', loginResponse.data.message);
      }
    } catch (error) {
      console.log('❌ Admin login failed:', error.response?.data?.message || error.message);
    }

    // Step 3: Test admin endpoints with authentication
    if (adminToken) {
      console.log('\n3. Testing admin endpoints...');
      const adminAxios = axios.create({
        baseURL: BASE_URL,
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      // Test admin dashboard stats
      try {
        const dashboardResponse = await adminAxios.get('/admin/dashboard/stats');
        console.log('✅ Admin dashboard stats working:', dashboardResponse.data.success);
      } catch (error) {
        console.log('❌ Admin dashboard stats failed:', error.response?.data?.message || error.message);
      }

      // Test admin vendors list
      try {
        const vendorsResponse = await adminAxios.get('/admin/vendors');
        console.log('✅ Admin vendors list working:', vendorsResponse.data.success);
        
        if (vendorsResponse.data.success && vendorsResponse.data.vendors && vendorsResponse.data.vendors.length > 0) {
          const vendorId = vendorsResponse.data.vendors[0].id;
          console.log(`   Found vendor ID: ${vendorId}`);

          // Test vendor-specific endpoints
          console.log('\n4. Testing vendor-specific endpoints...');
          
          // Test vendor performance
          try {
            const performanceResponse = await adminAxios.get(`/admin/vendors/${vendorId}/performance`);
            console.log('✅ Vendor performance endpoint working:', performanceResponse.data.success);
          } catch (error) {
            console.log('❌ Vendor performance endpoint failed:', error.response?.data?.message || error.message);
          }

          // Test vendor orders
          try {
            const ordersResponse = await adminAxios.get(`/admin/vendors/${vendorId}/orders`);
            console.log('✅ Vendor orders endpoint working:', ordersResponse.data.success);
          } catch (error) {
            console.log('❌ Vendor orders endpoint failed:', error.response?.data?.message || error.message);
          }

          // Test vendor metrics
          try {
            const metricsResponse = await adminAxios.get(`/admin/vendors/${vendorId}/metrics`);
            console.log('✅ Vendor metrics endpoint working:', metricsResponse.data.success);
          } catch (error) {
            console.log('❌ Vendor metrics endpoint failed:', error.response?.data?.message || error.message);
          }

          // Test vendor monthly revenue
          try {
            const revenueResponse = await adminAxios.get(`/admin/vendors/${vendorId}/revenue/monthly`);
            console.log('✅ Vendor monthly revenue endpoint working:', revenueResponse.data.success);
          } catch (error) {
            console.log('❌ Vendor monthly revenue endpoint failed:', error.response?.data?.message || error.message);
          }

          // Test vendor stats
          try {
            const statsResponse = await adminAxios.get(`/admin/vendors/${vendorId}/stats`);
            console.log('✅ Vendor stats endpoint working:', statsResponse.data.success);
          } catch (error) {
            console.log('❌ Vendor stats endpoint failed:', error.response?.data?.message || error.message);
          }

          // Test vendor order status
          try {
            const statusResponse = await adminAxios.get(`/admin/vendors/${vendorId}/orders/status`);
            console.log('✅ Vendor order status endpoint working:', statusResponse.data.success);
          } catch (error) {
            console.log('❌ Vendor order status endpoint failed:', error.response?.data?.message || error.message);
          }
        } else {
          console.log('⚠️  No vendors found to test vendor-specific endpoints');
        }
      } catch (error) {
        console.log('❌ Admin vendors list failed:', error.response?.data?.message || error.message);
      }
    }

    // Step 4: Test vendor authentication
    console.log('\n5. Testing vendor authentication...');
    try {
      // First, let's check if we have any vendors in the database
      const { data: vendors, error: vendorsError } = await supabase
        .from('vendors')
        .select('id, email')
        .limit(1);

      if (vendorsError) {
        console.log('❌ Error fetching vendors from database:', vendorsError.message);
      } else if (vendors && vendors.length > 0) {
        console.log(`   Found vendor: ${vendors[0].email}`);
        
        // Try to login as vendor (this might fail if no auth user exists)
        try {
          const vendorLoginResponse = await axios.post(`${BASE_URL}/auth/vendor/login`, {
            email: vendors[0].email,
            password: '12345678' // Default password
          });
          
          if (vendorLoginResponse.data.success) {
            console.log('✅ Vendor login working');
            const vendorToken = vendorLoginResponse.data.token;
            
            // Test vendor endpoints
            const vendorAxios = axios.create({
              baseURL: BASE_URL,
              headers: {
                'Authorization': `Bearer ${vendorToken}`,
                'Content-Type': 'application/json'
              }
            });

            // Test vendor profile
            try {
              const profileResponse = await vendorAxios.get('/vendor/profile');
              console.log('✅ Vendor profile endpoint working:', profileResponse.data.success);
            } catch (error) {
              console.log('❌ Vendor profile endpoint failed:', error.response?.data?.message || error.message);
            }

            // Test vendor dashboard
            try {
              const dashboardResponse = await vendorAxios.get('/vendor/dashboard');
              console.log('✅ Vendor dashboard endpoint working:', dashboardResponse.data.success);
            } catch (error) {
              console.log('❌ Vendor dashboard endpoint failed:', error.response?.data?.message || error.message);
            }

            // Test vendor products
            try {
              const productsResponse = await vendorAxios.get('/vendor/products');
              console.log('✅ Vendor products endpoint working:', productsResponse.data.success);
            } catch (error) {
              console.log('❌ Vendor products endpoint failed:', error.response?.data?.message || error.message);
            }

            // Test vendor orders
            try {
              const ordersResponse = await vendorAxios.get('/vendor/orders');
              console.log('✅ Vendor orders endpoint working:', ordersResponse.data.success);
            } catch (error) {
              console.log('❌ Vendor orders endpoint failed:', error.response?.data?.message || error.message);
            }

          } else {
            console.log('❌ Vendor login failed:', vendorLoginResponse.data.message);
          }
        } catch (error) {
          console.log('❌ Vendor login failed:', error.response?.data?.message || error.message);
        }
      } else {
        console.log('⚠️  No vendors found in database');
      }
    } catch (error) {
      console.log('❌ Error testing vendor authentication:', error.message);
    }

    // Step 5: Test public endpoints
    console.log('\n6. Testing public endpoints...');
    
    // Test product routes
    try {
      const productsResponse = await axios.get(`${BASE_URL}/products`);
      console.log('✅ Public products endpoint working:', productsResponse.data.success);
    } catch (error) {
      console.log('❌ Public products endpoint failed:', error.response?.data?.message || error.message);
    }

    // Test order routes
    try {
      const ordersResponse = await axios.get(`${BASE_URL}/orders`);
      console.log('✅ Public orders endpoint working:', ordersResponse.data.success);
    } catch (error) {
      console.log('❌ Public orders endpoint failed:', error.response?.data?.message || error.message);
    }

    console.log('\n🎉 API audit completed!');

  } catch (error) {
    console.error('❌ Audit failed:', error.message);
  }
}

// Run the audit
auditApiEndpoints();
