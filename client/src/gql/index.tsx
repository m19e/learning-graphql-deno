import gql from "graphql-tag";
import * as React from "react";
import * as Urql from "urql";
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
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  Upload: any;
};

export type AuthPayload = {
  __typename?: "AuthPayload";
  token: Scalars["String"];
  user: User;
};

export type Mutation = {
  __typename?: "Mutation";
  addFakeUsers: Array<User>;
  fakeUserAuth: AuthPayload;
  githubAuth: AuthPayload;
  postPhoto: Photo;
};

export type MutationAddFakeUsersArgs = {
  count?: InputMaybe<Scalars["Int"]>;
};

export type MutationFakeUserAuthArgs = {
  githubLogin: Scalars["ID"];
};

export type MutationGithubAuthArgs = {
  code: Scalars["String"];
};

export type MutationPostPhotoArgs = {
  input?: InputMaybe<PostPhotoInput>;
};

export type Photo = {
  __typename?: "Photo";
  category: PhotoCategory;
  created: Scalars["DateTime"];
  description?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  name: Scalars["String"];
  postedBy: User;
  taggedUsers: Array<User>;
  url: Scalars["String"];
};

export enum PhotoCategory {
  Action = "ACTION",
  Graphic = "GRAPHIC",
  Landscape = "LANDSCAPE",
  Portrait = "PORTRAIT",
  Selfie = "SELFIE",
}

export type PostPhotoInput = {
  category?: InputMaybe<PhotoCategory>;
  description?: InputMaybe<Scalars["String"]>;
  name: Scalars["String"];
};

export type Query = {
  __typename?: "Query";
  allPhotos: Array<Photo>;
  allUsers: Array<User>;
  me?: Maybe<User>;
  totalPhotos: Scalars["Int"];
  totalUsers: Scalars["Int"];
};

export type User = {
  __typename?: "User";
  avatar?: Maybe<Scalars["String"]>;
  githubLogin: Scalars["ID"];
  githubToken: Scalars["String"];
  inPhotos: Array<Photo>;
  name?: Maybe<Scalars["String"]>;
  postedPhotos: Array<Photo>;
};

export type UsersQueryVariables = Exact<{ [key: string]: never }>;

export type UsersQuery = {
  __typename?: "Query";
  totalUsers: number;
  allUsers: Array<
    {
      __typename?: "User";
      githubLogin: string;
      name?: string | null;
      avatar?: string | null;
    }
  >;
  me?: {
    __typename?: "User";
    githubLogin: string;
    name?: string | null;
    avatar?: string | null;
  } | null;
};

export type UserInfoFragment = {
  __typename?: "User";
  githubLogin: string;
  name?: string | null;
  avatar?: string | null;
};

export type FakeUsersMutationVariables = Exact<{
  count: Scalars["Int"];
}>;

export type FakeUsersMutation = {
  __typename?: "Mutation";
  addFakeUsers: Array<
    {
      __typename?: "User";
      githubLogin: string;
      name?: string | null;
      avatar?: string | null;
    }
  >;
};

export type AuthMutationVariables = Exact<{
  code: Scalars["String"];
}>;

export type AuthMutation = {
  __typename?: "Mutation";
  githubAuth: { __typename?: "AuthPayload"; token: string };
};

export const UserInfoFragmentDoc = gql`
fragment userInfo on User {
  githubLogin
  name
  avatar
}
`;
export const UsersDocument = gql`
query users {
  totalUsers
  allUsers {
    ...userInfo
  }
  me {
    ...userInfo
  }
}
${UserInfoFragmentDoc}`;

export const UsersComponent = (
  props: Omit<Urql.QueryProps<UsersQuery, UsersQueryVariables>, "query"> & {
    variables?: UsersQueryVariables;
  },
) => <Urql.Query {...props} query={UsersDocument} />;

export function useUsersQuery(
  options?: Omit<Urql.UseQueryArgs<UsersQueryVariables>, "query">,
) {
  return Urql.useQuery<UsersQuery, UsersQueryVariables>({
    query: UsersDocument,
    ...options,
  });
}
export const FakeUsersDocument = gql`
mutation fakeUsers($count: Int!) {
  addFakeUsers(count: $count) {
    githubLogin
    name
    avatar
  }
}
`;

export const FakeUsersComponent = (
  props:
    & Omit<
      Urql.MutationProps<FakeUsersMutation, FakeUsersMutationVariables>,
      "query"
    >
    & { variables?: FakeUsersMutationVariables },
) => <Urql.Mutation {...props} query={FakeUsersDocument} />;

export function useFakeUsersMutation() {
  return Urql.useMutation<FakeUsersMutation, FakeUsersMutationVariables>(
    FakeUsersDocument,
  );
}
export const AuthDocument = gql`
mutation auth($code: String!) {
  githubAuth(code: $code) {
    token
  }
}
`;

export const AuthComponent = (
  props:
    & Omit<Urql.MutationProps<AuthMutation, AuthMutationVariables>, "query">
    & { variables?: AuthMutationVariables },
) => <Urql.Mutation {...props} query={AuthDocument} />;

export function useAuthMutation() {
  return Urql.useMutation<AuthMutation, AuthMutationVariables>(AuthDocument);
}
