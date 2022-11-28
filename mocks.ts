import type { Photo, Tag, User } from "./types.ts";

export const users: User[] = [
  {
    githubLogin: "rTsukatsuki",
    name: "Rio Tsukatsuki",
    postedPhotos: [],
  },
  {
    githubLogin: "hAkeboshi",
    name: "Himari Akeboshi",
    postedPhotos: [],
  },
  {
    githubLogin: "nUshio",
    name: "Noa Ushio",
    postedPhotos: [],
  },
  {
    githubLogin: "yHayase",
    name: "Yuuka Hayase",
    postedPhotos: [],
  },
];

export const photos: Photo[] = [
  {
    id: "1",
    name: "photo/1 name",
    desciption: "photo/1 description",
    category: "PORTRAIT",
    githubUser: "hAkeboshi",
    created: "11-23-2032",
  },
  {
    id: "2",
    name: "photo/2 name",
    desciption: "photo/2 description",
    category: "SELFIE",
    githubUser: "nUshio",
    created: "11-25-2032",
  },
  {
    id: "3",
    name: "photo/3 name",
    desciption: "photo/3 description",
    category: "PORTRAIT",
    githubUser: "yHayase",
    created: "11-26-2032",
  },
];

export const tags: Tag[] = [
  { photoID: "1", userID: "rTsukatsuki" },
  { photoID: "2", userID: "yHayase" },
  { photoID: "3", userID: "nUshio" },
];
