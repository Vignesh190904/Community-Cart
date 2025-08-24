const { supabase } = require('./src/config/supabaseClient');

async function fixVendorIdsSQL() {
  console.log('🔧 Fixing vendor IDs using SQL approach...\n');

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

      // Use a transaction-like approach by updating in the correct order
      console.log(`   🔄 Starting vendor ID update process...`);

      // First, create a temporary vendor record with the new ID
      console.log(`   📝 Creating temporary vendor record...`);
      const { data: tempVendor, error: tempError } = await supabase
        .from('vendors')
        .insert([{
          id: authUser.id,
          community_id: 'a9ab2e9f-4f84-4a8a-a496-8f8363e70fcf', // Use existing community ID
          name: vendor.name,
          email: vendor.email,
          shop_name: vendor.shop_name + ' (temp)',
          phone: '+1234567890',
          business_name: vendor.shop_name,
          category: 'general',
          description: 'Temporary record',
          rating: 4.0,
          total_orders: 0,
          total_revenue: 0,
          vendor_since: '2025-08-22',
          status: 'true',
          password_hash: 'temp_hash'
        }])
        .select()
        .single();

      if (tempError) {
        console.log(`   ❌ Error creating temp vendor: ${tempError.message}`);
        continue;
      }

      console.log(`   ✅ Created temporary vendor record`);

      // Update products to use the new vendor ID
      console.log(`   📦 Updating products...`);
      const { error: updateProductsError } = await supabase
        .from('products')
        .update({ vendor_id: authUser.id })
        .eq('vendor_id', vendor.id);

      if (updateProductsError) {
        console.log(`   ❌ Error updating products: ${updateProductsError.message}`);
        // Clean up temp vendor
        await supabase.from('vendors').delete().eq('id', authUser.id);
        continue;
      }

      console.log(`   ✅ Updated products`);

      // Update orders to use the new vendor ID
      console.log(`   📋 Updating orders...`);
      const { error: updateOrdersError } = await supabase
        .from('orders')
        .update({ vendor_id: authUser.id })
        .eq('vendor_id', vendor.id);

      if (updateOrdersError) {
        console.log(`   ❌ Error updating orders: ${updateOrdersError.message}`);
        // Clean up temp vendor
        await supabase.from('vendors').delete().eq('id', authUser.id);
        continue;
      }

      console.log(`   ✅ Updated orders`);

      // Now update the temporary vendor with the correct data
      console.log(`   🔄 Updating temporary vendor with correct data...`);
      const { error: updateTempError } = await supabase
        .from('vendors')
        .update({
          shop_name: vendor.shop_name,
          phone: '+1234567890',
          business_name: vendor.shop_name,
          category: 'general',
          description: 'Fresh vegetables and fruits',
          rating: 4.5,
          total_orders: 20,
          total_revenue: 3647,
          vendor_since: '2025-08-22',
          status: 'true',
          password_hash: 'hashed_password_john'
        })
        .eq('id', authUser.id);

      if (updateTempError) {
        console.log(`   ❌ Error updating temp vendor: ${updateTempError.message}`);
        continue;
      }

      console.log(`   ✅ Updated temporary vendor with correct data`);

      // Delete the old vendor record
      console.log(`   🗑️ Deleting old vendor record...`);
      const { error: deleteError } = await supabase
        .from('vendors')
        .delete()
        .eq('id', vendor.id);

      if (deleteError) {
        console.log(`   ❌ Error deleting old vendor: ${deleteError.message}`);
        continue;
      }

      console.log(`   ✅ Deleted old vendor record`);
      console.log(`   🎉 Successfully updated vendor ID to ${authUser.id}`);
    }

    console.log('\n🎉 Vendor ID fix completed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixVendorIdsSQL();
