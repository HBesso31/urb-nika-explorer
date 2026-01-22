-- Add deposit_address to site_settings
ALTER TABLE public.site_settings
ADD COLUMN IF NOT EXISTS deposit_address text NOT NULL DEFAULT 'urbanika.eth';

-- Add financial_contract to contributions (other fields already exist)
ALTER TABLE public.contributions
ADD COLUMN IF NOT EXISTS financial_contract text;

-- Create policy for admins to view ALL contributions (for CRM)
CREATE POLICY "Admins can view all contributions"
ON public.contributions
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create policy for admins to view ALL profiles (for CRM user info)
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));