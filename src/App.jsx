import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./components/pages/home";
import About from "./components/pages/about";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

export default App;
