const {
  authenticate
} = require("../middleware/auth");


// =====================================================
// PUBLIC OPERATIONS
// =====================================================

const PUBLIC_OPERATIONS = new Set([
  "signup",
  "login",
]);


// =====================================================
// APOLLO AUTH PLUGIN
// =====================================================

const authPlugin = {

  async requestDidStart() {

    return {

      async didResolveOperation(
        requestContext
      ) {

        const {
          request,
          contextValue,
          document
        } = requestContext;


        // ---------------------------------------------
        // Find operation fields
        // ---------------------------------------------

        const operation =
          document.definitions.find(
            (definition) =>
              definition.kind ===
              "OperationDefinition"
          );


        if (!operation) {
          throw new Error(
            "Invalid GraphQL operation"
          );
        }


        const operationFields =
          operation.selectionSet.selections;


        // ---------------------------------------------
        // Check whether operation is public
        // ---------------------------------------------

        const isPublic =
          operationFields.some(
            (field) =>
              field.name?.value &&
              PUBLIC_OPERATIONS.has(
                field.name.value
              )
          );


        // ---------------------------------------------
        // Public operation
        // ---------------------------------------------

        if (isPublic) {

          console.log(
            "🌐 Public GraphQL operation"
          );

          return;
        }


        // ---------------------------------------------
        // Protected operation
        // ---------------------------------------------

        const user =
          authenticate(
            contextValue.req
          );


        // ---------------------------------------------
        // Store authenticated user
        // ---------------------------------------------

        contextValue.user = user;

        console.log(
          "🔐 Authenticated user:",
          user.email,
          user.role
        );
      },
    };
  },
};


module.exports = authPlugin;