require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testQuery() {
    // Hardcode a seller ID if we can, or just get all books with their orders
    const { data: books } = await supabaseAdmin.from('books').select('id, seller_id').limit(1);
    if (!books || books.length === 0) return console.log('No books');

    const sellerId = books[0].seller_id;
    console.log('Testing for seller:', sellerId);

    // Technique 1 (from Dashboard)
    const { data: books2 } = await supabaseAdmin.from('books').select('id').eq('seller_id', sellerId);
    const bookIds = books2.map(b => b.id);
    const { data: orders1 } = await supabaseAdmin.from('orders').select('amount').in('book_id', bookIds).eq('status', 'completed');
    console.log('Dashboard Tech Total:', orders1.reduce((sum, o) => sum + Number(o.amount), 0));

    // Technique 2 (from Balance)
    const { data: orders2, error } = await supabaseAdmin
        .from('orders')
        .select('amount, books!inner(seller_id)')
        .eq('books.seller_id', sellerId)
        .eq('status', 'completed');

    console.log('Error Tech 2:', error);
    console.log('Balance Tech Total:', (orders2 || []).reduce((sum, o) => sum + Number(o.amount), 0));
}

testQuery();
