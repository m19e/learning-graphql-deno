import { GraphQLScalarType, ky } from "../deps.ts";

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
    allUsers: () => User[] | Promise<User[]>;
  };
  Mutation: {
    postPhoto: (_: null, args: PhotoInput) => Photo;
  };
  DateTime: GraphQLScalarType;
};

const endpoint = "http://localhost:54321/graphql/v1";
const headers = {
  Authentication:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0",
  apiKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0",
};
const allUsersQuery = /* GraphQL */ `
query {
  usersCollection {
    edges {
      node {
        id
        name
        github_login
      }
    }
  }
}
`;

type ResponseError = { errors: { message: string }[]; data: undefined };
type Response = {
  data: {
    usersCollection: {
      edges: { node: { id: number; name: string; github_login: string } }[];
    };
  };
  errors: undefined;
} | ResponseError;

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
    allUsers: async () => {
      const { data, errors } = await ky.post(endpoint, {
        headers,
        json: { query: allUsersQuery },
      }).json<Response>();

      if (errors) {
        console.log(errors);
        return [];
      }
      const userList: User[] = data.usersCollection.edges.map((
        { node },
      ) => ({
        githubLogin: node.github_login,
        name: node.name,
        postedPhotos: [],
      }));
      return userList;
    },
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
