require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://wixrtifshezyldsgyjzr.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY in .env");
    process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);
const email = process.argv[2];

if (!email) {
    console.error("Please provide an email: node make-admin.js <your-email@example.com>");
    process.exit(1);
}

async function makeAdmin() {
    try {
        console.log(`Searching for user with email: ${email}...`);

        // 1. Find user by email
        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        if (listError) throw listError;

        const user = users.find(u => u.email === email);
        if (!user) {
            console.error(`User with email ${email} not found. Please register this email in the app first.`);
            process.exit(1);
        }

        // 2. Update user metadata
        const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
            user.id,
            { user_metadata: { ...user.user_metadata, role: 'admin' } }
        );

        if (error) {
            console.error("Error updating user:", error.message);
        } else {
            console.log(`\n✅ Success! ${email} is now an Admin. 🎉`);
            console.log("👉 Please log out and log back in on the website for the new admin rights to take effect.");
            console.log("URL for Admin Dashboard: http://localhost:5173/admin/dashboard\n");
        }
    } catch (e) {
        console.error("Unexpected error:", e);
    }
}

makeAdmin();
