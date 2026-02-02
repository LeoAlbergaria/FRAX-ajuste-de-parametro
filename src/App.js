import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import TBSPage from "./TBSPage";
import MainPage from "./MainPage";
import TestPage from "./TestPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/tbs" element={<TBSPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/" element={<MainPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

