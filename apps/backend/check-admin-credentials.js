const { supabase } = require('./src/config/supabaseClient');

async function checkAdminCredentials() {
  console.log('🔍 Checking admin credentials...\n');

  try {
    // Check if admin@admin.com exists
    console.log('1. Checking admin@admin.com...');
    const { data: adminUser, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.log('❌ Auth error:', authError.message);
    } else if (adminUser && adminUser.users) {
      const admin = adminUser.users.find(user => user.email === 'admin@admin.com');
      if (admin) {
        console.log('✅ Admin user exists in Auth');
        console.log('   User ID:', admin.id);
        console.log('   Email:', admin.email);
        console.log('   Email confirmed:', admin.email_confirmed_at ? 'Yes' : 'No');
      } else {
        console.log('❌ Admin user not found in Auth');
      }
    } else {
      console.log('❌ Could not retrieve users from Auth');
    }

    // Check if admin profile exists in admins table
    console.log('\n2. Checking admin profile in admins table...');
    const { data: adminProfile, error: profileError } = await supabase
      .from('admins')
      .select('*')
      .eq('email', 'admin@admin.com')
      .single();

    if (profileError) {
      console.log('❌ Profile error:', profileError.message);
    } else if (adminProfile) {
      console.log('✅ Admin profile exists in admins table');
      console.log('   ID:', adminProfile.id);
      console.log('   Name:', adminProfile.name);
      console.log('   Email:', adminProfile.email);
    } else {
      console.log('❌ Admin profile not found in admins table');
    }

    // Try to login
    console.log('\n3. Testing login...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'admin@admin.com',
      password: '12345678'
    });

    if (loginError) {
      console.log('❌ Login failed:', loginError.message);
    } else {
      console.log('✅ Login successful!');
      console.log('   Session:', loginData.session ? 'Valid' : 'Invalid');
      console.log('   User ID:', loginData.user?.id);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkAdminCredentials();
