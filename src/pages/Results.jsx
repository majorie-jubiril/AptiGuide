import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Container from "../layout/Container";
import PageWrapper from "../layout/PageWrapper";
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ResultsReport from "../components/ResultsReport";
import {
  getPersonalitySummary,
  generateProgramExplanation
} from "../utils/insights";

import "../styles/results.css";

import { PERSONALITY_PROFILES } from "../data/personalityProfiles";
import { PROGRAM_PROFILES } from "../data/programProfiles";

function getArticle(word = "") {
  return /^[aeiou]/i.test(word)
    ? "an"
    : "a";
}

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const resultsRef = useRef();

  const savedResults = JSON.parse(
    localStorage.getItem("analyzerResults")
  );

  const result =
    location.state ||
    savedResults ||
    {};

  const [showOtherFits, setShowOtherFits] =
    useState(false);

  const [selectedProgram, setSelectedProgram] =
    useState(null);

  const [expandedCards, setExpandedCards] =
    useState({});
  
  const [strongMatchesExpanded, setStrongMatchesExpanded] = 
    useState(true);

  const [showTopIntelligence, setShowTopIntelligence] =
    useState(false);  

  const [selectedPrograms, setSelectedPrograms] =
    useState([]);

  const [showCompareModal, setShowCompareModal] =
    useState(false);

  useEffect(() => {

  document.body.style.overflow =
    showCompareModal
      ? "hidden"
      : "auto";

  return () => {
    document.body.style.overflow =
      "auto";
  };

}, [showCompareModal]);

  const scores =
    result?.scores || null;

  const fits = Array.isArray(result?.fits)
    ? result.fits
    : [];

  const personality = scores
    ? getPersonalitySummary(scores)
    : null;

  const sortedFits = [...fits]
    .filter(
      (f) =>
        f &&
        typeof f.percentage === "number"
    )
    .sort((a, b) => b.percentage - a.percentage);

  const topProgram =
    selectedProgram ||
    sortedFits.find(
      (fit) => fit.level === "High"
    ) ||
    sortedFits[0] ||
    null;

  const remainingFits =
    sortedFits.filter(
      fit =>
        fit.program !==
        topProgram?.program
    );

  const strongMatches =
    remainingFits.filter(
      fit => fit.level === "High"
    );

  const otherFits =
    remainingFits.filter(
      fit =>
        fit.level === "Moderate" ||
        fit.level === "Low"
    );

  const comparedPrograms =
  sortedFits.filter((fit) =>
    selectedPrograms.includes(
      fit.program
    )
  );

  const savedScores = JSON.parse(
    localStorage.getItem("personalityScores")
  );

  const personalityData =
    getPersonalitySummary(
      savedScores || {}
    );

  const personalityType =
    personalityData.type;

  const profile =
    PERSONALITY_PROFILES[
      personalityType
    ];

  useEffect(() => {
    if (topProgram) {
      setSelectedProgram(topProgram);
    }
  }, [topProgram]);

  useEffect(() => {
    if (selectedPrograms.length < 2) {
      setShowCompareModal(false);
    }
  }, [selectedPrograms]);

  useEffect(() => {

  const handleKeyDown = (e) => {

    if (e.key === "Escape") {
      setShowCompareModal(false);
    }

  };

  window.addEventListener(
    "keydown",
    handleKeyDown
  );

  return () => {
    window.removeEventListener(
      "keydown",
      handleKeyDown
    );
  };

}, []);

  if (!topProgram) {
    return (
      <PageWrapper>
       
        <Container>
          <div className="results-empty">

            <h2>No Results Found</h2>

            <button
              onClick={() =>
                navigate("/analyzer")
              }
            >
              Go Back
            </button>

          </div>

        </Container>
      </PageWrapper>
    );
  }

  const getLevelClass = (level) => {
    if (level === "High") return "high";

    if (level === "Moderate")
      return "moderate";

    return "low";
  };

  const handleCompareToggle = (programName) => {

  setSelectedPrograms((prev) => {

    if (prev.includes(programName)) {

      return prev.filter(
        (name) => name !== programName
      );

    }

    if (prev.length >= 3) {
      return prev;
    }

    return [...prev, programName];

  });

};

  const downloadResults = async () => {
  const input = resultsRef.current;

  if (!input) return;

  const canvas = await html2canvas(input, {
    scale: 2,
    useCORS: true,
    scrollY: -window.scrollY,
    windowWidth: document.documentElement.scrollWidth,
    windowHeight: document.documentElement.scrollHeight,
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = 210;
  const pdfHeight = 297;

  const imgWidth = pdfWidth;

  const imgHeight =
    (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;

  let position = 0;

  pdf.addImage(
    imgData,
    "PNG",
    0,
    position,
    imgWidth,
    imgHeight
  );

  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;

    pdf.addPage();

    pdf.addImage(
      imgData,
      "PNG",
      0,
      position,
      imgWidth,
      imgHeight
    );

    heightLeft -= pdfHeight;
  }

  pdf.save("personality-results.pdf");
};

  return (
    <PageWrapper>
      <Container>

        <div className="results-page">

        {selectedPrograms.length >= 2 && (
          <div className="compare-bar">

            <div className="compare-bar-left">

              <span className="compare-count">
                {selectedPrograms.length} programs selected for comparison
              </span>

              <div className="compare-tags">

                {selectedPrograms.map(
                  (program) => (
                    <span
                      key={program}
                      className="compare-tag"
                    >
                      {program}
                    </span>
                  )
                )}

              </div>
            </div>

            <div className="compare-bar-actions">

              <button
                className="compare-clear-btn"
                onClick={() =>
                  setSelectedPrograms([])
                }
              >
                Clear
              </button>

              <button
                className="compare-now-btn"
                onClick={() =>
                  setShowCompareModal(true)
                }
              >
                Compare Now
              </button>

            </div>

          </div>
        )}

          <div className="results-container">

            {/* HEADER */}
            <div className="results-header">

              <h1>
                Your Assessment Results
              </h1>

              <p>
                Here are the programs
                that best align with
                your personality
              </p>

            </div>

            <div className="results-actions">
              <button
                className="download-results-btn"
                onClick={downloadResults}
              >
                ⬇ Download Report
              </button>
            </div>

           {/* PERSONALITY CARD */}
            <div className="personality-card">

              <div className="personality-header">

                <h2 className="personality-title">
                  You are {getArticle(profile.title)} {profile.title}
                </h2>

                <p className="personality-short-summary">
                  {profile.shortSummary}
                </p>

                <p className="personality-long-summary">
                  {profile.longSummary}
                </p>

              </div>

              <div className="personality-intelligence-grid">

                {/* LEFT COLUMN */}
                <div className="personality-intelligence-card">

                  <h4 className="personality-intelligence-title">
                    Personality Insights
                  </h4>

                  <div className="personality-intelligence-list">

                    {profile.insights.map(
                      (insight, index) => (

                        <div
                          key={index}
                          className="personality-intelligence-item"
                        >

                          <span className="insight-dot">
                            •
                          </span>

                          <p>{insight}</p>

                        </div>

                      )
                    )}

                  </div>

                </div>

                {/* RIGHT COLUMN */}
                <div className="personality-intelligence-card">

                  <h4 className="personality-intelligence-title">
                    Preferred Learning Environment
                  </h4>

                  <div className="personality-intelligence-list">

                    <div className="personality-intelligence-item">
                      <span className="check-mark">✓</span>
                      <p>Structured coursework with clear objectives</p>
                    </div>

                    <div className="personality-intelligence-item">
                      <span className="check-mark">✓</span>
                      <p>Technical problem-solving challenges</p>
                    </div>

                    <div className="personality-intelligence-item">
                      <span className="check-mark">✓</span>
                      <p>Independent or small-team project work</p>
                    </div>

                    <div className="personality-intelligence-item">
                      <span className="check-mark">✓</span>
                      <p>Predictable, organized academic systems</p>
                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* TOP RECOMMENDATION */}
            <div
              className={`top-card ${getLevelClass(
                topProgram.level
              )}`}
            >

              {/* META */}
              <div className="top-meta">

                <div className="top-left-meta">

                  <span className="top-badge">
                    TOP RECOMMENDATION
                  </span>

                  <span
                    className={`fit-badge ${getLevelClass(
                      topProgram.level
                    )}`}
                  >
                    {topProgram.level} Fit
                  </span>

                </div>

                <div className="top-right-meta">

                  <label className="compare-checkbox">

                    <input
                      type="checkbox"
                      checked={selectedPrograms.includes(
                        topProgram.program
                      )}
                      onChange={() =>
                        handleCompareToggle(
                          topProgram.program
                        )
                      }
                    />

                    <span>Compare</span>

                  </label>

                  <div className="top-score-wrapper">

                    <div
                      className={`score-ring ${getLevelClass(
                        topProgram.level
                      )}`}
                      style={{
                        "--score": `${topProgram.percentage}%`
                      }}
                    >

                      <div className="score-ring-inner">

                        <span className="score-value">
                          {topProgram.percentage}%
                        </span>

                      </div>

                    </div>

                  </div>
                </div>

              </div>

              {/* TITLE */}
              <div className="top-title-group">

                <h1 className="top-title">
                  {topProgram.program}
                </h1>

                <p className="top-program-description">
                  {PROGRAM_PROFILES[
                    topProgram?.program
                  ]?.description}
                </p>

              </div>

              <div className="details-toggle top-toggle">

                <button
                  className="show-details-btn"
                  onClick={() =>
                    setShowTopIntelligence(
                      (prev) => !prev
                    )
                  }
                >
                  {showTopIntelligence
                    ? "⌃ Hide Program Intelligence"
                    : "⌄ Show Program Intelligence"}
                </button>

              </div>

              {showTopIntelligence && (
                <>

              {/* GRID */}
              <div className="top-grid">

                {/* ABOUT */}
                <div className="info-card about-card">

                  <h3>
                    About This Program
                  </h3>

                  <p>
                    <strong>Description:</strong>{" "}
                    {PROGRAM_PROFILES[
                      topProgram?.program
                    ]?.description ||
                      "Program information unavailable."}
                  </p>

                  <p>
                    <strong>Environment:</strong>{" "}
                    {PROGRAM_PROFILES[
                      topProgram?.program
                    ]?.environment ||
                      "Environment information unavailable."}
                  </p>

                  <p>
                    <strong>Work Style:</strong>{" "}
                    {PROGRAM_PROFILES[
                      topProgram?.program
                    ]?.workStyle ||
                      "Work style information unavailable."}
                  </p>

                  <p>
                    <strong>Demands:</strong>{" "}
                    {PROGRAM_PROFILES[
                      topProgram?.program
                    ]?.demands ||
                      "Program demands unavailable."}
                  </p>

                </div>

                {/* WHY THIS FITS */}
                <div
                  className={`info-card fit-card ${getLevelClass(
                    topProgram.level
                  )}`}
                >

                  <h3>
                    Why This Fits You
                  </h3>

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

              {/* FIT BREAKDOWN */}
              {PROGRAM_PROFILES[
                topProgram?.program
              ]?.fitDimensions && (

                <div className="fit-dimensions-card">

                  <h3 className="fit-dimensions-title">
                    Fit Breakdown
                  </h3>

                  {Object.entries(
                    PROGRAM_PROFILES[
                      topProgram?.program
                    ]?.fitDimensions || {}
                  ).map(([key, value]) => (

                    <div
                      key={key}
                      className="fit-dimension-row"
                    >

                      <div className="fit-dimension-header">

                        <span className="fit-dimension-label">

                          {key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) =>
                              str.toUpperCase()
                            )}

                        </span>

                        <span className="fit-dimension-score">
                          {value}%
                        </span>

                      </div>

                      <div className="fit-dimension-bar">

                        <div
                          className={`fit-dimension-fill ${
                            value >= 80
                              ? "high-fit-fill"
                              : value >= 60
                              ? "moderate-fit-fill"
                              : "low-fit-fill"
                          }`}
                          style={{
                            width: `${value}%`
                          }}
                        />

                      </div>

                    </div>
                  ))}

                </div>
              )}

              {/* RECOMMENDATION INTELLIGENCE */}
              <div className="recommendation-details">

                {/* CAREER PATHS */}
                <div className="recommendation-intelligence-section">

                  <h4>
                    Career Paths
                  </h4>

                  <div className="career-path-tags">

                    {(
                      PROGRAM_PROFILES[
                        topProgram?.program
                      ]?.careerPaths || []
                    ).map((career) => (

                      <span
                        key={career}
                        className="career-tag"
                      >
                        {career}
                      </span>

                    ))}

                  </div>

                </div>

                {/* REALITY CHECK */}
                <div className="recommendation-intelligence-section">

                  <h4>
                    Program Reality Check
                  </h4>

                  <div className="reality-check-grid">

                    <div className="reality-item">

                      <span>
                        Workload
                      </span>

                      <p>
                        {
                          PROGRAM_PROFILES[
                            topProgram?.program
                          ]?.realityCheck?.workload
                        }
                      </p>

                    </div>

                    <div className="reality-item">

                      <span>
                        Environment
                      </span>

                      <p>
                        {
                          PROGRAM_PROFILES[
                            topProgram?.program
                          ]?.realityCheck?.environment
                        }
                      </p>

                    </div>

                    <div className="reality-item">

                      <span>
                        Pressure Level
                      </span>

                      <p>
                        {
                          PROGRAM_PROFILES[
                            topProgram?.program
                          ]?.realityCheck?.pressureLevel
                        }
                      </p>

                    </div>

                    <div className="reality-item">

                      <span>
                        Main Challenge
                      </span>

                      <p>
                        {
                          PROGRAM_PROFILES[
                            topProgram?.program
                          ]?.realityCheck?.keyChallenge
                        }
                      </p>

                    </div>

                  </div>

                </div>

                {/* SKILLS */}
                <div className="recommendation-intelligence-section">

                  <h4>
                    Skills to Strengthen
                  </h4>

                  <div className="skills-list">

                    {(
                      PROGRAM_PROFILES[
                        topProgram?.program
                      ]?.skillsToStrengthen || []
                    ).map((skill) => (

                      <div
                        key={skill}
                        className="skill-pill"
                      >
                        {skill}
                      </div>

                    ))}

                  </div>

                </div>

              </div>

              </>
            )}

              {/* COLLAPSED CTA */}
              {!showTopIntelligence && (

                <button
                  className={`apply-btn hero-btn ${getLevelClass(
                    topProgram.level
                  )}`}
                  onClick={() =>
                    navigate("/apply", {
                      state: {
                        selectedProgram:
                          topProgram,
                        scores: result.scores,
                        fits: result.fits
                      }
                    })
                  }
                >
                  Continue to Application →
                </button>

              )}

              {/* EXPANDED CTA */}
              {showTopIntelligence && (

                <button
                  className={`apply-btn hero-btn ${getLevelClass(
                    topProgram.level
                  )}`}
                  onClick={() =>
                    navigate("/apply", {
                      state: {
                        selectedProgram:
                          topProgram,
                        scores: result.scores,
                        fits: result.fits
                      }
                    })
                  }
                >
                  Continue to Application →
                </button>

              )}

            </div>

                      {strongMatches.length > 0 && (
                        <div className="matches-group-card">

                          <div
                            className="matches-group-header"
                            onClick={() =>
                              setStrongMatchesExpanded(
                                !strongMatchesExpanded
                              )
                            }
                          >

                            <div className="matches-group-left">

                              <div className="matches-group-title-row">

                                <h2>Strong Matches</h2>

                                <span className="matches-count">
                                  {strongMatches.length} Programs
                                </span>

                              </div>

                              <p className="matches-group-subtitle">
                                High Fit programs strongly aligned with your personality
                              </p>

                            </div>

                            <button className="matches-toggle-btn">

                              {strongMatchesExpanded
                                ? "−"
                                : "+"}

                            </button>

                          </div>

                          {strongMatchesExpanded && (

                            <div className="strong-matches-grid">

                            {strongMatches.map(
                              (fit, index) => {
                                const levelClass =
                                  getLevelClass(
                                    fit.level
                                  );

                                return (
                                  <div
                                    key={index}
                                    className={`strong-match-card ${levelClass} ${
                                      selectedProgram?.program ===
                                      fit.program
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    <div className="strong-match-header">

                                      <div className="strong-match-badge-group">

                                        <span
                                          className={`fit-badge ${levelClass}`}
                                        >
                                          {fit.level} Fit
                                        </span>

                                        <label className="compare-checkbox">

                                          <input
                                            type="checkbox"
                                            checked={selectedPrograms.includes(
                                              fit.program
                                            )}
                                            onChange={() =>
                                              handleCompareToggle(
                                                fit.program
                                              )
                                            }
                                          />

                                          <span>Compare</span>

                                        </label>

                                      </div>

                                      <div className="strong-match-actions">

                                        <div className="match-score-wrapper">

                                          <div
                                            className={`mini-score-ring ${levelClass}`}
                                            style={{
                                              "--score": `${fit.percentage}%`
                                            }}
                                          >

                                            <div className="mini-score-inner">

                                              <span className="mini-score-value">
                                                {fit.percentage}%
                                              </span>

                                            </div>

                                          </div>

                                        </div>

                                        <button
                                          className={`apply-btn-small ${levelClass}`}
                                          onClick={() =>
                                            navigate("/apply", {
                                              state: {
                                                selectedProgram: fit,
                                                scores: result.scores,
                                                fits: result.fits
                                              }
                                            })
                                          }
                                        >
                                          Apply →
                                        </button>

                                      </div>

                                    </div>

                                    <h3>
                                      {fit.program}
                                    </h3>

                                    <p className="strong-match-description">
                                      {PROGRAM_PROFILES[
                                        fit?.program
                                      ]?.description}
                                    </p>

                                    <div className="details-toggle">

                                      <button
                                        className="show-details-btn"
                                        onClick={() =>
                                          setExpandedCards(
                                            (prev) => ({
                                              ...prev,
                                              [fit.program]:
                                                !prev[
                                                  fit.program
                                                ]
                                            })
                                          )
                                        }
                                      >
                                        {expandedCards[
                                          fit.program
                                        ]
                                          ? "− Hide Details"
                                          : "+ Show Details"}
                                      </button>

                                    </div>

                                    {expandedCards[
                                      fit.program
                                    ] && (

                                      <div className="expanded-section">

                                        {/* ABOUT */}
                                        <div className="detail-box about-box">

                                          <h4>
                                            ABOUT THIS PROGRAM
                                          </h4>

                                          <p>
                                            <strong>Description:</strong>{" "}
                                            {PROGRAM_PROFILES[
                                              fit?.program
                                            ]?.description}
                                          </p>

                                          <p>
                                            <strong>Environment:</strong>{" "}
                                            {PROGRAM_PROFILES[
                                              fit?.program
                                            ]?.environment}
                                          </p>

                                          <p>
                                            <strong>Work Style:</strong>{" "}
                                            {PROGRAM_PROFILES[
                                              fit?.program
                                            ]?.workStyle}
                                          </p>

                                          <p>
                                            <strong>Demands:</strong>{" "}
                                            {PROGRAM_PROFILES[
                                              fit?.program
                                            ]?.demands}
                                          </p>

                                        </div>

                                        {/* WHY THIS FITS */}
                                        <div
                                          className={`detail-box fit-box ${levelClass}`}
                                        >

                                          <h4>
                                            WHY THIS FITS YOU
                                          </h4>

                                          <p>
                                            {personality
                                              ? generateProgramExplanation(
                                                  fit,
                                                  personality,
                                                  fit.level
                                                )
                                              : "Program aligned with your personality"}
                                          </p>

                                        </div>

                                        {/* CAREER PATHS */}
                                        <div className="detail-box career-box">

                                          <h4>
                                            CAREER PATH VISIBILITY
                                          </h4>

                                          <div className="career-tags">

                                            {(PROGRAM_PROFILES[
                                              fit?.program
                                            ]?.careerPaths || []).map(
                                              (career, i) => (
                                                <span
                                                  key={i}
                                                  className="career-tag"
                                                >
                                                  {career}
                                                </span>
                                              )
                                            )}

                                          </div>

                                        </div>

                                        {/* REALITY CHECK */}
                                        <div className="detail-box reality-box">

                                          <h4>
                                            PROGRAM REALITY CHECK
                                          </h4>

                                          <p>
                                            {
                                              PROGRAM_PROFILES[
                                                fit?.program
                                              ]?.realityCheck?.keyChallenge
                                            }
                                          </p>

                                        </div>

                                        {/* SKILLS */}
                                        <div className="detail-box skills-box">

                                          <h4>
                                            SKILLS TO STRENGTHEN
                                          </h4>

                                          <div className="career-tags">

                                            {(PROGRAM_PROFILES[
                                              fit?.program
                                            ]?.skillsToStrengthen || []).map(
                                              (skill, i) => (
                                                <span
                                                  key={i}
                                                  className="career-tag"
                                                >
                                                  {skill}
                                                </span>
                                              )
                                            )}

                                          </div>

                                        </div>

                                        {/* FIT BREAKDOWN */}
                                        {PROGRAM_PROFILES[
                                          fit?.program
                                        ]?.fitDimensions && (

                                          <div className="detail-box fit-dimensions-card">

                                            <h4>
                                              FIT BREAKDOWN
                                            </h4>

                                            {Object.entries(
                                              PROGRAM_PROFILES[
                                                fit?.program
                                              ]?.fitDimensions || {}
                                            ).map(([key, value]) => (

                                              <div
                                                key={key}
                                                className="fit-dimension-row"
                                              >

                                                <div className="fit-dimension-header">

                                                  <span className="fit-dimension-label">

                                                    {key
                                                      .replace(/([A-Z])/g, " $1")
                                                      .replace(/^./, (str) =>
                                                        str.toUpperCase()
                                                      )}

                                                  </span>

                                                  <span className="fit-dimension-score">
                                                    {value}%
                                                  </span>

                                                </div>

                                                <div className="fit-dimension-bar">

                                                  <div
                                                    className={`fit-dimension-fill ${
                                                      value >= 80
                                                        ? "high-fit-fill"
                                                        : value >= 60
                                                        ? "moderate-fit-fill"
                                                        : "low-fit-fill"
                                                    }`}
                                                    style={{
                                                      width: `${value}%`
                                                    }}
                                                  />

                                                </div>

                                              </div>
                                            ))}

                                          </div>
                                        )}

                                      </div>
                                    )}

                                    

                                  </div>
                                );
                              }
                            )}

                          </div>
                          )}

                        </div>
                    )}

            {/* OTHER FITS */}
            {otherFits.length > 0 && (
              <div>

                <div className="matches-group-card other-matches-parent-card">

                 <div
                    className="matches-group-header"
                    onClick={() =>
                      setShowOtherFits(
                        (prev) => !prev
                      )
                    }
                  >

                    <div className="matches-group-left">

                      <div className="matches-group-title-row">

                        <h2>Other Matches</h2>

                        <span className="matches-count other-count">
                          {otherFits.length} Programs
                        </span>

                      </div>

                      <p className="matches-group-subtitle">
                        Moderate & Low Fit programs — exploration still recommended
                      </p>

                    </div>

                    <button className="matches-toggle-btn">

                      {showOtherFits
                        ? "−"
                        : "+"}

                    </button>

                  </div>

                  {showOtherFits && (

                      <div className="strong-matches-grid">

                        {otherFits.map((fit, index) => {

                          const levelClass =
                            getLevelClass(
                              fit.level
                            );

                          return (

                            <div
                              key={index}
                              className="other-match-row"
                            >

                              <div className="strong-match-badge-group">

                                  <span
                                    className={`fit-badge ${levelClass}`}
                                  >
                                    {fit.level} Fit
                                  </span>

                                  <label className="compare-checkbox">

                                    <input
                                      type="checkbox"
                                      checked={selectedPrograms.includes(
                                        fit.program
                                      )}
                                      onChange={() =>
                                        handleCompareToggle(
                                          fit.program
                                        )
                                      }
                                    />

                                    <span>Compare</span>

                                  </label>

                                <div className="strong-match-actions">

                                  <div
                                    className={`other-score-ring ${levelClass}`}
                                    style={{
                                      "--score": `${fit.percentage}%`
                                    }}
                                  >

                                    <div className="other-score-inner">

                                      <span className="other-score-value">
                                        {fit.percentage}%
                                      </span>

                                    </div>

                                  </div>

                                  <button
                                    className={`apply-btn-small ${levelClass}`}
                                    onClick={() =>
                                      navigate("/apply", {
                                        state: {
                                          selectedProgram: fit,
                                          scores: result.scores,
                                          fits: result.fits
                                        }
                                      })
                                    }
                                  >
                                    Apply →
                                  </button>

                                </div>

                              </div>

                                <h3 className="other-match-row-title">
                                  {fit.program}
                                </h3>

                                <p className="other-match-row-description">
                                  {PROGRAM_PROFILES[
                                    fit?.program
                                  ]?.description}
                                </p>

                                <div className="details-toggle">

                                <button
                                  className="show-details-btn"
                                  onClick={() =>
                                    setExpandedCards(
                                      (prev) => ({
                                        ...prev,
                                        [fit.program]:
                                          !prev[fit.program]
                                      })
                                    )
                                  }
                                >
                                  {expandedCards[
                                    fit.program
                                  ]
                                    ? "− Hide Details"
                                    : "+ Show Details"}
                                </button>

                              </div>

                              {expandedCards[
                                fit.program
                              ] && (

                                <div className="expanded-section">

                                  <div className="detail-box about-box">

                                    <h4>
                                      ABOUT THIS PROGRAM
                                    </h4>

                                    <p>
                                      <strong>Description:</strong>{" "}
                                      {PROGRAM_PROFILES[
                                        fit?.program
                                      ]?.description}
                                    </p>

                                    <p>
                                      <strong>Environment:</strong>{" "}
                                      {PROGRAM_PROFILES[
                                        fit?.program
                                      ]?.environment}
                                    </p>

                                    <p>
                                      <strong>Work Style:</strong>{" "}
                                      {PROGRAM_PROFILES[
                                        fit?.program
                                      ]?.workStyle}
                                    </p>

                                    <p>
                                      <strong>Demands:</strong>{" "}
                                      {PROGRAM_PROFILES[
                                        fit?.program
                                      ]?.demands}
                                    </p>

                                  </div>

                                  {/* WHY THIS FITS */}
                                  <div
                                    className={`detail-box fit-box ${levelClass}`}
                                  >

                                    <h4>
                                      WHY THIS FITS YOU
                                    </h4>

                                    <p>
                                      {personality
                                        ? generateProgramExplanation(
                                            fit,
                                            personality,
                                            fit.level
                                          )
                                        : "Program aligned with your personality"}
                                    </p>

                                  </div>

                                  {/* CAREER PATHS */}
                                  <div className="detail-box career-box">

                                    <h4>
                                      CAREER PATH VISIBILITY
                                    </h4>

                                    <div className="career-tags">

                                      {(PROGRAM_PROFILES[
                                        fit?.program
                                      ]?.careerPaths || []).map(
                                        (career, i) => (
                                          <span
                                            key={i}
                                            className="career-tag"
                                          >
                                            {career}
                                          </span>
                                        )
                                      )}

                                    </div>

                                  </div>

                                  {/* REALITY CHECK */}
                                  <div className="detail-box reality-box">

                                    <h4>
                                      PROGRAM REALITY CHECK
                                    </h4>

                                    <p>
                                      {
                                        PROGRAM_PROFILES[
                                          fit?.program
                                        ]?.realityCheck?.keyChallenge
                                      }
                                    </p>

                                  </div>

                                  {/* SKILLS */}
                                  <div className="detail-box skills-box">

                                    <h4>
                                      SKILLS TO STRENGTHEN
                                    </h4>

                                    <div className="career-tags">

                                      {(PROGRAM_PROFILES[
                                        fit?.program
                                      ]?.skillsToStrengthen || []).map(
                                        (skill, i) => (
                                          <span
                                            key={i}
                                            className="career-tag"
                                          >
                                            {skill}
                                          </span>
                                        )
                                      )}

                                    </div>

                                  </div>

                                  {/* FIT BREAKDOWN */}
                                  {PROGRAM_PROFILES[
                                    fit?.program
                                  ]?.fitDimensions && (

                                    <div className="detail-box fit-dimensions-card">

                                      <h4>
                                        FIT BREAKDOWN
                                      </h4>

                                      {Object.entries(
                                        PROGRAM_PROFILES[
                                          fit?.program
                                        ]?.fitDimensions || {}
                                      ).map(([key, value]) => (

                                        <div
                                          key={key}
                                          className="fit-dimension-row"
                                        >

                                          <div className="fit-dimension-header">

                                            <span className="fit-dimension-label">

                                              {key
                                                .replace(/([A-Z])/g, " $1")
                                                .replace(/^./, (str) =>
                                                  str.toUpperCase()
                                                )}

                                            </span>

                                            <span className="fit-dimension-score">
                                              {value}%
                                            </span>

                                          </div>

                                          <div className="fit-dimension-bar">

                                            <div
                                              className={`fit-dimension-fill ${
                                                value >= 80
                                                  ? "high-fit-fill"
                                                  : value >= 60
                                                  ? "moderate-fit-fill"
                                                  : "low-fit-fill"
                                              }`}
                                              style={{
                                                width: `${value}%`
                                              }}
                                            />

                                          </div>

                                        </div>
                                      ))}

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

        </div>

      </Container>

      {showCompareModal &&
        comparedPrograms.length >= 2 && (

  <div
    className="compare-modal-overlay"
    onClick={() =>
      setShowCompareModal(false)
    }
  >

    <div
    className="compare-modal"
    onClick={(e) =>
      e.stopPropagation()
    }
  >

      <div className="compare-modal-header">

        <h2>Program Comparison</h2>

        <button
          className="compare-close-btn"
          onClick={() =>
            setShowCompareModal(false)
          }
        >
          ✕
        </button>

      </div>

      <div className="compare-table">

        <div className="compare-table-header">

        <div className="compare-row-label empty-label"></div>

        {comparedPrograms.map((program) => (

          <div
            key={program.program}
            className="compare-program-header"
          >

            <h3>
              {program.program}
            </h3>

            <div className="compare-program-meta">

              <span
                className={`fit-badge ${getLevelClass(
                  program.level
                )}`}
              >
                {program.level} Fit
              </span>

              <span className="compare-overall-score">
                {program.percentage}%
              </span>

            </div>

            <div className="compare-progress-track">

              <div
                className={`compare-progress-fill ${getLevelClass(
                  program.level
                )}`}
                style={{
                  width: `${program.percentage}%`
                }}
              />

            </div>

          </div>

        ))}

      </div>

    {[
      {
        label: "Analytical",
        key: "analytical"
      },
      {
        label: "Social",
        key: "social"
      },
      {
        label: "Structure",
        key: "structure"
      },
      {
        label: "Creativity",
        key: "creativity"
      },
      {
        label: "Emotional Demand",
        key: "emotionalDemand"
      },
      {
        label: "Adaptability",
        key: "adaptability"
      }
    ].map((item) => (

      <div
        key={item.key}
        className="compare-data-row"
      >

        <div className="compare-row-label">
          {item.label}
        </div>

        {comparedPrograms.map((program) => {

          const value =
            PROGRAM_PROFILES[
              program.program
            ]?.fitDimensions?.[
              item.key
            ] || 0;

          return (

            <div
              key={program.program}
              className="compare-data-cell"
            >

              <div className="compare-score-row">

                <span>
                  Score
                </span>

                <strong>
                  {value}%
                </strong>

              </div>

              <div className="compare-progress-track small">

                <div
                  className={`compare-progress-fill ${
                    value >= 80
                      ? "high"
                      : value >= 60
                      ? "moderate"
                      : "low"
                  }`}
                  style={{
                    width: `${value}%`
                  }}
                />

              </div>

            </div>

          );

        })}

      </div>
    ))}

    {[
      {
        label: "Environment",
        key: "environment"
      },
      {
        label: "Work Style",
        key: "workStyle"
      },
      {
        label: "Demands",
        key: "demands"
      },
      {
        label: "Reality Check",
        key: "realityCheck"
      }
    ].map((section) => (

      <div
        key={section.key}
        className="compare-data-row text-row"
      >

        <div className="compare-row-label">
          {section.label}
        </div>

        {comparedPrograms.map((program) => {

          let content = "";

          if (section.key === "realityCheck") {
            content =
              PROGRAM_PROFILES[
                program.program
              ]?.realityCheck
                ?.keyChallenge || "";
          } else {
            content =
              PROGRAM_PROFILES[
                program.program
              ]?.[section.key] || "";
          }

          return (

            <div
              key={program.program}
              className="compare-text-cell"
            >
              {content}
            </div>

          );

        })}

      </div>
    ))}
          </div>

    </div>

  </div>
)}      

      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          width: "1200px",
          background: "#fff"
        }}
        ref={resultsRef}
      >

        <ResultsReport
          result={result}
          profile={profile}
          topRecommendation={topProgram}
          strongMatches={strongMatches}
          moderateMatches={
            sortedFits.filter(
              (fit) => fit.level === "Moderate"
            )
          }
          lowMatches={
            sortedFits.filter(
              (fit) => fit.level === "Low"
            )
          }
        />

      </div>
    </PageWrapper>
  );
}