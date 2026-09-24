import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { verifyPaystackTransaction } from "@/lib/paystack";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { reference, cvId, phone } = body;

    if (!reference || !cvId) {
      return NextResponse.json(
        { error: "Missing reference or cvId" },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Confirm with Paystack's servers — this is the source of truth
    const transaction = await verifyPaystackTransaction(reference);

    const isSuccessful = transaction.status === "success";

    // Record the payment attempt regardless of outcome, for your own records
    const { error: paymentError } = await supabaseAdmin.from("payments").upsert(
      {
        cv_id: cvId,
        paystack_reference: reference,
        amount_kes: Math.round(transaction.amount / 100),
        status: isSuccessful ? "success" : "failed",
        phone: phone ?? null,
        verified_at: new Date().toISOString(),
      },
      { onConflict: "paystack_reference" }
    );

    if (paymentError) {
      console.error("Failed to record payment:", paymentError);
    }

    if (!isSuccessful) {
      return NextResponse.json(
        { paid: false, error: "Payment was not successful" },
        { status: 402 }
      );
    }

    // Unlock the CV
    const { error: cvError } = await supabaseAdmin
      .from("cvs")
      .update({ is_paid: true })
      .eq("id", cvId);

    if (cvError) {
      console.error("Failed to mark CV as paid:", cvError);
      return NextResponse.json({ error: cvError.message }, { status: 500 });
    }

    return NextResponse.json({ paid: true });
  } catch (err: any) {
    console.error("POST /api/payments/verify crashed:", err);
    return NextResponse.json(
      { error: err.message ?? "Unknown server error" },
      { status: 500 }
    );
  }
}
