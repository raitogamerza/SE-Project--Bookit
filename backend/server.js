const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase Client
const supabaseUrl = 'https://wixrtifshezyldsgyjzr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpeHJ0aWZzaGV6eWxkc2d5anpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MzU5NDgsImV4cCI6MjA4NzAxMTk0OH0.FPoIiAYLcJx2KQzvb3UWRLss8ZZAZfXB9bKwOVhG-ws';

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: SUPABASE_URL and SUPABASE_ANON_KEY are required in .env file.');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// Routes

// Basic health check route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Bookit Backend API' });
});

// Route to Add a Book
app.post('/api/books', async (req, res) => {
    try {
        const { title, author, description, price, genre, coverUrl, demoFileUrl, sellerId } = req.body;

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

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
