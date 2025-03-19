import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/Landing";
import FreeEditor from "./components/FreeEditor";
import PremiumEditor from "./components/PremiumEditor";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/free" element={<FreeEditor />} />
        <Route path="/premium" element={<PremiumEditor />} />
      </Routes>
    </Router>
  );
};

export default App;
