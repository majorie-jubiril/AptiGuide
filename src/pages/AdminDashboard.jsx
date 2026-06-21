import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin-dashboard.css";

const PERSONALITY_LABELS = {
  analytical_thinker: "Analytical Thinker",
  versatile_collaborator: "Versatile Collaborator",
  strategic_planner: "Strategic Planner",
  creative_explorer: "Creative Explorer",
  practical_operator: "Practical Operator",
  independent_problem_solver: "Independent Problem Solver"
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/results")
      .then(res => res.json())
      .then(json => {
        setResults(json.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError("Could not connect to backend");
        setLoading(false);
      });
  }, []);

  const getFitLevel = (fits, topProgram, appliedProgram) => {
    if (!fits || !fits.length) return "Unknown";
    const parsed = typeof fits === "string" ? JSON.parse(fits) : fits;
    const programToCheck = appliedProgram || topProgram;
    const match = parsed.find(f => f.program === programToCheck);
    if (match) return match.level;
    const sorted = [...parsed]
        .filter(f => f && typeof f.percentage === "number")
        .sort((a, b) => b.percentage - a.percentage);
    return sorted[0]?.level || "Unknown";
  };

  const getTopScore = (fits, topProgram) => {
    if (!fits || !fits.length) return 0;
    const parsed = typeof fits === "string" ? JSON.parse(fits) : fits;
    const match = parsed.find(f => f.program === topProgram);
    if (match) return match.percentage || 0;
    const sorted = [...parsed]
        .filter(f => f && typeof f.percentage === "number")
        .sort((a, b) => b.percentage - a.percentage);
    return sorted[0]?.percentage || 0;
  };

  const total = results.length;
  const high = results.filter(r => getFitLevel(r.fits, r.top_program, r.applied_program) === "High").length;
  const moderate = results.filter(r => getFitLevel(r.fits, r.top_program, r.applied_program) === "Moderate").length;
  const low = results.filter(r => getFitLevel(r.fits, r.top_program, r.applied_program) === "Low").length;
  const avgScore = total
    ? Math.round(results.reduce((sum, r) => sum + getTopScore(r.fits, r.applied_program || r.top_program), 0) / total)
    : 0;

  const typeCounts = {};
  results.forEach(r => {
    const t = r.personality_type || "unknown";
    typeCounts[t] = (typeCounts[t] || 0) + 1;
  });

  // ── TOP PROGRAMS ──────────────────────────────────────────────
  // Build a map: programName → { count, high, moderate, low }
  const programMap = {};
  results.forEach(r => {
    const program = r.applied_program || r.top_program;
    if (!program) return;
    if (!programMap[program]) {
      programMap[program] = { count: 0, high: 0, moderate: 0, low: 0 };
    }
    programMap[program].count += 1;
    const level = getFitLevel(r.fits, r.top_program, r.applied_program);
    if (level === "High") programMap[program].high += 1;
    else if (level === "Moderate") programMap[program].moderate += 1;
    else if (level === "Low") programMap[program].low += 1;
  });

  const topPrograms = Object.entries(programMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6); // show top 6 max

  const maxProgramCount = topPrograms[0]?.count || 1;
  // ─────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="admin-loading">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <p>{error}</p>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="admin-page">

      {/* HEADER */}
      <div className="admin-header">
        <div>
          <p className="admin-subtitle">University of Accra — AptiGuide</p>
          <h1 className="admin-title">Analytics Dashboard</h1>
        </div>
        <button
          className="admin-home-btn"
          onClick={() => navigate("/")}
        >
          ← Back to Portal
        </button>
      </div>

      {/* STATS */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <p className="stat-label">Total Assessments</p>
          <p className="stat-value">{total}</p>
        </div>
        <div className="admin-stat-card">
          <p className="stat-label">High Fit</p>
          <p className="stat-value high">{high}</p>
        </div>
        <div className="admin-stat-card">
          <p className="stat-label">Moderate Fit</p>
          <p className="stat-value moderate">{moderate}</p>
        </div>
        <div className="admin-stat-card">
          <p className="stat-label">Low Fit</p>
          <p className="stat-value low">{low}</p>
        </div>
        <div className="admin-stat-card">
          <p className="stat-label">Avg Fit Score</p>
          <p className="stat-value">{avgScore}%</p>
        </div>
      </div>

      {/* TOP PROGRAMS */}
      <div className="admin-section-card">
        <h2 className="admin-section-title">Top Programs</h2>

        {topPrograms.length === 0 ? (
          <p className="admin-empty">No program data yet.</p>
        ) : (
          <div className="top-programs-list">
            {topPrograms.map((prog) => {
              const pct = Math.round((prog.count / total) * 100);
              const barWidth = Math.round((prog.count / maxProgramCount) * 100);

              return (
                <div key={prog.name} className="top-program-row">

                  {/* Program name + applicant count */}
                  <div className="top-program-meta">
                    <span className="top-program-name">{prog.name}</span>
                    <span className="top-program-count">
                      {prog.count} student{prog.count !== 1 ? "s" : ""} · {pct}% of total
                    </span>
                  </div>

                  {/* Bar */}
                  <div className="top-program-bar-wrap">
                    <div
                      className="top-program-bar"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>

                  {/* Fit level breakdown */}
                  <div className="top-program-fit-row">
                    {prog.high > 0 && (
                      <span className="fit-mini high">
                        ↑ {prog.high} High
                      </span>
                    )}
                    {prog.moderate > 0 && (
                      <span className="fit-mini moderate">
                        ~ {prog.moderate} Moderate
                      </span>
                    )}
                    {prog.low > 0 && (
                      <span className="fit-mini low">
                        ↓ {prog.low} Low
                      </span>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* PERSONALITY BREAKDOWN */}
      <div className="admin-section-card">
        <h2 className="admin-section-title">Personality Type Breakdown</h2>
        <div className="personality-breakdown">
          {Object.entries(typeCounts).map(([type, count]) => (
            <div key={type} className="personality-row">
              <span className="personality-name">
                {PERSONALITY_LABELS[type] || type}
              </span>
              <div className="personality-bar-wrap">
                <div
                  className="personality-bar"
                  style={{ width: `${Math.round((count / total) * 100)}%` }}
                />
              </div>
              <span className="personality-count">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT RESULTS */}
      <div className="admin-section-card">
        <h2 className="admin-section-title">Recent Assessments</h2>
        {results.length === 0 ? (
          <p className="admin-empty">No assessments yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Personality Type</th>
                    <th>Top Recommendation</th>
                    <th>Applied To</th>
                    <th>Fit Level</th>
                    <th>Score</th>
                    <th>Date</th>
                </tr>
                </thead>
            <tbody>
              {results.map((r) => {
                const level = getFitLevel(r.fits, r.top_program, r.applied_program);
                const score = getTopScore(r.fits, r.applied_program || r.top_program);
                const date = new Date(r.created_at).toLocaleDateString("en-GB", {
                  day: "numeric", month: "short", year: "numeric"
                });
                return (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{PERSONALITY_LABELS[r.personality_type] || r.personality_type}</td>
                    <td>{r.top_program || "—"}</td>
                    <td>{r.applied_program || "—"}</td>
                    <td>
                        <span className={`fit-badge ${level.toLowerCase()}`}>
                        {level}
                      </span>
                    </td>
                    <td>{Math.round(score)}%</td>
                    <td>{date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}