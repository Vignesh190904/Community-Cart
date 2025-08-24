// Script to update admin user credentials
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gqbdhpcnrsbexrvkfkso.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxYmRocGNucnNiZXhydmtma3NvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDc1NTE5MywiZXhwIjoyMDcwMzMxMTkzfQ.jKTawJiqG8F09zqYR5W6-oGmqMygoTnNh06RMkqSaew';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateAdminCredentials() {
  console.log('Updating admin user credentials...\n');

  try {
    // First, get the current admin user
    console.log('1. Getting current admin user...');
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Error getting users:', usersError.message);
      return;
    }

    const adminUser = users.users.find(user => user.email === 'admin@communitycart.com');
    
    if (!adminUser) {
      console.log('❌ Admin user not found');
      return;
    }

    console.log('✅ Admin user found');
    console.log('User ID:', adminUser.id);
    console.log('Current Email:', adminUser.email);

    // Update the user email to 'admin@admin.com'
    console.log('\n2. Updating email to "admin@admin.com"...');
    const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
      adminUser.id,
      { 
        email: 'admin@admin.com',
        email_confirm: true
      }
    );

    if (updateError) {
      console.error('❌ Error updating email:', updateError.message);
      return;
    }

    console.log('✅ Email updated successfully');
    console.log('New Email:', updateData.user.email);

    // Update the password to '12345678'
    console.log('\n3. Updating password to "12345678"...');
    const { data: passwordData, error: passwordError } = await supabase.auth.admin.updateUserById(
      adminUser.id,
      { 
        password: '12345678'
      }
    );

    if (passwordError) {
      console.error('❌ Error updating password:', passwordError.message);
      return;
    }

    console.log('✅ Password updated successfully');

    // Update the admin profile in the database
    console.log('\n4. Updating admin profile in database...');
    const { data: profileData, error: profileError } = await supabase
      .from('admins')
      .update({ 
        email: 'admin@admin.com',
        name: 'Admin User'
      })
      .eq('id', adminUser.id)
      .select()
      .single();

    if (profileError) {
      console.error('❌ Error updating admin profile:', profileError.message);
      return;
    }

    console.log('✅ Admin profile updated successfully');
    console.log('Profile Email:', profileData.email);
    console.log('Profile Name:', profileData.name);

    console.log('\n🎉 Admin credentials updated successfully!');
    console.log('New Login Credentials:');
    console.log('Email: admin@admin.com');
    console.log('Password: 12345678');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

updateAdminCredentials();
