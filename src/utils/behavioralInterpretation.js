import { PROGRAM_PROFILES } from "../data/programProfiles";
import { PERSONALITY_PROFILES } from "../data/personalityProfiles";
import { BEHAVIORAL_LANGUAGE } from "../data/behavioralLanguage";

export function interpretBehavior(
  selectedProgram,
  personalityType,
  fitLevel,
  compatibilityData = null
)
 {
  if (!selectedProgram || !personalityType) {
    return null;
  }

  const programProfile =
    PROGRAM_PROFILES[selectedProgram.program];

  const personalityProfile =
    PERSONALITY_PROFILES[personalityType];

  const traits =
  personalityProfile.behavioralTraits;

  if (!programProfile || !personalityProfile) {
    return null;
  }

  const environmentTraits =
    programProfile.environmentTraits;
  
  if (!environmentTraits) {
    return {
      alignments: [],
      tensions: [],
      adaptationPotential: [],
      fitTone: fitLevel
    };
  }

  const interpretation = {
    alignments: [],
    tensions: [],
    adaptationPotential: [],
    dominantInsight: null,
    fitTone: fitLevel
  };

  // COMPATIBILITY ENGINE INJECTION

  if (compatibilityData) {

    interpretation.alignments =
      compatibilityData.alignments || [];

    interpretation.tensions =
      compatibilityData.tensions || [];

    interpretation.dominantInsight =
      compatibilityData.dominantInsight || null;

    interpretation.narrativeSignals =
      compatibilityData.narrativeSignals || null;
  }

  // STRUCTURE ALIGNMENT
  if (
    environmentTraits.structureLevel === "high" &&
    traits.structurePreference === "high"
 ) {
    interpretation.alignments.push(
        "structured environments"
    ); 
 }

  // CREATIVITY VS STRUCTURE TENSION
  if (
    environmentTraits.creativityDemand === "high" &&
    traits.structurePreference === "high"
  ) {
    interpretation.tensions.push(
      "highly creative and unstructured environments"
    );
  }

  // CREATIVE GROWTH POTENTIAL
  if (
    environmentTraits.creativityDemand === "high" &&
    traits.creativityOrientation !== "low"
  ) {
    interpretation.adaptationPotential.push(
      "creative exploration"
    );
  }

  // AMBIGUITY TENSION
if (
  environmentTraits.ambiguityLevel === "high" &&
  traits.ambiguityTolerance === "low"
) {
  interpretation.tensions.push(
    "ambiguous and open-ended environments"
  );
}

// COLLABORATION TENSION
if (
  environmentTraits.collaborationLevel === "high" &&
  traits.collaborationPreference === "low"
) {
  interpretation.tensions.push(
    "highly collaborative environments"
  );
}

  // EMOTIONAL DEMAND TENSION
  if (
    environmentTraits.emotionalDemand === "high" &&
    traits.emotionalOrientation === "low"
  ) {
    interpretation.tensions.push(
      "emotionally intensive environments"
    );
  }

  // DETERMINE DOMINANT INSIGHT

  const semanticTypes =
    programProfile.semanticTypes || [];

  // HEALTHCARE / CARE PROGRAMS
  if (
    semanticTypes.includes(
      "care_oriented_program"
    )
  ) {

    if (
      interpretation.tensions.includes(
        "emotionally intensive environments"
      )
    ) {
      interpretation.dominantInsight =
        "emotional_tension";
    }

    else if (
      interpretation.tensions.includes(
        "highly collaborative environments"
      )
    ) {
      interpretation.dominantInsight =
        "collaboration_tension";
    }
  }

  // CREATIVE PROGRAMS
  else if (
    semanticTypes.includes(
      "creative_program"
    )
  ) {

    if (
      interpretation.tensions.includes(
        "highly creative and unstructured environments"
      )
    ) {
      interpretation.dominantInsight =
        "creative_tension";
    }

    else if (
      interpretation.tensions.includes(
        "ambiguous and open-ended environments"
      )
    ) {
      interpretation.dominantInsight =
        "ambiguity_tension";
    }
  }

  // COMMUNICATION / PEOPLE PROGRAMS
  else if (
    semanticTypes.includes(
      "communication_program"
    ) ||

    semanticTypes.includes(
      "people_centered_program"
    )
  ) {

    if (
      interpretation.tensions.includes(
        "highly collaborative environments"
      )
    ) {
      interpretation.dominantInsight =
        "collaboration_tension";
    }

    else if (
      interpretation.tensions.includes(
        "emotionally intensive environments"
      )
    ) {
      interpretation.dominantInsight =
        "emotional_tension";
    }
  }

  // RESEARCH / ANALYTICAL PROGRAMS
  else if (
    semanticTypes.includes(
      "research_heavy_program"
    ) ||

    semanticTypes.includes(
      "analytical_program"
    )
  ) {

    if (
      interpretation.tensions.includes(
        "ambiguous and open-ended environments"
      )
    ) {
      interpretation.dominantInsight =
        "ambiguity_tension";
    }

    else if (
      interpretation.alignments.includes(
        "structured environments"
      )
    ) {
      interpretation.dominantInsight =
        "structure_alignment";
    }
  }

  // TECHNICAL / STRUCTURED PROGRAMS
  else {

    if (
      interpretation.alignments.includes(
        "structured environments"
      )
    ) {
      interpretation.dominantInsight =
        "structure_alignment";
    }

    else if (
      interpretation.tensions.includes(
        "ambiguous and open-ended environments"
      )
    ) {
      interpretation.dominantInsight =
        "ambiguity_tension";
    }
  }
  
  // FIT-AWARE INTERPRETATION GOVERNANCE

  if (fitLevel === "High") {

    // High fit should prioritize alignment
    // over tension-heavy narratives

    if (
      interpretation.dominantInsight ===
      "adaptation_pressure"
    ) {
      interpretation.dominantInsight =
        "growth_alignment";
    }

    if (
      interpretation.dominantInsight ===
      "emotional_tension"
    ) {
      interpretation.dominantInsight =
        "people_alignment";
    }

    if (
      interpretation.dominantInsight ===
      "ambiguity_tension"
    ) {
      interpretation.dominantInsight =
        "creative_alignment";
    }
  }

  if (fitLevel === "Low") {

  // Low fit should NOT sound
  // overly optimistic

  if (
    interpretation.dominantInsight ===
    "structure_alignment"
  ) {
    interpretation.dominantInsight =
      "adaptation_pressure";
  }

  if (
    interpretation.dominantInsight ===
    "people_alignment"
  ) {
    interpretation.dominantInsight =
      "collaboration_tension";
  }

  if (
    interpretation.dominantInsight ===
    "creative_alignment"
  ) {
    interpretation.dominantInsight =
      "creative_tension";
  }
}

return interpretation;
}

export function composeBehaviorNarrative(
  interpretation,
  selectedProgram,
  personalityType
) {
  if (
    !interpretation ||
    !selectedProgram ||
    !personalityType
  ) {
    return "Program aligned with your assessment profile.";
  }

  const language =
    BEHAVIORAL_LANGUAGE;

  const SEMANTIC_ALIASES = {

  structured_environment:
    "structure_alignment",

  technical_environment:
    "technical_alignment",

  independent_execution:
    "technical_alignment",

  creative_environment:
    "creative_alignment",

  high_collaboration:
    "collaboration_tension",

  high_ambiguity:
    "ambiguity_tension",

  emotional_intensity:
    "emotional_tension"
};

  const {
  alignments,
  tensions,
  adaptationPotential,
  fitTone,
  narrativeSignals
} = interpretation;

const semanticLanguage =
  language.environment_semantics;

const transitions =
  language.narrative_transitions;

  const programName =
    selectedProgram.program || "This program";

  const programProfile =
    PROGRAM_PROFILES[programName];

  const personalityLabels = {
    analytical_thinker:
      "independent problem-solving personality",

    creative_explorer:
      "creative and exploratory personality",

    versatile_collaborator:
      "adaptable and people-oriented personality",

    structured_strategist:
      "structured and analytical personality",
  };

  const personalityLabel =
    personalityLabels[personalityType] ||
    "individual learning style";

  let modifier = "";

  let dynamicModifier = null;

  const normalizedInsight =
  SEMANTIC_ALIASES[
    interpretation.dominantInsight
  ] ||

  interpretation.dominantInsight;

if (
  normalizedInsight &&
  language[
    normalizedInsight
  ]?.[personalityType]
) {

  dynamicModifier =
  language[
    normalizedInsight
  ][personalityType];
}

  let alignmentNarratives = [];

  let tensionNarratives = [];

  let adaptationNarratives = [];

  let layeredNarrative = [];


  const primaryAlignment =
    narrativeSignals?.primaryAlignment;

  const primaryTension =
    narrativeSignals?.primaryTension;

    const socialTensions = [
    "collaboration_tension",
    "people_centered_tension",
    "social_energy_tension"
  ];

  const analyticalTensions = [
    "structured_reasoning_tension",
    "technical_environment_tension",
    "abstract_reasoning_tension"
  ];

  const hasSocialTension =
    socialTensions.includes(
      primaryTension
    );

  const hasAnalyticalTension =
    analyticalTensions.includes(
      primaryTension
    );
  
    const secondaryAlignment =
    narrativeSignals?.secondaryAlignment;

  const secondaryTension =
    narrativeSignals?.secondaryTension;

  const narrativeWeighting =
    narrativeSignals?.narrativeWeighting;

  const adaptationPriority =
    narrativeSignals?.adaptationPriority;

  // NARRATIVE GOVERNANCE

  const strongAlignment =
    narrativeWeighting?.alignmentWeight ===
    "strong";

  const strongTension =
    narrativeWeighting?.tensionWeight ===
    "strong";

  const highAdaptationPressure =
    adaptationPriority === "high";

  const shouldSuppressMinorTension =
    fitTone === "High" &&
    strongAlignment &&
    !strongTension;

  const shouldAmplifyAlignment =
    fitTone === "High" &&
    strongAlignment;
  
    const suppressSocialRedundancy =
    hasSocialTension &&
    tensionNarratives.length > 0;

  const suppressAnalyticalRedundancy =
    hasAnalyticalTension &&
    tensionNarratives.length > 0;

  if (
    interpretation.dominantInsight ===
    "structure_alignment"
  ) {
    modifier =
      "The environment may feel naturally compatible with your preference for structured reasoning and organized problem-solving.";
  }

  else if (
    interpretation.dominantInsight ===
    "creative_tension"
  ) {
    modifier =
      "The highly open-ended and creatively fluid nature of the environment may occasionally challenge your preference for structure and predictability.";
  }

  else if (
    interpretation.dominantInsight ===
    "ambiguity_tension"
  ) {
    modifier =
      "The program may sometimes require comfort with ambiguity, experimentation, and less clearly defined expectations.";
  }

  else if (
    interpretation.dominantInsight ===
    "collaboration_tension"
  ) {
    modifier =
      "The collaborative and socially intensive aspects of the environment may occasionally feel draining if you naturally prefer independent work styles.";
  }

  else if (
    interpretation.dominantInsight ===
    "emotional_tension"
  ) {
    modifier =
      "Emotionally demanding and people-centered situations within the field may occasionally require additional emotional adaptability.";
  }

  else if (
    interpretation.dominantInsight ===
    "creative_alignment"
  ) {
    modifier =
      "Your adaptability and openness to exploration may help you navigate the program's creative and evolving demands.";
  }

  else if (
    interpretation.dominantInsight ===
    "people_alignment"
  ) {
    modifier =
      "Your interpersonal adaptability may support success in the program's collaborative and communication-heavy environment.";
  }

  else if (
    interpretation.dominantInsight ===
    "adaptation_pressure"
  ) {
    modifier =
      "Long-term success here may require deliberate adjustment to unfamiliar academic and behavioral demands.";
  }

  if (
  primaryAlignment &&
  semanticLanguage?.alignments?.[
    primaryAlignment
  ]
) {

  const alignmentNarrative =
    semanticLanguage.alignments[
      primaryAlignment
    ];

  alignmentNarratives.push(
    shouldAmplifyAlignment
      ? `${alignmentNarrative} may feel especially natural for your behavioral tendencies.`
      : alignmentNarrative
  );
}

if (
  semanticLanguage?.tensions?.[
    primaryTension
  ]
) {

  const tensionNarrative =
    semanticLanguage.tensions[
      primaryTension
    ];

  const shouldSuppressNarrative =

    (
      hasSocialTension &&
      tensionNarratives.some(
        narrative =>
          narrative.includes(
            "social"
          ) ||
          narrative.includes(
            "collaborative"
          )
      )
    ) ||

    (
      hasAnalyticalTension &&
      tensionNarratives.some(
        narrative =>
          narrative.includes(
            "technical"
          ) ||
          narrative.includes(
            "analytical"
          ) ||
          narrative.includes(
            "structured"
          )
      )
    );

  if (!shouldSuppressNarrative) {

    tensionNarratives.push(
      tensionNarrative
    );
  }
}

  if (dynamicModifier) {
  layeredNarrative.push(
    dynamicModifier
  );
}

// ADD TENSION CONTEXT

const suppressTensionNarrative =
  shouldSuppressMinorTension;

if (
  tensions.length > 0 &&
  interpretation.dominantInsight !==
    "collaboration_tension" &&
  !suppressTensionNarrative
) {

  tensionNarratives.push(
    "Some aspects of the program may still require behavioral adjustment over time."
  );
}

// ADD ADAPTATION CONTEXT

if (
  adaptationPotential.length > 0
) {

  adaptationNarratives.push(
    "Your adaptability may help you navigate unfamiliar academic expectations more comfortably."
  );
}

// FALLBACK TO STATIC MODIFIER

if (
  alignmentNarratives.length === 0 &&
  modifier
) {
  alignmentNarratives.push(
    modifier
  );
}

// FIT-AWARE NARRATIVE ORDERING

if (fitTone === "High") {

  layeredNarrative = [
    ...alignmentNarratives,
    ...adaptationNarratives,
    ...tensionNarratives
  ];
}

else if (fitTone === "Low") {

  layeredNarrative = [
    ...tensionNarratives,
    ...adaptationNarratives,
    ...alignmentNarratives
  ];
}

else {

  layeredNarrative = [
    ...alignmentNarratives,
    ...tensionNarratives,
    ...adaptationNarratives
  ];
}

return layeredNarrative.join(" ");
}
