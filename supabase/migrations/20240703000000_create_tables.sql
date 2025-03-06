-- Criação das tabelas principais

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  profession TEXT,
  address TEXT,
  phone TEXT,
  photo_url TEXT,
  is_approved BOOLEAN DEFAULT FALSE
);

-- Tabela de cursos
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  is_free BOOLEAN DEFAULT FALSE,
  category TEXT,
  image_url TEXT,
  instructor TEXT,
  duration TEXT
);

-- Tabela de módulos do curso
CREATE TABLE IF NOT EXISTS course_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_number INTEGER NOT NULL
);

-- Tabela de lições
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  content TEXT,
  duration TEXT,
  order_number INTEGER NOT NULL
);

-- Tabela de materiais da biblioteca
CREATE TABLE IF NOT EXISTS library_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  category TEXT,
  file_size TEXT,
  pages INTEGER,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  download_url TEXT,
  cover_image_url TEXT,
  download_count INTEGER DEFAULT 0
);

-- Tabela de downloads de usuários
CREATE TABLE IF NOT EXISTS user_downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  material_id UUID REFERENCES library_materials(id) ON DELETE CASCADE,
  download_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de matrículas em cursos
CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress INTEGER DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed BOOLEAN DEFAULT FALSE,
  completion_date TIMESTAMP WITH TIME ZONE
);

-- Tabela de pagamentos
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id),
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  asaas_id TEXT,
  payment_method TEXT
);

-- Tabela de certificados
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  issue_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  download_url TEXT,
  hours INTEGER
);

-- Tabela de credenciais
CREATE TABLE IF NOT EXISTS credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  qr_code TEXT,
  issue_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expiry_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active',
  payment_id UUID REFERENCES payments(id)
);

-- Função para incrementar o contador de downloads
CREATE OR REPLACE FUNCTION increment_download_count(material_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE library_materials
  SET download_count = download_count + 1
  WHERE id = material_id;
END;
$$ LANGUAGE plpgsql;

-- Habilitar extensão para gerar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Configurar RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE credentials ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Usuários podem ver seus próprios dados" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Todos podem ver cursos" ON courses
  FOR SELECT USING (true);

CREATE POLICY "Todos podem ver materiais da biblioteca" ON library_materials
  FOR SELECT USING (true);

CREATE POLICY "Usuários podem ver seus próprios pagamentos" ON payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem ver seus próprios certificados" ON certificates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem ver suas próprias credenciais" ON credentials
  FOR SELECT USING (auth.uid() = user_id);
