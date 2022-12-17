import { Application, applyGraphQL, oakCors, Router } from "./deps.ts";

import { resolvers } from "./graphql/resolvers.ts";
import { context } from "./graphql/context.ts";

const typeDefs = await Deno.readTextFile("./graphql/typeDefs.graphql");

const app = new Application();

// app.use(async (ctx, next) => {
//   await next();
//   const rt = ctx.response.headers.get("X-Response-Time");
//   console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
// });
// app.use(async (ctx, next) => {
//   const start = Date.now();
//   await next();
//   const ms = Date.now() - start;
//   ctx.response.headers.set("X-Response-Time", `${ms}ms`);
// });

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

app.use(
  router.routes(),
  GraphQLService.routes(),
  GraphQLService.allowedMethods(),
);

app.use(
  oakCors({
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
  }),
);

console.log("Server start at http://localhost:4000");
await app.listen({ port: 4000 });
