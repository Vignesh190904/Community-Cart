const { supabase } = require('./src/config/supabaseClient');

async function createViews() {
  console.log('🔧 Creating missing database views...\n');

  try {
    // Create vendor_metrics view
    console.log('1. Creating vendor_metrics view...');
    const { error: vmError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE VIEW vendor_metrics AS
        SELECT 
          v.id as vendor_id,
          v.name as vendor_name,
          v.shop_name,
          v.rating,
          COUNT(DISTINCT p.id) as total_products,
          COUNT(DISTINCT CASE WHEN p.available = true THEN p.id END) as active_products,
          COUNT(DISTINCT o.id) as total_orders,
          COUNT(DISTINCT CASE WHEN o.status = 'completed' THEN o.id END) as completed_orders,
          COALESCE(SUM(CASE WHEN o.status = 'completed' THEN o.total_amount ELSE 0 END), 0) as total_revenue,
          CASE 
            WHEN COUNT(DISTINCT o.id) > 0 
            THEN COALESCE(SUM(CASE WHEN o.status = 'completed' THEN o.total_amount ELSE 0 END), 0) / COUNT(DISTINCT o.id)
            ELSE 0 
          END as avg_order_value,
          COALESCE(SUM(CASE WHEN o.status = 'completed' THEN o.total_amount * 0.1 ELSE 0 END), 0) as total_profit
        FROM vendors v
        LEFT JOIN products p ON v.id = p.vendor_id
        LEFT JOIN orders o ON v.id = o.vendor_id
        GROUP BY v.id, v.name, v.shop_name, v.rating;
      `
    });

    if (vmError) {
      console.log('❌ Error creating vendor_metrics view:', vmError.message);
    } else {
      console.log('✅ vendor_metrics view created successfully');
    }

    // Test the view
    console.log('\n2. Testing vendor_metrics view...');
    const { data: testData, error: testError } = await supabase
      .from('vendor_metrics')
      .select('*')
      .limit(1);

    if (testError) {
      console.log('❌ Error testing vendor_metrics view:', testError.message);
    } else {
      console.log('✅ vendor_metrics view working correctly');
      console.log('   Sample data:', testData);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createViews();
