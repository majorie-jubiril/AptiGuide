import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/apply.css";

export default function Apply() {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedProgram = location.state?.selectedProgram;
    location.state?.selectedProgram ||
    JSON.parse(localStorage.getItem("selectedProgram"));

  const [step, setStep] = useState(1);

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
      <div className="apply-card">

        {/* =========================
            STEPPER (FIXED KEYS)
        ========================= */}
        <div className="stepper">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="step-wrapper">
              <div
                className={`step ${
                  step === s ? "active" : ""
                } ${step > s ? "done" : ""}`}
              >
                {step > s ? "✓" : s}
              </div>

              {s < 5 && <div className="line"></div>}
            </div>
          ))}
        </div>

        {/* =========================
            STEP 1: CONFIRM
        ========================= */}
        {step === 1 && (
          <>
            <h1 className="apply-title">
              Application: {selectedProgram.program}
            </h1>

            <div className="fit-row">
              <div className="fit-right">
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

            <div
              className={`insight-box ${selectedProgram.level.toLowerCase()}`}
            >
              Based on your personality, this program is a{" "}
              <strong>
                {selectedProgram.level.toLowerCase()} match
              </strong>.
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
          </>
        )}

        {/* =========================
            STEP 2: DETAILS
        ========================= */}
        {step === 2 && (
          <>
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
          </>
        )}

        {/* =========================
            STEP 3: ACADEMIC
        ========================= */}
        {step === 3 && (
          <>
            <h1 className="apply-title">Academic Background</h1>
            <p className="form-sub">
              Tell us about your educational history
            </p>

            <div className="info-box">
              <strong>Note:</strong> This is a simulation
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
          </>
        )}

        {/* =========================
            STEP 4: STATEMENT
        ========================= */}
        {step === 4 && (
          <>
            <h1 className="apply-title">Personal Statement</h1>

            <div className="info-box purple">
              💡 Suggestion: Highlight analytical thinking & problem-solving.
            </div>

            <div className="form-group">
              <label>Your Statement *</label>
              <textarea
                className="statement-textarea"
                rows="6"
                placeholder="Write your motivation..."
                value={formData.statement}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    statement: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-actions">
              <button className="back-btn" onClick={() => setStep(3)}>
                ← Back
              </button>

              <button className="next-btn" onClick={() => setStep(5)}>
                Next →
              </button>
            </div>
          </>
        )}

        {/* =========================
            STEP 5: REVIEW
        ========================= */}
        {step === 5 && (
          <>
            <h1 className="apply-title">Review & Submit</h1>

            <div className="review-card highlight">
              <div className="review-header">
                <h3>{selectedProgram.program}</h3>
                <span className={`fit-badge ${selectedProgram.level.toLowerCase()}`}>
                  {selectedProgram.level} Fit
                </span>
              </div>
            </div>

            <div className="review-card">
              <h4>Personal Details</h4>
              <p>{formData.name}</p>
              <p>{formData.email}</p>
              <p>{formData.phone}</p>
              <p>{formData.country}</p>
            </div>

            <div className="review-card">
              <h4>Academic Background</h4>
              <p>{formData.school}</p>
              <p>{formData.qualification}</p>
              <p>{formData.grades}</p>
            </div>

            <div className="review-card">
              <h4>Statement</h4>
              <p>{formData.statement}</p>
            </div>

            <div className="form-actions">
              <button className="back-btn" onClick={() => setStep(4)}>
                ← Back
              </button>

              <button
                className="submit-btn"
                onClick={() => {
                  localStorage.removeItem("applicationData");
                  setStep(6);
                }}
              >
                Submit Application ✓
              </button>
            </div>
          </>
        )}

        {/* =========================
            STEP 6: SUBMIT APPLICATION
        ============================ */}
        {step === 6 && (
        <>
          <h1 className="apply-title">Application Submitted!</h1>

          <div className="review-card highlight center">
            <h2>{selectedProgram.program}</h2>

            <div className="status-row">
              <span className="status-badge pending">PENDING REVIEW</span>
              <span
                className={`fit-badge ${selectedProgram.level.toLowerCase()}`}
              >
                {selectedProgram.level} Fit
              </span>
            </div>

            <p className="success-message">
              This program aligns well with your strengths in
              <strong> analytical thinking, systematic problem-solving, </strong>
              and <strong>independent learning</strong>.
            </p>
          </div>

          <p className="success-subtext">
            We'll review your application and send a decision to{" "}
            <strong>{formData.email}</strong> within 4–6 weeks.
          </p>

          <button
            className="continue-btn"
            onClick={() => navigate("/results")}
          >
            Explore Other Programs
          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate("/")}
          >
            Return to Home
          </button>
        </>
      )}
      </div>
    </div>
  );
}