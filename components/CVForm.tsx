"use client";

import { v4 as uuid } from "uuid";
import { CVData, Experience, Education, Certification, LanguageItem, CVTab } from "@/lib/types";

const TABS: CVTab[] = [
  "Contact",
  "Summary",
  "Experience",
  "Education",
  "Skills",
  "Certifications",
  "Languages",
];

export default function CVForm({
  data,
  onChange,
  activeTab,
  setActiveTab,
}: {
  data: CVData;
  onChange: (data: CVData) => void;
  activeTab: CVTab;
  setActiveTab: (tab: CVTab) => void;
}) {
  const update = (patch: Partial<CVData>) => onChange({ ...data, ...patch });

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-brand text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Contact" && (
        <div className="space-y-3">
          <Input label="Full name" value={data.fullName} onChange={(v) => update({ fullName: v })} />
          <Input label="Job title / role you're applying for" value={data.jobTitle} onChange={(v) => update({ jobTitle: v })} />
          <Input label="Email" value={data.email} onChange={(v) => update({ email: v })} />
          <Input label="Phone (e.g. 07XX XXX XXX)" value={data.phone} onChange={(v) => update({ phone: v })} />
          <Input label="Location (e.g. Nairobi, Kenya)" value={data.location} onChange={(v) => update({ location: v })} />
        </div>
      )}

      {activeTab === "Summary" && (
        <Textarea
          label="Professional summary (2-4 sentences)"
          value={data.summary}
          onChange={(v) => update({ summary: v })}
          rows={5}
        />
      )}

      {activeTab === "Experience" && (
        <ListEditor
          items={data.experience}
          onAdd={() =>
            update({
              experience: [
                ...data.experience,
                { id: uuid(), jobTitle: "", company: "", location: "", startDate: "", endDate: "", description: "" },
              ],
            })
          }
          onRemove={(id) => update({ experience: data.experience.filter((e) => e.id !== id) })}
          renderItem={(item: Experience, i) => (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Input label="Job title" value={item.jobTitle} onChange={(v) => updateExp(i, { jobTitle: v })} />
                <Input label="Company" value={item.company} onChange={(v) => updateExp(i, { company: v })} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Input label="Location" value={item.location} onChange={(v) => updateExp(i, { location: v })} />
                <Input label="Start (e.g. Jan 2022)" value={item.startDate} onChange={(v) => updateExp(i, { startDate: v })} />
                <Input label="End (or 'Present')" value={item.endDate} onChange={(v) => updateExp(i, { endDate: v })} />
              </div>
              <Textarea label="What did you do? (one bullet per line)" value={item.description} onChange={(v) => updateExp(i, { description: v })} rows={4} />
            </div>
          )}
        />
      )}

      {activeTab === "Education" && (
        <ListEditor
          items={data.education}
          onAdd={() =>
            update({
              education: [
                ...data.education,
                { id: uuid(), school: "", qualification: "", location: "", startDate: "", endDate: "" },
              ],
            })
          }
          onRemove={(id) => update({ education: data.education.filter((e) => e.id !== id) })}
          renderItem={(item: Education, i) => (
            <div className="grid grid-cols-2 gap-2">
              <Input label="School / institution" value={item.school} onChange={(v) => updateEdu(i, { school: v })} />
              <Input label="Qualification" value={item.qualification} onChange={(v) => updateEdu(i, { qualification: v })} />
              <Input label="Location" value={item.location} onChange={(v) => updateEdu(i, { location: v })} />
              <div className="grid grid-cols-2 gap-2">
                <Input label="Start" value={item.startDate} onChange={(v) => updateEdu(i, { startDate: v })} />
                <Input label="End" value={item.endDate} onChange={(v) => updateEdu(i, { endDate: v })} />
              </div>
            </div>
          )}
        />
      )}

      {activeTab === "Skills" && (
        <Textarea
          label="Skills, separated by commas (e.g. Excel, Customer Service, Python)"
          value={data.skills.join(", ")}
          onChange={(v) => update({ skills: v.split(",").map((s) => s.trim()).filter(Boolean) })}
          rows={4}
        />
      )}

      {activeTab === "Certifications" && (
        <ListEditor
          items={data.certifications}
          onAdd={() =>
            update({ certifications: [...data.certifications, { id: uuid(), name: "", issuer: "", year: "" }] })
          }
          onRemove={(id) => update({ certifications: data.certifications.filter((c) => c.id !== id) })}
          renderItem={(item: Certification, i) => (
            <div className="grid grid-cols-3 gap-2">
              <Input label="Certification name" value={item.name} onChange={(v) => updateCert(i, { name: v })} />
              <Input label="Issuer" value={item.issuer} onChange={(v) => updateCert(i, { issuer: v })} />
              <Input label="Year" value={item.year} onChange={(v) => updateCert(i, { year: v })} />
            </div>
          )}
        />
      )}

      {activeTab === "Languages" && (
        <ListEditor
          items={data.languages}
          onAdd={() => update({ languages: [...data.languages, { id: uuid(), name: "", level: "" }] })}
          onRemove={(id) => update({ languages: data.languages.filter((l) => l.id !== id) })}
          renderItem={(item: LanguageItem, i) => (
            <div className="grid grid-cols-2 gap-2">
              <Input label="Language" value={item.name} onChange={(v) => updateLang(i, { name: v })} />
              <Input label="Level (Fluent / Intermediate / Basic)" value={item.level} onChange={(v) => updateLang(i, { level: v })} />
            </div>
          )}
        />
      )}
    </div>
  );

  function updateExp(index: number, patch: Partial<Experience>) {
    const next = [...data.experience];
    next[index] = { ...next[index], ...patch };
    update({ experience: next });
  }
  function updateEdu(index: number, patch: Partial<Education>) {
    const next = [...data.education];
    next[index] = { ...next[index], ...patch };
    update({ education: next });
  }
  function updateCert(index: number, patch: Partial<Certification>) {
    const next = [...data.certifications];
    next[index] = { ...next[index], ...patch };
    update({ certifications: next });
  }
  function updateLang(index: number, patch: Partial<LanguageItem>) {
    const next = [...data.languages];
    next[index] = { ...next[index], ...patch };
    update({ languages: next });
  }
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-gray-600">{label}</span>
      <input
        className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function Textarea({ label, value, onChange, rows }: { label: string; value: string; onChange: (v: string) => void; rows: number }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-gray-600">{label}</span>
      <textarea
        className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function ListEditor<T extends { id: string }>({
  items,
  onAdd,
  onRemove,
  renderItem,
}: {
  items: T[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={item.id} className="border border-gray-200 rounded-md p-3 relative">
          <button
            onClick={() => onRemove(item.id)}
            className="absolute top-2 right-2 text-xs text-red-500 hover:underline"
          >
            Remove
          </button>
          {renderItem(item, i)}
        </div>
      ))}
      <button
        onClick={onAdd}
        className="text-sm text-brand font-medium hover:underline"
      >
        + Add
      </button>
    </div>
  );
}
