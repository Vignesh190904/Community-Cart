const { supabase } = require('./src/config/supabaseClient');

async function fixJohnDoeVendorSimple() {
  console.log('🔧 Fixing John Doe vendor record (simple approach)...\n');

  try {
    // Get John Doe's current vendor record
    console.log('1. Getting John Doe vendor record...');
    const { data: johnVendor, error: vendorError } = await supabase
      .from('vendors')
      .select('*')
      .eq('email', 'john@example.com')
      .single();

    if (vendorError) {
      console.log('❌ Error fetching John Doe vendor:', vendorError.message);
      return;
    }

    console.log('✅ Found John Doe vendor:', johnVendor.name);
    console.log('   Current ID:', johnVendor.id);

    // Get John Doe's auth user
    console.log('\n2. Getting John Doe auth user...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.log('❌ Error fetching auth users:', authError.message);
      return;
    }

    const johnAuthUser = authUsers.users.find(u => u.email === 'john@example.com');
    if (!johnAuthUser) {
      console.log('❌ No auth user found for John Doe');
      return;
    }

    console.log('✅ Found John Doe auth user ID:', johnAuthUser.id);

    if (johnVendor.id === johnAuthUser.id) {
      console.log('✅ Vendor ID already matches auth user ID');
      return;
    }

    // Get John Doe's products
    console.log('\n3. Getting John Doe products...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id')
      .eq('vendor_id', johnVendor.id);

    if (productsError) {
      console.log('❌ Error fetching products:', productsError.message);
      return;
    }

    console.log(`✅ Found ${products.length} products for John Doe`);

    // Get John Doe's orders
    console.log('\n4. Getting John Doe orders...');
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id')
      .eq('vendor_id', johnVendor.id);

    if (ordersError) {
      console.log('❌ Error fetching orders:', ordersError.message);
      return;
    }

    console.log(`✅ Found ${orders.length} orders for John Doe`);

    // Update products to use new vendor ID first
    if (products.length > 0) {
      console.log('\n5. Updating products to use new vendor ID...');
      const { error: updateProductsError } = await supabase
        .from('products')
        .update({ vendor_id: johnAuthUser.id })
        .eq('vendor_id', johnVendor.id);

      if (updateProductsError) {
        console.log('❌ Error updating products:', updateProductsError.message);
        return;
      }

      console.log('✅ Updated products to use new vendor ID');
    }

    // Update orders to use new vendor ID
    if (orders.length > 0) {
      console.log('\n6. Updating orders to use new vendor ID...');
      const { error: updateOrdersError } = await supabase
        .from('orders')
        .update({ vendor_id: johnAuthUser.id })
        .eq('vendor_id', johnVendor.id);

      if (updateOrdersError) {
        console.log('❌ Error updating orders:', updateOrdersError.message);
        return;
      }

      console.log('✅ Updated orders to use new vendor ID');
    }

    // Now update the vendor ID
    console.log('\n7. Updating vendor ID...');
    const { error: updateError } = await supabase
      .from('vendors')
      .update({ id: johnAuthUser.id })
      .eq('id', johnVendor.id);

    if (updateError) {
      console.log('❌ Error updating vendor ID:', updateError.message);
      return;
    }

    console.log('✅ Updated vendor ID to', johnAuthUser.id);
    console.log('\n🎉 John Doe vendor fix completed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixJohnDoeVendorSimple();
