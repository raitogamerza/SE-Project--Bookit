import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wixrtifshezyldsgyjzr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpeHJ0aWZzaGV6eWxkc2d5anpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MzU5NDgsImV4cCI6MjA4NzAxMTk0OH0.FPoIiAYLcJx2KQzvb3UWRLss8ZZAZfXB9bKwOVhG-ws';

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
