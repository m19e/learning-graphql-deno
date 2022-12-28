export type User = {
  githubLogin: string;
  githubToken: string;
  name: string | null;
  avatar: string | null;
};

type ResponseError = { errors: { message: string }[]; data: undefined };
export type Response<T> =
  | {
    data: T;
    errors: undefined;
  }
  | ResponseError;

interface Variable {
  [key: string]: string | number | null | undefined | Variable;
}
type Variables = Record<string, Variable | Variable[] | unknown>;

export type Options = {
  query: string;
  variables?: {
    [key: string]: unknown;
  };
};
