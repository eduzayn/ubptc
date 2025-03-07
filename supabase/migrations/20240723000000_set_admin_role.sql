-- Verificar admins existentes
SELECT * FROM public.users WHERE role = 'admin';

-- Definir um usuário específico como admin
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'seu-email@exemplo.com';