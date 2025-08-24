const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

// Use provided credentials or fall back to environment variables
const supabaseUrl = process.env.SUPABASE_URL || 'https://gqbdhpcnrsbexrvkfkso.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxYmRocGNucnNiZXhydmtma3NvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDc1NTE5MywiZXhwIjoyMDcwMzMxMTkzfQ.jKTawJiqG8F09zqYR5W6-oGmqMygoTnNh06RMkqSaew';

// Validate that we have the required credentials
if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL and Service Role Key are required. Please check your environment variables or .env file.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = { supabase };
