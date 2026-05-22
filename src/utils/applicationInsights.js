import { PROGRAM_PROFILES } from "../data/programProfiles";
import {
  interpretBehavior,
  composeBehaviorNarrative
} from "./behavioralInterpretation";

  export function generateApplicationContext(
  selectedProgram,
  personality
) {
  if (!selectedProgram) {
    return {
      fitLabel: "Moderate Fit",
      matchScore: 0,

      title:
        "Application Context",

      conciseCompatibility:
        "Program aligned with your assessment profile."
    };
  }

  const profile =
    PROGRAM_PROFILES[
      selectedProgram.program
    ];

  const fitLevel =
    selectedProgram.level;

  const narrative =
    profile?.applicationNarratives?.[
      fitLevel
    ];

  const interpretation =
    interpretBehavior(
      selectedProgram,
      personality?.type,
      fitLevel
    );

  const behavioralModifier =
    composeBehaviorNarrative(
      interpretation,
      selectedProgram,
      personality?.type
    );

  return {
    fitLabel: `${fitLevel} Fit`,

    matchScore:
      selectedProgram.percentage,

    title:
      narrative?.title ||
      "Application Context",

    conciseCompatibility:
      narrative?.message
        ? `${narrative.message} ${behavioralModifier || ""}`.trim()
        : behavioralModifier ||
          "Program aligned with your assessment profile.",

      category:
        profile?.category || "",

      environment:
        profile?.environment || ""
    };
}

export function generateStatementGuidance(
  selectedProgram
) {
  if (!selectedProgram) {
    return {
      title:
        "Strong applications often highlight:",

      themes: [
        "motivation",
        "academic interests",
        "future goals"
      ]
    };
  }

  const program =
    selectedProgram.program;

  const guidanceMap = {
    "BSc Computer Science": [
      "problem-solving experiences",
      "technical curiosity",
      "projects or experimentation",
      "logical thinking",
      "team collaboration"
    ],

    "BSc Civil Engineering": [
  "what inspired your interest in engineering",
  "projects or technical interests",
  "problem-solving experiences",
  "teamwork or leadership experiences",
  "future career goals"
],

    "LLB Law": [
      "critical thinking",
      "communication skills",
      "reasoning ability",
      "interest in justice or advocacy",
      "discipline and persistence"
    ]
  };

  return {
    title:
      "Strong applications often highlight:",

    themes:
      guidanceMap[program] || [
        "motivation",
        "academic interests",
        "future goals",
        "personal strengths"
      ]
  };
}