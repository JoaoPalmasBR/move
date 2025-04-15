// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://esnhnmuyfejtneboscsz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzbmhubXV5ZmVqdG5lYm9zY3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNjg2ODksImV4cCI6MjA1OTc0NDY4OX0.tMGnLKz-lSyyWueSdHLecmN5U-jCV-3hsL2mRlFTfqw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
