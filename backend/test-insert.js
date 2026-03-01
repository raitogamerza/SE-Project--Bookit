require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testInsert() {
    console.log("Testing insert into orders table...");
    try {
        const { data, error } = await supabase.from('orders').insert([
            {
                user_id: 'e6a8dd2e-b695-4b72-a0ce-2eccc16f0ce3', // Dummy UUID
                book_id: 'e6a8dd2e-b695-4b72-a0ce-2eccc16f0ce3', // Dummy UUID
                amount: 10.00,
                status: 'completed'
            }
        ]).select();

        if (error) {
            console.error("❌ Insert failed:", error);
        } else {
            console.log("✅ Insert succeeded:", data);
        }
    } catch (err) {
        console.error("Connection error:", err);
    }
}

testInsert();
