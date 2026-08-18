const express = require("express");
const cors = require("cors");

const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express5");

const dotenv = require("dotenv");

const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");

const connectDB = require("./config/db");

const eventBus = require("./events/eventBus");
const getDashboardStats = require("./utils/dashboardStats");

dotenv.config();

const {authenticate} = require("./middleware/auth");
const cookieParser = require("cookie-parser");
const authPlugin = require("./plugins/authPlugin");

const app = express();

// =====================================================
// CORS
// =====================================================

const allowedOrigins = [
  "http://localhost:5173",
  "https://sarag-clinic-v2.netlify.app",

  // Optional: current Netlify deploy preview
  "https://6a7f2af73491cbb289195d81--sarag-clinic-v2.netlify.app",

  // Environment variable
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow Postman / server-to-server requests
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("❌ CORS blocked origin:", origin);

    return callback(
      new Error("Not allowed by CORS")
    );
  },

  methods: [
    "GET",
    "POST",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],

  credentials: true,
};

// Apply CORS globally
app.use(cors(corsOptions));
app.use(cookieParser());

// =====================================================
// DATABASE CONNECTION
// =====================================================

let dbConnected = false;

const ensureDBConnection = async () => {
  if (dbConnected) {
    return;
  }

  await connectDB();

  dbConnected = true;
};


// =====================================================
// APOLLO SERVER
// =====================================================

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    authPlugin,
  ],
});


// =====================================================
// APOLLO INITIALIZATION
// =====================================================

let apolloStarted = false;

const initializeApollo = async () => {
  if (!apolloStarted) {
    await server.start();

    apolloStarted = true;

    console.log("🚀 Apollo Server initialized");
  }
};


// =====================================================
// GRAPHQL
// =====================================================

app.use(
  "/graphql",

  express.json(),

  async (req, res, next) => {

    try {

      await ensureDBConnection();

      await initializeApollo();

      return expressMiddleware(
        server,
        {
          context: async ({ req, res }) => {

            return {
              req,
              res,
              user: null,
            };
          },
        }
      )(req, res, next);

    } catch (error) {

      console.error(
        "❌ GraphQL initialization error:",
        error
      );

      next(error);
    }
  }
);


// =====================================================
// SSE REALTIME EVENTS
// =====================================================

app.get(
  "/events",

  async (req, res) => {
    try {

      await ensureDBConnection();

      console.log(
        "🔌 New SSE client connected"
      );

      // -----------------------------------------------
      // SSE HEADERS
      // -----------------------------------------------

      res.setHeader(
        "Content-Type",
        "text/event-stream"
      );

      res.setHeader(
        "Cache-Control",
        "no-cache, no-transform"
      );

      res.setHeader(
        "Connection",
        "keep-alive"
      );

      res.setHeader(
        "X-Accel-Buffering",
        "no"
      );

      // -----------------------------------------------
      // Flush headers
      // -----------------------------------------------

      if (res.flushHeaders) {
        res.flushHeaders();
      }

      // -----------------------------------------------
      // CONNECTION EVENT
      // -----------------------------------------------

      res.write(
        `event: connected\n` +
        `data: ${JSON.stringify({
          message:
            "SSE connection established",
        })}\n\n`
      );

      // -----------------------------------------------
      // SEND EVENT
      // -----------------------------------------------

      const sendEvent = (payload) => {

        if (res.writableEnded) {
          return;
        }

        try {

          res.write(
            `event: clinic-update\n` +
            `data: ${JSON.stringify(
              payload
            )}\n\n`
          );

        } catch (error) {

          console.error(
            "❌ SSE write error:",
            error
          );

        }
      };

      // -----------------------------------------------
      // SUBSCRIBE
      // -----------------------------------------------

      eventBus.on(
        "clinic-update",
        sendEvent
      );

      // -----------------------------------------------
      // INITIAL DASHBOARD STATS
      // -----------------------------------------------

      try {

        const dashboardStats =
          await getDashboardStats();

        sendEvent({

          type:
            "INITIAL_STATS",

          entity:
            "dashboard",

          action:
            "initial",

          data: {
            dashboardStats,
          },

        });

      } catch (error) {

        console.error(
          "❌ Failed to get initial stats:",
          error
        );

      }

      // -----------------------------------------------
      // HEARTBEAT
      // -----------------------------------------------

      const heartbeat =
        setInterval(() => {

          if (!res.writableEnded) {

            try {

              res.write(
                ": heartbeat\n\n"
              );

            } catch (error) {

              console.error(
                "❌ SSE heartbeat error:",
                error
              );

            }

          }

        }, 30000);

      // -----------------------------------------------
      // DISCONNECT
      // -----------------------------------------------

      req.on(
        "close",
        () => {

          console.log(
            "🔌 SSE client disconnected"
          );

          clearInterval(
            heartbeat
          );

          eventBus.off(
            "clinic-update",
            sendEvent
          );

          if (
            !res.writableEnded
          ) {
            res.end();
          }

        }
      );

    } catch (error) {

      console.error(
        "❌ SSE error:",
        error
      );

      if (!res.headersSent) {

        res.status(500).json({
          error:
            "SSE connection failed",
        });

      }
    }
  }
);


// =====================================================
// HEALTH CHECK
// =====================================================

app.get(
  "/",
  (req, res) => {

    res.json({

      success: true,

      message:
        "Sarag Clinic API is running",

    });

  }
);


// =====================================================
// ERROR HANDLER
// =====================================================

app.use(
  (error, req, res, next) => {

    console.error(
      "❌ Unhandled server error:",
      error
    );

    if (res.headersSent) {
      return next(error);
    }

    res.status(500).json({

      success: false,

      message:
        error.message ||
        "Internal server error",

    });

  }
);


// =====================================================
// LOGOUT HANDLE
// =====================================================

 
app.post(
  "/logout",
  (req, res) => {

    res.clearCookie(
      "sarag_clinic_token",
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === "production",
        sameSite:
          process.env.NODE_ENV === "production"
            ? "none"
            : "lax",
        path: "/",
      }
    );

    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  }
);


// =====================================================
// LOCAL DEVELOPMENT
// =====================================================

if (require.main === module) {

  const PORT =
    process.env.PORT || 3000;

  const startLocalServer =
    async () => {

      try {

        await ensureDBConnection();

        await initializeApollo();

        app.listen(
          PORT,
          () => {

            console.log(
              `🚀 App is listening at ${PORT}`
            );

            console.log(
              `GraphQL: http://localhost:${PORT}/graphql`
            );

            console.log(
              `SSE: http://localhost:${PORT}/events`
            );

          }
        );

      } catch (error) {

        console.error(
          "❌ Failed to start server:",
          error
        );

        process.exit(1);

      }

    };

  startLocalServer();

}


// =====================================================
// EXPORT FOR VERCEL
// =====================================================

module.exports = app;