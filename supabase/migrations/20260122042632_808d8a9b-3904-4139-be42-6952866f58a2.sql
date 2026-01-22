-- Allow admins to UPDATE contributions (to approve/confirm transactions)
CREATE POLICY "Admins can update all contributions"
ON public.contributions
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));