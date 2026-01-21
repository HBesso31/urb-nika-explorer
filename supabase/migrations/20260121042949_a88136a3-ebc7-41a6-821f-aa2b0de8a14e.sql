-- Create enum for participation type
CREATE TYPE public.participation_type AS ENUM ('investment', 'loan');

-- Create enum for participation status
CREATE TYPE public.participation_status AS ENUM ('pending', 'active', 'closed');

-- Create enum for scenario type
CREATE TYPE public.scenario_type AS ENUM ('conservative', 'base', 'optimistic');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Create participations table (user declarations of intent)
CREATE TABLE public.participations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type participation_type NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  term_months INTEGER NOT NULL CHECK (term_months > 0),
  scenario scenario_type NOT NULL DEFAULT 'base',
  status participation_status NOT NULL DEFAULT 'pending',
  estimated_return NUMERIC(12, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on participations
ALTER TABLE public.participations ENABLE ROW LEVEL SECURITY;

-- Participations policies
CREATE POLICY "Users can view their own participations"
  ON public.participations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own participations"
  ON public.participations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own participations"
  ON public.participations FOR UPDATE
  USING (auth.uid() = user_id);

-- Create benefits table (static reference data)
CREATE TABLE public.benefits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  min_investment NUMERIC(12, 2) DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on benefits (publicly readable)
ALTER TABLE public.benefits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active benefits"
  ON public.benefits FOR SELECT
  USING (is_active = true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_participations_updated_at
  BEFORE UPDATE ON public.participations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;

-- Create trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert default benefits
INSERT INTO public.benefits (type, title, description, min_investment) VALUES
  ('governance', 'Voz y Voto', 'Participación en decisiones clave del proyecto con derecho a voto en asambleas.', 5000),
  ('access', 'Acceso a la Casa', 'Noches de estancia en Casa Acocui según tu nivel de participación.', 10000),
  ('community', 'Comunidad Urbánika', 'Acceso a la red de inversionistas y eventos exclusivos del proyecto.', 1000),
  ('impact', 'Impacto Regenerativo', 'Contribuyes a un modelo de desarrollo sustentable y regenerativo.', 0);