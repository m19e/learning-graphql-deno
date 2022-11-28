import { createSchema, createYoga, serve } from "./deps.ts";

import type { Photo, PhotoInput, User } from "./types.ts";
import { photos, tags, users } from "./mocks.ts";

const typeDefs = await Deno.readTextFile("./graphql/typeDefs.graphql");

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
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
        taggedUsers: (parent: Photo) => {
          return tags.filter((tag) => tag.photoID === parent.id).map((
            { userID },
          ) => users.find((u) => u.githubLogin === userID));
        },
      },
      User: {
        postedPhotos: (parent: User) => {
          return photos.filter((p) => p.githubUser === parent.githubLogin);
        },
        inPhotos: (parent: User) => {
          return tags.filter((tag) => tag.userID === parent.githubLogin).map((
            { photoID },
          ) => photos.find((p) => p.id === photoID));
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
