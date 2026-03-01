require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://wixrtifshezyldsgyjzr.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
    console.log("Starting DB Migration...");

    // 1. We'll use sql rpc if available, but since we don't know if rpc(exec_sql) exists,
    // we will just try to create the withdrawals table via a direct REST call or by explaining what to run.

    // In Supabase, creating tables from the JS client without an RPC isn't directly supported.
    // Instead we will just use this script to try a dummy insert to see if the table exists, and if not, log the SQL.

    console.log(`
------- PLEASE RUN THIS SQL IN SUPABASE SQL EDITOR -------

-- 1. Create withdrawals table
CREATE TABLE IF NOT EXISTS public.withdrawals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    seller_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Setup RLS for withdrawals
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

-- Sellers can view their own withdrawals
CREATE POLICY "Sellers can view own withdrawals" 
ON public.withdrawals FOR SELECT 
USING (auth.uid() = seller_id);

-- Sellers can insert their own withdrawals
CREATE POLICY "Sellers can insert own withdrawals" 
ON public.withdrawals FOR INSERT 
WITH CHECK (auth.uid() = seller_id);

----------------------------------------------------------
    `);
}

migrate();
