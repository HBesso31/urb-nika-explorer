-- Allow admins to view all app_users (for CRM contact display)
CREATE POLICY "Admins can view all app_users" 
ON public.app_users 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));