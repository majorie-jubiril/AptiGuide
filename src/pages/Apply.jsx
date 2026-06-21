import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  getPersonalitySummary
} from "../utils/insights";

import {
  generateApplicationContext,
  generateStatementGuidance
} from "../utils/applicationInsights";
import "../styles/apply.css";

export default function Apply() {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedProgram = location.state?.selectedProgram;

  const [step, setStep] = useState(1);
  const scores = location.state?.scores;

  const personality = scores
    ? getPersonalitySummary(scores)
    : null;

  const applicationContext =
    generateApplicationContext(
    selectedProgram,
    personality
  );
  
  const statementGuidance =
  generateStatementGuidance(
    selectedProgram
  );

  // ✅ FULL FORM STATE (FIXED)
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("applicationData");
    return saved
      ? JSON.parse(saved)
      : {
          name: "",
          email: "",
          phone: "",
          country: "",
          school: "",
          qualification: "",
          grades: "",
          statement: "",
        };
  });

  useEffect(() => {
    localStorage.setItem("applicationData", JSON.stringify(formData));
  }, [formData]);

  if (!selectedProgram) {
    return (
      <div className="apply-container">
        <h2>No Program Selected</h2>
        <button onClick={() => navigate("/")}>
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="apply-page">
      <div className="apply-stepper-wrap">

        {/* =========================
            STEPPER
        ========================= */}
        <div className="stepper">

          {[
            "Confirm",
            "Details",
            "Academic",
            "Statement",
            "Review"
          ].map((label, index) => {

            const s = index + 1;

            return (
              <div
                key={s}
                className="step-item"
              >

                <div className="step-line-bg"></div>

                <div
                  className={`step-circle ${
                    step === s
                      ? "active"
                      : step > s
                      ? "done"
                      : ""
                  }`}
                >
                  {step > s ? "✓" : s}
                </div>

                <span className="step-label">
                  {label}
                </span>

              </div>
            );
          })}

        </div>
    </div>

    <div className="apply-card">

        {/* =========================
            STEP 1: CONFIRM
        ========================= */}
        {step === 1 && (
          <div className="apply-inner">
            <div className="application-hero">

              <div className="hero-left">

                <span className="hero-label">
                  APPLYING TO
                </span>

                <h1 className="hero-program">
                  {selectedProgram.program}
                </h1>

                <div className="hero-fit-row">

                  <span
                    className={`fit-badge ${selectedProgram.level.toLowerCase()}`}
                  >
                    {selectedProgram.level} Fit
                  </span>

                  <span className="match-score">
                    {selectedProgram.percentage}% Match
                  </span>

                </div>

              </div>

            </div>

            <div
              className={`insight-box ${selectedProgram.level.toLowerCase()}`}
            >

              <div className="insight-content">

                <h3>
                  {applicationContext.title}
                </h3>

                <p>
                  {applicationContext.conciseCompatibility}
                </p>

              </div>

            </div>

            <button
              className="continue-btn"
              onClick={() => setStep(2)}
            >
              Continue Application
            </button>

            <button
              className="change-btn"
              onClick={() => navigate(-1)}
            >
              ← Change Program
            </button>
          </div>
        )}

        {/* =========================
            STEP 2: DETAILS
        ========================= */}
        {step === 2 && (
          <div className="form-layout">

            <h1 className="apply-title">Personal Details</h1>
            <p className="form-sub">
              Please provide your contact information
            </p>

            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="text"
                placeholder="+233..."
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Country *</label>
              <select
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
              >
                <option value="">-- Select a country --</option>
                <option>Ghana</option>
                <option>Nigeria</option>
                <option>UK</option>
              </select>
            </div>

            <div className="form-actions">
              <button className="back-btn" onClick={() => setStep(1)}>
                ← Back
              </button>

              <button className="next-btn" onClick={() => setStep(3)}>
                Next →
              </button>
            </div>
          </div>
        )}

        {/* =========================
            STEP 3: ACADEMIC
        ========================= */}
        {step === 3 && (
          <div className="form-layout">

            <h1 className="apply-title">Academic Background</h1>
            <p className="form-sub">
              Tell us about your educational history
            </p>

            <div className="info-alert">
              <span className="info-icon">ⓘ</span>

              <p>
                This is a simulation for demonstration purposes.
                No real application is submitted.
              </p>
            </div>

            <div className="form-group">
              <label>Previous School *</label>
              <input
                type="text"
                placeholder="Enter your school name"
                value={formData.school}
                onChange={(e) =>
                  setFormData({ ...formData, school: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Qualification Type *</label>
              <select
                value={formData.qualification}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    qualification: e.target.value,
                  })
                }
              >
                <option value="">-- Select qualification --</option>
                <option>WASSCE</option>
                <option>SSCE</option>
                <option>A-Level</option>
                <option>Diploma</option>
              </select>
            </div>

            <div className="form-group">
              <label>Grades / Score *</label>
              <input
                type="text"
                placeholder="e.g. A1 B2 C4 or 3.8 GPA"
                value={formData.grades}
                onChange={(e) =>
                  setFormData({ ...formData, grades: e.target.value })
                }
              />
            </div>

            <div className="form-actions">
              <button className="back-btn" onClick={() => setStep(2)}>
                ← Back
              </button>

              <button className="next-btn" onClick={() => setStep(4)}>
                Next →
              </button>
            </div>
          </div>
        )}

        {/* =========================
              STEP 4: STATEMENT
          ========================= */}
          {step === 4 && (
            <div className="form-layout statement-layout">

              <div className="statement-header">
                <h1 className="apply-title">
                  Personal Statement
                </h1>

                <p className="form-sub">
                  Why are you interested in {selectedProgram.program}?
                </p>
              </div>

              <div className="statement-guidance">

                <div className="guidance-icon">
                  💡
                </div>

                <div className="guidance-content">

                  <p className="guidance-title">
                    Suggestions for your statement:
                  </p>

                  <p className="guidance-text">
                    Your statement should clearly explain why you are interested
                    in this field, the experiences that shaped your interest,
                    and the goals you hope to pursue through this program.
                  </p>

                </div>

              </div>

              <div className="statement-focus-card">

                <h4 className="focus-title">
                  AREAS TO ADDRESS IN YOUR STATEMENT:
                </h4>

                <div className="statement-tags">

                  {statementGuidance.themes.map(
                    (theme) => (
                      <span
                        key={theme}
                        className="statement-tag"
                      >
                        {theme}
                      </span>
                    )
                  )}

                </div>

              </div>

              <div className="form-group">

                <label className="statement-label">
                  Your Statement <span>*</span>
                </label>

                <textarea
                  className="statement-textarea"
                  rows="10"
                  placeholder="Describe your motivation, interests, experiences, and future goals related to this program..."
                  value={formData.statement}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      statement: e.target.value,
                    })
                  }
                />

                <div className="statement-meta-row">

                  <p className="statement-helper">
                    Aim for 200–500 words
                  </p>

                  <span className="word-count">
                    {
                      formData.statement
                        .trim()
                        .split(/\s+/)
                        .filter(Boolean).length
                    }{" "}
                    words
                  </span>

                </div>

              </div>

              <div className="form-actions">

                <button
                  className="back-btn"
                  onClick={() => setStep(3)}
                >
                  ← Back
                </button>

                <button
                  className="next-btn"
                  onClick={() => setStep(5)}
                >
                  Review Application →
                </button>

              </div>

            </div>
          )}

       {/* =========================
            STEP 5: REVIEW
        ========================= */}
        {step === 5 && (
          <div className="review-layout">

            <h1 className="apply-title review-main-title">
              Review & Submit
            </h1>

            {/* =========================
                PROGRAM SUMMARY
            ========================= */}
            <div className="program-summary-card">

              <div className="program-summary-left">

                <h2 className="summary-program">
                  {selectedProgram.program}
                </h2>

                <p className="review-program-description">
                  Ensure your personal details, academic information, and statement are accurate before submission.
                </p>

              </div>

              <div className="program-summary-right">

                <span
                  className={`fit-badge review-fit ${selectedProgram.level.toLowerCase()}`}
                >
                  {selectedProgram.level} Fit
                </span>

                <span className="review-match">
                  {selectedProgram.percentage}% Match
                </span>

              </div>

            </div>

            {/* =========================
                PERSONAL DETAILS
            ========================= */}
            <div className="review-section-card">

              <h4 className="review-section-title">
                PERSONAL DETAILS
              </h4>

              <div className="review-grid">

                <div className="review-row">
                  <span>Name</span>
                  <strong>{formData.name || "—"}</strong>
                </div>

                <div className="review-row">
                  <span>Email</span>
                  <strong>{formData.email || "—"}</strong>
                </div>

                <div className="review-row">
                  <span>Phone</span>
                  <strong>{formData.phone || "—"}</strong>
                </div>

                <div className="review-row">
                  <span>Country</span>
                  <strong>{formData.country || "—"}</strong>
                </div>

              </div>

            </div>

            {/* =========================
                ACADEMIC BACKGROUND
            ========================= */}
            <div className="review-section-card">

              <h4 className="review-section-title">
                ACADEMIC BACKGROUND
              </h4>

              <div className="review-grid">

                <div className="review-row">
                  <span>School</span>
                  <strong>{formData.school || "—"}</strong>
                </div>

                <div className="review-row">
                  <span>Qualification</span>
                  <strong>{formData.qualification || "—"}</strong>
                </div>

                <div className="review-row">
                  <span>Grades</span>
                  <strong>{formData.grades || "—"}</strong>
                </div>

                <div className="review-row">
                  <span>Statement</span>
                  <strong>
                    {formData.statement
                      ? `${formData.statement.substring(0, 60)}...`
                      : "—"}
                  </strong>
                </div>

              </div>

            </div>

            {/* =========================
                ACTIONS
            ========================= */}
            <div className="form-actions review-actions">

              <button
                className="back-btn review-back-btn"
                onClick={() => setStep(4)}
              >
                ← Back
              </button>

              <button
                className="submit-btn review-submit-btn"
                onClick={async () => {
                  try {
                    const resultId = JSON.parse(
                      localStorage.getItem("analyzerResults")
                    )?.resultId;

                    if (resultId) {
                      await fetch(`http://localhost:5000/api/results/${resultId}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          applied_program: selectedProgram.program
                        })
                      });
                    }
                  } catch (err) {
                    console.warn("Could not save applied program:", err);
                  }
                  localStorage.removeItem("applicationData");
                  setStep(6);
                }}
              >
                ✓ Submit Application
              </button>

            </div>

          </div>
        )}

        {/* =========================
            STEP 6: SUBMIT APPLICATION
        ============================ */}
        {step === 6 && (
        <div className="success-layout">
      <div className="success-hero">

        <div className="success-icon-wrap">
          ✓
        </div>

        <h1 className="success-title">
          Application Submitted!
        </h1>

      </div>

      {/* =========================
          SUCCESS BODY
      ========================= */}
      <div className="success-body">

        <div
          className={`success-summary-card ${selectedProgram.level.toLowerCase()}`}
        >

          {/* TOP ROW */}
          <div className="success-summary-top">

            <h2 className="success-program">
              {selectedProgram.program}
            </h2>

            <span className="pending-badge">
              Pending Review
            </span>

          </div>

          {/* FIT ROW */}
          <div className="success-fit-row">

            <span
              className={`fit-badge review-fit ${selectedProgram.level.toLowerCase()}`}
            >
              {selectedProgram.level} Fit
            </span>

            <span className="success-match">
              {selectedProgram.percentage}% Match
            </span>

          </div>
          
        </div>

        {/* PRIMARY CTA */}
        <button
          className="success-primary-btn"
          onClick={() => navigate("/results")}
        >
          Explore Other Programs
        </button>

        {/* SECONDARY CTA */}
        <button
          className="success-secondary-btn"
          onClick={() => navigate("/")}
        >
          Return to Home
        </button>

      </div>

    </div>
    )}
      </div>
    </div>
  );
}