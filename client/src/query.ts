export const ALL_USERS_QUERY = /* GraphQL */ `
query {
  totalUsers
  allUsers {
    ...userInfo
  }
  me {
      ...userInfo
  }
}

fragment userInfo on User {
  githubLogin
  name
  avatar
}
`;

export const ADD_FAKE_USERS_MUTATION = /* GraphQL */ `
mutation($count: Int!) {
  addFakeUsers(count: $count) {
    githubLogin
    name
    avatar
  }
}
`;

export const GITHUB_AUTH_MUTATION = /* GraphQL */ `
mutation githubAuth($code: String!) {
  githubAuth(code: $code) {
    token
  }
}
`;
