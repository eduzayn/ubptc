-- Adicionar coluna role à tabela users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user'));

-- Adicionar política de segurança para leitura
DROP POLICY IF EXISTS "Permitir leitura do próprio perfil e admins podem ler tudo" ON public.users;
CREATE POLICY "Permitir leitura do próprio perfil e admins podem ler tudo" ON public.users
FOR SELECT USING (
  auth.uid() = id OR 
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
