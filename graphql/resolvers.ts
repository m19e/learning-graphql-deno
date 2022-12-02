import { GraphQLScalarType } from "../deps.ts";

import type { Photo, PhotoInput, User } from "../types.ts";
import { photos, tags, users } from "../mocks.ts";

type Resolvers = {
  Photo: {
    url: (parent: Photo) => string;
    postedBy: (parent: Photo) => User | undefined;
    taggedUsers: (parent: Photo) => (User | undefined)[];
  };
  User: {
    postedPhotos: (parent: User) => Photo[];
    inPhotos: (parent: User) => (Photo | undefined)[];
  };
  Query: {
    totalPhotos: () => number;
    allPhotos: () => Photo[];
    totalUsers: () => number;
    allUsers: () => User[];
  };
  Mutation: {
    postPhoto: (_: null, args: PhotoInput) => Photo;
  };
  DateTime: GraphQLScalarType;
};

export const resolvers: Resolvers = {
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
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: () => photos,
    totalUsers: () => users.length,
    allUsers: () => users,
  },
  Mutation: {
    postPhoto: (_: null, args: PhotoInput): Photo => {
      const newPhoto: Photo = {
        ...args.input,
        id: crypto.randomUUID(),
        created: new Date().toISOString(),
      };
      photos.push(newPhoto);
      return newPhoto;
    },
  },
  DateTime: new GraphQLScalarType({
    name: "DateTime",
    description: "A valid date time value.",
    parseValue: (value: string) => new Date(value),
    serialize: (value: string) => new Date(value).toISOString(),
    parseLiteral: (ast: { value: string }) => ast.value,
  }),
};
