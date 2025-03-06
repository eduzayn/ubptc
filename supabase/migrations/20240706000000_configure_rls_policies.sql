-- Habilitar RLS para tabelas que contêm dados sensíveis
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;

-- Política para usuários (apenas o próprio usuário pode ver/editar seus dados)
DROP POLICY IF EXISTS "Users can view own data" ON users;
CREATE POLICY "Users can view own data" 
  ON users FOR SELECT 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own data" ON users;
CREATE POLICY "Users can update own data" 
  ON users FOR UPDATE 
  USING (auth.uid() = id);

-- Política para pagamentos (usuários só podem ver seus próprios pagamentos)
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
CREATE POLICY "Users can view own payments" 
  ON payments FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para materiais da biblioteca (todos podem ver)
DROP POLICY IF EXISTS "Anyone can view library materials" ON library_materials;
CREATE POLICY "Anyone can view library materials" 
  ON library_materials FOR SELECT 
  USING (true);

-- Política para downloads (usuários só podem ver seus próprios downloads)
DROP POLICY IF EXISTS "Users can view own downloads" ON user_downloads;
CREATE POLICY "Users can view own downloads" 
  ON user_downloads FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para notificações (usuários só podem ver suas próprias notificações)
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" 
  ON notifications FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" 
  ON notifications FOR UPDATE 
  USING (auth.uid() = user_id);

-- Política para matrículas em cursos (usuários só podem ver suas próprias matrículas)
DROP POLICY IF EXISTS "Users can view own enrollments" ON course_enrollments;
CREATE POLICY "Users can view own enrollments" 
  ON course_enrollments FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own enrollments" ON course_enrollments;
CREATE POLICY "Users can update own enrollments" 
  ON course_enrollments FOR UPDATE 
  USING (auth.uid() = user_id);

-- Habilitar realtime para notificações
alter publication supabase_realtime add table notifications;
