import { PROGRAMS } from "./programs";

export const PROGRAM_NAME_MAP = {
  // BUSINESS
  "Bachelor of Business Administration": "BSc Business Administration",
  "Bachelor of Science in Accounting": "BSc Accounting",
  "Bachelor of Science in Accounting and Finance": "BSc Accounting",
  "Bachelor of Science in Banking and Finance": "BSc Banking and Finance",
  "Bachelor of Science in Human Resource Management": "BSc Human Resource Management",
  "Bachelor of Science in Marketing": "BSc Marketing",
  "Bachelor of Science in Business Economics": "BSc Business Economics",
  "Bachelor of Science in Agribusiness and Finance": "BSc Agribusiness and Finance",
  "Bachelor of Science in Real Estate Management and Finance": "BSc Real Estate Management and Finance",
  "Bachelor of Science in Applied Statistics": "BSc Applied Statistics",
  "Bachelor of Science in Logistics and Transport Management": "BSc Logistics and Transport Management",
  "Bachelor of Science in Actuarial Science": "BSc Actuarial Science",
  
  // COMMUNICATION
  "Bachelor of Arts in Public Relations Management": "BA Public Relations",
  "Bachelor of Arts in Communication Studies": "BA Communication Studies",
  "Bachelor of Arts in Applied French and Communications": "BA Applied French and Communications",

  // TECHNOLOGY
  "Bachelor of Science in Information Technology": "BSc Information Technology",
  "Bachelor of Science in Data Science and Analytics": "BSc Data Science and Analytics",

  // LAW
  "Bachelor of Laws": "LLB Law",
  "Bachelor of Laws (LLB)": "LLB Law",

  // DIPLOMAS
  "Diploma in Accounting": "BSc Accounting",
  "Diploma in Marketing": "BSc Marketing",
  "Diploma in Information Technology Management": "BSc Information Technology",
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