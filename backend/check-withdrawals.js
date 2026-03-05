require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkTable() {
    const { data, error } = await supabaseAdmin.from('withdrawals').select('*').limit(1);
    console.log('Result:', { data, error });
}

checkTable();
