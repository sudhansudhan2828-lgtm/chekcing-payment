# Dodo Payments Integration Guide — PayBridge AI

This integration was engineered by PayBridge AI for **sudhansudhan2828-lgtm/chekcing-payment**.

## 1. Required Environment Variables
Add these to your `.env.local` and hosting provider:

```bash
# Dodo Payments API Key (Dashboard -> Developer -> API Keys)
DODO_PAYMENTS_API_KEY=dodo_test_...

# Webhook Secret (Dashboard -> Developer -> Webhooks)
DODO_PAYMENTS_WEBHOOK_SECRET=whsec_...

# Environment: 'test' or 'live'
DODO_PAYMENTS_ENVIRONMENT=test

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 2. Webhook Configuration
1. Open your [Dodo Payments Dashboard](https://test.dodopayments.com/developer/webhooks).
2. Click **Create Webhook Endpoint**.
3. Endpoint URL:
   ```
   https://<your-domain>/api/dodo/webhook
   ```
4. Subscribe to events:
   - `payment.succeeded`
   - `subscription.active`
   - `subscription.cancelled`
5. Copy the Signing Secret into `DODO_PAYMENTS_WEBHOOK_SECRET`.
