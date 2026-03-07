const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 5000;

// Initialize Supabase Client with Service Role Key to bypass RLS for backend tasks
const supabaseUrl = process.env.SUPABASE_URL || 'https://wixrtifshezyldsgyjzr.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseKey) {
    console.error("CRITICAL ERROR: Missing SUPABASE_SERVICE_ROLE_KEY in .env");
}
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors());

// Stripe Webhook MUST be before express.json()
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
    const payload = request.body;
    const sig = request.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        if (endpointSecret) {
            event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
        } else {
            // Fallback for local testing without webhook secret
            event = JSON.parse(payload);
        }
    } catch (err) {
        console.error('Webhook signature verification failed.', err.message);
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const userId = paymentIntent.metadata?.userId;
        let bookIds = [];
        try {
            bookIds = JSON.parse(paymentIntent.metadata?.bookIds || '[]');
        } catch (e) { }

        if (userId && bookIds.length > 0) {
            console.log(`[Webhook] Fulfilling order for User ${userId}, Books: ${bookIds}`);
            // Fulfill the order by inserting into Supabase
            for (const bookId of bookIds) {
                const { data: book } = await supabase.from('books').select('price').eq('id', bookId).single();
                if (book) {
                    await supabase.from('orders').insert([{
                        user_id: userId,
                        book_id: bookId,
                        amount: book.price,
                        status: 'completed'
                    }]);
                }
            }
        }
    }
    response.send();
});

// JSON middleware for all other routes
app.use(express.json());

// Routes

// Basic health check route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Bookit Backend API' });
});

// Route to create a PaymentIntent for Stripe Elements
app.post('/api/create-payment-intent', async (req, res) => {
    try {
        const { items, userId } = req.body;
        if (!items || items.length === 0 || !userId) {
            return res.status(400).json({ error: 'Missing items or user ID' });
        }

        // Calculate total amount in Satang (smallest currency unit for THB)
        const amount = Math.round(items.reduce((sum, item) => sum + item.price, 0) * 100);
        const bookIds = items.map(item => item.id);

        // Create a PaymentIntent with payment method types
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'thb',
            automatic_payment_methods: { enabled: true },
            metadata: {
                userId: userId,
                bookIds: JSON.stringify(bookIds)
            }
        });

        // Send the client secret back to the frontend to render the Element
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Stripe PaymentIntent Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Route for Direct QR Code Checkout (Mock Verification)
app.post('/api/checkout-direct', async (req, res) => {
    try {
        const { items, userId, exactAmount } = req.body; // Accept exactAmount
        if (!items || items.length === 0 || !userId) {
            return res.status(400).json({ error: 'Missing items or user ID' });
        }

        // We initially mark the order as "pending" instead of "completed"
        for (const item of items) {
            await supabase.from('orders').insert([{
                user_id: userId,
                book_id: item.id,
                amount: exactAmount || item.price, // Save exact decimals
                status: 'pending' // Changed to pending
            }]);
        }

        res.json({ success: true, message: 'Order created and pending verification.', exactAmount });
    } catch (error) {
        console.error('Direct Checkout Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Route to securely verify payment and fulfill order
app.post('/api/verify-payment', async (req, res) => {
    try {
        const { paymentIntentId } = req.body;
        if (!paymentIntentId) {
            return res.status(400).json({ error: 'Missing payment intent ID' });
        }

        // Retrieve the payment intent securely from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({ error: 'Payment not successful' });
        }

        const userId = paymentIntent.metadata?.userId;
        let bookIds = [];
        try {
            bookIds = JSON.parse(paymentIntent.metadata?.bookIds || '[]');
        } catch (e) {
            console.error('Failed to parse bookIds from metadata', e);
        }

        if (!userId || bookIds.length === 0) {
            return res.status(400).json({ error: 'Invalid payment metadata' });
        }

        console.log(`[Verify Payment] Fulfilling order for User ${userId}, Books: ${bookIds}`);

        // Fulfill the order securely
        for (const bookId of bookIds) {
            // Check if order already exists to prevent duplicate fulfillment
            const { data: existingOrder } = await supabase
                .from('orders')
                .select('id')
                .eq('user_id', userId)
                .eq('book_id', bookId)
                .single();

            if (!existingOrder) {
                const { data: book } = await supabase.from('books').select('price').eq('id', bookId).single();
                if (book) {
                    await supabase.from('orders').insert([{
                        user_id: userId,
                        book_id: bookId,
                        amount: book.price,
                        status: 'completed'
                    }]);
                }
            }
        }

        res.json({ success: true, message: 'Order verified and fulfilled securely.' });
    } catch (error) {
        console.error('Verify Payment Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Route for Auto Email Payment Verification
app.post('/api/verify-payment', async (req, res) => {
    try {
        const { exactAmount, userId } = req.body;

        if (!exactAmount) {
            return res.status(400).json({ error: 'Missing exact amount to verify' });
        }

        const emailUser = process.env.EMAIL_USER;
        const emailPass = process.env.EMAIL_PASS;

        if (!emailUser || !emailPass) {
            console.error("No EMAIL_USER or EMAIL_PASS set up in .env");
            return res.status(500).json({ error: 'Backend email processor not configured.' });
        }

        // Call our IMAP service
        const isVerified = await checkRecentEmails(exactAmount, emailUser, emailPass);

        if (isVerified) {
            // Update the pending orders to completed
            const { error: updateErr } = await supabase
                .from('orders')
                .update({ status: 'completed' })
                .eq('user_id', userId)
                .eq('amount', exactAmount)
                .eq('status', 'pending');

            if (updateErr) {
                console.error("Error updating order status:", updateErr);
            }
            return res.json({ success: true, message: 'Payment verified successfully!' });
        } else {
            return res.json({ success: false, message: 'Payment not yet found in bank notifications. Please wait a minute and try again.' });
        }

    } catch (error) {
        console.error('Verify Payment Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Route for Seller Dashboard Analytics
app.get('/api/seller/dashboard/:sellerId', async (req, res) => {
    try {
        const { sellerId } = req.params;

        if (!sellerId) {
            return res.status(400).json({ error: 'Missing seller ID' });
        }

        const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey);

        // 1. Get all books owned by this seller
        const { data: books, error: booksError } = await supabaseAdmin
            .from('books')
            .select('id, title')
            .eq('seller_id', sellerId);

        if (booksError) throw booksError;

        if (!books || books.length === 0) {
            return res.json({
                totalRevenue: 0,
                totalOrders: 0,
                newCustomers: 0,
                chartData: [],
                topFan: null
            });
        }

        const bookIds = books.map(b => b.id);

        // 2. Get all completed orders for these books
        const { data: orders, error: ordersError } = await supabaseAdmin
            .from('orders')
            .select('*, profiles(full_name, username, email)')
            .in('book_id', bookIds)
            .eq('status', 'completed');

        if (ordersError) throw ordersError;

        // 3. Compute Stats
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + Number(order.amount), 0);

        // Calculate unique customers
        const uniqueUsers = new Set(orders.map(o => o.user_id));
        const newCustomers = uniqueUsers.size;

        // 4. Calculate Top Fan
        const userFrequency = {};
        orders.forEach(o => {
            const uid = o.user_id;
            if (!userFrequency[uid]) {
                userFrequency[uid] = { count: 0, profile: o.profiles };
            }
            userFrequency[uid].count += 1;
        });

        let topFan = null;
        let maxCount = 0;
        for (const [uid, data] of Object.entries(userFrequency)) {
            if (data.count > maxCount) {
                maxCount = data.count;
                topFan = {
                    name: data.profile?.full_name || data.profile?.username || data.profile?.email || 'Anonymous',
                    count: data.count
                };
            }
        }

        // 5. Generate Chart Data (Last 7 Days)
        const chartDataMap = {};
        // Initialize last 7 days to 0
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' }); // "Mon", "Tue"
            chartDataMap[dateStr] = 0;
        }

        orders.forEach(o => {
            const orderDate = new Date(o.created_at);
            const dateStr = orderDate.toLocaleDateString('en-US', { weekday: 'short' });
            if (chartDataMap[dateStr] !== undefined) {
                chartDataMap[dateStr] += Number(o.amount);
            }
        });

        const chartData = Object.keys(chartDataMap).map(key => ({
            name: key,
            sales: chartDataMap[key]
        }));

        // 6. Format Recent Orders for the Table
        const recentOrders = orders
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 10)
            .map(o => {
                const book = books.find(b => b.id === o.book_id) || {};
                return {
                    id: o.id.split('-')[0].toUpperCase(),
                    customer: o.profiles?.full_name || o.profiles?.username || o.profiles?.email || 'Unknown',
                    book: book.title || 'Unknown Book',
                    date: new Date(o.created_at).toISOString().split('T')[0],
                    amount: o.amount,
                    status: o.status === 'completed' ? 'Completed' : 'Processing'
                };
            });

        res.json({
            totalRevenue,
            totalOrders,
            newCustomers,
            chartData: chartData.length > 0 ? chartData : [
                { name: 'Mon', sales: 0 }, { name: 'Tue', sales: 0 }, { name: 'Wed', sales: 0 },
                { name: 'Thu', sales: 0 }, { name: 'Fri', sales: 0 }, { name: 'Sat', sales: 0 }, { name: 'Sun', sales: 0 }
            ],
            topFan,
            recentOrders
        });

    } catch (error) {
        console.error('Seller Dashboard Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Route to Add a Book
app.post('/api/books', async (req, res) => {
    try {
        const { title, author, description, price, genre, coverUrl, demoFileUrl, fileUrl, sellerId } = req.body;

        // Basic validation
        if (!title || !author || !price || !sellerId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const authHeader = req.headers.authorization;

        // Create a user-scoped supabase client to respect RLS
        const supabaseClient = createClient(supabaseUrl, supabaseKey, {
            global: {
                headers: {
                    Authorization: authHeader || ''
                }
            }
        });

        const { data, error } = await supabaseClient
            .from('books')
            .insert([
                {
                    title,
                    author,
                    description,
                    price: parseFloat(price),
                    genre,
                    cover_url: coverUrl,
                    demo_file_url: demoFileUrl,
                    file_url: fileUrl,
                    seller_id: sellerId
                }
            ])
            .select();

        if (error) {
            console.error('Supabase Insert Error:', error);
            return res.status(500).json({ error: 'Failed to add book to database', details: error.message });
        }

        res.status(201).json({ message: 'Book added successfully', book: data[0] });

    } catch (err) {
        console.error('Server Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to Update a Book
app.put('/api/books/:id', async (req, res) => {
    try {
        const bookId = req.params.id;
        const { title, author, description, price, genre, coverUrl, demoFileUrl, fileUrl } = req.body;

        if (!title || !author || !price) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

        const token = authHeader.replace('Bearer ', '');
        const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey);

        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
        if (authError || !user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const isAdmin = user.user_metadata?.role === 'admin';

        let query = supabaseAdmin
            .from('books')
            .update({
                title,
                author,
                description,
                price: parseFloat(price),
                genre,
                cover_url: coverUrl,
                demo_file_url: demoFileUrl,
                file_url: fileUrl
            })
            .eq('id', bookId);

        // Enforce ownership if the request is not from an admin
        if (!isAdmin) {
            query = query.eq('seller_id', user.id);
        }

        const { data, error } = await query.select();

        if (error) {
            console.error('Supabase Update Error:', error);
            return res.status(500).json({ error: 'Failed to update book in database', details: error.message });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Book not found or permission denied' });
        }

        res.status(200).json({ message: 'Book updated successfully', book: data[0] });

    } catch (err) {
        console.error('Server Update Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to Delete a Book
app.delete('/api/books/:id', async (req, res) => {
    try {
        const bookId = req.params.id;
        const authHeader = req.headers.authorization;

        // Create a user-scoped supabase client to respect DB RLS
        const supabaseClient = createClient(supabaseUrl, supabaseKey, {
            global: {
                headers: {
                    Authorization: authHeader || ''
                }
            }
        });

        // Create an admin client for Storage operations (bypassing Storage RLS which often blocks deletes)
        const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey);

        // 1. Fetch the book to get the file URLs before deleting
        const { data: book, error: fetchError } = await supabaseClient.from('books').select('*').eq('id', bookId).single();

        if (fetchError || !book) {
            console.error('Error fetching book details:', fetchError);
            return res.status(404).json({ error: 'Book not found' });
        }

        // 2. Delete associated orders first to prevent foreign key constraint error
        const { error: orderError } = await supabaseClient.from('orders').delete().eq('book_id', bookId);
        if (orderError) {
            console.error('Error deleting related orders:', orderError);
        }

        // 3. Extract file paths from URLs and delete from Supabase Storage
        const extractPath = (url) => {
            if (!url) return null;
            // Expected format: https://[project].supabase.co/storage/v1/object/public/books/[user_id]/[filename]
            const parts = url.split('/public/books/');
            return parts.length > 1 ? parts[1] : null;
        };

        const filesToDelete = [
            extractPath(book.demo_file_url),
            extractPath(book.file_url),
            extractPath(book.cover_url),
            extractPath(book.qr_code_url)
        ].filter(Boolean); // Remove nulls

        if (filesToDelete.length > 0) {
            const { data: removeData, error: storageError } = await supabaseAdmin.storage.from('books').remove(filesToDelete);
            if (storageError) {
                console.error('Error deleting files from storage:', storageError);
            } else {
                console.log('Successfully deleted storage files:', removeData);
            }
        }

        // 4. Delete the book
        const { error } = await supabaseClient.from('books').delete().eq('id', bookId);

        if (error) {
            console.error('Error deleting book:', error);
            return res.status(500).json({ error: 'Failed to delete book', details: error.message });
        }

        res.json({ success: true, message: 'Book and associated files deleted successfully' });
    } catch (err) {
        console.error('Server Error on Delete:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route for Admin Dashboard Stats
app.get('/api/admin/dashboard', async (req, res) => {
    try {
        const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey);

        // 1. Total users
        const { data: { users }, error: authError } = await supabaseAdmin.auth.admin.listUsers();
        if (authError) throw authError;

        const totalUsers = users.length;
        const totalSellers = users.filter(u => u.user_metadata?.role === 'seller').length;

        // 2. Platform Sales (Total Revenue)
        const { data: orders, error: ordersError } = await supabaseAdmin
            .from('orders')
            .select('amount')
            .eq('status', 'completed');
        if (ordersError) throw ordersError;

        const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.amount) || 0), 0);

        // 3. Pending Payouts
        const { count: pendingCount, error: pendingError } = await supabaseAdmin
            .from('withdrawals')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending');

        if (pendingError) throw pendingError;

        res.json({
            users: totalUsers,
            revenue: totalRevenue,
            sellers: totalSellers,
            pending: pendingCount || 0
        });

    } catch (error) {
        console.error('Admin Dashboard Stats Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// --- ADMIN USERS ROUTES ---
app.get('/api/admin/users', async (req, res) => {
    try {
        const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey);
        const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
        if (error) throw error;

        const formattedUsers = users.map(u => ({
            id: u.id,
            email: u.email,
            full_name: u.user_metadata?.full_name || 'Unknown',
            role: u.user_metadata?.role || 'user',
            created_at: u.created_at,
            banned_until: u.banned_until
        }));
        res.json(formattedUsers);
    } catch (err) {
        console.error('Admin Fetch Users Error:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

app.delete('/api/admin/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey);
        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
        if (error) throw error;
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
        console.error('Admin Delete User Error:', err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

app.put('/api/admin/users/:id/ban', async (req, res) => {
    try {
        const userId = req.params.id;
        const { banned } = req.body; // boolean
        const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey);

        // "876000h" = 100 years. "none" removes the ban.
        const banDuration = banned ? '876000h' : 'none';

        const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, { ban_duration: banDuration });
        if (error) throw error;

        res.json({ success: true, message: `User ${banned ? 'banned' : 'unbanned'} successfully` });
    } catch (err) {
        console.error('Admin Ban User Error:', err);
        res.status(500).json({ error: 'Failed to update user ban status' });
    }
});

app.get('/api/admin/books', async (req, res) => {
    try {
        const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey);

        const { data: booksData, error: booksError } = await supabaseAdmin.from('books').select('*').order('created_at', { ascending: false });
        if (booksError) throw booksError;

        const { data: { users }, error: authError } = await supabaseAdmin.auth.admin.listUsers();

        let finalBooks = booksData;
        if (!authError && users) {
            finalBooks = booksData.map(book => {
                const seller = users.find(u => u.id === book.seller_id);
                return {
                    ...book,
                    users: seller ? {
                        full_name: seller.user_metadata?.full_name || 'Unknown',
                        email: seller.email
                    } : null
                };
            });
        }

        res.json(finalBooks);
    } catch (err) {
        console.error('Admin Fetch Books Error:', err);
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});

app.delete('/api/admin/books/:id', async (req, res) => {
    try {
        const bookId = req.params.id;
        const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey);

        const { data: book, error: fetchError } = await supabaseAdmin.from('books').select('*').eq('id', bookId).single();
        if (fetchError || !book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        await supabaseAdmin.from('orders').delete().eq('book_id', bookId);

        const extractPath = (url) => {
            if (!url) return null;
            const parts = url.split('/public/books/');
            return parts.length > 1 ? parts[1] : null;
        };

        const filesToDelete = [
            extractPath(book.demo_file_url),
            extractPath(book.file_url),
            extractPath(book.cover_url),
            extractPath(book.qr_code_url)
        ].filter(Boolean);

        if (filesToDelete.length > 0) {
            await supabaseAdmin.storage.from('books').remove(filesToDelete);
        }

        const { error } = await supabaseAdmin.from('books').delete().eq('id', bookId);
        if (error) throw error;

        res.json({ success: true, message: 'Book deleted successfully' });
    } catch (err) {
        console.error('Admin Delete Book Error:', err);
        res.status(500).json({ error: 'Failed to delete book' });
    }
});

// --- SELLER WITHDRAWAL ROUTES ---
app.get('/api/seller/balance', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

        const token = authHeader.replace('Bearer ', '');
        const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey);

        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
        if (authError || !user) throw new Error('User not found');
        const sellerId = user.id;

        const { data: orders, error: ordersError } = await supabaseAdmin
            .from('orders')
            .select('amount, books!inner(seller_id)')
            .eq('books.seller_id', sellerId)
            .eq('status', 'completed');

        if (ordersError) throw ordersError;

        const totalSales = orders.reduce((sum, order) => sum + parseFloat(order.amount), 0);
        const totalEarnings = totalSales * 0.85; // 15% platform cut

        const { data: withdrawals, error: wError } = await supabaseAdmin
            .from('withdrawals')
            .select('amount')
            .eq('seller_id', sellerId)
            .neq('status', 'rejected');

        if (wError) throw wError;

        const totalWithdrawn = withdrawals.reduce((sum, w) => sum + parseFloat(w.amount), 0);
        const availableBalance = totalEarnings - totalWithdrawn;

        res.json({
            total_sales: totalSales,
            total_earnings: totalEarnings,
            total_withdrawn: totalWithdrawn,
            available_balance: availableBalance
        });
    } catch (err) {
        console.error('Balance Error:', err);
        res.status(500).json({ error: 'Failed to fetch balance' });
    }
});

app.post('/api/seller/withdraw', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const { amount, bank_name, account_number, account_name } = req.body;

        if (!amount || amount <= 0 || !bank_name || !account_number || !account_name) {
            return res.status(400).json({ error: 'Invalid withdrawal details' });
        }

        const token = authHeader.replace('Bearer ', '');
        const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey);

        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
        if (authError || !user) throw new Error('Unauthorized');
        const { data: orders } = await supabaseAdmin.from('orders').select('amount, books!inner(seller_id)').eq('books.seller_id', user.id).eq('status', 'completed');
        const { data: withdrawals } = await supabaseAdmin.from('withdrawals').select('amount').eq('seller_id', user.id).neq('status', 'rejected');

        const totalEarnings = (orders || []).reduce((sum, order) => sum + parseFloat(order.amount), 0) * 0.85;
        const totalWithdrawn = (withdrawals || []).reduce((sum, w) => sum + parseFloat(w.amount), 0);
        const availableBalance = totalEarnings - totalWithdrawn;

        if (amount > availableBalance) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        const { error: insertError } = await supabaseAdmin.from('withdrawals').insert([{
            seller_id: user.id,
            amount,
            bank_name,
            account_number,
            account_name,
            status: 'pending'
        }]);

        if (insertError) throw insertError;
        res.json({ success: true, message: 'Withdrawal request submitted successfully' });
    } catch (err) {
        console.error('Withdraw Error:', err);
        res.status(500).json({ error: 'Failed to submit withdrawal' });
    }
});

app.get('/api/seller/withdrawals', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

        const token = authHeader.replace('Bearer ', '');
        const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey);

        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
        if (authError || !user) throw new Error('Unauthorized');

        const { data, error } = await supabaseAdmin.from('withdrawals').select('*').eq('seller_id', user.id).order('created_at', { ascending: false });
        if (error) throw error;

        res.json(data);
    } catch (err) {
        console.error('Fetch Withdrawals Error:', err);
        res.status(500).json({ error: 'Failed to fetch withdrawals' });
    }
});

// --- ADMIN WITHDRAWAL ROUTES ---
app.get('/api/admin/withdrawals', async (req, res) => {
    try {
        const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey);

        const { data: withdrawals, error } = await supabaseAdmin.from('withdrawals').select('*').order('created_at', { ascending: false });
        if (error) throw error;

        const { data: { users }, error: authError } = await supabaseAdmin.auth.admin.listUsers();

        let finalWithdrawals = withdrawals;
        if (!authError && users) {
            finalWithdrawals = withdrawals.map(w => {
                const seller = users.find(u => u.id === w.seller_id);
                return {
                    ...w,
                    seller: seller ? {
                        full_name: seller.user_metadata?.full_name || 'Unknown',
                        email: seller.email
                    } : null
                };
            });
        }
        res.json(finalWithdrawals);
    } catch (err) {
        console.error('Admin Fetch Withdrawals Error:', err);
        res.status(500).json({ error: 'Failed to fetch withdrawals' });
    }
});

app.put('/api/admin/withdrawals/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey);
        const { error } = await supabaseAdmin.from('withdrawals').update({ status }).eq('id', req.params.id);
        if (error) throw error;
        res.json({ success: true, message: 'Withdrawal status updated' });
    } catch (err) {
        console.error('Admin Update Withdrawal Error:', err);
        res.status(500).json({ error: 'Failed to update withdrawal status' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
