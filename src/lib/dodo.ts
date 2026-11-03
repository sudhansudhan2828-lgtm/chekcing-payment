// Dodo Payments SDK Client
// Official documentation: https://docs.dodopayments.com

const DODO_BASE_URL =
  process.env.DODO_PAYMENTS_ENVIRONMENT === "live"
    ? "https://live.dodopayments.com"
    : "https://test.dodopayments.com";

export async function createDodoCheckoutSession({
  productId,
  customerEmail,
  customerName,
  billingAddress,
  metadata,
}: {
  productId: string;
  customerEmail: string;
  customerName?: string;
  billingAddress?: { country: string };
  metadata?: Record<string, string>;
}) {
  const apiKey = process.env.DODO_PAYMENTS_API_KEY;
  if (!apiKey) {
    throw new Error("DODO_PAYMENTS_API_KEY is not defined in environment.");
  }

  const response = await fetch(`${DODO_BASE_URL}/checkouts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_id: productId,
      customer: {
        email: customerEmail,
        name: customerName,
      },
      billing: billingAddress,
      metadata: {
        ...metadata,
        integration: "paybridge-ai",
      },
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?payment=success`,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Dodo Payments API error (${response.status}): ${errorText}`);
  }

  return response.json();
}
