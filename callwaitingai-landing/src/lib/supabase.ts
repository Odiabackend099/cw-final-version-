import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bcufohulqrceytkrqpgd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjdWZvaHVscXJjZXl0a3JxcGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MTA2NTUsImV4cCI6MjA3NTA4NjY1NX0.rc9-fFpLsTyESK-222zYVKGVx-R5mwb9Xi005p_bwoI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
