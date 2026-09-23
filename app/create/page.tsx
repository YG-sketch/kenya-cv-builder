"use client";

import { useEffect, useRef, useState } from "react";
import CVForm from "@/components/CVForm";
import CVPreview from "@/components/CVPreview";
import { CVData } from "@/lib/types";
import { emptyCv } from "@/lib/emptyCv";

const STORAGE_KEY = "cv_kenya_draft_id";

export default function CreatePage() {
  const [cvId, setCvId] = useState<string | null>(null);
  const [data, setData] = useState<CVData>(emptyCv());
  const [activeTab, setActiveTab] = useState
    "Contact" | "Summary" | "Experience" | "Education" | "Skills" | "Certifications" | "Languages"
  >("Contact");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // On first load: reuse an existing draft from localStorage, or create a new one
  useEffect(() => {
    async function init() {
      const existingId = localStorage.getItem(STORAGE_KEY);

      if (existingId) {
        const res = await fetch(`/api/cv/${existingId}`);
        if (res.ok) {
          const cv = await res.json();
          setCvId(cv.id);
          setData({ ...emptyCv(), ...cv.data });
          setLoading(false);
          return;
        }
      }

      const res = await fetch("/api/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: emptyCv() }),
      });
      const cv = await res.json();
      localStorage.setItem(STORAGE_KEY, cv.id);
      setCvId(cv.id);
      setLoading(false);
    }
    init();
  }, []);

  // Debounced autosave whenever data changes
  useEffect(() => {
    if (!cvId || loading) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);

    saveTimer.current = setTimeout(async () => {
      setSaving(true);
      await fetch(`/api/cv/${cvId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      setSaving(false);
    }, 800);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [data, cvId, loading]);

  if (loading) {
    return <div className="max-w-6xl mx-auto px-6 py-20 text-center text-gray-500">Loading your CV...</div>;
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
        </div>
      </div>
    </main>
  );
}
