const { supabase } = require('./src/config/supabaseClient');

async function fixJohnDoeFinal() {
  console.log('🔧 Final fix for John Doe vendor record...\n');

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

    // Step 1: Temporarily change the email and shop_name of the old vendor record
    console.log('\n3. Temporarily changing email and shop_name of old vendor record...');
    const { error: tempEmailError } = await supabase
      .from('vendors')
      .update({ 
        email: 'john_temp@example.com',
        shop_name: johnVendor.shop_name + ' (old)'
      })
      .eq('id', johnVendor.id);

    if (tempEmailError) {
      console.log('❌ Error changing email:', tempEmailError.message);
      return;
    }

    console.log('✅ Changed email to john_temp@example.com and shop_name to', johnVendor.shop_name + ' (old)');

    // Step 2: Create new vendor record with correct ID and original email
    console.log('\n4. Creating new vendor record with correct ID...');
    const { data: newVendor, error: createError } = await supabase
      .from('vendors')
      .insert([{
        id: johnAuthUser.id,
        community_id: johnVendor.community_id,
        name: johnVendor.name,
        email: 'john@example.com', // Original email
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
      }])
      .select()
      .single();

    if (createError) {
      console.log('❌ Error creating new vendor record:', createError.message);
      // Revert email change
      await supabase.from('vendors').update({ email: 'john@example.com' }).eq('id', johnVendor.id);
      return;
    }

    console.log('✅ Created new vendor record with ID:', newVendor.id);

    // Step 3: Update products to use new vendor ID
    console.log('\n5. Updating products to use new vendor ID...');
    const { error: updateProductsError } = await supabase
      .from('products')
      .update({ vendor_id: johnAuthUser.id })
      .eq('vendor_id', johnVendor.id);

    if (updateProductsError) {
      console.log('❌ Error updating products:', updateProductsError.message);
      // Clean up and revert
      await supabase.from('vendors').delete().eq('id', johnAuthUser.id);
      await supabase.from('vendors').update({ email: 'john@example.com' }).eq('id', johnVendor.id);
      return;
    }

    console.log('✅ Updated products to use new vendor ID');

    // Step 4: Update orders to use new vendor ID
    console.log('\n6. Updating orders to use new vendor ID...');
    const { error: updateOrdersError } = await supabase
      .from('orders')
      .update({ vendor_id: johnAuthUser.id })
      .eq('vendor_id', johnVendor.id);

    if (updateOrdersError) {
      console.log('❌ Error updating orders:', updateOrdersError.message);
      // Clean up and revert
      await supabase.from('vendors').delete().eq('id', johnAuthUser.id);
      await supabase.from('vendors').update({ email: 'john@example.com' }).eq('id', johnVendor.id);
      return;
    }

    console.log('✅ Updated orders to use new vendor ID');

    // Step 5: Delete the old vendor record
    console.log('\n7. Deleting old vendor record...');
    const { error: deleteError } = await supabase
      .from('vendors')
      .delete()
      .eq('id', johnVendor.id);

    if (deleteError) {
      console.log('❌ Error deleting old vendor record:', deleteError.message);
      // Clean up new vendor
      await supabase.from('vendors').delete().eq('id', johnAuthUser.id);
      return;
    }

    console.log('✅ Deleted old vendor record');
    console.log('\n🎉 John Doe vendor fix completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixJohnDoeFinal();
