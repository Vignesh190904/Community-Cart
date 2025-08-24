const { supabase } = require('./src/config/supabaseClient');

async function createAdminProfile() {
  console.log('🔧 Creating admin profile...\n');

  try {
    // First, get the admin user from auth
    const { data: adminUser, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.log('❌ Auth error:', authError.message);
      return;
    }

    const admin = adminUser.users.find(user => user.email === 'admin@admin.com');
    if (!admin) {
      console.log('❌ Admin user not found in Auth');
      return;
    }

    console.log('✅ Found admin user:', admin.id);

    // Check if admin profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('admins')
      .select('*')
      .eq('email', 'admin@admin.com');

    if (checkError) {
      console.log('❌ Error checking existing profile:', checkError.message);
      return;
    }

    if (existingProfile && existingProfile.length > 0) {
      console.log('✅ Admin profile already exists');
      console.log('   ID:', existingProfile[0].id);
      console.log('   Name:', existingProfile[0].name);
      return;
    }

    // Create admin profile
    const { data: newProfile, error: createError } = await supabase
      .from('admins')
      .insert([
        {
          id: admin.id,
          name: 'Admin User',
          email: 'admin@admin.com',
          phone: null,
          password_hash: 'managed_by_supabase_auth'
        }
      ])
      .select('*')
      .single();

    if (createError) {
      console.log('❌ Error creating admin profile:', createError.message);
      return;
    }

    console.log('✅ Admin profile created successfully!');
    console.log('   ID:', newProfile.id);
    console.log('   Name:', newProfile.name);
    console.log('   Email:', newProfile.email);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createAdminProfile();
