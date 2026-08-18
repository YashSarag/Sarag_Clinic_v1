// import {
//   ApolloClient,
//   InMemoryCache,
//   HttpLink,
// } from "@apollo/client";

// const client = new ApolloClient({
//   link: new HttpLink({
//     uri: "http://localhost:3000/graphql",
//     credentials: "include",
//   }),

//   cache: new InMemoryCache(),
// });

// export default client;



import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  CombinedGraphQLErrors,
} from "@apollo/client";

import { onError } from "@apollo/client/link/error";

import { store } from "./redux/store";
import { logout } from "./redux/authSlice";


// =====================================================
// HTTP LINK
// =====================================================

const httpLink = new HttpLink({

  uri: "http://localhost:3000/graphql",

  credentials: "include",

});


// =====================================================
// AUTH ERROR LINK
// =====================================================

let isLoggingOut = false;

const authErrorLink = onError(({ error }) => {

  console.log("🔴 APOLLO ERROR:", error);


  // ===================================================
  // GRAPHQL ERRORS
  // ===================================================

  if (CombinedGraphQLErrors.is(error)) {

    console.log(
      "🔴 GRAPHQL ERRORS:",
      error.errors
    );


    for (const graphQLError of error.errors) {

      console.log(
        "GraphQL error message:",
        graphQLError.message
      );

      console.log(
        "GraphQL error code:",
        graphQLError.extensions?.code
      );


      // ===============================================
      // TOKEN EXPIRED / INVALID / MISSING
      // ===============================================

      if (
        graphQLError.extensions?.code ===
        "UNAUTHENTICATED"
      ) {

        console.log(
          "🔐 TOKEN EXPIRED / INVALID"
        );


        if (isLoggingOut) {
          return;
        }

        isLoggingOut = true;


        // =============================================
        // CLEAR REDUX
        // =============================================

        console.log(
          "🚪 Logging out..."
        );

        store.dispatch(logout());


        // =============================================
        // REDIRECT
        // =============================================

        window.location.replace(
          "/login"
        );


        return;
      }
    }
  }
});


// =====================================================
// APOLLO CLIENT
// =====================================================

const client = new ApolloClient({

  link: from([
    authErrorLink,
    httpLink,
  ]),

  cache: new InMemoryCache(),

});

export default client;