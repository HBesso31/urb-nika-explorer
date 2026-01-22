-- Permitir que cualquier usuario autenticado pueda actualizar site_settings
-- (En producción, esto debería restringirse a admins)
CREATE POLICY "Authenticated users can update site settings" 
ON public.site_settings FOR UPDATE 
USING (true)
WITH CHECK (true);