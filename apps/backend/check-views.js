const { supabase } = require('./src/config/supabaseClient');

async function checkViews() {
  console.log('🔍 Checking database views...\n');

  try {
    // Check vendor_metrics view
    console.log('1. Checking vendor_metrics view...');
    const { data: vendorMetrics, error: vmError } = await supabase
      .from('vendor_metrics')
      .select('*')
      .limit(1);

    if (vmError) {
      console.log('❌ vendor_metrics view error:', vmError.message);
    } else {
      console.log('✅ vendor_metrics view exists');
      console.log('   Sample data:', vendorMetrics);
    }

    // Check monthly_revenue view
    console.log('\n2. Checking monthly_revenue view...');
    const { data: monthlyRevenue, error: mrError } = await supabase
      .from('monthly_revenue')
      .select('*')
      .limit(1);

    if (mrError) {
      console.log('❌ monthly_revenue view error:', mrError.message);
    } else {
      console.log('✅ monthly_revenue view exists');
      console.log('   Sample data:', monthlyRevenue);
    }

    // Check if views exist in information_schema
    console.log('\n3. Checking information_schema for views...');
    const { data: views, error: viewsError } = await supabase
      .rpc('get_views');

    if (viewsError) {
      console.log('❌ Error checking views:', viewsError.message);
    } else {
      console.log('✅ Available views:', views);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkViews();
