import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import "./App.css";

import { Users } from "./Users";
import { AuthorizedUser } from "./AuthorizedUser";

const queryClient = new QueryClient();

export const RQApp = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <div>
        <DefaultContent />
        <AuthorizedUser />
        <Users />
      </div>
    </BrowserRouter>
  </QueryClientProvider>
);

const DefaultContent = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <div className="flex">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
};
