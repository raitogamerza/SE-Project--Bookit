require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testBan() {
    try {
        const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
        if (error) throw error;

        // Pick the first user
        const user = users[0];
        console.log('First user:', user.email, user.id);

        console.log('Attempting to ban...');
        const result = await supabaseAdmin.auth.admin.updateUserById(user.id, { ban_duration: '876000h' });
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (err) {
        console.error('Error:', err);
    }
}

testBan();
