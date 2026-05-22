const CATEGORY_DEFAULTS = {

  engineering: {
    semanticTypes: [
      "structured_program",
      "technical_program",
      "analytical_program"
    ],

    environmentTraits: {
      structureLevel: "high",
      technicalIntensity: "high",
      collaborationLevel: "moderate",
      ambiguityLevel: "moderate"
    }
  },

  business: {
    semanticTypes: [
      "leadership_program",
      "people_centered_program",
      "communication_program"
    ],

    environmentTraits: {
      collaborationLevel: "high",
      leadershipDemand: "moderate",
      ambiguityLevel: "moderate"
    }
  },

  healthcare: {
    semanticTypes: [
      "care_oriented_program",
      "people_centered_program",
      "high_responsibility_program"
    ],

    environmentTraits: {
      emotionalDemand: "high",
      collaborationLevel: "high",
      structureLevel: "moderate"
    }
  },

  social_science: {
    semanticTypes: [
      "interpretive_program",
      "people_centered_program",
      "research_heavy_program"
    ],

    environmentTraits: {
      ambiguityLevel: "high",
      collaborationLevel: "moderate",
      emotionalDemand: "moderate"
    }
  },

  creative: {
    semanticTypes: [
      "creative_program",
      "communication_program"
    ],

    environmentTraits: {
      creativityDemand: "high",
      ambiguityLevel: "high",
      structureLevel: "low"
    }
  }
};

export function resolveSemanticTypes(
  profile = {}
) {

  const category =
  profile.category || "general";

const categoryDefaults =
  CATEGORY_DEFAULTS[
    category
  ] || {};

const semanticTypes = [

  ...(categoryDefaults.semanticTypes || []),

  ...(profile.semanticTypes || [])
];

const environmentTraits = {

  ...(categoryDefaults.environmentTraits || {}),

  ...(profile.environmentTraits || {})
};

  return {
    semanticTypes,
    environmentTraits,

    hasSemanticEnrichment:
      semanticTypes.length > 0 ||

      environmentTraits.length > 0
  };
}

export function resolveEnvironmentProfile(
  profile = {}
) {

  return {
    environment:
      profile.environment ||
      "general",

    category:
      profile.category ||
      "general",

    environmentTraits:
      profile.environmentTraits || []
  };
}