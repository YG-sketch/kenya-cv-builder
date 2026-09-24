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
