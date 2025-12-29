CREATE TABLE IF NOT EXISTS pix_payments (
  payment_id UUID PRIMARY KEY REFERENCES payments(id) ON DELETE CASCADE,
  code VARCHAR(80) NOT NULL,
  qr_text TEXT NOT NULL,
  expires_at TIMESTAMP,
  status VARCHAR(30) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pix_payments_status ON pix_payments(status);
