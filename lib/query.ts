import { Response, User, UserRecord } from "../types.ts";
import { convertRecordToUser } from "../utils.ts";
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
): Promise<User | null> => {
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
  if (errors || data.usersCollection.edges.length !== 1) {
    console.error(errors);
    return null;
  }
  const [userEdge] = data.usersCollection.edges;
  return convertRecordToUser(userEdge.node);
};

export const findUserByLogin = async (login: string): Promise<User | null> => {
  const { data, errors } = await postWithHeaders<FindUserResponse>({
    query: findUserQuery,
    variables: {
      filter: {
        github_login: {
          eq: login,
        },
      },
    },
  });
  if (errors) {
    console.error(errors);
    return null;
  }
  const [edge] = data.usersCollection.edges;
  return convertRecordToUser(edge.node);
};
