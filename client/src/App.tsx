import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

import ky from "ky";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

import type { Options, Response } from "./types";

const queryClient = new QueryClient();

function App() {
  const [count, setCount] = useState(0);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <div>
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
        <Users />
      </div>
    </QueryClientProvider>
  );
}

const endpoint = "http://localhost:4000/graphql";
const fetcher = async <T,>(options: Options): Promise<T | undefined> => {
  const res = await ky
    .post(endpoint, {
      json: options,
    })
    .json<Response<T>>();
  return res.data;
};

const allUsersQuery = /* GraphQL */ `
  {
    totalUsers
    allUsers {
      githubLogin
      avatar
    }
  }
`;
type AllUsersData = {
  allUsers: {
    githubLogin: string;
    avatar: string;
  }[];
};

const fetchAllUsers = async () => {
  return await fetcher<AllUsersData>({ query: allUsersQuery });
};

const Users = () => {
  const { data, error } = useQuery(allUsersQuery, fetchAllUsers);

  if (error) return <span>!ERROR!</span>;
  if (!data) return <span>loading...</span>;
  return (
    <div style={{ display: "flex" }}>
      <span style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>
        {JSON.stringify(data, null, 4)}
      </span>
    </div>
  );
};

export default App;
