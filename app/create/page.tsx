"use client";

import { useEffect, useRef, useState } from "react";
import CVForm from "@/components/CVForm";
import CVPreview from "@/components/CVPreview";
import PayButton from "@/components/PayButton";
import { CVData, CVTab } from "@/lib/types";
import { emptyCv } from "@/lib/emptyCv";

const STORAGE_KEY = "cv_kenya_draft_id";

export default function CreatePage() {
  const [cvId, setCvId] = useState<string | null>(null);
  const [data, setData] = useState<CVData>(emptyCv());
  const [isPaid, setIsPaid] = useState(false);
  const [activeTab, setActiveTab] = useState<CVTab>("Contact");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const existingId = localStorage.getItem(STORAGE_KEY);

        if (existingId) {
          const res = await fetch(`/api/cv/${existingId}`);
          if (res.ok) {
            const cv = await res.json();
            setCvId(cv.id);
            setData({ ...emptyCv(), ...cv.data });
            setIsPaid(!!cv.is_paid);
            setLoading(false);
            return;
          }
          localStorage.removeItem(STORAGE_KEY);
        }

        const res = await fetch("/api/cv", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: emptyCv() }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed to create CV (status ${res.status}): ${text}`);
        }

        const cv = await res.json();
        if (!cv.id) {
          throw new Error(`Server did not return a CV id: ${JSON.stringify(cv)}`);
        }

        localStorage.setItem(STORAGE_KEY, cv.id);
        setCvId(cv.id);
        setLoading(false);
      } catch (err: any) {
        console.error("CV init failed:", err);
        setError(err.message ?? "Something went wrong loading your CV.");
        setLoading(false);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (!cvId || loading) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);

    saveTimer.current = setTimeout(async () => {
      setSaving(true);
      try {
        await fetch(`/api/cv/${cvId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data }),
        });
      } catch (err) {
        console.error("Autosave failed:", err);
      } finally {
        setSaving(false);
      }
    }, 800);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [data, cvId, loading]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center text-gray-500">
        Loading your CV...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="text-red-600 font-medium mb-2">Something went wrong</p>
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Build your CV</h1>
        <span className="text-xs text-gray-400">{saving ? "Saving..." : "Saved"}</span>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <CVForm data={data} onChange={setData} activeTab={activeTab} setActiveTab={setActiveTab} />
        <div>
          <p className="text-xs text-gray-400 mb-2">Live preview</p>
          <CVPreview data={data} />

          <div className="mt-6 border-t pt-6">
            {isPaid ? (
              <div>
                <p className="text-green-700 font-medium mb-3">
                  ✅ Payment confirmed — your CV is unlocked.
                </p>
                <button
                  onClick={() => window.print()}
                  className="bg-brand hover:bg-brand-dark transition-colors text-white font-semibold px-6 py-3 rounded-lg"
                >
                  Download / Print CV
                </button>
                <p className="text-xs text-gray-400 mt-2">
                  Choose "Save as PDF" in the print dialog to download it.
                </p>
              </div>
            ) : (
              cvId && (
                <PayButton
                  cvId={cvId}
                  email={data.email}
                  phone={data.phone}
                  onPaid={() => setIsPaid(true)}
                />
              )
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
