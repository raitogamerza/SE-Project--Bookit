require('dotenv').config({ path: '../frontend/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBooks() {
    const { data, error } = await supabase
        .from('books')
        .select('title, file_url, demo_file_url')
        .order('created_at', { ascending: false })
        .limit(2);

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Books (latest 2):');
        console.log(JSON.stringify(data, null, 2));
    }
}

checkBooks();
