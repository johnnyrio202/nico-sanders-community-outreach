-- Rate-limit counters for the public form endpoints (see api/_lib/guard.ts).
-- Keys are hashed; rows expire and are cleaned up opportunistically.
CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 1,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE INDEX IF NOT EXISTS rate_limits_expires_idx ON rate_limits (expires_at);
