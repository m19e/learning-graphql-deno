import { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import reactLogo from "./assets/react.svg";
import "./App.css";

import type { User } from "./types";
import { ADD_FAKE_USERS_MUTATION, ALL_USERS_QUERY } from "./query";
import {
  fetchAddFakeUsers,
  fetchAllUsers,
  makeQueryRefetcher,
} from "./fetcher";

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
  const client = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: [ADD_FAKE_USERS_MUTATION],
    mutationFn: fetchAddFakeUsers,
    onSuccess: makeQueryRefetcher(client, ALL_USERS_QUERY),
  });

  return (
    <div className="flex flex-col items-start gap-4">
      <span>{count} Users</span>
      <div className="inline-flex gap-2">
        <button
          className="bg-blue-700 hover:bg-blue-600 text-white rounded px-4 py-2"
          onClick={() => refetchUsers()}
        >
          Refetch User
        </button>
        <button
          className="bg-green-700 hover:bg-green-600 text-white rounded px-4 py-2"
          onClick={() => mutate({ count: 1 })}
        >
          Add Fake Users
        </button>
      </div>
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
