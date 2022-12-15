import { Ctx } from "../types.ts";
import { findUserByToken } from "../lib/query.ts";

type ContextProps = {
  request: {
    headers: {
      get: (key: string) => string;
    };
  };
};
type Context = (ctx: ContextProps) => Promise<Ctx>;

export const context: Context = async ({ request }) => {
  const githubToken = request.headers.get("authorization");
  const currentUser = await findUserByToken(githubToken);
  return {
    currentUser,
  };
};
