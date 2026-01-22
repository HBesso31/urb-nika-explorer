-- Tabla contributions: aportes reales de usuarios
CREATE TABLE public.contributions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  vehicle TEXT NOT NULL CHECK (vehicle IN ('investment', 'loan')),
  amount_mxn NUMERIC NOT NULL,
  amount_usd NUMERIC NOT NULL,
  network TEXT,
  tx_hash TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla payouts: pagos recibidos por el usuario
CREATE TABLE public.payouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  vehicle TEXT NOT NULL CHECK (vehicle IN ('investment', 'loan')),
  amount_mxn NUMERIC NOT NULL,
  amount_usd NUMERIC NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla user_benefits: beneficios asignados por usuario
CREATE TABLE public.user_benefits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  benefit_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'unlocked')),
  unlocked_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla site_settings: configuración administrable (1 registro)
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  urbanika_contact_email TEXT NOT NULL DEFAULT 'contacto@urbanika.mx',
  urbanika_contact_whatsapp TEXT NOT NULL DEFAULT '+52 55 1234 5678',
  humberto_contact_email TEXT NOT NULL DEFAULT 'humberto@urbanika.mx',
  humberto_contact_whatsapp TEXT NOT NULL DEFAULT '+52 55 8765 4321',
  terms_url TEXT NOT NULL DEFAULT '/terminos-y-condiciones.pdf',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insertar registro inicial de configuración
INSERT INTO public.site_settings (id) VALUES (gen_random_uuid());

-- Enable RLS
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for contributions
CREATE POLICY "Users can view their own contributions" 
ON public.contributions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own contributions" 
ON public.contributions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS policies for payouts
CREATE POLICY "Users can view their own payouts" 
ON public.payouts FOR SELECT 
USING (auth.uid() = user_id);

-- RLS policies for user_benefits
CREATE POLICY "Users can view their own benefits" 
ON public.user_benefits FOR SELECT 
USING (auth.uid() = user_id);

-- RLS policies for site_settings (público para lectura)
CREATE POLICY "Anyone can view site settings" 
ON public.site_settings FOR SELECT 
USING (true);

-- Trigger para updated_at en contributions
CREATE TRIGGER update_contributions_updated_at
BEFORE UPDATE ON public.contributions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para updated_at en site_settings
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();