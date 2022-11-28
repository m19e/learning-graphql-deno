import { createSchema, createYoga, serve } from "./deps.ts";

import { resolvers } from "./graphql/resolvers.ts";

const typeDefs = await Deno.readTextFile("./graphql/typeDefs.graphql");

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
});

serve(yoga, {
  onListen({ hostname, port }) {
    console.log(`Listening on http://${hostname}:${port}/graphql`);
  },
});
