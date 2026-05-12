import { PROGRAMS } from "../data/programs";

/**
 * STEP 1: Build scores from weight-based answers
 */
export function buildScoresFromAnswers(answers) {
  const scores = {
    inclusion: 0,
    control: 0,
    affection: 0,
    thinking: 0,
    flexibility: 0
  };

  answers.forEach((answer) => {
    if (!answer?.weights) return;

    Object.entries(answer.weights).forEach(([dimension, value]) => {
      if (scores[dimension] !== undefined) {
        scores[dimension] += value;
      }
    });
  });

  return scores;
}

/**
 * STEP 2: Normalize scores (important for consistency)
 */
function normalizeScores(scores) {
  const normalized = {};

  Object.entries(scores).forEach(([key, value]) => {
    // Clamp between -10 and +10 for stability
    const clamped = Math.max(Math.min(value, 10), -10);

    // Convert to 0–100 scale
    normalized[key] = Math.round(((clamped + 10) / 20) * 100);
  });

  return normalized;
}

/**
 * STEP 3: Convert score → level
 */
function getLevel(score = 50) {
  if (score >= 70) return "high";
  if (score >= 40) return "moderate";
  return "low";
}

/**
 * STEP 4: Match scoring
 */
function scoreMatch(user, program) {
  if (user === program) return 1;

  const adjacent =
    (user === "high" && program === "moderate") ||
    (user === "moderate" && program === "high") ||
    (user === "moderate" && program === "low") ||
    (user === "low" && program === "moderate");

  if (adjacent) return 0.6;

  return 0.2;
}

/**
 * STEP 5: Fit level
 */
function getFitLevel(percentage) {
  if (percentage >= 80) return "High";
  if (percentage >= 55) return "Moderate";
  return "Low";
}

/**
 * STEP 6: Calculate fit per program
 */
export function calculateFit(rawScores, program) {
  if (!program?.profile) {
    return { percentage: 0, level: "Low" };
  }

  const scores = normalizeScores(rawScores);

  const userProfile = {
    inclusion: getLevel(scores.inclusion),
    control: getLevel(scores.control),
    affection: getLevel(scores.affection),
    thinking: getLevel(scores.thinking),
    flexibility: getLevel(scores.flexibility)
  };

  let total = 0;
  let count = 0;

  Object.keys(userProfile).forEach((dimension) => {
    if (program.profile[dimension]) {
      total += scoreMatch(
        userProfile[dimension],
        program.profile[dimension]
      );
      count++;
    }
  });

  const percentage = Math.round((total / count) * 100);
  const level = getFitLevel(percentage);

  return { percentage, level };
}

/**
 * STEP 7: Generate all program fits
 */
export function generateFitsFromScores(scores) {
  return PROGRAMS.map((program) => {
    const { percentage, level } = calculateFit(scores, program);

    return {
      program: program.name,
      percentage,
      level
    };
  });
}