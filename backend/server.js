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
            payment_method_types: ['card', 'promptpay'],
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

// Fallback Route for local testing: Force fulfill an order without Stripe Webhook
app.post('/api/fulfill-order-test', async (req, res) => {
    try {
        const { items, userId } = req.body;
        if (!items || items.length === 0 || !userId) {
            return res.status(400).json({ error: 'Missing items or user ID' });
        }

        console.log(`[Test Fulfillment] Fulfilling order for User ${userId}`);

        for (const item of items) {
            const { error: insertError } = await supabase.from('orders').insert([{
                user_id: userId,
                book_id: item.id,
                amount: item.price,
                status: 'completed'
            }]);
            if (insertError) {
                console.error("❌ Supabase Insert Error:", insertError);
                return res.status(500).json({ error: "Failed to insert order into DB: " + insertError.message });
            }
        }
        res.json({ success: true, message: 'Order fulfilled (test mode)' });
    } catch (error) {
        console.error('Test Fulfillment Error:', error);
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

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
