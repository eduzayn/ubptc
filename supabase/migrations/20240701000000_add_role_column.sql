-- Add role column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';

-- Create index for faster role-based queries
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Update existing admin users (example - you'll need to replace with actual user IDs)
-- UPDATE public.users SET role = 'admin' WHERE id IN ('user-id-1', 'user-id-2');

-- Create policy for admin access
DROP POLICY IF EXISTS "Admins can do everything" ON public.users;
CREATE POLICY "Admins can do everything"
ON public.users
USING (auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin'));
