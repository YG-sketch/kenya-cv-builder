"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

const AMOUNT_KES = 20;

export default function PayButton({
  cvId,
  email,
  phone,
  onPaid,
}: {
  cvId: string;
  email: string;
  phone: string;
  onPaid: () => void;
}) {
  const [scriptReady, setScriptReady] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (document.getElementById("paystack-inline-script")) {
      setScriptReady(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "paystack-inline-script";
    script.src = "https://js.paystack.co/v1/inline.js";
    script.onload = () => setScriptReady(true);
    script.onerror = () => setError("Could not load payment system. Check your connection.");
    document.body.appendChild(script);
  }, []);

  function handlePay() {
    setError(null);

    if (!email) {
      setError("Please add your email in the Contact tab first — Paystack needs it for the receipt.");
      return;
    }
    if (!scriptReady || !window.PaystackPop) {
      setError("Payment system is still loading — try again in a moment.");
      return;
    }

    const reference = `cv_${cvId}_${Date.now()}`;

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email,
      amount: AMOUNT_KES * 100,
      currency: "KES",
      channels: ["mobile_money", "card"],
      ref: reference,
      metadata: { cvId },
      callback: (response: any) => {
        setPaying(true);
        fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference: response.reference, cvId, phone }),
        })
          .then((res) => res.json())
          .then((data) => {
            setPaying(false);
            if (data.paid) {
              onPaid();
            } else {
              setError("Payment could not be confirmed. If money was deducted, contact support with your reference: " + response.reference);
            }
          })
          .catch(() => {
            setPaying(false);
            setError("Could not confirm payment. Please refresh and check again.");
          });
      },
      onClose: () => {
        setPaying(false);
      },
    });

    handler.openIframe();
  }

  return (
    <div>
      <button
        onClick={handlePay}
        disabled={paying}
        className="bg-brand hover:bg-brand-dark transition-colors text-white font-semibold px-6 py-3 rounded-lg disabled:opacity-60"
      >
        {paying ? "Confirming payment..." : `Pay 20 Bob via M-Pesa`}
      </button>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
}
