// middleware/auth.js

const jwt = require("jsonwebtoken");
const { GraphQLError } = require("graphql");


// =====================================================
// AUTHENTICATE
// =====================================================

const authenticate = (req) => {

  const token =
    req.cookies?.sarag_clinic_token;


  // ===================================================
  // NO TOKEN
  // ===================================================

  if (!token) {

    throw new GraphQLError(
      "Authentication required",
      {
        extensions: {
          code: "UNAUTHENTICATED",
        },
      }
    );
  }


  // ===================================================
  // VERIFY TOKEN
  // ===================================================

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "sarag-clinic"
    );

    return decoded;

  } catch (error) {

    console.error(
      "❌ JWT verification failed:",
      error.message
    );

    throw new GraphQLError(
      "Invalid or expired token",
      {
        extensions: {
          code: "UNAUTHENTICATED",
        },
      }
    );
  }
};


// =====================================================
// IS ADMIN
// =====================================================

const isAdmin = (user) => {

  if (!user) {

    throw new GraphQLError(
      "Authentication required",
      {
        extensions: {
          code: "UNAUTHENTICATED",
        },
      }
    );
  }


  if (user.role !== "admin") {

    throw new GraphQLError(
      "Admin access required",
      {
        extensions: {
          code: "FORBIDDEN",
        },
      }
    );
  }

  return true;
};


// =====================================================
// IS EMPLOYEE
// =====================================================

const isEmployee = (user) => {

  if (!user) {

    throw new GraphQLError(
      "Authentication required",
      {
        extensions: {
          code: "UNAUTHENTICATED",
        },
      }
    );
  }


  if (user.role !== "employee") {

    throw new GraphQLError(
      "Employee access required",
      {
        extensions: {
          code: "FORBIDDEN",
        },
      }
    );
  }

  return true;
};


// =====================================================
// IS ADMIN OR EMPLOYEE
// =====================================================

const isAdminOrEmployee = (user) => {

  if (!user) {

    throw new GraphQLError(
      "Authentication required",
      {
        extensions: {
          code: "UNAUTHENTICATED",
        },
      }
    );
  }


  if (
    user.role !== "admin" &&
    user.role !== "employee"
  ) {

    throw new GraphQLError(
      "Admin or employee access required",
      {
        extensions: {
          code: "FORBIDDEN",
        },
      }
    );
  }

  return true;
};


module.exports = {
  authenticate,
  isAdmin,
  isEmployee,
  isAdminOrEmployee,
};



// // middleware/auth.js

// const jwt = require("jsonwebtoken");
// const { GraphQLError } = require("graphql");

// // =====================================================
// // AUTHENTICATE
// // =====================================================

// const authenticate = (req) => {

//   const token =
//     req.cookies?.sarag_clinic_token;

//   // No token
//   if (!token) {
//     throw new Error(
//       "Authentication required"
//     );
//   }

//   try {

//     const decoded = jwt.verify(
//       token,
//       "sarag-clinic"
//     );

//     return decoded;

//   } catch (error) {

//     console.error(
//       "❌ JWT verification failed:",
//       error.message
//     );

//     // throw new Error(
//     //   "Invalid or expired token"
//     // );

//     throw new GraphQLError("Invalid or expired token", {
//         extensions: {
//             code: "UNAUTHENTICATED",
//         },
//     });
//   }
// };


// // =====================================================
// // IS ADMIN
// // =====================================================

// const isAdmin = (user) => {

//   if (!user) {
//     throw new Error(
//       "Authentication required"
//     );
//   }

//   if (user.role !== "admin") {
//     throw new Error(
//       "Admin access required"
//     );
//   }

//   return true;
// };


// // =====================================================
// // IS EMPLOYEE
// // =====================================================

// const isEmployee = (user) => {

//   if (!user) {
//     throw new Error(
//       "Authentication required"
//     );
//   }

//   if (user.role !== "employee") {
//     throw new Error(
//       "Employee access required"
//     );
//   }

//   return true;
// };


// // =====================================================
// // IS ADMIN OR EMPLOYEE
// // =====================================================

// const isAdminOrEmployee = (user) => {

//   if (!user) {
//     throw new Error(
//       "Authentication required"
//     );
//   }

//   if (
//     user.role !== "admin" &&
//     user.role !== "employee"
//   ) {
//     throw new Error(
//       "Admin or employee access required"
//     );
//   }

//   return true;
// };


// module.exports = {
//   authenticate,
//   isAdmin,
//   isEmployee,
//   isAdminOrEmployee,
// };