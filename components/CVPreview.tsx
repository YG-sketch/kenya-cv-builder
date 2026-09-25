import { CVData } from "@/lib/types";

// Deliberately plain: single column, no tables/icons/graphics —
// this is what makes a CV parse cleanly through ATS software.
export default function CVPreview({ data }: { data: CVData }) {
  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-10 text-[13.5px] leading-relaxed text-gray-800">
      {/* Header */}
      <div className="border-b-2 border-brand pb-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {data.fullName || "Your Name"}
        </h1>
        {data.jobTitle && (
          <p className="text-brand font-semibold text-base mt-1">{data.jobTitle}</p>
        )}
        <p className="text-gray-500 text-xs mt-2 tracking-wide">
          {[data.email, data.phone, data.location].filter(Boolean).join("   •   ")}
        </p>
      </div>

      {data.summary && (
        <section className="mb-6">
          <SectionHeading>Summary</SectionHeading>
          <p className="text-gray-700">{data.summary}</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="mb-6">
          <SectionHeading>Experience</SectionHeading>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-4 last:mb-0">
              <div className="flex justify-between items-baseline flex-wrap gap-x-3">
                <span className="font-semibold text-gray-900">
                  {exp.jobTitle}
                  {exp.company && <span className="font-normal text-gray-600"> — {exp.company}</span>}
                </span>
                <span className="text-gray-500 text-xs whitespace-nowrap">
                  {exp.startDate} – {exp.endDate}
                </span>
              </div>
              {exp.location && (
                <p className="text-gray-500 text-xs mt-0.5">{exp.location}</p>
              )}
              {exp.description && (
                <p className="whitespace-pre-line mt-1.5 text-gray-700">{exp.description}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {data.education.length > 0 && (
        <section className="mb-6">
          <SectionHeading>Education</SectionHeading>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-3 last:mb-0">
              <div className="flex justify-between items-baseline flex-wrap gap-x-3">
                <span className="font-semibold text-gray-900">
                  {edu.qualification}
                  {edu.school && <span className="font-normal text-gray-600"> — {edu.school}</span>}
                </span>
                <span className="text-gray-500 text-xs whitespace-nowrap">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
              {edu.location && (
                <p className="text-gray-500 text-xs mt-0.5">{edu.location}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {data.skills.length > 0 && (
        <section className="mb-6">
          <SectionHeading>Skills</SectionHeading>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, i) => (
              <span
                key={i}
                className="bg-brand/10 text-brand-dark text-xs font-medium px-2.5 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {data.certifications.length > 0 && (
        <section className="mb-6">
          <SectionHeading>Certifications</SectionHeading>
          {data.certifications.map((cert) => (
            <p key={cert.id} className="text-gray-700 mb-1 last:mb-0">
              <span className="font-medium text-gray-900">{cert.name}</span>
              {cert.issuer && ` — ${cert.issuer}`}
              {cert.year && ` (${cert.year})`}
            </p>
          ))}
        </section>
      )}

      {data.languages.length > 0 && (
        <section>
          <SectionHeading>Languages</SectionHeading>
          <p className="text-gray-700">
            {data.languages.map((l) => `${l.name} (${l.level})`).join("   •   ")}
          </p>
        </section>
      )}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="uppercase text-xs font-bold tracking-widest text-brand-dark mb-2.5 pb-1 border-b border-gray-200">
      {children}
    </h2>
  );
}
