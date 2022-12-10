import { ky } from "../deps.ts";
import { SUPABASE_ANON_KEY } from "../env.ts";

const endpoint = "http://localhost:54321/graphql/v1";
const headers = {
  Authentication: `Bearer ${SUPABASE_ANON_KEY}`,
  apiKey: SUPABASE_ANON_KEY,
};

export const postWithHeaders = async <T>(query: string): Promise<T> => {
  return await ky.post(endpoint, {
    headers,
    json: { query },
  }).json<T>();
};
