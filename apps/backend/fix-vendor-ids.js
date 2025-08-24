const { supabase } = require('./src/config/supabaseClient');

async function fixVendorIds() {
  console.log('🔧 Fixing vendor IDs to match auth user IDs...\n');

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

    // Get auth users
    console.log('\n2. Getting auth users...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.log('❌ Error fetching auth users:', authError.message);
      return;
    }

    console.log('✅ Found auth users:', authUsers.users.length);

    // For each vendor, find matching auth user and update vendor ID
    for (const vendor of vendors) {
      console.log(`\n3. Processing vendor: ${vendor.name} (${vendor.email})`);
      
      // Find matching auth user
      const authUser = authUsers.users.find(u => u.email === vendor.email);
      
      if (!authUser) {
        console.log(`   ❌ No auth user found for ${vendor.email}`);
        continue;
      }

      console.log(`   🔧 Found auth user ID: ${authUser.id}`);
      console.log(`   📝 Current vendor ID: ${vendor.id}`);

      if (vendor.id === authUser.id) {
        console.log(`   ✅ Vendor ID already matches auth user ID`);
        continue;
      }

      // Update vendor ID to match auth user ID
      console.log(`   🔄 Updating vendor ID...`);
      const { error: updateError } = await supabase
        .from('vendors')
        .update({ id: authUser.id })
        .eq('id', vendor.id);

      if (updateError) {
        console.log(`   ❌ Error updating vendor ID: ${updateError.message}`);
      } else {
        console.log(`   ✅ Updated vendor ID to ${authUser.id}`);
      }
    }

    console.log('\n🎉 Vendor ID fix completed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixVendorIds();
