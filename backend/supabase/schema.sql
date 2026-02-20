-- Run this in your Supabase SQL Editor

-- 1. Create the Books Table
CREATE TABLE IF NOT EXISTS public.books (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    genre TEXT NOT NULL,
    cover_url TEXT,
    demo_file_url TEXT
);

-- Set up Row Level Security (RLS) for books table
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Books are viewable by everyone." 
ON public.books FOR SELECT USING (true);

CREATE POLICY "Sellers can insert their own books." 
ON public.books FOR INSERT 
WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their own books." 
ON public.books FOR UPDATE 
USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete their own books." 
ON public.books FOR DELETE 
USING (auth.uid() = seller_id);


-- 2. Create Storage Bucket for Books (PDFs and Covers)
insert into storage.buckets (id, name, public)
values ('books', 'books', true)
on conflict (id) do nothing;

-- Set up Row Level Security (RLS) for storage
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'books' );

CREATE POLICY "Authenticated users can upload books"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'books' AND auth.role() = 'authenticated' );

CREATE POLICY "Users can update their own books"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'books' AND auth.uid() = owner );

CREATE POLICY "Users can delete their own books"
ON storage.objects FOR DELETE
USING ( bucket_id = 'books' AND auth.uid() = owner );
