require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkUserLibrary() {
    console.log("Checking User Library...");
    try {
        // Query to match MyLibrary.jsx
        const { data, error } = await supabase
            .from('orders')
            .select(`
                id,
                created_at,
                status,
                user_id,
                books:book_id (
                    id,
                    title
                )
            `)
            .eq('status', 'completed')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("❌ Query failed:", error);
        } else {
            console.log("✅ Query succeeded! Found", data.length, "completed orders.");
            console.log(JSON.stringify(data, null, 2));
        }
    } catch (err) {
        console.error("Connection error:", err);
    }
}

checkUserLibrary();
