import type { AuthPayload, Photo, PhotoInput, User } from "../types.ts";
import { CLIENT_ID, CLIENT_SECRET } from "../env.ts";
import { authorizeWithGitHub } from "../lib/github.ts";
import { postWithHeaders } from "../lib/request.ts";

import { photos } from "../mocks.ts";

const updateUserMutation = /* GraphQL */ `
mutation ($set: usersUpdateInput!, $filter: usersFilter) {
  updateusersCollection(set: $set, filter: $filter) {
    affectedCount
    records {
      github_login
      github_token
      name
      avatar
    }
  }
}
`;
const createUserMutation = /* GraphQL */ `
mutation ($objects: [usersInsertInput!]!) {
  insertIntousersCollection(objects: $objects) {
    affectedCount
    records {
      github_login
      github_token
      name
      avatar
    }
  }
}
`;

type UserRecord = {
  github_login: string;
  github_token: string;
  name: string | null;
  avatar: string | null;
};
type UpdateUserResponse = {
  data: {
    updateusersCollection: {
      affectedCount: number;
      records: UserRecord[];
    };
  };
};
const postUpdateUser = async (
  login: string,
  newUser: User,
): Promise<UserRecord | null> => {
  const res = await postWithHeaders<UpdateUserResponse>({
    query: updateUserMutation,
    variables: {
      "filter": {
        "github_login": {
          "eq": login,
        },
      },
      "set": convertUserToRecord(newUser),
    },
  });
  const [updatedUser] = res.data.updateusersCollection.records;
  return updatedUser || null;
};

const convertUserToRecord = (user: User): UserRecord => {
  const { githubLogin, githubToken, name, avatar } = user;

  return {
    github_login: githubLogin,
    github_token: githubToken,
    name,
    avatar,
  };
};
const convertRecordToUser = (record: UserRecord): User => {
  const { github_login, github_token, name, avatar } = record;

  return {
    githubLogin: github_login,
    githubToken: github_token,
    name,
    avatar,
  };
};

type CreateUserResponse = {
  data: {
    insertIntousersCollection: {
      affectedCount: number;
      records: UserRecord[];
    };
  };
};
const postCreateUser = async (newUser: User): Promise<UserRecord> => {
  const { data } = await postWithHeaders<CreateUserResponse>({
    query: createUserMutation,
    variables: {
      "objects": convertUserToRecord(newUser),
    },
  });
  const [createdUser] = data.insertIntousersCollection.records;
  return createdUser;
};

const updateOrCreateUser = async (
  login: string,
  newUser: User,
): Promise<User> => {
  const updatedRecord = await postUpdateUser(login, newUser);
  if (updatedRecord) return convertRecordToUser(updatedRecord);
  const createdRecord = await postCreateUser(newUser);
  return convertRecordToUser(createdRecord);
};

export type MutationResolver = {
  postPhoto: (_: null, args: PhotoInput) => Photo;
  githubAuth: (_: null, args: { code: string }) => Promise<AuthPayload>;
};

export const Mutation: MutationResolver = {
  postPhoto: (_: null, args: PhotoInput): Photo => {
    const newPhoto: Photo = {
      ...args.input,
      id: crypto.randomUUID(),
      created: new Date().toISOString(),
    };
    photos.push(newPhoto);
    return newPhoto;
  },
  githubAuth: async (_, { code }) => {
    const { access_token, avatar_url, login, name } = await authorizeWithGitHub(
      {
        client_id: CLIENT_ID!,
        client_secret: CLIENT_SECRET!,
        code,
      },
    );
    const authUser: User = {
      githubLogin: login,
      githubToken: access_token,
      name,
      avatar: avatar_url,
    };

    try {
      const resUser = await updateOrCreateUser(login, authUser);
      return {
        user: resUser,
        token: access_token,
      };
    } catch (err) {
      console.error("Error! ", err);
      return {
        user: authUser,
        token: access_token,
      };
    }
  },
};
