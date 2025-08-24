const { supabase } = require('./src/config/supabaseClient');

async function checkSchema() {
  console.log('🔍 Checking database schema...\n');

  try {
    // Check if vendors table exists and has data
    console.log('1. Checking vendors table...');
    const { data: vendors, error: vendorsError } = await supabase
      .from('vendors')
      .select('count(*)')
      .limit(1);

    if (vendorsError) {
      console.log('❌ Vendors table error:', vendorsError.message);
    } else {
      console.log('✅ Vendors table exists');
    }

    // Check if vendor_metrics view exists
    console.log('\n2. Checking vendor_metrics view...');
    const { data: metrics, error: metricsError } = await supabase
      .from('vendor_metrics')
      .select('*')
      .limit(1);

    if (metricsError) {
      console.log('❌ vendor_metrics view error:', metricsError.message);
    } else {
      console.log('✅ vendor_metrics view exists');
    }

    // Check if monthly_revenue view exists
    console.log('\n3. Checking monthly_revenue view...');
    const { data: revenue, error: revenueError } = await supabase
      .from('monthly_revenue')
      .select('*')
      .limit(1);

    if (revenueError) {
      console.log('❌ monthly_revenue view error:', revenueError.message);
    } else {
      console.log('✅ monthly_revenue view exists');
    }

    // Check if orders table exists
    console.log('\n4. Checking orders table...');
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('count(*)')
      .limit(1);

    if (ordersError) {
      console.log('❌ Orders table error:', ordersError.message);
    } else {
      console.log('✅ Orders table exists');
    }

    // Check if communities table exists
    console.log('\n5. Checking communities table...');
    const { data: communities, error: communitiesError } = await supabase
      .from('communities')
      .select('count(*)')
      .limit(1);

    if (communitiesError) {
      console.log('❌ Communities table error:', communitiesError.message);
    } else {
      console.log('✅ Communities table exists');
    }

    // Try to get actual vendor data
    console.log('\n6. Getting actual vendor data...');
    const { data: actualVendors, error: actualVendorsError } = await supabase
      .from('vendors')
      .select('*')
      .limit(5);

    if (actualVendorsError) {
      console.log('❌ Error fetching vendors:', actualVendorsError.message);
    } else {
      console.log(`✅ Found ${actualVendors.length} vendors`);
      if (actualVendors.length > 0) {
        console.log('   Sample vendor:', {
          id: actualVendors[0].id,
          name: actualVendors[0].name,
          shop_name: actualVendors[0].shop_name
        });
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkSchema();
