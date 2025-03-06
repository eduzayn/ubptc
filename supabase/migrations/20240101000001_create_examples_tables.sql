-- Criar tabela de usuários (se não existir)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL
);

-- Criar tabela de mensagens para o exemplo de tempo real
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  content TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Criar políticas para a tabela de usuários
CREATE POLICY "Usuários podem ver todos os perfis" 
  ON users FOR SELECT 
  USING (true);

CREATE POLICY "Usuários só podem atualizar seus próprios dados" 
  ON users FOR UPDATE 
  USING (auth.uid() = id);

-- Criar políticas para a tabela de mensagens
CREATE POLICY "Qualquer um pode ler mensagens" 
  ON messages FOR SELECT 
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir mensagens" 
  ON messages FOR INSERT 
  WITH CHECK (true);

-- Habilitar Realtime para a tabela de mensagens
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
