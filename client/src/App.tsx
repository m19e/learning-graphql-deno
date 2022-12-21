import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

import ky from "ky";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

import type { Options, Response, User } from "./types";
import { AllUsersQuery as AllUsersData } from "./generated";

const queryClient = new QueryClient();

function App() {
  const [count, setCount] = useState(0);

  return (
    <QueryClientProvider client={queryClient}>
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
        <Users />
      </div>
    </QueryClientProvider>
  );
}

const endpoint = "http://localhost:4000/graphql";
const fetcher = async <T,>(options: Options): Promise<T | undefined> => {
  console.log("fetch now: ", new Date());

  const res = await ky
    .post(endpoint, {
      json: options,
    })
    .json<Response<T>>();
  return res.data;
};

const ALL_USERS_QUERY = /* GraphQL */ `
  {
    totalUsers
    allUsers {
      githubLogin
      name
      avatar
    }
  }
`;

const fetchAllUsers = async () => {
  return await fetcher<AllUsersData>({ query: ALL_USERS_QUERY });
};

const Users = () => {
  const { data, error, refetch } = useQuery({
    queryKey: [ALL_USERS_QUERY],
    queryFn: fetchAllUsers,
  });

  if (error) return <span>ERROR</span>;
  if (!data) return <span>loading users...</span>;
  return (
    <UserList
      count={data.totalUsers}
      users={data.allUsers}
      refetchUsers={refetch}
    />
  );
};

type UserListProps = {
  count: number;
  users: Partial<User>[];
  refetchUsers: () => void;
};
const UserList = ({ count, users, refetchUsers }: UserListProps) => {
  return (
    <div className="flex flex-col items-start gap-4">
      <span>{count} Users</span>
      <button
        className="bg-blue-700 hover:bg-blue-600 text-white rounded px-4 py-2"
        onClick={() => refetchUsers()}
      >
        Refetch User
      </button>
      {users.map((user) => <UserListItem key={user.githubLogin} user={user} />)}
    </div>
  );
};

const UserListItem = ({ user }: { user: Partial<User> }) => {
  return (
    <div
      key={user.githubLogin}
      className="flex items-center gap-2"
    >
      <img
        src="https://placehold.jp/50x50.png"
        width={48}
        height={48}
        alt=""
      />
      <span className="text-blue-500">
        {user.name ?? user.githubLogin}
      </span>
    </div>
  );
};

export default App;
