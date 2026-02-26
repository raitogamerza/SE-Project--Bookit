require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wixrtifshezyldsgyjzr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpeHJ0aWZzaGV6eWxkc2d5anpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MzU5NDgsImV4cCI6MjA4NzAxMTk0OH0.FPoIiAYLcJx2KQzvb3UWRLss8ZZAZfXB9bKwOVhG-ws';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    const { data, error } = await supabase.from('books').select('*').limit(1);
    if (error) console.error(error);
    else console.log(data);
}

test();
