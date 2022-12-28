import { createClient } from "urql";

export const client = createClient({
  url: "http://localhost:4000/graphql",
  fetchOptions: () => {
    // const token = import.meta.env.VITE_TOKEN;
    return {
      headers: {
        authorization: localStorage.getItem("token")!,
      },
    };
  },
  suspense: true,
  maskTypename: true,
});
