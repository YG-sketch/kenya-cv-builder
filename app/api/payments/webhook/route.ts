import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase";

// Paystack calls this URL directly whenever a payment event happens.
// This is a safety net in case the browser closes before verify() runs.
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    const secretKey = process.env.PAYSTACK_SECRET_KEY!;
    const expectedSignature = crypto
      .createHmac("sha512", secretKey)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.warn("Webhook signature mismatch — ignoring request");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === "charge.success") {
      const reference = event.data.reference;
      const cvId = event.data.metadata?.cvId;
      const amountKes = Math.round(event.data.amount / 100);

      const supabaseAdmin = getSupabaseAdmin();

      await supabaseAdmin.from("payments").upsert(
        {
          cv_id: cvId ?? null,
          paystack_reference: reference,
          amount_kes: amountKes,
          status: "success",
          verified_at: new Date().toISOString(),
        },
        { onConflict: "paystack_reference" }
      );

      if (cvId) {
        await supabaseAdmin.from("cvs").update({ is_paid: true }).eq("id", cvId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook crashed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
