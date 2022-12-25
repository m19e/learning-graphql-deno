import { Suspense } from "react";
import type { QueryState } from "urql";
import { Exact, FakeUsersComponent, UsersComponent, UsersQuery } from "../gql";

export const Users = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Suspense fallback={<UsersFallback />}>
        <UsersComponent>
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
  const { totalUsers, allUsers } = data;
  return (
    <div className="flex flex-col items-start gap-4 bg-gray-100 min-w-[24rem] rounded-xl p-4">
      <div className="w-full inline-flex items-center justify-between gap-4 border-b border-gray-400 pb-2">
        <div className="flex items-center gap-0.5 bg-teal-500 text-white py-1.5 px-2 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
          </svg>
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
    </div>
  );
};
