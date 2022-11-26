import { createSchema, createYoga, serve } from "./deps.ts";

import type { Photo, PhotoInput, User } from "./types.ts";
import { photos, users } from "./mocks.ts";

const yoga = createYoga({
  schema: createSchema({
    typeDefs: /* GraphQL */ `
      enum PhotoCategory {
        SELFIE
        PORTRAIT
        ACTION
        LANDSCAPE
        GRAPHIC
      }
      type User {
        githubLogin: ID!
        name: String
        avatar: String
        postedPhotos: [Photo!]!
      }
      type Photo {
        id: ID!
        url: String!
        name: String!
        description: String
        category: PhotoCategory!
        postedBy: User!
      }
      input PostPhotoInput {
        name: String!
        category: PhotoCategory = PORTRAIT
        description: String
      }
      type Query {
        totalPhotos: Int!
        allPhotos: [Photo!]!
        hello: String!
      }
      type Mutation {
        postPhoto(input: PostPhotoInput): Photo!
      }
    `,
    resolvers: {
      Query: {
        totalPhotos: () => photos.length,
        allPhotos: () => photos,
      },
      Mutation: {
        postPhoto: (_: null, args: PhotoInput): Photo => {
          const newPhoto: Photo = {
            ...args.input,
            id: crypto.randomUUID(),
          };
          photos.push(newPhoto);
          return newPhoto;
        },
      },
      Photo: {
        url: (parent: Photo) => {
          return `https://mysite.com/assets/img/${parent.id}.png`;
        },
        postedBy: (parent: Photo) => {
          return users.find((u) => u.githubLogin === parent.githubUser);
        },
      },
      User: {
        postedPhotos: (parent: User) => {
          return photos.filter((p) => p.githubUser === parent.githubLogin);
        },
      },
    },
  }),
});

serve(yoga, {
  onListen({ hostname, port }) {
    console.log(`Listening on http://${hostname}:${port}/graphql`);
  },
});
