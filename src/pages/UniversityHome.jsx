import { Link } from "react-router-dom";
import "../styles/university-home.css";
import { BookOpen, Users, Globe } from "lucide-react";

function UniversityHome() {
  return (
    <div className="university-home">

      {/* NAVBAR */}

      <header className="uoa-navbar">

        <div className="uoa-brand">

          <div className="uoa-logo">
            UNIA
          </div>

          <div>
            <h2>University of Accra</h2>
            <p>Admissions Portal</p>
          </div>

        </div>

        <nav>
          <a href="#programs">Programs</a>
          <a href="#about">About</a>

          <Link to="/analyzer">
            Apply
          </Link>
        </nav>

      </header>

      {/* HERO */}

      <section className="uoa-hero">

        <div className="uoa-hero-content">

          <h1>
            Discover Your Future at UNIA
          </h1>

          <p>
            Explore programs, discover your strengths,
            and find the academic path that fits you best.
          </p>

        </div>

      </section>

      {/* ANALYZER CTA */}

      <section className="analyzer-section">

        <div className="analyzer-card">

          <div className="analyzer-icon">
            💡
          </div>

          <h2>
            Not Sure What To Study?
          </h2>

          <p>
            Take our intelligent program analyzer to
            discover degree programs aligned with
            your strengths, thinking style, and interests.
          </p>

          <Link
            to="/analyzer"
            className="primary-btn"
          >
            Try Analyzer
          </Link>

        </div>

      </section>

      {/* FEATURES */}

      <div className="features-grid">

            <div className="feature-card">
                <div className="feature-icon blue">
                <BookOpen size={36} strokeWidth={2.2} />
                </div>

                <h3>50+ Programs</h3>

                <p>
                Choose from a wide range of undergraduate
                and graduate programs
                </p>
            </div>

            <div className="feature-card">
                <div className="feature-icon green">
                <Users size={36} strokeWidth={2.2} />
                </div>

                <h3>Expert Faculty</h3>

                <p>
                Learn from world-renowned professors and
                researchers
                </p>
            </div>

            <div className="feature-card">
                <div className="feature-icon purple">
                <Globe size={36} strokeWidth={2.2} />
                </div>

                <h3>Global Network</h3>

                <p>
                Connect with students and alumni from
                around the world
                </p>
            </div>

            </div>
    </div>
  );
}

export default UniversityHome;