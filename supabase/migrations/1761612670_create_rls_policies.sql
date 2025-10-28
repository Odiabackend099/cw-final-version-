-- Migration: create_rls_policies
-- Created at: 1761612670

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

-- Assistants table policies (admin only for modifications)
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
;