import { headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const bodyText = await req.text();
  const signature = headers().get("x-dodo-signature");
  const webhookSecret = process.env.DODO_PAYMENTS_WEBHOOK_SECRET;

  if (!signature) {
    return NextResponse.json({ error: "Missing x-dodo-signature header" }, { status: 400 });
  }

  if (!webhookSecret) {
    console.error("[PayBridge Webhook] DODO_PAYMENTS_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Webhook secret unconfigured" }, { status: 500 });
  }

  // Verify HMAC-SHA256 signature
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(bodyText)
    .digest("hex");

  if (signature !== expectedSignature) {
    console.warn("[PayBridge Dodo Webhook] Invalid signature match");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(bodyText);
  console.log(`[PayBridge Dodo Webhook] Verified event: ${event.type} [${event.id}]`);

  switch (event.type) {
    case "payment.succeeded": {
      const payment = event.data;
      const userId = payment.metadata?.userId;
      console.log(`[PayBridge] Payment succeeded for user ${userId}, amount: ${payment.amount}`);
      // Update user entitlements in database
      break;
    }

    case "subscription.active": {
      const sub = event.data;
      console.log(`[PayBridge] Subscription activated: ${sub.id}`);
      // Mark subscription active in database
      break;
    }

    case "subscription.cancelled": {
      const sub = event.data;
      console.log(`[PayBridge] Subscription cancelled: ${sub.id}`);
      // Revert entitlements in database
      break;
    }

    default:
      console.log(`[PayBridge Dodo Webhook] Event ignored: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
