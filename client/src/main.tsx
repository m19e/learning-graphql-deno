import React from "react";
import ReactDOM from "react-dom/client";

import { UrqlApp } from "./urql/App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <UrqlApp />
  </React.StrictMode>,
);
