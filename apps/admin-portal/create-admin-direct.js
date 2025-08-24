// Script to create admin user directly using Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gqbdhpcnrsbexrvkfkso.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxYmRocGNucnNiZXhydmtma3NvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDc1NTE5MywiZXhwIjoyMDcwMzMxMTkzfQ.jKTawJiqG8F09zqYR5W6-oGmqMygoTnNh06RMkqSaew';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminDirect() {
  console.log('Creating admin user directly...\n');

  const adminData = {
    email: 'admin@communitycart.com',
    password: 'admin123456',
    name: 'Admin User',
    phone: '+1234567890'
  };

  try {
    console.log('1. Creating user in Supabase Auth...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminData.email,
      password: adminData.password,
      email_confirm: true,
      user_metadata: {
        name: adminData.name,
        role: 'admin'
      }
    });

    if (authError) {
      console.error('❌ Auth creation failed:', authError.message);
      return;
    }

    console.log('✅ User created in Supabase Auth');
    console.log('User ID:', authData.user.id);

    console.log('\n2. Creating admin profile in database...');
    const { data: profileData, error: adminError } = await supabase
      .from('admins')
      .insert([
        {
          id: authData.user.id,
          name: adminData.name,
          email: adminData.email,
          phone: adminData.phone,
          password_hash: 'managed_by_supabase_auth'
        }
      ])
      .select()
      .single();

    if (adminError) {
      console.error('❌ Admin profile creation failed:', adminError.message);
      return;
    }

    console.log('✅ Admin profile created successfully');
    console.log('Admin ID:', profileData.id);
    console.log('Name:', profileData.name);
    console.log('Email:', profileData.email);

    console.log('\n🎉 Admin user created successfully!');
    console.log('You can now login to the admin portal with:');
    console.log('Email: admin@communitycart.com');
    console.log('Password: admin123456');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
}

createAdminDirect();
