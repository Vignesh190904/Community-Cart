const { supabase } = require('./src/config/supabaseClient');

async function checkVendorSchema() {
  console.log('🔍 Checking vendors table schema...\n');

  try {
    // Try to get a vendor record to see what columns exist
    console.log('1. Getting a vendor record...');
    const { data: vendor, error: vendorError } = await supabase
      .from('vendors')
      .select('*')
      .limit(1)
      .single();

    if (vendorError) {
      console.log('❌ Error fetching vendor:', vendorError.message);
      return;
    }

    console.log('✅ Vendor record found');
    console.log('📋 Available columns:');
    Object.keys(vendor).forEach(key => {
      console.log(`   - ${key}: ${typeof vendor[key]} (${vendor[key]})`);
    });

    // Check if password_hash column exists
    if ('password_hash' in vendor) {
      console.log('\n✅ password_hash column exists');
    } else {
      console.log('\n❌ password_hash column does not exist');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkVendorSchema();
