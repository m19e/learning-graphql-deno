import type { AuthPayload, Photo, PhotoInput, User } from "../types.ts";
import { CLIENT_ID, CLIENT_SECRET } from "../env.ts";
import { authorizeWithGitHub } from "../lib/github.ts";

import { photos } from "../mocks.ts";

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
    const user: User = {
      name,
      githubLogin: login,
      githubToken: access_token,
      avatar: avatar_url,
    };

    // TODO find, update user token on supabase gql
    console.log(user);

    return {
      user,
      token: access_token,
    };
  },
};
