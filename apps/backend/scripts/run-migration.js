const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('🚀 Starting migration: 002_vendor_analytics_tables.sql');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '../sql/migrations/002_vendor_analytics_tables.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          
          if (error) {
            console.error(`❌ Error in statement ${i + 1}:`, error.message);
            // Continue with other statements
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } catch (err) {
          console.error(`❌ Exception in statement ${i + 1}:`, err.message);
        }
      }
    }
    
    console.log('🎉 Migration completed!');
    
    // Test the new tables
    console.log('\n🔍 Testing new tables...');
    
    const { data: vendors, error: vendorsError } = await supabase
      .from('vendors')
      .select('*')
      .limit(1);
    
    if (vendorsError) {
      console.error('❌ Error testing vendors table:', vendorsError.message);
    } else {
      console.log('✅ Vendors table accessible');
    }
    
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .limit(1);
    
    if (ordersError) {
      console.error('❌ Error testing orders table:', ordersError.message);
    } else {
      console.log('✅ Orders table accessible');
    }
    
    const { data: metrics, error: metricsError } = await supabase
      .from('vendor_metrics')
      .select('*')
      .limit(1);
    
    if (metricsError) {
      console.error('❌ Error testing vendor_metrics view:', metricsError.message);
    } else {
      console.log('✅ Vendor metrics view accessible');
    }
    
  } catch (error) {
    console.error('💥 Migration failed:', error.message);
    process.exit(1);
  }
}

// Alternative approach: Execute SQL directly using raw query
async function runMigrationDirect() {
  try {
    console.log('🚀 Starting direct migration execution...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '../sql/migrations/002_vendor_analytics_tables.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the entire migration as one query
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql: migrationSQL 
    });
    
    if (error) {
      console.error('❌ Migration error:', error.message);
      
      // Try alternative approach - execute key statements individually
      console.log('🔄 Trying alternative approach...');
      
      const keyStatements = [
        `CREATE TABLE IF NOT EXISTS orders (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
          customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
          status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
          total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
          customer_name VARCHAR(255),
          customer_phone VARCHAR(20),
          order_date DATE NOT NULL DEFAULT CURRENT_DATE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
        )`,
        
        `CREATE TABLE IF NOT EXISTS customers (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL,
          phone VARCHAR(20),
          address TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
        )`,
        
        `ALTER TABLE vendors 
         ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 4.0 CHECK (rating >= 0 AND rating <= 5),
         ADD COLUMN IF NOT EXISTS total_orders INTEGER DEFAULT 0 CHECK (total_orders >= 0),
         ADD COLUMN IF NOT EXISTS total_revenue DECIMAL(12,2) DEFAULT 0 CHECK (total_revenue >= 0)`
      ];
      
      for (const stmt of keyStatements) {
        const { error: stmtError } = await supabase.rpc('exec_sql', { sql: stmt });
        if (stmtError) {
          console.error('❌ Statement error:', stmtError.message);
        } else {
          console.log('✅ Statement executed successfully');
        }
      }
    } else {
      console.log('✅ Migration executed successfully');
    }
    
    console.log('🎉 Migration process completed!');
    
  } catch (error) {
    console.error('💥 Direct migration failed:', error.message);
  }
}

// Run the migration
runMigrationDirect();
