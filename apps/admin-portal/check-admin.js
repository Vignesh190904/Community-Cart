// Script to check admin profile and create if needed
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gqbdhpcnrsbexrvkfkso.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxYmRocGNucnNiZXhydmtma3NvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDc1NTE5MywiZXhwIjoyMDcwMzMxMTkzfQ.jKTawJiqG8F09zqYR5W6-oGmqMygoTnNh06RMkqSaew';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAndCreateAdmin() {
  console.log('Checking admin profile...\n');

  try {
    // First, get the user from Supabase Auth
    console.log('1. Getting user from Supabase Auth...');
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Error getting users:', usersError.message);
      return;
    }

    const adminUser = users.users.find(user => user.email === 'admin@communitycart.com');
    
    if (!adminUser) {
      console.log('❌ Admin user not found in Supabase Auth');
      return;
    }

    console.log('✅ Admin user found in Supabase Auth');
    console.log('User ID:', adminUser.id);
    console.log('Email:', adminUser.email);

    // Check if admin profile exists in database
    console.log('\n2. Checking admin profile in database...');
    const { data: adminProfile, error: profileError } = await supabase
      .from('admins')
      .select('*')
      .eq('id', adminUser.id)
      .single();

    if (profileError && profileError.code === 'PGRST116') {
      // Admin profile doesn't exist, create it
      console.log('❌ Admin profile not found in database, creating...');
      
      const { data: newProfile, error: createError } = await supabase
        .from('admins')
        .insert([
          {
            id: adminUser.id,
            name: 'Admin User',
            email: adminUser.email,
            phone: '+1234567890',
            password_hash: 'managed_by_supabase_auth'
          }
        ])
        .select()
        .single();

      if (createError) {
        console.error('❌ Error creating admin profile:', createError.message);
        return;
      }

      console.log('✅ Admin profile created successfully');
      console.log('Admin ID:', newProfile.id);
      console.log('Name:', newProfile.name);
      console.log('Email:', newProfile.email);

    } else if (profileError) {
      console.error('❌ Error checking admin profile:', profileError.message);
      return;
    } else {
      console.log('✅ Admin profile already exists in database');
      console.log('Admin ID:', adminProfile.id);
      console.log('Name:', adminProfile.name);
      console.log('Email:', adminProfile.email);
    }

    console.log('\n🎉 Admin setup complete!');
    console.log('You can now login to the admin portal with:');
    console.log('Email: admin@communitycart.com');
    console.log('Password: admin123456');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkAndCreateAdmin();
