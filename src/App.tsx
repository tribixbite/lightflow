import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LightingAdvisor from "./components/light";
import { GithubParam } from "./components/GithubParam";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen items-center justify-center bg-zinc-900">
        <Routes>
          <Route path="/" element={<GithubParam />} />
          <Route path="/light" element={<LightingAdvisor />} />
          <Route path="/repo" element={<GithubParam />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
