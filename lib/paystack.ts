// Server-side helper to verify a Paystack transaction by its reference.
// Never trust a "successful" payment reported only by the browser —
// always confirm with Paystack's servers using the secret key.
export async function verifyPaystackTransaction(reference: string) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY!;

  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
      cache: "no-store",
    }
  );

  const json = await res.json();

  if (!res.ok || !json.status) {
    throw new Error(json.message ?? "Failed to verify transaction with Paystack");
  }

  return json.data as {
    status: string; // "success" | "failed" | "abandoned" etc.
    reference: string;
    amount: number; // in kobo/cents
    currency: string;
    customer: { email: string };
    metadata?: Record<string, any>;
  };
}
