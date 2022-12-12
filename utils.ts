import { User, UserRecord } from "./types.ts";

export const convertRecordToUser = (record: UserRecord): User => {
  const { github_login, github_token, name, avatar } = record;

  return {
    githubLogin: github_login,
    githubToken: github_token,
    name,
    avatar,
  };
};

export const convertUserToRecord = (user: User): UserRecord => {
  const { githubLogin, githubToken, name, avatar } = user;

  return {
    github_login: githubLogin,
    github_token: githubToken,
    name,
    avatar,
  };
};
