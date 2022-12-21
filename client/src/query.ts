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
    ...userInfo
  }
}
`;
