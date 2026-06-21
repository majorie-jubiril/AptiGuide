import { useState } from "react";
import "../styles/SupaAdmin.css";

const BACKEND_URL = "https://apti-backend-8fhm.onrender.com";

export default function SuperAdmin() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    const res = await fetch(`${BACKEND_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    if (res.ok) {
      setAuthed(true);
      fetchUniversities();
    } else {
      setError("Incorrect password");
    }
  };

  const fetchUniversities = async () => {
    setLoading(true);
    const res = await fetch(
      `${BACKEND_URL}/api/admin/universities?password=${password}`
    );
    const json = await res.json();
    setUniversities(json.data || []);
    setLoading(false);
  };

  if (!authed) {
    return (
      <div className="sa-login-wrapper">
        <div className="sa-login-box">
          <h2 className="sa-title">AptiGuide Super Admin</h2>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="sa-input"
          />
          {error && <p className="sa-error">{error}</p>}
          <button onClick={handleLogin} className="sa-button">Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="sa-wrapper">
      <h1 className="sa-title">Super Admin — All Universities</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="sa-table">
          <thead>
            <tr>
              <th>University</th>
              <th>API Key</th>
              <th>Status</th>
              <th>Assessments</th>
              <th>Added</th>
            </tr>
          </thead>
          <tbody>
            {universities.length === 0 ? (
              <tr>
                <td colSpan={5} className="sa-empty">No universities yet</td>
              </tr>
            ) : (
              universities.map((uni) => (
                <tr key={uni.id}>
                  <td>{uni.name}</td>
                  <td className="sa-apikey">{uni.api_key}</td>
                  <td>
                    <span className={uni.is_active ? "sa-active" : "sa-inactive"}>
                      {uni.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="sa-center">{uni.assessment_count}</td>
                  <td>{new Date(uni.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}