export const ALL_USERS_QUERY = /* GraphQL */ `
query {
  totalUsers
  allUsers {
    githubLogin
    name
    avatar
  }
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
