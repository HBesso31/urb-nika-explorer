-- 1. Crear enum de roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- 2. Crear tabla user_roles
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- 3. Habilitar RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Crear función SECURITY DEFINER para verificar roles (evita recursión en RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 5. Política: usuarios pueden ver sus propios roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

-- 6. Asignar rol admin a humberto.besso@gmail.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('88116f9b-f05f-493a-b1b8-3a938bd200c6', 'admin');

-- 7. Eliminar política permisiva anterior de site_settings
DROP POLICY IF EXISTS "Authenticated users can update site settings" ON public.site_settings;

-- 8. Crear política restrictiva: solo admins pueden actualizar site_settings
CREATE POLICY "Only admins can update site settings"
ON public.site_settings FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));