import { CVData } from "@/lib/types";

// Deliberately plain: single column, no tables/icons/graphics —
// this is what makes a CV parse cleanly through ATS software.
export default function CVPreview({ data }: { data: CVData }) {
  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-8 text-sm leading-relaxed">
      <h1 className="text-2xl font-bold">
        {data.fullName || "Your Name"}
      </h1>
      {data.jobTitle && (
        <p className="text-brand font-medium">{data.jobTitle}</p>
      )}
      <p className="text-gray-500 text-xs mt-1">
        {[data.email, data.phone, data.location].filter(Boolean).join("  |  ")}
      </p>

      {data.summary && (
        <section className="mt-5">
          <h2 className="uppercase text-xs font-bold tracking-wide text-gray-500 border-b pb-1 mb-2">
            Summary
          </h2>
          <p>{data.summary}</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="mt-5">
          <h2 className="uppercase text-xs font-bold tracking-wide text-gray-500 border-b pb-1 mb-2">
            Experience
          </h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between font-semibold">
                <span>{exp.jobTitle} — {exp.company}</span>
                <span className="text-gray-500 font-normal text-xs">
                  {exp.startDate} - {exp.endDate}
                </span>
              </div>
              {exp.location && (
                <p className="text-gray-500 text-xs">{exp.location}</p>
              )}
              <p className="whitespace-pre-line mt-1">{exp.description}</p>
            </div>
          ))}
        </section>
      )}

      {data.education.length > 0 && (
        <section className="mt-5">
          <h2 className="uppercase text-xs font-bold tracking-wide text-gray-500 border-b pb-1 mb-2">
            Education
          </h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between font-semibold">
                <span>{edu.qualification} — {edu.school}</span>
                <span className="text-gray-500 font-normal text-xs">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
              {edu.location && (
                <p className="text-gray-500 text-xs">{edu.location}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {data.skills.length > 0 && (
        <section className="mt-5">
          <h2 className="uppercase text-xs font-bold tracking-wide text-gray-500 border-b pb-1 mb-2">
            Skills
          </h2>
          <p>{data.skills.join(", ")}</p>
        </section>
      )}

      {data.certifications.length > 0 && (
        <section className="mt-5">
          <h2 className="uppercase text-xs font-bold tracking-wide text-gray-500 border-b pb-1 mb-2">
            Certifications
          </h2>
          {data.certifications.map((cert) => (
            <p key={cert.id}>
              {cert.name} — {cert.issuer} {cert.year && `(${cert.year})`}
            </p>
          ))}
        </section>
      )}

      {data.languages.length > 0 && (
        <section className="mt-5">
          <h2 className="uppercase text-xs font-bold tracking-wide text-gray-500 border-b pb-1 mb-2">
            Languages
          </h2>
          <p>
            {data.languages.map((l) => `${l.name} (${l.level})`).join(", ")}
          </p>
        </section>
      )}
    </div>
  );
}
