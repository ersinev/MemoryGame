import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./assets/css/index.css";
import Game from "./components/Game";
import "bootstrap/dist/css/bootstrap.min.css";
import { createRoot } from "react-dom/client";
import AdminPanel from "./components/AdminPanel";
import Result from "./components/Result";

const root = createRoot(document.getElementById("root"));
root.render(
<Router>
    <Routes>
      <Route exact path="/" element={<Game />} />
      <Route exact path="/admin" element={<AdminPanel />} />
      <Route exact path="/result" element={<Result />} />
    </Routes>
  </Router>
);
