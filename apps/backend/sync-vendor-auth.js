const { supabase } = require('./src/config/supabaseClient');

async function syncVendorAuth() {
  console.log('🔧 Syncing vendor auth users with database...\n');

  try {
    // Get vendors from database
    console.log('1. Getting vendors from database...');
    const { data: vendors, error: vendorsError } = await supabase
      .from('vendors')
      .select('id, name, email, shop_name')
      .limit(5);

    if (vendorsError) {
      console.log('❌ Error fetching vendors:', vendorsError.message);
      return;
    }

    console.log('✅ Found vendors:', vendors.length);

    // Get existing auth users
    console.log('\n2. Getting existing auth users...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.log('❌ Error fetching auth users:', authError.message);
      return;
    }

    console.log('✅ Found auth users:', authUsers.users.length);

    // For each vendor in database, create auth user if doesn't exist
    for (const vendor of vendors) {
      console.log(`\n3. Processing vendor: ${vendor.name} (${vendor.email})`);
      
      // Check if auth user already exists
      const existingUser = authUsers.users.find(u => u.email === vendor.email);
      
      if (existingUser) {
        console.log(`   ✅ Auth user already exists for ${vendor.email}`);
        continue;
      }

      // Create new auth user
      console.log(`   🔧 Creating auth user for ${vendor.email}...`);
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: vendor.email,
        password: '12345678', // Default password
        email_confirm: true,
        user_metadata: {
          name: vendor.name,
          role: 'vendor',
          shop_name: vendor.shop_name
        }
      });

      if (createError) {
        console.log(`   ❌ Error creating auth user: ${createError.message}`);
      } else {
        console.log(`   ✅ Created auth user: ${newUser.user.email}`);
      }
    }

    console.log('\n🎉 Vendor auth sync completed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

syncVendorAuth();
