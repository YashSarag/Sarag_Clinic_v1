// import {
//   ApolloClient,
//   InMemoryCache,
//   HttpLink,
// } from "@apollo/client";

// const client = new ApolloClient({
//   link: new HttpLink({
//     uri: "https://sarag-clinic-v1.vercel.app/graphql",
//   }),

//   cache: new InMemoryCache({
//     typePolicies: {
//       Patient: {
//         keyFields: ["id"],
//       },

//       Record: {
//         keyFields: ["id"],
//       },
//     },
//   }),
// });

// export default client;


import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from "@apollo/client";

const httpLink = new HttpLink({
  uri:
    import.meta.env.VITE_GRAPHQL_URL ||
    "http://localhost:3000/graphql",
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;