const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createDefaultAdmin() {
  try {
    const adminEmail = 'vignesh190904@gmail.com';
    const adminPassword = 'LordVikky@190904';
    const adminName = 'Vignesh Admin';

    console.log('Creating default admin account...');
    console.log(`Email: ${adminEmail}`);
    console.log(`Name: ${adminName}`);

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(adminPassword, saltRounds);
    console.log('Password hashed successfully');

    // First, create the user in Supabase Auth
    console.log('Creating user in Supabase Auth...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        name: adminName,
        role: 'admin'
      }
    });

    if (authError) {
      console.error('Error creating user in Supabase Auth:', authError);
      return;
    }

    console.log('User created in Supabase Auth successfully');
    const userId = authData.user.id;

    // Insert admin details into admins table
    console.log('Inserting admin details into admins table...');
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .insert([
        {
          id: userId,
          name: adminName,
          email: adminEmail,
          phone: null,
          password_hash: passwordHash,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (adminError) {
      console.error('Error inserting into admins table:', adminError);
      return;
    }

    console.log('Admin account created successfully!');
    console.log('Admin ID:', adminData.id);
    console.log('Admin Name:', adminData.name);
    console.log('Admin Email:', adminData.email);
    console.log('Created at:', adminData.created_at);
    console.log('\nDefault Admin Credentials:');
    console.log('Email: vignesh190904@gmail.com');
    console.log('Password: LordVikky@190904');
    console.log('\nYou can now use these credentials to log into the Admin Portal!');

  } catch (error) {
    console.error('Error creating default admin:', error);
  }
}

// Run the function
createDefaultAdmin();
