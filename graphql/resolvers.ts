import { GraphQLScalarType } from "../deps.ts";

import type {
  Ctx,
  Photo,
  PhotosResponse,
  User,
  UsersResponse,
} from "../types.ts";
import { Mutation, MutationResolver } from "./mutation.ts";
import { postWithHeaders } from "../lib/request.ts";

import { photos, tags, users } from "../mocks.ts";

type Resolvers = {
  Photo: {
    id: (parent: Photo) => Photo["id"];
    url: (parent: Photo) => string;
    postedBy: (parent: Photo) => User | undefined;
    taggedUsers: (parent: Photo) => (User | undefined)[];
  };
  User: {
    postedPhotos: (parent: User) => Photo[];
    inPhotos: (parent: User) => (Photo | undefined)[];
  };
  Query: {
    me: (
      _p: null,
      _a: null,
      ctx: Ctx,
    ) => User | null;
    totalPhotos: () => Promise<number>;
    allPhotos: () => Promise<Photo[]>;
    totalUsers: () => Promise<number>;
    allUsers: () => User[] | Promise<User[]>;
  };
  Mutation: MutationResolver;
  DateTime: GraphQLScalarType;
};

const allUsersQuery = /* GraphQL */ `
{
  usersCollection {
    edges {
      node {
        github_login
        github_token
        name
        avatar
      }
    }
  }
}
`;
const fetchAllUsers = async (): Promise<UsersResponse> => {
  return await postWithHeaders<UsersResponse>({ query: allUsersQuery });
};

const allPhotosQuery = /* GraphQL */ `
{
  photosCollection {
    edges {
      node {
        id
        name
        description
        category
        created
        github_user
      }
    }
  }
}
`;
const fetchAllPhotos = async (): Promise<PhotosResponse> => {
  return await postWithHeaders<PhotosResponse>({ query: allPhotosQuery });
};

export const resolvers: Resolvers = {
  Photo: {
    id: (parent: Photo) => {
      return parent.id;
    },
    url: (parent: Photo) => {
      return `/img/photos/${parent.id}.jpg`;
    },
    postedBy: (parent: Photo) => {
      return users.find((u) => u.githubLogin === parent.githubUser);
    },
    taggedUsers: (parent: Photo) => {
      return tags.filter((tag) => tag.photoID === String(parent.id)).map((
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
      ) => photos.find((p) => String(p.id) === photoID));
    },
  },
  Query: {
    me: (_p, _a, { currentUser }) => currentUser,
    totalPhotos: async () => {
      const { data, errors } = await fetchAllPhotos();
      if (errors) {
        console.log(errors);
        return 0;
      }
      const { edges } = data.photosCollection;
      return edges.length;
    },
    allPhotos: async () => {
      const { data, errors } = await fetchAllPhotos();
      if (errors) {
        console.log(errors);
        return [];
      }
      const { edges } = data.photosCollection;
      const photoList: Photo[] = edges.map(({ node }) => {
        const { github_user, ...other } = node;
        return {
          ...other,
          githubUser: github_user,
        };
      });
      return photoList;
    },
    totalUsers: async () => {
      const { data, errors } = await fetchAllUsers();
      if (errors) {
        console.log(errors);
        return 0;
      }
      const { edges } = data.usersCollection;
      return edges.length;
    },
    allUsers: async () => {
      const { data, errors } = await fetchAllUsers();
      if (errors) {
        console.log(errors);
        return [];
      }
      const userList: User[] = data.usersCollection.edges.map((
        { node },
      ) => ({
        githubLogin: node.github_login,
        githubToken: node.github_token,
        name: node.name,
        avatar: null,
      }));
      return userList;
    },
  },
  Mutation,
  DateTime: new GraphQLScalarType({
    name: "DateTime",
    description: "A valid date time value.",
    parseValue: (value: string) => new Date(value),
    serialize: (value: string) => new Date(value).toISOString(),
    parseLiteral: (ast: { value: string }) => ast.value,
  }),
};
