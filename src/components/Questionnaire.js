import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QUESTIONS } from "../data/questions";
import { PROGRAMS } from "../data/programs";
import { calculateFit } from "../utils/fitEngine";
import { generateInsights } from "../utils/insights";

export default function Questionnaire() {
  const navigate = useNavigate();

  // --- STATE ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);

  const currentQuestion = QUESTIONS[currentIndex];
  const totalQuestions = QUESTIONS.length;

  // --- HANDLE ANSWER ---
  const handleSelect = (value) => {
    setSelected(value);

    const updatedAnswers = {
      ...answers,
      [currentIndex]: value
    };

    setAnswers(updatedAnswers);

    const isLast = currentIndex === totalQuestions - 1;

    setTimeout(() => {
      setSelected(null);

      if (isLast) {
        processResults(updatedAnswers);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    }, 180);
  };

  // --- RESULT PIPELINE ---
  const processResults = (finalAnswers) => {
    const scores = {};

    // Step 1: Aggregate totals + counts
    QUESTIONS.forEach((q, index) => {
      const answer = finalAnswers[index];

      if (!scores[q.trait]) {
        scores[q.trait] = { total: 0, count: 0 };
      }

      if (answer !== undefined) {
        scores[q.trait].total += answer;
        scores[q.trait].count += 1;
      }
    });

    // Step 2: Convert to averages
    const averagedScores = {};

    Object.keys(scores).forEach((trait) => {
      const { total, count } = scores[trait];
      averagedScores[trait] = count > 0 ? total / count : 0;
    });

    // Step 3: Generate insights
    const insights = generateInsights(averagedScores);

    // -----------------------------
    // 🔥 NEW: TEMP USER TRAITS
    // -----------------------------
    const userTraits = ["analytical", "independent"];
    // (we will make this dynamic later)

    // Step 4: Calculate program fit (UPDATED)
    const fits = PROGRAMS.map((program) => {
      const fit = calculateFit(
        averagedScores,
        program,
        userTraits // 👈 THIS is the key change
      );

      return {
        program: program.name,
        ...fit
      };
    });

    // Step 5: Navigate to results
    navigate("/results", {
      state: {
        scores: averagedScores,
        insights,
        fits,
        traits: userTraits // optional (for future use)
      }
    });
  };

  // --- PROGRESS ---
  const progressPercent =
    ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className="qa-page">
      {/* Top Section */}
      <div className="qa-top">
        <div className="qa-pill">
          <span className="qa-dot" />
          Question {currentIndex + 1} of {totalQuestions}
        </div>

        <div className="qa-progress">
          <div
            className="qa-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Card */}
      <div className="qa-card">
        <div className="qa-badge">Scenario</div>

        <h2 className="qa-question">
          {currentQuestion.text}
        </h2>

        {/* Options */}
        <div className="qa-options">
          {currentQuestion.options.map((opt, i) => {
            const isActive = selected === opt.value;

            return (
              <button
                key={i}
                className={`qa-option ${isActive ? "active" : ""}`}
                onClick={() => handleSelect(opt.value)}
              >
                <span className="qa-option-label">
                  {String.fromCharCode(65 + i)}
                </span>

                <span className="qa-option-text">
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}