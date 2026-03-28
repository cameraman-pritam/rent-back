import "./App.css";
import { Routes, Route } from "react-router-dom";
import Root from "./components/root";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Root />} />
      </Routes>
    </>
  );
}

export default App;
