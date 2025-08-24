// Script to confirm admin user email
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gqbdhpcnrsbexrvkfkso.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxYmRocGNucnNiZXhydmtma3NvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDc1NTE5MywiZXhwIjoyMDcwMzMxMTkzfQ.jKTawJiqG8F09zqYR5W6-oGmqMygoTnNh06RMkqSaew';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function confirmEmail() {
  console.log('Confirming admin user email...\n');

  try {
    // Get the admin user
    console.log('1. Getting admin user...');
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
    console.log('Email confirmed:', adminUser.email_confirmed_at ? 'Yes' : 'No');

    if (adminUser.email_confirmed_at) {
      console.log('✅ Email is already confirmed');
      return;
    }

    // Confirm the email
    console.log('\n2. Confirming email...');
    const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
      adminUser.id,
      { email_confirm: true }
    );

    if (updateError) {
      console.error('❌ Error confirming email:', updateError.message);
      return;
    }

    console.log('✅ Email confirmed successfully');
    console.log('User ID:', updateData.user.id);
    console.log('Email confirmed at:', updateData.user.email_confirmed_at);

    console.log('\n🎉 Admin user is now ready for login!');
    console.log('You can now login to the admin portal with:');
    console.log('Email: admin@communitycart.com');
    console.log('Password: admin123456');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

confirmEmail();
