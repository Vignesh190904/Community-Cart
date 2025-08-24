const { supabase } = require('./src/config/supabaseClient');

async function fixVendorIdsWithProducts() {
  console.log('🔧 Fixing vendor IDs with foreign key handling...\n');

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

      // Check if vendor has products
      console.log(`   🔍 Checking for products...`);
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id')
        .eq('vendor_id', vendor.id);

      if (productsError) {
        console.log(`   ❌ Error checking products: ${productsError.message}`);
        continue;
      }

      if (products && products.length > 0) {
        console.log(`   📦 Found ${products.length} products, updating them first...`);
        
        // Update products to use new vendor ID
        const { error: updateProductsError } = await supabase
          .from('products')
          .update({ vendor_id: authUser.id })
          .eq('vendor_id', vendor.id);

        if (updateProductsError) {
          console.log(`   ❌ Error updating products: ${updateProductsError.message}`);
          continue;
        }
        
        console.log(`   ✅ Updated ${products.length} products`);
      }

      // Check if vendor has orders
      console.log(`   🔍 Checking for orders...`);
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id')
        .eq('vendor_id', vendor.id);

      if (ordersError) {
        console.log(`   ❌ Error checking orders: ${ordersError.message}`);
        continue;
      }

      if (orders && orders.length > 0) {
        console.log(`   📋 Found ${orders.length} orders, updating them first...`);
        
        // Update orders to use new vendor ID
        const { error: updateOrdersError } = await supabase
          .from('orders')
          .update({ vendor_id: authUser.id })
          .eq('vendor_id', vendor.id);

        if (updateOrdersError) {
          console.log(`   ❌ Error updating orders: ${updateOrdersError.message}`);
          continue;
        }
        
        console.log(`   ✅ Updated ${orders.length} orders`);
      }

      // Now update vendor ID
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

    console.log('\n🎉 Vendor ID fix with foreign key handling completed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixVendorIdsWithProducts();
