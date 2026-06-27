import { PROGRAMS } from "./programs";

export const PROGRAM_NAME_MAP = {
  // BUSINESS
  "Bachelor of Business Administration": "BSc Business Administration",
  "Bachelor of Science in Accounting": "BSc Accounting",
  "Bachelor of Science in Accounting and Finance": "BSc Accounting",
  "Bachelor of Science in Banking and Finance": "BSc Banking and Finance",
  "Bachelor of Science in Human Resource Management": "BSc Human Resource Management",
  "Bachelor of Science in Procurement and Supply Chain Management":
  "BSc Procurement and Supply Chain Management",
  "Bachelor of Science in Marketing": "BSc Marketing",

  "Bachelor of Arts in Communication Studies": "BA Communication Studies",
  "Bachelor of Arts in Public Relations Management": "BA Public Relations",

  // TECHNOLOGY
  "Bachelor of Science in Information Technology": "BSc Information Technology",

  // LAW
  "Bachelor of Laws": "LLB Law",

  // DIPLOMAS
  "Diploma in Accounting": "BSc Accounting",
  "Diploma in Marketing": "BSc Marketing",
  "Diploma in Information Technology Management": "BSc Information Technology",

  // No behavioural profile yet
  "Diploma in Public Relations": "BA Public Relations",
  "Diploma in Management": "BSc Business Administration",
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