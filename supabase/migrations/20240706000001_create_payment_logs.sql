-- Criar tabela para logs de pagamentos (para monitoramento e análise)
CREATE TABLE IF NOT EXISTS payment_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID REFERENCES payments(id),
  asaas_id TEXT,
  event TEXT NOT NULL,
  status TEXT NOT NULL,
  details JSONB,
  environment TEXT DEFAULT 'sandbox',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhorar performance de consultas
CREATE INDEX IF NOT EXISTS idx_payment_logs_payment_id ON payment_logs(payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_logs_asaas_id ON payment_logs(asaas_id);
CREATE INDEX IF NOT EXISTS idx_payment_logs_event ON payment_logs(event);
CREATE INDEX IF NOT EXISTS idx_payment_logs_status ON payment_logs(status);
CREATE INDEX IF NOT EXISTS idx_payment_logs_environment ON payment_logs(environment);
CREATE INDEX IF NOT EXISTS idx_payment_logs_created_at ON payment_logs(created_at);

-- Permitir acesso anônimo para leitura (apenas para administradores)
ALTER TABLE payment_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view payment logs" ON payment_logs;
CREATE POLICY "Admins can view payment logs"
  ON payment_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );
