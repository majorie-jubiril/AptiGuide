import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UniversityHome from "./pages/UniversityHome";
import Analyzer from "./pages/Analyzer";
import Results from "./pages/Results";
import Apply from "./pages/Apply";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UniversityHome />} />
        <Route path="/analyzer" element={<Analyzer />} />
        <Route path="/results" element={<Results />} />
        <Route path="/apply" element={<Apply />} />
      </Routes>
    </Router>
  );
}

export default App;