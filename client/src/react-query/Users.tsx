import { useMutation, useQuery, useQueryClient } from "react-query";

import type { User } from "./types";
import { ADD_FAKE_USERS_MUTATION, ALL_USERS_QUERY } from "./query";
import {
  fetchAddFakeUsers,
  fetchAllUsers,
  makeQueryRefetcher,
} from "./fetcher";

export const Users = () => {
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
