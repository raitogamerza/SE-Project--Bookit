const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 5000;

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || 'https://wixrtifshezyldsgyjzr.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpeHJ0aWZzaGV6eWxkc2d5anpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MzU5NDgsImV4cCI6MjA4NzAxMTk0OH0.FPoIiAYLcJx2KQzvb3UWRLss8ZZAZfXB9bKwOVhG-ws';
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors());

// Stripe Webhook MUST be before express.json()
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
    let event;
    try {
        const sig = request.headers['stripe-signature'];
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (endpointSecret && sig) {
            event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
        } else {
            // Fallback for local testing if no webhook secret is configured
            event = JSON.parse(request.body);
        }
    } catch (err) {
        console.error('Webhook signature verification failed.', err.message);
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        let bookIds = [];
        try {
            bookIds = JSON.parse(session.metadata?.bookIds || '[]');
        } catch (e) { }

        if (userId && bookIds.length > 0) {
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

// Route for Stripe Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { items, userId } = req.body;
        if (!items || items.length === 0 || !userId) {
            return res.status(400).json({ error: 'Missing items or user ID' });
        }

        const line_items = items.map(item => ({
            price_data: {
                currency: 'thb',
                product_data: {
                    name: item.title,
                    images: item.cover ? [item.cover] : [],
                },
                unit_amount: Math.round(item.price * 100), // convert THB to Satang
            },
            quantity: 1,
        }));

        const bookIds = items.map(item => item.id);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'promptpay'],
            line_items,
            mode: 'payment',
            // Return URLs point back to frontend. Fallback to localhost if origin not provided.
            success_url: `${req.headers.origin || 'http://localhost:5173'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin || 'http://localhost:5173'}/checkout`,
            metadata: {
                userId: userId,
                bookIds: JSON.stringify(bookIds)
            }
        });

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        console.error('Stripe Session Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Route for Direct QR Code Checkout (Mock Verification)
app.post('/api/checkout-direct', async (req, res) => {
    try {
        const { items, userId } = req.body;
        if (!items || items.length === 0 || !userId) {
            return res.status(400).json({ error: 'Missing items or user ID' });
        }

        // Fulfill the order directly by inserting into Supabase
        for (const item of items) {
            await supabase.from('orders').insert([{
                user_id: userId,
                book_id: item.id,
                amount: item.price,
                status: 'completed'
            }]);
        }

        res.json({ success: true, message: 'Payment confirmed and order created.' });
    } catch (error) {
        console.error('Direct Checkout Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Route to Add a Book
app.post('/api/books', async (req, res) => {
    try {
        const { title, author, description, price, genre, coverUrl, demoFileUrl, qrCodeUrl, sellerId } = req.body;

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
                    qr_code_url: qrCodeUrl,
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

        // Create a user-scoped supabase client to respect RLS
        const supabaseClient = createClient(supabaseUrl, supabaseKey, {
            global: {
                headers: {
                    Authorization: authHeader || ''
                }
            }
        });

        // 1. Delete associated orders first to prevent foreign key constraint error
        const { error: orderError } = await supabaseClient.from('orders').delete().eq('book_id', bookId);
        if (orderError) {
            console.error('Error deleting related orders:', orderError);
        }

        // 2. Delete the book
        const { error } = await supabaseClient.from('books').delete().eq('id', bookId);

        if (error) {
            console.error('Error deleting book:', error);
            return res.status(500).json({ error: 'Failed to delete book', details: error.message });
        }

        res.json({ success: true, message: 'Book deleted successfully' });
    } catch (err) {
        console.error('Server Error on Delete:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
