import { createClient } from '@supabase/supabase-js';

// Production Supabase configuration - NEW BACKEND
const supabaseUrl = "https://bcufohulqrceytkrqpgd.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjdWZvaHVscXJjZXl0a3JxcGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MTA2NTUsImV4cCI6MjA3NTA4NjY1NX0.rc9-fFpLsTyESK-222zYVKGVx-R5mwb9Xi005p_bwoI";

// Create Supabase client with proper headers to prevent 406 errors
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  },
});

// Vapi Configuration
export const VAPI_CONFIG = {
  publicKey: 'ddd720c5-6fb8-4174-b7a6-729d7b308cb9',
  assistantId: 'fdaaa6f7-a204-4c08-99fd-20451c96fc74'
};

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: 'admin' | 'agent' | 'client';
          company_name: string | null;
          phone_number: string | null;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      leads: {
        Row: {
          id: string;
          full_name: string;
          email: string | null;
          phone_number: string | null;
          company_name: string | null;
          message: string | null;
          source: string;
          status: string;
          assigned_to: string | null;
          metadata: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
      };
      call_logs: {
        Row: {
          id: string;
          vapi_call_id: string | null;
          assistant_id: string | null;
          lead_id: string | null;
          caller_phone: string | null;
          duration_seconds: number | null;
          recording_url: string | null;
          transcript: string | null;
          call_status: string;
          call_type: string;
          metadata: Record<string, any>;
          started_at: string | null;
          ended_at: string | null;
          created_at: string;
        };
      };
      assistants: {
        Row: {
          id: string;
          name: string;
          vapi_assistant_id: string | null;
          system_prompt: string | null;
          voice_config: Record<string, any>;
          model: string;
          first_message: string;
          is_active: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      payments: {
        Row: {
          id: string;
          user_id: string | null;
          flutterwave_tx_ref: string | null;
          flutterwave_tx_id: string | null;
          amount: number;
          currency: string;
          payment_status: string;
          payment_link: string | null;
          plan_type: string | null;
          metadata: Record<string, any>;
          paid_at: string | null;
          created_at: string;
        };
      };
    };
  };
};
