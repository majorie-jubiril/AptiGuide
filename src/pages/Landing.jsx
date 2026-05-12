import { useNavigate } from "react-router-dom";
import Container from "../layout/Container";
import PageWrapper from "../layout/PageWrapper";
import Button from "../components/ui/Button";
import "../styles/landing.css";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <Container>
        <div className="landing-page">
          <div className="landing-card">
            
            {/* Icon */}
            <div className="landing-icon">
              <div className="icon-outer">
                <div className="icon-inner">
                  <div className="checkmark"></div>
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="landing-title">
              Discover the Right Program for You
            </h1>

            {/* Subtitle */}
            <p className="landing-subtitle">
              Answer a few real-life scenarios to find your best-fit path
            </p>

            {/* Stats */}
            <div className="landing-stats">
              <div>
                <h3>12</h3>
                <p>Questions</p>
              </div>
              <div>
                <h3>5min</h3>
                <p>Duration</p>
              </div>
              <div>
                <h3>100%</h3>
                <p>Personalized</p>
              </div>
            </div>

            {/* CTA */}
            <Button
              variant="primary"
              onClick={() => navigate("/analyzer")}
            >
              Start Assessment
            </Button>

          </div>
        </div>
      </Container>
    </PageWrapper>
  );
}