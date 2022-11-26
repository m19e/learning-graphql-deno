import type { Photo, User } from "./types.ts";

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
  },
  {
    id: "2",
    name: "photo/2 name",
    desciption: "photo/2 description",
    category: "SELFIE",
    githubUser: "nUshio",
  },
  {
    id: "3",
    name: "photo/3 name",
    desciption: "photo/3 description",
    category: "PORTRAIT",
    githubUser: "yHayase",
  },
];
