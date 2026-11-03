import { NextResponse } from "next/server";
import { createDodoCheckoutSession } from "@/lib/dodo";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, email, name, userId } = body;

    if (!productId || !email) {
      return NextResponse.json(
        { error: "productId and email are required." },
        { status: 400 }
      );
    }

    const checkout = await createDodoCheckoutSession({
      productId,
      customerEmail: email,
      customerName: name,
      metadata: {
        userId: userId || "anonymous",
      },
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: checkout.payment_link || checkout.url,
      checkoutId: checkout.id,
    });
  } catch (err: any) {
    console.error("[Dodo Checkout Error]:", err.message);
    return NextResponse.json(
      { error: err.message || "Failed to create Dodo checkout" },
      { status: 500 }
    );
  }
}
