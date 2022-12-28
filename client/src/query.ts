export const ALL_USERS_QUERY = /* GraphQL */ `
query users {
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
mutation fakeUsers($count: Int!) {
  addFakeUsers(count: $count) {
    githubLogin
    name
    avatar
  }
}
`;

export const GITHUB_AUTH_MUTATION = /* GraphQL */ `
mutation auth($code: String!) {
  githubAuth(code: $code) {
    token
  }
}
`;
