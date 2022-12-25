import ky from "ky";
import { QueryClient } from "react-query";

import type { Options, Response } from "./types";
import { ADD_FAKE_USERS_MUTATION, ALL_USERS_QUERY, GITHUB_AUTH_MUTATION } from "../query";
import {
  AddFakeUsersMutation,
  AddFakeUsersMutationVariables,
  AllUsersQuery as AllUsersData,
  GithubAuthMutation,
  GithubAuthMutationVariables,
} from "./generated";

const endpoint = "http://localhost:4000/graphql";
const fetcher = async <T>(options: Options): Promise<T | undefined> => {
  const res = await ky
    .post(endpoint, { json: options })
    .json<Response<T>>();
  return res.data;
};

export const fetchAllUsers = async () => {
  return await fetcher<AllUsersData>({ query: ALL_USERS_QUERY });
};

export const fetchAddFakeUsers = async (
  variables: AddFakeUsersMutationVariables,
) => {
  return await fetcher<AddFakeUsersMutation>({
    query: ADD_FAKE_USERS_MUTATION,
    variables,
  });
};

export const fetchGithubAuth = async (
  variables: GithubAuthMutationVariables,
) => {
  return await fetcher<GithubAuthMutation>({
    query: GITHUB_AUTH_MUTATION,
    variables,
  });
};

export const makeQueryRefetcher =
  (client: QueryClient, queryKey: string | string[]) => async () => {
    await client.refetchQueries({
      queryKey,
      active: true,
      exact: true,
    });
  };
