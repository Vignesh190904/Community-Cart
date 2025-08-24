const { supabase } = require('./src/config/supabaseClient');

async function testVendorAuth() {
  console.log('🔍 Testing vendor authentication...\n');

  try {
    // First, let's check what vendors exist in the database
    console.log('1. Checking vendors in database...');
    const { data: vendors, error: vendorsError } = await supabase
      .from('vendors')
      .select('id, name, email, shop_name')
      .limit(5);

    if (vendorsError) {
      console.log('❌ Error fetching vendors:', vendorsError.message);
      return;
    }

    console.log('✅ Vendors found:', vendors.length);
    vendors.forEach(v => console.log(`   - ${v.name} (${v.email}) - ${v.shop_name}`));

    // Check if there are any auth users
    console.log('\n2. Checking auth users...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.log('❌ Error fetching auth users:', authError.message);
      return;
    }

    console.log('✅ Auth users found:', authUsers.users.length);
    authUsers.users.forEach(u => {
      console.log(`   - ${u.email} (${u.user_metadata?.role || 'no role'})`);
    });

    // Try to find a vendor user
    const vendorUser = authUsers.users.find(u => u.user_metadata?.role === 'vendor');
    
    if (vendorUser) {
      console.log('\n3. Found vendor user:', vendorUser.email);
      console.log('   User metadata:', vendorUser.user_metadata);
      
      // Try to login with this vendor
      console.log('\n4. Testing vendor login...');
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: vendorUser.email,
        password: '12345678' // Default password
      });

      if (loginError) {
        console.log('❌ Login error:', loginError.message);
      } else {
        console.log('✅ Login successful!');
        console.log('   User ID:', loginData.user.id);
        console.log('   Session:', !!loginData.session);
      }
    } else {
      console.log('\n❌ No vendor users found in auth');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testVendorAuth();
