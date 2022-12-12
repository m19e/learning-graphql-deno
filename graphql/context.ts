import { Response, User, UserRecord } from "../types.ts";
import { convertRecordToUser } from "../utils.ts";
import { postWithHeaders } from "../lib/request.ts";

type FindUserData = {
  usersCollection: {
    edges: [
      {
        node: UserRecord;
      },
    ];
  };
};
type FindUserResponse = Response<FindUserData>;
const findUserQuery = /* GraphQL */ `
  query ($filter: usersFilter) {
    usersCollection(filter: $filter) {
      edges {
        node {
          github_login
          github_token
          name
          avatar
        }
      }
    }
  }
  `;
const findUser = async (token: string): Promise<UserRecord | null> => {
  const { data, errors } = await postWithHeaders<FindUserResponse>({
    query: findUserQuery,
    variables: {
      filter: {
        github_token: {
          eq: token,
        },
      },
    },
  });
  if (errors) {
    console.error(errors);
    return null;
  }
  const [userEdge] = data.usersCollection.edges;
  return userEdge.node;
};

type ContextProps = {
  request: {
    headers: {
      get: (key: string) => string;
    };
  };
};
type Context = (ctx: ContextProps) => Promise<{ currentUser: User | null }>;
export const context: Context = async ({ request }) => {
  const githubToken = request.headers.get("authorization");
  const record = await findUser(githubToken);
  const currentUser = record ? convertRecordToUser(record) : null;
  return {
    currentUser,
  };
};
