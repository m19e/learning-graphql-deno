import { Ctx } from "../types.ts";
import { findUserByToken } from "../lib/query.ts";

type ContextProps = {
  request: {
    headers: {
      get: (key: string) => string | null;
    };
  };
};
type Context = (ctx: ContextProps) => Promise<Ctx>;

export const context: Context = async ({ request }) => {
  const githubToken = request.headers.get("authorization");
  if (githubToken === null) return { currentUser: null };
  const currentUser = await findUserByToken(githubToken);
  return {
    currentUser,
  };
};
