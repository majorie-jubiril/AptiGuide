/**
 * Convert normalized score → level
 */
function getLevel(score = 50) {
  if (score >= 70) return "high";
  if (score >= 40) return "moderate";
  return "low";
}

/**
 * Normalize raw scores (same logic as fitEngine)
 */
function normalizeScores(scores) {
  const normalized = {};

  Object.entries(scores || {}).forEach(([key, value]) => {
    const clamped = Math.max(Math.min(value, 10), -10);
    normalized[key] = Math.round(((clamped + 10) / 20) * 100);
  });

  return normalized;
}

/**
 * ✅ PERSONALITY SUMMARY (NEW MODEL)
 */
export function getPersonalitySummary(scores) {
  const normalized = normalizeScores(scores);

  const profile = {
    inclusion: getLevel(normalized.inclusion),
    control: getLevel(normalized.control),
    affection: getLevel(normalized.affection),
    thinking: getLevel(normalized.thinking),
    flexibility: getLevel(normalized.flexibility)
  };

  const {
    inclusion,
    control,
    affection,
    thinking,
    flexibility
  } = profile;

  let type = "";

  // ✅ PERSONALITY TYPE ENGINE
  if (thinking === "high" && control === "high") {
    type = "analytical_thinker";

  } else if (inclusion === "high" && affection === "high") {
    type = "versatile_collaborator";

  } else if (control === "high" && flexibility === "low") {
    type = "strategic_planner";

  } else if (flexibility === "high" && thinking !== "low") {
    type = "creative_explorer";

  } else if (
    inclusion === "moderate" &&
    control === "moderate" &&
    affection === "moderate"
  ) {
    type = "practical_operator";

  } else {
    type = "independent_problem_solver";
  }

    return {
    type,
    insights: generateInsights(normalized)
  };
}

/**
 * ✅ INSIGHTS ENGINE (NEW — DIMENSION-BASED)
 */
export function generateInsights(scores) {
  const insights = [];

  const {
    inclusion,
    control,
    affection,
    thinking,
    flexibility
  } = scores;

  // --- INCLUSION ---
  if (inclusion >= 70) {
    insights.push("You actively engage with others and thrive in social environments.");
  } else if (inclusion <= 30) {
    insights.push("You prefer working independently and value personal space.");
  } else {
    insights.push("You balance collaboration with independence depending on the situation.");
  }

  // --- CONTROL ---
  if (control >= 70) {
    insights.push("You naturally take initiative and prefer leading or structuring tasks.");
  } else if (control <= 30) {
    insights.push("You prefer guidance and clear direction when approaching tasks.");
  } else {
    insights.push("You can both lead and follow depending on what the situation requires.");
  }

  // --- AFFECTION ---
  if (affection >= 70) {
    insights.push("You value strong relationships and emotional connection with others.");
  } else if (affection <= 30) {
    insights.push("You maintain emotional independence and focus more on tasks than relationships.");
  } else {
    insights.push("You balance emotional connection with personal boundaries.");
  }

  // --- THINKING ---
  if (thinking >= 70) {
    insights.push("You rely heavily on logic, analysis, and critical thinking when making decisions.");
  } else if (thinking <= 30) {
    insights.push("You prefer intuitive or experience-based decision making.");
  } else {
    insights.push("You combine logical reasoning with intuition when solving problems.");
  }

  // --- FLEXIBILITY ---
  if (flexibility >= 70) {
    insights.push("You adapt quickly to change and are comfortable exploring new approaches.");
  } else if (flexibility <= 30) {
    insights.push("You prefer stability, structure, and predictable environments.");
  } else {
    insights.push("You balance structure with adaptability depending on context.");
  }

  return insights;
}

/**
 * ✅ PROGRAM EXPLANATION (UNCHANGED BUT ALIGNED)
 */
export function generateProgramExplanation(fit, personality, level) {
  if (!fit || !personality) {
    return "Program aligned with your personality profile.";
  }

  const personalityLabel = personality?.label || "your";

  if (level === "High") {
    return `This program strongly aligns with your ${personalityLabel} personality and preferred work style.`;
  }

  if (level === "Moderate") {
    return `This program partially matches your ${personalityLabel} personality, though some aspects may require adjustment.`;
  }

  return `This program may challenge your natural preferences, but could still be pursued with effort.`;
}