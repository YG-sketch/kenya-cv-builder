import { CVData } from "./types";

export function emptyCv(): CVData {
  return {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
  };
}
