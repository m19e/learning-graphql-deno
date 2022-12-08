import { GraphQLScalarType, ky } from "../deps.ts";

import type { Photo, PhotoCategory, PhotoInput, User } from "../types.ts";
import { photos, tags, users } from "../mocks.ts";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

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
    allPhotos: () => Promise<Photo[]>;
    totalUsers: () => Promise<number>;
    allUsers: () => User[] | Promise<User[]>;
  };
  Mutation: {
    postPhoto: (_: null, args: PhotoInput) => Photo;
  };
  DateTime: GraphQLScalarType;
};

const endpoint = "http://localhost:54321/graphql/v1";
const headers = {
  Authentication: `Bearer ${SUPABASE_ANON_KEY}`,
  apiKey: SUPABASE_ANON_KEY,
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

type Collection<T> = {
  edges: { node: T }[];
};

type UserNode = { id: number; name: string; github_login: string };
type UsersCollection = Collection<UserNode>;
type UsersData = {
  usersCollection: UsersCollection;
};

type PhotoNode = {
  id: number;
  name: string;
  desciption?: string;
  category: PhotoCategory;
  github_user: string;
  created: string;
};
type PhotosCollection = Collection<PhotoNode>;
type PhotosData = {
  photosCollection: PhotosCollection;
};

type ResponseError = { errors: { message: string }[]; data: undefined };
type Response<T> = {
  data: T;
  errors: undefined;
} | ResponseError;

type UsersResponse = Response<UsersData>;
const fetchAllUsers = async (): Promise<UsersResponse> => {
  return await ky.post(endpoint, {
    headers,
    json: { query: allUsersQuery },
  }).json<UsersResponse>();
};

type PhotosResponse = Response<PhotosData>;
const fetchAllPhotos = async (): Promise<PhotosResponse> => {
  return await ky.post(endpoint, {
    headers,
    json: { query: allPhotosQuery },
  }).json<PhotosResponse>();
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
    allPhotos: async () => {
      const { data, errors } = await fetchAllPhotos();
      if (errors) {
        console.log(errors);
        return [];
      }
      const { edges } = data.photosCollection;
      const photoList = edges.map(({ node }) => {
        const { id, github_user, ...other } = node;
        return {
          id: String(id),
          githubUser: github_user,
          ...other,
        };
      });
      // console.log(photoList);
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
