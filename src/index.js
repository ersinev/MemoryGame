import React from "react";

import "./assets/css/index.css";
import Game from "./components/Game";
import "bootstrap/dist/css/bootstrap.min.css";
import { createRoot } from "react-dom/client";
const root = createRoot(document.getElementById("root"));
root.render(<Game />); // Replace 'App' with your root component
