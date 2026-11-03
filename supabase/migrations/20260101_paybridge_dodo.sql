-- PayBridge AI: Dodo Payments Schema Migration
ALTER TABLE IF EXISTS users
  ADD COLUMN IF NOT EXISTS dodo_customer_id text UNIQUE,
  ADD COLUMN IF NOT EXISTS dodo_subscription_id text,
  ADD COLUMN IF NOT EXISTS subscription_tier text DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'active';

CREATE TABLE IF NOT EXISTS processed_webhook_events (
  id text PRIMARY KEY,
  event_type text NOT NULL,
  provider text NOT NULL DEFAULT 'dodo',
  processed_at timestamptz DEFAULT now()
);
