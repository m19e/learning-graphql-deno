import { Application, applyGraphQL, oakCors, Router } from "./deps.ts";

import { resolvers } from "./graphql/resolvers.ts";
import { context } from "./graphql/context.ts";

const typeDefs = await Deno.readTextFile("./graphql/typeDefs.graphql");

const app = new Application();

const router = new Router().get(
  "/",
  ({ response }) => response.body = "Welcome to the PhotoShare API",
);

const GraphQLService = await applyGraphQL<Router>({
  Router,
  typeDefs,
  resolvers,
  context,
});

app.use(oakCors());
app.use(
  router.routes(),
  GraphQLService.routes(),
  GraphQLService.allowedMethods(),
);

console.log(`Server start at http://localhost:4000`);
await app.listen({ port: 4000 });
