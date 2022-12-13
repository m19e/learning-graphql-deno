import { GQLError } from "../deps.ts";

import type {
  AuthPayload,
  Ctx,
  Photo,
  PhotoInput,
  User,
  UserRecord,
} from "../types.ts";
import { CLIENT_ID, CLIENT_SECRET } from "../env.ts";
import { convertRecordToUser, convertUserToRecord } from "../utils.ts";
import { authorizeWithGitHub } from "../lib/github.ts";
import { postWithHeaders } from "../lib/request.ts";

type UpdateUserResponse = {
  data: {
    updateusersCollection: {
      records: UserRecord[];
    };
  };
};
const updateUserMutation = /* GraphQL */ `
mutation ($set: usersUpdateInput!, $filter: usersFilter) {
  updateusersCollection(set: $set, filter: $filter) {
    records {
      github_login
      github_token
      name
      avatar
    }
  }
}
`;
const postUpdateUser = async (
  login: string,
  newUser: User,
): Promise<UserRecord | null> => {
  const res = await postWithHeaders<UpdateUserResponse>({
    query: updateUserMutation,
    variables: {
      filter: {
        github_login: {
          eq: login,
        },
      },
      set: convertUserToRecord(newUser),
    },
  });
  const [updatedUser] = res.data.updateusersCollection.records;
  return updatedUser || null;
};

type CreateUserResponse = {
  data: {
    insertIntousersCollection: {
      records: UserRecord[];
    };
  };
};
const createUserMutation = /* GraphQL */ `
mutation ($objects: [usersInsertInput!]!) {
  insertIntousersCollection(objects: $objects) {
    records {
      github_login
      github_token
      name
      avatar
    }
  }
}
`;
const postCreateUser = async (newUser: User): Promise<UserRecord> => {
  const { data } = await postWithHeaders<CreateUserResponse>({
    query: createUserMutation,
    variables: {
      objects: convertUserToRecord(newUser),
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

type CreatePhotoResponse = {
  data: {
    insertIntophotosCollection: {
      records: { id: number }[];
    };
  };
};
const createPhotoMutation = /* GraphQL */ `
mutation ($objects: [photosInsertInput!]!) {
  insertIntophotosCollection(objects: $objects) {
    records {
      id
    }
  }
}
`;
const postCreatePhoto = async (
  photo: Photo,
): Promise<{ id: number }> => {
  const { githubUser, name, category, desciption, created } = photo;
  const { data } = await postWithHeaders<CreatePhotoResponse>({
    query: createPhotoMutation,
    variables: {
      objects: {
        github_user: githubUser,
        name,
        category,
        desciption,
        created,
      },
    },
  });
  const [record] = data.insertIntophotosCollection.records;
  return record;
};

export type MutationResolver = {
  postPhoto: (_: null, args: PhotoInput, ctx: Ctx) => Promise<Photo>;
  githubAuth: (_: null, args: { code: string }) => Promise<AuthPayload>;
};

export const Mutation: MutationResolver = {
  postPhoto: async (_, args, { currentUser }) => {
    if (!currentUser) {
      throw new GQLError(`only an authorized user can post a photo`);
    }
    const newPhoto: Photo = {
      ...args.input,
      githubUser: currentUser.githubLogin,
      created: new Date().toISOString(),
    };

    const record = await postCreatePhoto(newPhoto);
    return {
      ...newPhoto,
      id: record.id,
    };
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
