require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
    process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

async function seedAdmin() {
    const email = 'admin@bookit.com';
    const password = 'adminpassword123';

    try {
        console.log(`Checking if ${email} exists...`);
        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        if (listError) throw listError;

        let user = users.find(u => u.email === email);

        if (user) {
            console.log(`User ${email} already exists! Forcing role to admin and resetting password...`);
            const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
                password: password,
                user_metadata: { ...user.user_metadata, role: 'admin', full_name: 'Global Admin' },
                email_confirm: true
            });

            if (updateError) throw updateError;
            console.log(`✅ Success! The admin account is ready to use.`);
            console.log(`\nEmail: ${email}\nPassword: ${password}\n`);

        } else {
            console.log(`Creating new admin account ${email}...`);
            const { data, error: createError } = await supabaseAdmin.auth.admin.createUser({
                email: email,
                password: password,
                email_confirm: true,
                user_metadata: { role: 'admin', full_name: 'Global Admin' }
            });

            if (createError) throw createError;
            console.log(`✅ Success! The admin account has been created.`);
            console.log(`\nEmail: ${email}\nPassword: ${password}\n`);
        }
    } catch (e) {
        console.error("Failed to seed admin:", e.message);
    }
}

seedAdmin();
