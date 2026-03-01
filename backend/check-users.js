require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkUsers() {
    console.log("Checking public.users table...");
    try {
        const { data, error } = await supabase.from('users').select('*');

        if (error) {
            console.error("❌ Query failed:", error);
        } else {
            console.log(`✅ Query succeeded! Found ${data.length} users.`);
            console.log(data);
        }
    } catch (err) {
        console.error("Connection error:", err);
    }
}

checkUsers();
