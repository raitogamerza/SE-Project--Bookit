require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://wixrtifshezyldsgyjzr.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpeHJ0aWZzaGV6eWxkc2d5anpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MzU5NDgsImV4cCI6MjA4NzAxMTk0OH0.FPoIiAYLcJx2KQzvb3UWRLss8ZZAZfXB9bKwOVhG-ws';
const supabase = createClient(supabaseUrl, process.env.SUPABASE_ANON_KEY);

const testUrl = "https://wixrtifshezyldsgyjzr.supabase.co/storage/v1/object/public/books/a53c0c75-a533-4195-a378-b5ffe3604987/book_1772180942981.pdf";

const extractPath = (url) => {
    if (!url) return null;
    const parts = url.split('/public/books/');
    return parts.length > 1 ? parts[1] : null;
};

const path = extractPath(testUrl);
console.log("Extracted path:", path);

async function check() {
    console.log("Attempting to delete with anon key (this will fail if RLS blocks it)");
    const { data, error } = await supabase.storage.from('books').remove([path]);
    console.log("Result:", { data, error });
}
check();
