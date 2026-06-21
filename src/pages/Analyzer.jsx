import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Container from "../layout/Container";
import PageWrapper from "../layout/PageWrapper";
import { getRandomQuestions } from "../data/questions";
import {
  buildScoresFromAnswers,
  generateFitsFromScores
} from "../utils/fitEngine";
import { getPersonalitySummary } from "../utils/insights";
import "../styles/analyzer.css";

export default function Analyzer() {
  const navigate = useNavigate();
  const location = useLocation();
  const apiKey = new URLSearchParams(location.search).get("api_key");

  // ✅ Generate randomized questions ONCE per session
  const [questions] = useState(() => getRandomQuestions(12));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  // ✅ Guard
  if (!questions || questions.length === 0) {
    return (
      <PageWrapper>
        <Container>
          <h2>No questions available</h2>
        </Container>
      </PageWrapper>
    );
  }

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  // ✅ NEW ANSWER HANDLER (weights-based)
  const handleAnswer = async (question, option) => {
    const updatedAnswers = [
      ...answers,
      {
        questionId: question.id,
        weights: option.weights
      }
    ];

    // LAST QUESTION → PROCESS
    if (currentIndex === totalQuestions - 1) {
      try {
        // 🔹 Build scores from weights
        const scores = buildScoresFromAnswers(updatedAnswers);
        localStorage.setItem("personalityScores", JSON.stringify(scores));

        // 🔹 Generate program fits
        const fits = generateFitsFromScores(scores);

        localStorage.setItem(
          "analyzerResults",
          JSON.stringify({
            answers: updatedAnswers,
            scores,
            fits,
          })
        );

        // 🔹 Get personality type
        const personality = getPersonalitySummary(scores);
        const topProgram = [...fits]
          .filter(f => f && typeof f.percentage === "number")
          .sort((a, b) => b.percentage - a.percentage)[0];

        // 🔹 Save to backend
          try {
            const response = await fetch("http://localhost:5000/api/results", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                personality_type: personality.type,
                scores,
                fits,
                top_program: topProgram?.program || "Unknown",
                api_key: apiKey
              })
            });

            const savedData = await response.json();

            if (savedData?.data?.[0]?.id) {
              const existing = JSON.parse(
                localStorage.getItem("analyzerResults") || "{}"
              );
              localStorage.setItem(
                "analyzerResults",
                JSON.stringify({
                  ...existing,
                  resultId: savedData.data[0].id
                })
              );
            }
          } catch (saveErr) {
            console.warn("Could not save to backend:", saveErr);
          }
        navigate("/results", {
          state: {
            answers: updatedAnswers,
            scores,
            fits
          }
        });
      } catch (err) {
        console.error("ANALYZER ERROR:", err);
      }

      return;
    }

    setAnswers(updatedAnswers);
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <PageWrapper>
      <Container>
        <div className="analyzer-page">

          {/* PROGRESS */}
          <div className="analyzer-progress">
            <div className="question-count">
              Question {currentIndex + 1} of {totalQuestions}
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* QUESTION CARD */}
          <div className="question-card">

            <div className="scenario-pill">
              Scenario
            </div>

            <h1 className="question-text">
              {currentQuestion?.text || "Loading question..."}
            </h1>

            <div className="options">
              {(currentQuestion?.options || [])
                // ✅ Shuffle options (anti-pattern memorization)
                .sort(() => Math.random() - 0.5)
                .map((opt, index) => (
                  <div
                    key={index}
                    className="option-card"
                    onClick={() => handleAnswer(currentQuestion, opt)}
                  >
                    <span className="option-letter">
                      {String.fromCharCode(65 + index)}
                    </span>

                    <span className="option-text">
                      {opt?.label || "Option"}
                    </span>
                  </div>
                ))}
            </div>

          </div>

        </div>
      </Container>
    </PageWrapper>
  );
}