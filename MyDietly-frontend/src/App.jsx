import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
// import Projects from "./pages/Projects/Projects.jsx";
import Home from "./pages/Home/index.jsx";
// import AboutMe from "./pages/AboutMe/aboutme.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/projects" element={<Projects />} />
        <Route path="/about" element={<AboutMe />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
