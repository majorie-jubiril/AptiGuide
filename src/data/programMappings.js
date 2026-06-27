import { PROGRAMS } from "./programs";

export const PROGRAM_NAME_MAP = {
  // BUSINESS
  "Bachelor of Business Administration": "BSc Business Administration",
  "Bachelor of Science in Accounting": "BSc Accounting",
  "Bachelor of Science in Banking and Finance": "BSc Banking and Finance",
  "Bachelor of Science in Human Resource Management": "BSc Human Resource Management",
  "Bachelor of Science in Procurement and Supply Chain Management":
    "BSc Procurement and Supply Chain Management",
  "Bachelor of Science in Marketing": "BSc Marketing",

  // TECHNOLOGY
  "Bachelor of Science in Information Technology": "BSc Information Technology",

  // LAW
  "Bachelor of Laws": "LLB Law",

  // DIPLOMAS
  "Diploma in Accounting": "BSc Accounting",
  "Diploma in Business Administration": "BSc Business Administration",
  "Diploma in Marketing": "BSc Marketing",
  "Diploma in Procurement and Supply Chain Management":
    "BSc Procurement and Supply Chain Management",
  "Diploma in Information Technology": "BSc Information Technology",

  // No behavioural profile yet
  "Diploma in Public Relations": null,
  "Diploma in Data Analytics": null,
  "Diploma in Cyber Security": null,
  "Diploma in Management": null,
  "Diploma in Office Management": null,
  "Diploma in Insurance": null,
  "Diploma in Accounting and Finance": "BSc Accounting"
};

export function mapPrograms(apiPrograms) {
  return apiPrograms
    .map((apiProgram) => {
      const profileName = PROGRAM_NAME_MAP[apiProgram.program_name];

      if (!profileName) return null;

      const profile = PROGRAMS.find(
        (program) => program.name === profileName
      );

      if (!profile) return null;

      return {
        ...profile,
        name: apiProgram.program_name,
        degree: apiProgram.degree,
        apply_url: apiProgram.apply_url,
        slug: apiProgram.program_slug
      };
    })
    .filter(Boolean);
}