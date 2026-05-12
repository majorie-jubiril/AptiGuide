import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Container from "../layout/Container";
import PageWrapper from "../layout/PageWrapper";
import {
  getPersonalitySummary,
  generateProgramExplanation
} from "../utils/insights";
import "../styles/results.css";
import { PERSONALITY_PROFILES } from "../data/personalityProfiles";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const savedResults = JSON.parse(
    localStorage.getItem("analyzerResults")
  );
  const result = location.state || savedResults || {};

  const [showOtherFits, setShowOtherFits] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const scores = result?.scores || null;
  const fits = Array.isArray(result?.fits) ? result.fits : [];

  // ✅ SINGLE declaration (FIXED)
  const personality = scores ? getPersonalitySummary(scores) : null;

  const sortedFits = [...fits]
    .filter((f) => f && typeof f.percentage === "number")
    .sort((a, b) => b.percentage - a.percentage);

  const topProgram =
    selectedProgram ||
    sortedFits.find((fit) => fit.fitLevel === "High") ||
    sortedFits[0] ||
    null;
  // Strong = next best (regardless of level)
  const strongMatches = sortedFits.slice(1, 5);

  // Others = everything after
  const otherFits = sortedFits.slice(5);
  console.log("ALL FITS:", sortedFits);
console.log("STRONG MATCHES:", strongMatches);
console.log("OTHER FITS:", otherFits);

  const savedScores = JSON.parse(localStorage.getItem("personalityScores"));
  const personalityData = getPersonalitySummary(savedScores || {});

  const personalityType = personalityData.type;

  const profile = PERSONALITY_PROFILES[personalityType];

  // ✅ SAFE log (optional)
  console.log("Personality:", personality);

  useEffect(() => {
    if (topProgram) {
      setSelectedProgram(topProgram);
    }
  }, [topProgram]);

  if (!topProgram) {
    return (
      <PageWrapper>
        <Container>
          <div className="results-empty">
            <h2>No Results Found</h2>
            <button onClick={() => navigate("/analyzer")}>
              Go Back
            </button>
          </div>
        </Container>
      </PageWrapper>
    );
  }

  const getLevelClass = (level) => {
    if (level === "High") return "high";
    if (level === "Moderate") return "moderate";
    return "low";
  };

  return (
    <PageWrapper>
      <Container>
        <div className="results-page">
          <div className="results-container">

            {/* HEADER */}
            <div className="results-header">
              <h1>Your Assessment Results</h1>
              <p>
                Here are the programs that best align with your personality
              </p>
            </div>

            <div className="personality-card">
              <h2>You are a {profile.title}</h2>
              <p className="personality-summary">
                {profile.shortSummary}
              </p>

              <p className="personality-summary">
                {profile.longSummary}
              </p>

              <div className="personality-insights">
                <h4 className="insights-title">Personality Insights</h4>

                {profile.insights.map((insight, index) => (
                  <p key={index}>✔ {insight}</p>
                ))}
              </div>
            </div>
            
            {/* TOP RECOMMENDATION (NOW DYNAMIC) */}
            <div className={`top-card ${getLevelClass(topProgram.level)}`}>

              {/* TOP META */}
              <div className="top-meta">

                <div className="top-left-meta">
                  <span className="top-badge">
                    TOP RECOMMENDATION
                  </span>

                  <span className={`fit-badge ${getLevelClass(topProgram.level)}`}>
                    {topProgram.level} Fit
                  </span>
                </div>

                <span className={`top-score ${getLevelClass(topProgram.level)}`}>
                  {topProgram.percentage}%
                </span>

              </div>

              {/* TITLE */}
              <h1 className="top-title">
                {topProgram.program}
              </h1>

              {/* INSIGHT GRID */}
              <div className="top-grid">

                {/* ABOUT */}
                <div className="info-card about-card">

                  <h3>About This Program</h3>

                  <div className="info-section">
                    <h4>Environment</h4>
                    <p>
                      Collaborative learning, structured coursework,
                      project-based tasks and critical thinking activities.
                    </p>
                  </div>

                  <div className="info-section">
                    <h4>Work Style</h4>
                    <p>
                      Independent problem-solving mixed with teamwork,
                      research and analytical decision-making.
                    </p>
                  </div>

                  <div className="info-section">
                    <h4>Demands</h4>
                    <p>
                      Strong reasoning ability, consistency,
                      adaptability and intellectual curiosity.
                    </p>
                  </div>

                </div>

                {/* WHY IT FITS */}
                <div className={`info-card fit-card ${getLevelClass(topProgram.level)}`}>

                  <h3>Why This Fits You</h3>

                  <p>
                    {personality
                      ? generateProgramExplanation(
                          topProgram,
                          personality,
                          topProgram.level
                        )
                      : "Program aligned with your personality"}
                  </p>

                </div>

              </div>

              {/* CTA */}
              <button
                className={`apply-btn hero-btn ${getLevelClass(topProgram.level)}`}
                onClick={() =>
                  navigate("/apply", {
                  state: {
                  selectedProgram: topProgram,
                  scores: result.scores,
                  fits: result.fits,
                }
                })
                }
              >
                Continue to Application →
              </button>

            </div>

            {/* STRONG MATCHES */}
            {strongMatches.length > 0 && (
              <div className="section">
                <h2>Strong Matches</h2>

                <div className="grid">
                  {strongMatches.map((fit, index) => {
                    const levelClass = getLevelClass(fit.level);

                    return (
                      <div
                        key={index}
                        className={`program-card ${levelClass} ${
                          selectedProgram?.program === fit.program ? "active" : ""
                        }`}
                      >
                        <div className="card-header">

                          <div className="card-badge-group">
                            <span className={`fit-badge ${levelClass}`}>
                              {fit.level} Fit
                            </span>
                          </div>

                          <span className="score">
                            {fit.percentage}%
                          </span>

                        </div>

                        <h3>{fit.program}</h3>

                        <p>
                          {personality
                            ? generateProgramExplanation(
                                fit,
                                personality,
                                fit.level
                              )
                            : "Program aligned with your personality"}
                        </p>

                        <button
                          className={`apply-btn ${levelClass}`}
                          onClick={() =>
                            navigate("/apply", {
                            state: {
                            selectedProgram: fit,
                            scores: result.scores,
                            fits: result.fits,
                          }
                          })
                          }
                        >
                          {fit.level === "High" ? "Apply" : "Apply Anyway"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* OTHER FITS */}
            {otherFits.length > 0 && (
              <div className="section">

                <div
                  className="other-matches-toggle"
                  onClick={() => setShowOtherFits(prev => !prev)}
                >
                  <h2>Other Matches</h2>

                  <span className={`arrow ${showOtherFits ? "open" : ""}`}>
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>

                {showOtherFits && (
                  <div className="other-list">
                    {otherFits.map((fit, index) => {
                      const levelClass = getLevelClass(fit.level);

                      return (
                        <div key={index} className={`program-card ${levelClass}`}>
                          <div className="card-header">

                            <div className="card-badge-group">
                              <span className={`fit-badge ${levelClass}`}>
                                {fit.level} Fit
                              </span>
                            </div>

                            <span className="score">
                              {fit.percentage}%
                            </span>

                          </div>

                          <h3>{fit.program}</h3>

                          <p>
                            {personality
                              ? generateProgramExplanation(
                                  fit,
                                  personality,
                                  fit.level
                                )
                              : "Program aligned with your personality"}
                          </p>

                          <button
                            className={`apply-btn ${levelClass}`}
                            onClick={() =>
                              navigate("/apply", {
                                state: {
                                selectedProgram: fit,
                                scores: result.scores,
                                fits: result.fits,
                              }
                              })
                            }
                          >
                            Apply Anyway
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            )}

          </div>
        </div>
      </Container>
    </PageWrapper>
  );
}