import { useState } from "react";
import { CAREER_PROFILES } from "../data/careerProfiles";
import "../styles/CareerIntelligence.css";

function getLevelClass(fit) {
  if (fit === "High") return "high";
  if (fit === "Moderate") return "moderate";
  return "low";
}

function careerScore(fit) {
  if (fit === "High") return 90;
  if (fit === "Moderate") return 65;
  return 35;
}

export default function CareerIntelligence({ personalityType }) {
  const [showTopIntelligence, setShowTopIntelligence] = useState(false);
  const [strongMatchesExpanded, setStrongMatchesExpanded] = useState(false);
  const [showOtherCareers, setShowOtherCareers] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});

  if (!personalityType) return null;
  const profile = CAREER_PROFILES[personalityType];
  if (!profile) return null;

  const { careers, summary, environment, growthAreas } = profile;

  const [topCareer, ...rest] = careers;
  const strongMatches = rest.filter((c) => c.fit === "High");
  const otherCareers = rest.filter((c) => c.fit !== "High");

  const topScore = careerScore(topCareer?.fit || "High");
  const topLevel = getLevelClass(topCareer?.fit || "High");

  return (
    <div className="career-intelligence">

      {/* ── TOP RECOMMENDED CAREER ── */}
      <div className={`top-card ${topLevel}`}>

        <div className="top-meta">
          <div className="top-left-meta">
            <span className="top-badge career-top-badge">TOP RECOMMENDED CAREER</span>
            <span className={`fit-badge ${topLevel}`}>{topCareer?.fit || "High"} Fit</span>
          </div>

          <div className="top-right-meta">
            <div className="top-score-wrapper">
              <div
                className={`score-ring ${topLevel}`}
                style={{ "--score": `${topScore}%` }}
              >
                <div className="score-ring-inner">
                  <span className="score-value">{topScore}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="top-title-group">
          <h1 className="top-title">{topCareer?.title}</h1>
          <p className="top-program-description">{topCareer?.description}</p>
        </div>

        <div className="details-toggle top-toggle">
          <button
            className="show-details-btn"
            onClick={() => setShowTopIntelligence((prev) => !prev)}
          >
            {showTopIntelligence
              ? "⌃ Hide Career Intelligence"
              : "⌄ Show Career Intelligence"}
          </button>
        </div>

        {showTopIntelligence && (
          <>
            <div className="top-grid">

              {/* ABOUT */}
              <div className="info-card about-card">
                <h3>About This Career</h3>
                <p>
                  <strong>Overview:</strong> {topCareer?.description}
                </p>
                <p>
                  <strong>Work Environment:</strong> {environment}
                </p>
              </div>

              {/* WHY THIS FITS */}
              <div className={`info-card fit-card ${topLevel}`}>
                <h3>Why This Fits You</h3>
                <p>{summary}</p>
              </div>

            </div>

            {/* SKILLS TO STRENGTHEN */}
            {topCareer?.skills?.length > 0 && (
              <div className="recommendation-intelligence-section">
                <h4>Key Skills to Develop</h4>
                <div className="skills-list">
                  {topCareer.skills.map((skill) => (
                    <div key={skill} className="skill-pill">{skill}</div>
                  ))}
                </div>
              </div>
            )}

            {/* GROWTH AREAS */}
            {growthAreas?.length > 0 && (
              <div className="recommendation-intelligence-section">
                <h4>Areas to Strengthen</h4>
                <div className="career-path-tags">
                  {growthAreas.map((area) => (
                    <span key={area} className="career-tag">{area}</span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* CTA */}
        <button className={`apply-btn hero-btn ${topLevel}`}>
          Build Profile →
        </button>

      </div>

      {/* ── STRONG CAREER MATCHES ── */}
      {strongMatches.length > 0 && (
        <div className="matches-group-card">

          <div
            className="matches-group-header"
            onClick={() => setStrongMatchesExpanded(!strongMatchesExpanded)}
          >
            <div className="matches-group-left">
              <div className="matches-group-title-row">
                <h2>Strong Career Matches</h2>
                <span className="matches-count">{strongMatches.length} Careers</span>
              </div>
              <p className="matches-group-subtitle">
                High Fit careers strongly aligned with your personality
              </p>
            </div>
            <button className="matches-toggle-btn">
              {strongMatchesExpanded ? "−" : "+"}
            </button>
          </div>

          {strongMatchesExpanded && (
            <div className="strong-matches-grid">
              {strongMatches.map((career, index) => {
                const levelClass = getLevelClass(career.fit);
                const score = careerScore(career.fit);
                const cardKey = `strong-${career.title}`;

                return (
                  <div key={index} className={`strong-match-card ${levelClass}`}>

                    <div className="strong-match-header">
                      <div className="strong-match-badge-group">
                        <span className={`fit-badge ${levelClass}`}>{career.fit} Fit</span>
                      </div>

                      <div className="strong-match-actions">
                        <div className="match-score-wrapper">
                          <div
                            className={`mini-score-ring ${levelClass}`}
                            style={{ "--score": `${score}%` }}
                          >
                            <div className="mini-score-inner">
                              <span className="mini-score-value">{score}%</span>
                            </div>
                          </div>
                        </div>
                        <button className={`apply-btn-small ${levelClass}`}>
                          Build CV →
                        </button>
                      </div>
                    </div>

                    <h3>{career.title}</h3>
                    <p className="strong-match-description">{career.description}</p>

                    <div className="details-toggle">
                      <button
                        className="show-details-btn"
                        onClick={() =>
                          setExpandedCards((prev) => ({
                            ...prev,
                            [cardKey]: !prev[cardKey],
                          }))
                        }
                      >
                        {expandedCards[cardKey] ? "− Hide Details" : "+ Show Details"}
                      </button>
                    </div>

                    {expandedCards[cardKey] && (
                      <div className="expanded-section">

                        <div className={`detail-box fit-box ${levelClass}`}>
                          <h4>WHY THIS FITS YOU</h4>
                          <p>{career.description}</p>
                        </div>

                        {career.skills?.length > 0 && (
                          <div className="detail-box skills-box">
                            <h4>KEY SKILLS</h4>
                            <div className="career-tags">
                              {career.skills.map((skill, i) => (
                                <span key={i} className="career-tag">{skill}</span>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ── OTHER CAREER MATCHES ── */}
      {otherCareers.length > 0 && (
        <div>
          <div className="matches-group-card other-matches-parent-card">

            <div
              className="matches-group-header"
              onClick={() => setShowOtherCareers((prev) => !prev)}
            >
              <div className="matches-group-left">
                <div className="matches-group-title-row">
                  <h2>Other Career Matches</h2>
                  <span className="matches-count other-count">
                    {otherCareers.length} Careers
                  </span>
                </div>
                <p className="matches-group-subtitle">
                  Moderate & Low Fit careers — exploration still recommended
                </p>
              </div>
              <button className="matches-toggle-btn">
                {showOtherCareers ? "−" : "+"}
              </button>
            </div>

            {showOtherCareers && (
              <div className="strong-matches-grid">
                {otherCareers.map((career, index) => {
                  const levelClass = getLevelClass(career.fit);
                  const score = careerScore(career.fit);
                  const cardKey = `other-${career.title}`;

                  return (
                    <div key={index} className="other-match-row">

                      <div className="strong-match-badge-group">
                        <span className={`fit-badge ${levelClass}`}>{career.fit} Fit</span>

                        <div className="strong-match-actions">
                          <div
                            className={`other-score-ring ${levelClass}`}
                            style={{ "--score": `${score}%` }}
                          >
                            <div className="other-score-inner">
                              <span className="other-score-value">{score}%</span>
                            </div>
                          </div>
                          <button className={`apply-btn-small ${levelClass}`}>
                            Explore →
                          </button>
                        </div>
                      </div>

                      <h3 className="other-match-row-title">{career.title}</h3>
                      <p className="other-match-row-description">{career.description}</p>

                      <div className="details-toggle">
                        <button
                          className="show-details-btn"
                          onClick={() =>
                            setExpandedCards((prev) => ({
                              ...prev,
                              [cardKey]: !prev[cardKey],
                            }))
                          }
                        >
                          {expandedCards[cardKey] ? "− Hide Details" : "+ Show Details"}
                        </button>
                      </div>

                      {expandedCards[cardKey] && (
                        <div className="expanded-section">

                          <div className={`detail-box fit-box ${levelClass}`}>
                            <h4>WHY THIS FITS YOU</h4>
                            <p>{career.description}</p>
                          </div>

                          {career.skills?.length > 0 && (
                            <div className="detail-box skills-box">
                              <h4>KEY SKILLS</h4>
                              <div className="career-tags">
                                {career.skills.map((skill, i) => (
                                  <span key={i} className="career-tag">{skill}</span>
                                ))}
                              </div>
                            </div>
                          )}

                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}