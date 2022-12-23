import { Suspense } from "react";
import type { QueryState } from "urql";
import { Exact, UsersComponent, UsersQuery } from "../gql";

export const Users = () => {
  return (
    <Suspense fallback={<UsersFallback />}>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <UsersComponent>
          {(props) => <UsersContent {...props} />}
        </UsersComponent>
      </div>
    </Suspense>
  );
};

const UsersFallback = () => {
  return (
    <div>
      <span>Loading Users...</span>
    </div>
  );
};

type UsersProps = QueryState<
  UsersQuery,
  Exact<{
    [key: string]: never;
  }>
>;

const UsersContent = ({ data }: UsersProps) => {
  if (!data) return null;
  const { totalUsers, allUsers } = data;
  return (
    <div className="flex flex-col items-start gap-4 bg-gray-100 p-4">
      <span className="text-teal-500 font-semibold">{totalUsers} Users</span>
      <div className="inline-flex gap-2">
        <button className="bg-blue-700 hover:bg-blue-600 text-white rounded px-4 py-2">
          Refetch User
        </button>
        <button className="bg-green-700 hover:bg-green-600 text-white rounded px-4 py-2">
          Add Fake Users
        </button>
      </div>
      {allUsers.map((user) => (
        <div key={user.githubLogin} className="flex items-center gap-2">
          <img
            src="https://placehold.jp/48x48.png"
            alt="placehold"
          />
          <span className="text-blue-600 text-lg">
            {user.name ?? user.githubLogin}
          </span>
        </div>
      ))}
    </div>
  );
};
