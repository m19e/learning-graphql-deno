import { Suspense } from "react";
import type { QueryState } from "urql";
import { Exact, FakeUsersComponent, UsersComponent, UsersQuery } from "../gql";

import { AuthorizedUser } from "./AuthorizedUser";
import Svg from "./Svg";

export const Users = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Suspense fallback={<UsersFallback />}>
        <UsersComponent requestPolicy="cache-and-network">
          {(props) => <UsersContent {...props} />}
        </UsersComponent>
      </Suspense>
    </div>
  );
};

const UsersFallback = () => {
  return (
    <div className="flex items-center p-4 bg-gray-100 rounded-xl">
      <span className="font-semibold">Loading Users...</span>
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
  const { totalUsers, allUsers, me } = data;
  return (
    <div className="flex flex-col items-start gap-4 bg-gray-100 min-w-[24rem] rounded-xl p-4">
      <div className="w-full inline-flex items-center justify-between gap-4 border-b border-gray-400 pb-2">
        <div className="flex gap-2">
          <div className="flex items-center gap-0.5 bg-teal-500 text-white py-1.5 px-2 rounded-lg">
            <div className="w-6 h-6">
              <Svg.People />
            </div>
            <span className="font-semibold text-lg">{totalUsers}</span>
          </div>
          <FakeUsersComponent>
            {({ executeMutation }) => (
              <button
                className="bg-blue-600 hover:bg-blue-500 text-white rounded px-4 py-2"
                onClick={() => executeMutation({ count: 1 })}
              >
                Add Fake Users
              </button>
            )}
          </FakeUsersComponent>
        </div>
        <AuthorizedUser me={me} />
      </div>
      {allUsers.filter((u) => u.githubLogin !== "m19e").map((user) => (
        <div key={user.githubLogin} className="flex items-center gap-2">
          <img
            src="https://placehold.jp/50x50.png"
            alt="placehold"
          />
          <span className="text-blue-600 text-lg">
            {user.name ?? user.githubLogin}
          </span>
        </div>
      ))}
      <p className="whitespace-pre">{JSON.stringify(me, null, 2)}</p>
    </div>
  );
};
