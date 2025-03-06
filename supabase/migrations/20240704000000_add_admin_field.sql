-- Adicionar campo is_admin à tabela users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Criar um usuário administrador para teste
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000000', 'admin@associacaopro.com.br', '$2a$10$Ht.3YwWIJW6tGWGpYRuKXOQZZDmhgitQwnmyBSw8vQeqzQFCzG9Iq', NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users (id, email, name, is_admin)
VALUES ('00000000-0000-0000-0000-000000000000', 'admin@associacaopro.com.br', 'Administrador', true)
ON CONFLICT (id) DO NOTHING;

-- Criar política para permitir que apenas administradores acessem certas tabelas
DROP POLICY IF EXISTS "Apenas administradores podem gerenciar" ON library_materials;
CREATE POLICY "Apenas administradores podem gerenciar"
  ON library_materials
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );
