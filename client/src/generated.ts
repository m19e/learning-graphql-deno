import { useQuery, UseQueryOptions } from "react-query";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> =
  & Omit<T, K>
  & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> =
  & Omit<T, K>
  & { [SubKey in K]: Maybe<T[SubKey]> };

function fetcher<TData, TVariables>(
  endpoint: string,
  requestInit: RequestInit,
  query: string,
  variables?: TVariables,
) {
  return async (): Promise<TData> => {
    const res = await fetch(endpoint, {
      method: "POST",
      ...requestInit,
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  };
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: Date;
};

export enum PhotoCategory {
  Selfie = "SELFIE",
  Portrait = "PORTRAIT",
  Action = "ACTION",
  Landscape = "LANDSCAPE",
  Graphic = "GRAPHIC",
}

export type PostPhotoInput = {
  name: Scalars["String"];
  category?: InputMaybe<PhotoCategory>;
  description?: InputMaybe<Scalars["String"]>;
};

export type Photo = {
  __typename?: "Photo";
  id: Scalars["ID"];
  url: Scalars["String"];
  name: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  category: PhotoCategory;
  postedBy: User;
  taggedUsers: Array<User>;
  created: Scalars["DateTime"];
};

export type User = {
  __typename?: "User";
  githubLogin: Scalars["ID"];
  githubToken: Scalars["String"];
  name?: Maybe<Scalars["String"]>;
  avatar?: Maybe<Scalars["String"]>;
  postedPhotos: Array<Photo>;
  inPhotos: Array<Photo>;
};

export type AuthPayload = {
  __typename?: "AuthPayload";
  token: Scalars["String"];
  user: User;
};

export type Query = {
  __typename?: "Query";
  me?: Maybe<User>;
  totalPhotos: Scalars["Int"];
  allPhotos: Array<Photo>;
  totalUsers: Scalars["Int"];
  allUsers: Array<User>;
};

export type Mutation = {
  __typename?: "Mutation";
  postPhoto: Photo;
  githubAuth: AuthPayload;
  addFakeUsers: Array<User>;
  fakeUserAuth: AuthPayload;
};

export type MutationPostPhotoArgs = {
  input?: InputMaybe<PostPhotoInput>;
};

export type MutationGithubAuthArgs = {
  code: Scalars["String"];
};

export type MutationAddFakeUsersArgs = {
  count?: InputMaybe<Scalars["Int"]>;
};

export type MutationFakeUserAuthArgs = {
  githubLogin: Scalars["ID"];
};

export type AllUsersQueryVariables = Exact<{ [key: string]: never }>;

export type AllUsersQuery = {
  __typename?: "Query";
  totalUsers: number;
  allUsers: Array<
    { __typename?: "User"; githubLogin: string; avatar?: string | null }
  >;
};

export const AllUsersDocument = /* GraphQL */ `
query allUsers {
  totalUsers
  allUsers {
    githubLogin
    avatar
  }
}
`;
export const useAllUsersQuery = <
  TData = AllUsersQuery,
  TError = unknown,
>(
  dataSource: { endpoint: string; fetchParams?: RequestInit },
  variables?: AllUsersQueryVariables,
  options?: UseQueryOptions<AllUsersQuery, TError, TData>,
) =>
  useQuery<AllUsersQuery, TError, TData>(
    variables === undefined ? ["allUsers"] : ["allUsers", variables],
    fetcher<AllUsersQuery, AllUsersQueryVariables>(
      dataSource.endpoint,
      dataSource.fetchParams || {},
      AllUsersDocument,
      variables,
    ),
    options,
  );
