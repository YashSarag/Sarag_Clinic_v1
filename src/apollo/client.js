import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:3000/graphql",
  }),

  cache: new InMemoryCache({
    typePolicies: {
      Patient: {
        keyFields: ["id"],
      },

      Record: {
        keyFields: ["id"],
      },
    },
  }),
});

export default client;