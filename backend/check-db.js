require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkOrdersTable() {
    console.log("Checking orders table...");
    try {
        const { data, error } = await supabase.from('orders').select('*').limit(1);

        if (error) {
            console.error("❌ Error querying orders table:", error.message);
            console.log("It seems the 'orders' table does not exist or lacks permissions.");
        } else {
            console.log("✅ 'orders' table exists!");
            console.log("Sample data or empty array:", data);
        }
    } catch (err) {
        console.error("Connection error:", err);
    }
}

checkOrdersTable();
