import React from "react";
import ReactDOM from "react-dom";
import "./assets/css/index.css";
import Game from "./components/Game";
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <React.StrictMode>
    <Game/>
  </React.StrictMode>,
  document.getElementById("root")
);
