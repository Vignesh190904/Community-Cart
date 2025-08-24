const { supabase } = require('./src/config/supabaseClient');

async function fixJohnDoeVendor() {
  console.log('🔧 Fixing John Doe vendor record...\n');

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

    // Get John Doe's products
    console.log('\n3. Getting John Doe products...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
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
      .select('*')
      .eq('vendor_id', johnVendor.id);

    if (ordersError) {
      console.log('❌ Error fetching orders:', ordersError.message);
      return;
    }

    console.log(`✅ Found ${orders.length} orders for John Doe`);

    // Create new vendor record with correct ID
    console.log('\n5. Creating new vendor record with correct ID...');
    const newVendorData = {
      id: johnAuthUser.id,
      community_id: johnVendor.community_id,
      name: johnVendor.name,
      email: johnVendor.email,
      shop_name: johnVendor.shop_name,
      phone: johnVendor.phone,
      business_name: johnVendor.business_name,
      category: johnVendor.category,
      description: johnVendor.description,
      rating: johnVendor.rating,
      total_orders: johnVendor.total_orders,
      total_revenue: johnVendor.total_revenue,
      vendor_since: johnVendor.vendor_since,
      status: johnVendor.status,
      updated_at: johnVendor.updated_at,
      created_at: johnVendor.created_at,
      password_hash: johnVendor.password_hash
    };

    const { data: newVendor, error: createError } = await supabase
      .from('vendors')
      .insert([newVendorData])
      .select()
      .single();

    if (createError) {
      console.log('❌ Error creating new vendor record:', createError.message);
      return;
    }

    console.log('✅ Created new vendor record with ID:', newVendor.id);

    // Update products to use new vendor ID
    if (products.length > 0) {
      console.log('\n6. Updating products to use new vendor ID...');
      const { error: updateProductsError } = await supabase
        .from('products')
        .update({ vendor_id: newVendor.id })
        .eq('vendor_id', johnVendor.id);

      if (updateProductsError) {
        console.log('❌ Error updating products:', updateProductsError.message);
        return;
      }

      console.log('✅ Updated products to use new vendor ID');
    }

    // Update orders to use new vendor ID
    if (orders.length > 0) {
      console.log('\n7. Updating orders to use new vendor ID...');
      const { error: updateOrdersError } = await supabase
        .from('orders')
        .update({ vendor_id: newVendor.id })
        .eq('vendor_id', johnVendor.id);

      if (updateOrdersError) {
        console.log('❌ Error updating orders:', updateOrdersError.message);
        return;
      }

      console.log('✅ Updated orders to use new vendor ID');
    }

    // Delete old vendor record
    console.log('\n8. Deleting old vendor record...');
    const { error: deleteError } = await supabase
      .from('vendors')
      .delete()
      .eq('id', johnVendor.id);

    if (deleteError) {
      console.log('❌ Error deleting old vendor record:', deleteError.message);
      return;
    }

    console.log('✅ Deleted old vendor record');

    console.log('\n🎉 John Doe vendor fix completed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixJohnDoeVendor();
