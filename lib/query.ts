import { Response, UserRecord } from "../types.ts";
import { postWithHeaders } from "./request.ts";

// Users Collection
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

export const findUserByToken = async (
  token: string,
): Promise<UserRecord | null> => {
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
