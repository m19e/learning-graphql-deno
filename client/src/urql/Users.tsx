import { Suspense } from "react";
import type { QueryState } from "urql";
import { Exact, UsersComponent, UsersQuery } from "../gql";

export const Users = () => {
  return (
    <Suspense fallback={<span>Loading...</span>}>
      <UsersComponent>
        {(props) => <UsersContent {...props} />}
      </UsersComponent>
    </Suspense>
  );
};

type UsersProps = QueryState<
  UsersQuery,
  Exact<{
    [key: string]: never;
  }>
>;

const UsersContent = ({ data }: UsersProps) => {
  return (
    <p className="whitespace-pre text-left p-2 bg-gray-200">
      {JSON.stringify(data, null, 4)}
    </p>
  );
};
