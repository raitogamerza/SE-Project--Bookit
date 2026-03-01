require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://wixrtifshezyldsgyjzr.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkWithdrawals() {
    console.log("Checking if 'withdrawals' table exists...");

    // Try to select exactly 0 rows from withdrawals just to see if it errors
    const { data, error } = await supabase
        .from('withdrawals')
        .select('*')
        .limit(0);

    if (error) {
        console.error("❌ Table DOES NOT exist or error occurred:", error.message);
    } else {
        console.log("✅ The 'withdrawals' table exists and is ready!");
    }
}

checkWithdrawals();
