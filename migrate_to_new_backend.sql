-- Complete Migration for NEW Backend (bcufohulqrceytkrqpgd)
-- This script drops all existing tables and creates fresh schema

-- Drop all existing tables (CASCADE to handle dependencies)
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.webhook_events CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.call_logs CASCADE;
DROP TABLE IF EXISTS public.leads CASCADE;
DROP TABLE IF EXISTS public.assistants CASCADE;
DROP TABLE IF EXISTS public.system_settings CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop trigger function if exists
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'client',
  company_name TEXT,
  phone_number TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assistants table
CREATE TABLE public.assistants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL DEFAULT 'Marcy',
  vapi_assistant_id TEXT,
  system_prompt TEXT,
  voice_config JSONB DEFAULT '{"provider": "11labs", "voiceId": "rachel"}',
  model TEXT DEFAULT 'gpt-3.5-turbo',
  first_message TEXT DEFAULT 'Hello! I am Marcy, your CallWaitingAI assistant. How can I help you today?',
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads table
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone_number TEXT,
  company_name TEXT,
  message TEXT,
  source TEXT DEFAULT 'website',
  status TEXT DEFAULT 'new',
  assigned_to UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Call logs table
CREATE TABLE public.call_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vapi_call_id TEXT UNIQUE,
  assistant_id UUID,
  lead_id UUID,
  caller_phone TEXT,
  duration_seconds INTEGER,
  recording_url TEXT,
  transcript TEXT,
  call_status TEXT DEFAULT 'initiated',
  call_type TEXT DEFAULT 'inbound',
  metadata JSONB DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Webhook events table
CREATE TABLE public.webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  source TEXT DEFAULT 'vapi',
  processed BOOLEAN DEFAULT false,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  flutterwave_tx_ref TEXT UNIQUE,
  flutterwave_tx_id TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_status TEXT DEFAULT 'pending',
  payment_link TEXT,
  plan_type TEXT,
  metadata JSONB DEFAULT '{}',
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL,
  sender_type TEXT NOT NULL,
  message_text TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System settings table
CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  description TEXT,
  updated_by UUID,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_source ON public.leads(source);
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX idx_call_logs_vapi_call_id ON public.call_logs(vapi_call_id);
CREATE INDEX idx_call_logs_status ON public.call_logs(call_status);
CREATE INDEX idx_call_logs_created_at ON public.call_logs(created_at DESC);
CREATE INDEX idx_webhook_events_processed ON public.webhook_events(processed);
CREATE INDEX idx_webhook_events_event_type ON public.webhook_events(event_type);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_status ON public.payments(payment_status);
CREATE INDEX idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX idx_users_role ON public.users(role);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assistants_updated_at BEFORE UPDATE ON public.assistants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assistants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id OR auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = id OR auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Allow insert for authenticated users" ON public.users
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'authenticated', 'service_role'));

-- Assistants table policies
CREATE POLICY "Anyone can view active assistants" ON public.assistants
  FOR SELECT USING (is_active = true OR auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Allow insert assistants" ON public.assistants
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Allow update assistants" ON public.assistants
  FOR UPDATE USING (auth.role() IN ('anon', 'service_role'));

-- Leads table policies
CREATE POLICY "Users can view assigned leads" ON public.leads
  FOR SELECT USING (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Allow insert leads" ON public.leads
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Allow update leads" ON public.leads
  FOR UPDATE USING (auth.role() IN ('anon', 'service_role'));

-- Call logs table policies
CREATE POLICY "Users can view call logs" ON public.call_logs
  FOR SELECT USING (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Allow insert call logs" ON public.call_logs
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Allow update call logs" ON public.call_logs
  FOR UPDATE USING (auth.role() IN ('anon', 'service_role'));

-- Webhook events table policies
CREATE POLICY "Allow read webhook events" ON public.webhook_events
  FOR SELECT USING (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Allow insert webhook events" ON public.webhook_events
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Allow update webhook events" ON public.webhook_events
  FOR UPDATE USING (auth.role() IN ('anon', 'service_role'));

-- Payments table policies
CREATE POLICY "Users can view their payments" ON public.payments
  FOR SELECT USING (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Allow insert payments" ON public.payments
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Allow update payments" ON public.payments
  FOR UPDATE USING (auth.role() IN ('anon', 'service_role'));

-- Chat messages table policies
CREATE POLICY "Users can view chat messages" ON public.chat_messages
  FOR SELECT USING (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Allow insert chat messages" ON public.chat_messages
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

-- System settings table policies
CREATE POLICY "Anyone can read settings" ON public.system_settings
  FOR SELECT USING (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Allow insert settings" ON public.system_settings
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Allow update settings" ON public.system_settings
  FOR UPDATE USING (auth.role() IN ('anon', 'service_role'));
