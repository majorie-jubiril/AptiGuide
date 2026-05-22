import {
  resolveSemanticTypes
} from "./semanticResolver";

export const evaluateBehavioralCompatibility = ({
  personalityProfile,
  programProfile
}) => {

  if (!personalityProfile || !programProfile) {
    return null;
  }

  const personalityTraits =
    personalityProfile.behavioralTraits || {};

  const {
    environmentTraits
  } = resolveSemanticTypes(
    programProfile
  );

  const alignments = [];
  const tensions = [];

  const signalPriorityMap = {
    structured_reasoning: 10,
    technical_environment: 9,
    leadership_alignment: 8,
    creative_environment: 7,
    adaptive_environment: 6,
    independent_execution: 5,
    structured_environment: 4,

    high_ambiguity: 10,
    emotional_intensity: 9,
    low_structure_environment: 8,
    high_collaboration: 7
  };

  // STRUCTURE ALIGNMENT

  if (
    personalityTraits.structurePreference === "high" &&
    (
      environmentTraits.structureLevel === "high" ||
      environmentTraits.structureLevel === "very_high"
    )
  ) {
    alignments.push("structured_environment");
  }

  // COLLABORATION TENSION

  if (
    personalityTraits.collaborationPreference === "low" &&
    (
      environmentTraits.collaborationLevel === "high" ||
      environmentTraits.collaborationLevel === "very_high"
    )
  ) {
    tensions.push("high_collaboration");
  }

  // AMBIGUITY TENSION

  if (
    personalityTraits.ambiguityTolerance === "low" &&
    (
      environmentTraits.ambiguityLevel === "high" ||
      environmentTraits.ambiguityLevel === "very_high"
    )
  ) {
    tensions.push("high_ambiguity");
  }

  // TECHNICAL ALIGNMENT

  if (
    personalityTraits.technicalOrientation === "high" &&
    (
      environmentTraits.technicalIntensity === "high" ||
      environmentTraits.technicalIntensity === "very_high"
    )
  ) {
    alignments.push("technical_environment");
  }

  // CREATIVITY ALIGNMENT

  if (
    personalityTraits.creativityOrientation === "high" &&
    (
      environmentTraits.creativityDemand === "high" ||
      environmentTraits.creativityDemand === "very_high"
    )
  ) {
    alignments.push("creative_environment");
  }

  // INDEPENDENT EXECUTION ALIGNMENT

if (
  personalityTraits.collaborationPreference === "low" &&
  (
    environmentTraits.collaborationLevel === "low" ||
    environmentTraits.collaborationLevel === "moderate"
  )
) {
  alignments.push("independent_execution");
}

// STRUCTURED REASONING ALIGNMENT

if (
  personalityTraits.structurePreference === "high" &&
  personalityTraits.ambiguityTolerance === "low" &&
  (
    environmentTraits.structureLevel === "high" ||
    environmentTraits.structureLevel === "very_high"
  )
) {
  alignments.push("structured_reasoning");
}

// ADAPTIVE ENVIRONMENT ALIGNMENT

if (
  personalityTraits.adaptabilityPreference === "high" &&
  (
    environmentTraits.ambiguityLevel === "moderate" ||
    environmentTraits.ambiguityLevel === "high" ||
    environmentTraits.ambiguityLevel === "very_high"
  )
) {
  alignments.push("adaptive_environment");
}

// LEADERSHIP ALIGNMENT

if (
  personalityTraits.leadershipPreference === "high" &&
  (
    environmentTraits.leadershipDemand === "high" ||
    environmentTraits.leadershipDemand === "very_high"
  )
) {
  alignments.push("leadership_alignment");
}


// EMOTIONAL DEMAND TENSION

if (
  personalityTraits.emotionalOrientation === "low" &&
  environmentTraits.emotionalDemand === "high"
) {
  tensions.push("emotional_intensity");
}

// LOW STRUCTURE TENSION

if (
  personalityTraits.structurePreference === "high" &&
  environmentTraits.structureLevel === "low"
) {
  tensions.push("low_structure_environment");
}
  // ADAPTATION PRESSURE

  let adaptationPressure = "low";

  if (tensions.length >= 2) {
    adaptationPressure = "high";
  } else if (tensions.length === 1) {
    adaptationPressure = "moderate";
  }

  let dominantInsight = null;

  const sortedAlignments = [...alignments].sort(
  (a, b) =>
    (signalPriorityMap[b] || 0) -
    (signalPriorityMap[a] || 0)
);

const sortedTensions = [...tensions].sort(
  (a, b) =>
    (signalPriorityMap[b] || 0) -
    (signalPriorityMap[a] || 0)
);

// PRIORITIZE ALIGNMENTS FIRST

if (sortedAlignments.length > 0) {
  dominantInsight = sortedAlignments[0];
}

// FALL BACK TO TENSIONS

if (
  !dominantInsight &&
  sortedTensions.length > 0
) {
  dominantInsight = sortedTensions[0];
}

return {
  alignments,
  tensions,
  adaptationPressure,
  dominantInsight,

  narrativeSignals: {
    primaryAlignment:
      sortedAlignments[0] || null,

    secondaryAlignment:
      sortedAlignments[1] || null,

    primaryTension:
      sortedTensions[0] || null,

    secondaryTension:
      sortedTensions[1] || null,

    adaptationPriority:
      adaptationPressure === "high"
        ? adaptationPressure
        : null,

    narrativeWeighting: {
      alignmentWeight:
        sortedAlignments.length >= 2
          ? "strong"
          : "moderate",

      tensionWeight:
        sortedTensions.length >= 2
          ? "strong"
          : sortedTensions.length === 1
            ? "moderate"
            : "minimal",

      adaptationWeight:
        adaptationPressure === "high"
          ? "strong"
          : adaptationPressure === "moderate"
            ? "moderate"
            : "minimal"
    }
  }
};

};