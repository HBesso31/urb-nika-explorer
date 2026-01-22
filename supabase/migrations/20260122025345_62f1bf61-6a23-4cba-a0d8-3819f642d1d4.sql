-- Create auth_method enum type
CREATE TYPE public.auth_method AS ENUM ('wallet', 'email');

-- Create app_users table for Privy authentication
CREATE TABLE public.app_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  privy_user_id TEXT NOT NULL UNIQUE,
  email TEXT,
  wallet_address TEXT,
  auth_method public.auth_method NOT NULL DEFAULT 'email',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for app_users
-- Users can view their own profile
CREATE POLICY "Users can view their own app_users profile"
ON public.app_users
FOR SELECT
USING (privy_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Users can update their own profile
CREATE POLICY "Users can update their own app_users profile"
ON public.app_users
FOR UPDATE
USING (privy_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Allow insert via service role (edge function) - no client-side insert
-- The edge function will handle upsert on login

-- Create updated_at trigger
CREATE TRIGGER update_app_users_updated_at
BEFORE UPDATE ON public.app_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update contributions table to reference app_users
-- Add app_user_id column for Privy users
ALTER TABLE public.contributions 
ADD COLUMN app_user_id UUID REFERENCES public.app_users(id);

-- Update contributions RLS to support app_user_id
CREATE POLICY "App users can view their own contributions"
ON public.contributions
FOR SELECT
USING (
  app_user_id IN (
    SELECT id FROM public.app_users 
    WHERE privy_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  )
);

CREATE POLICY "App users can insert their own contributions"
ON public.contributions
FOR INSERT
WITH CHECK (
  app_user_id IN (
    SELECT id FROM public.app_users 
    WHERE privy_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  )
);