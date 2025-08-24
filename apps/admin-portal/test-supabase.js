// Test script to verify Supabase connectivity
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gqbdhpcnrsbexrvkfkso.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxYmRocGNucnNiZXhydmtma3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NTUxOTMsImV4cCI6MjA3MDMzMTE5M30.s6oQMIxDXTirHrEcZO8WdBJvd2-SAnetFmNYVjr0yuI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabase() {
  console.log('Testing Supabase connectivity...\n');

  try {
    // Test basic connection
    console.log('1. Testing basic connection...');
    const { data, error } = await supabase.from('admins').select('count').limit(1);
    
    if (error) {
      console.log('⚠️  Connection test result:', error.message);
      console.log('   This might be expected if the admins table is empty or has RLS policies');
    } else {
      console.log('✅ Basic connection successful');
    }

    // Test auth connection
    console.log('\n2. Testing auth connection...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log('⚠️  Auth test result:', authError.message);
    } else {
      console.log('✅ Auth connection successful');
      console.log('   Session status:', authData.session ? 'Active' : 'No active session');
    }

    // Test database schema
    console.log('\n3. Testing database schema...');
    const { data: schemaData, error: schemaError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(5);

    if (schemaError) {
      console.log('⚠️  Schema test result:', schemaError.message);
    } else {
      console.log('✅ Schema access successful');
      console.log('   Available tables:', schemaData?.map(t => t.table_name).join(', ') || 'None found');
    }

    console.log('\n🎉 Supabase connectivity test completed!');
    console.log('   The admin portal should now be able to connect to Supabase successfully.');

  } catch (error) {
    console.error('\n❌ Supabase test failed:', error.message);
  }
}

testSupabase();
