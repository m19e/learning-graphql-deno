import type { CATEGORY } from "./consts.ts";

export type PhotoCategory = keyof typeof CATEGORY;

export type Photo = {
  id: number;
  url?: string;
  name: string;
  desciption: string | null;
  category: PhotoCategory;
  githubUser: string;
  created: string;
};

export type PhotoInput = {
  input: Photo;
};

export type User = {
  githubLogin: string;
  githubToken: string;
  name: string | null;
  avatar: string | null;
};
export type UserRecord = {
  github_login: string;
  github_token: string;
  name: string | null;
  avatar: string | null;
};

export type Tag = {
  photoID: string;
  userID: string;
};

export type AuthPayload = {
  token: string;
  user: User;
};

// Supabase

type Collection<T> = {
  edges: { node: T }[];
};

type UserNode = {
  github_login: string;
  github_token: string;
  name: string;
  avatar: string;
};
type UsersCollection = Collection<UserNode>;
type UsersData = {
  usersCollection: UsersCollection;
};

type PhotoNode = {
  id: number;
  name: string;
  desciption: string | null;
  category: PhotoCategory;
  github_user: string;
  created: string;
};
type PhotosCollection = Collection<PhotoNode>;
type PhotosData = {
  photosCollection: PhotosCollection;
};

type ResponseError = { errors: { message: string }[]; data: undefined };
export type Response<T> = {
  data: T;
  errors: undefined;
} | ResponseError;

export type UsersResponse = Response<UsersData>;
export type PhotosResponse = Response<PhotosData>;

export type Ctx = { currentUser: User | null };
