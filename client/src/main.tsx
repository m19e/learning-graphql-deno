import React from "react";
import ReactDOM from "react-dom/client";

import { RQApp } from "./react-query/App";
import { UrqlApp } from "./urql/App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <UrqlApp />
    {/* <RQApp /> */}
  </React.StrictMode>,
);
