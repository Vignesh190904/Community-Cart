const { supabase } = require('./src/config/supabaseClient');

async function debugVendors() {
  console.log('🔍 Debugging vendors table...\n');

  try {
    // Check if vendors table exists
    console.log('1. Checking vendors table...');
    const { data: vendors, error } = await supabase
      .from('vendors')
      .select('*')
      .limit(5);

    if (error) {
      console.log('❌ Error fetching vendors:', error.message);
      console.log('Error details:', error);
      return;
    }

    console.log(`✅ Found ${vendors?.length || 0} vendors`);
    
    if (vendors && vendors.length > 0) {
      console.log('\nSample vendor data:');
      console.log(JSON.stringify(vendors[0], null, 2));
    }

    // Check communities table
    console.log('\n2. Checking communities table...');
    const { data: communities, error: communitiesError } = await supabase
      .from('communities')
      .select('*')
      .limit(5);

    if (communitiesError) {
      console.log('❌ Error fetching communities:', communitiesError.message);
    } else {
      console.log(`✅ Found ${communities?.length || 0} communities`);
      if (communities && communities.length > 0) {
        console.log('\nSample community data:');
        console.log(JSON.stringify(communities[0], null, 2));
      }
    }

    // Try the exact query from the admin route
    console.log('\n3. Testing admin route query...');
    const { data: adminVendors, error: adminError } = await supabase
      .from('vendors')
      .select(`
        id,
        name,
        email,
        shop_name,
        phone,
        business_name,
        category,
        description,
        rating,
        total_orders,
        total_revenue,
        status,
        created_at,
        communities(name)
      `)
      .order('created_at', { ascending: false });

    if (adminError) {
      console.log('❌ Error with admin query:', adminError.message);
      console.log('Error details:', adminError);
    } else {
      console.log(`✅ Admin query successful, found ${adminVendors?.length || 0} vendors`);
      if (adminVendors && adminVendors.length > 0) {
        console.log('\nSample admin vendor data:');
        console.log(JSON.stringify(adminVendors[0], null, 2));
      }
    }

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugVendors();
