import { PROGRAM_PROFILES } from "../data/programProfiles";

import {
  generateProgramExplanation
} from "../utils/insights";
import "../styles/results-report.css";

export default function ResultsReport({
  result,
  profile,
  topRecommendation,
  strongMatches,
  moderateMatches,
  lowMatches
}) {

  return (
    <div className="report-document">

      {/* HEADER */}
      <div className="report-header">
        <h1>Personality Assessment Report</h1>

        <p>
          Personalized program recommendations based on
          your assessment results.
        </p>
      </div>

      {/* PERSONALITY SUMMARY */}
      <section className="report-section">

        <h2>{profile.title}</h2>

        <p>{profile.summary}</p>

        <div className="report-insights">

          {profile.insights?.map((insight, index) => (
            <div
              key={index}
              className="report-insight-item"
            >
              • {insight}
            </div>
          ))}

        </div>

      </section>

      {/* TOP RECOMMENDATION */}
      <section className="report-section">

        <h2>Top Recommendation</h2>

        <div className="report-program-card">

          <div className="report-program-header">

            <h3>
              {topRecommendation.program}
            </h3>

            <span>
              {topRecommendation.fitScore}%
            </span>

          </div>

          <p>
            {
              generateProgramExplanation(
                topRecommendation,
                profile
              )
            }
          </p>

        </div>

      </section>

      {/* FIT BREAKDOWN */}
      <section className="report-section">

        <h2>Fit Breakdown</h2>

        {Object.entries(
            PROGRAM_PROFILES[
            topRecommendation.program
            ]?.fitDimensions || {}
            ).map(([key, value]) => (

            <div
            key={key}
            className="report-fit-row"
            >

            <div className="report-fit-header">

                <span className="report-fit-label">
                {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) =>
                    str.toUpperCase()
                    )}
                </span>

                <span className="report-fit-score">
                {value}%
                </span>

            </div>

            <div className="report-fit-bar">

                <div
                className={`report-fit-fill ${
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

        ))}

        </section>

      {/* CAREER PATHS */}
      <section className="report-section">

        <h2>Career Paths</h2>

        <div className="report-tags">

          {PROGRAM_PROFILES[
            topRecommendation.program
          ]?.careerPaths?.map((career, index) => (

            <span
              key={index}
              className="report-tag"
            >
              {career}
            </span>

          ))}

        </div>

      </section>

      {/* REALITY CHECK */}
      <section className="report-section">

        <h2>Program Reality Check</h2>

        <div className="report-grid">

          <div>
            <h4>Workload</h4>

            <p>
              {
                PROGRAM_PROFILES[
                  topRecommendation.program
                ]?.realityCheck?.workload
              }
            </p>
          </div>

          <div>
            <h4>Environment</h4>

            <p>
              {
                PROGRAM_PROFILES[
                  topRecommendation.program
                ]?.realityCheck?.environment
              }
            </p>
          </div>

          <div>
            <h4>Pressure Level</h4>

            <p>
              {
                PROGRAM_PROFILES[
                  topRecommendation.program
                ]?.realityCheck?.pressureLevel
              }
            </p>
          </div>

          <div>
            <h4>Main Challenge</h4>

            <p>
              {
                PROGRAM_PROFILES[
                  topRecommendation.program
                ]?.realityCheck?.keyChallenge
              }
            </p>
          </div>

        </div>

      </section>

      {/* SKILLS */}
        <section className="report-section">

        <h2>Skills To Strengthen</h2>

        <div className="report-tags">

            {PROGRAM_PROFILES[
            topRecommendation.program
            ]?.skillsToStrengthen?.map(
            (skill, index) => (

            <span
                key={index}
                className="report-tag"
            >
                {skill}
            </span>

            ))}

        </div>

        </section>

    </div>
  );
}