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

const app = express();

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
});

// =====================================================
// INITIALIZE APOLLO
// =====================================================

let apolloStarted = false;

const initializeApollo = async () => {
  if (!apolloStarted) {
    await server.start();
    apolloStarted = true;
  }
};

// =====================================================
// CORS
// =====================================================

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without origin
    // e.g. Postman/server-side requests
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(
      new Error("Not allowed by CORS")
    );
  },

  credentials: true,
};

// =====================================================
// GRAPHQL
// =====================================================

app.use(
  "/graphql",

  cors(corsOptions),

  express.json(),

  async (req, res, next) => {
    try {
      await ensureDBConnection();
      await initializeApollo();

      return expressMiddleware(server)(
        req,
        res,
        next
      );
    } catch (error) {
      console.error(
        "GraphQL initialization error:",
        error
      );

      next(error);
    }
  }
);

// =====================================================
// SSE REALTIME EVENTS
// =====================================================
//
// NOTE:
// This endpoint works in a traditional Node server.
// On Vercel, persistent SSE connections have serverless
// execution/lifetime constraints, and the in-memory
// EventEmitter is not a reliable cross-instance event bus.
//
// We are keeping the endpoint for now so the frontend
// doesn't break, but we'll redesign realtime separately.
// =====================================================

app.get(
  "/events",

  cors(corsOptions),

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
            "SSE write error:",
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
          type: "INITIAL_STATS",

          entity: "dashboard",

          action: "initial",

          data: {
            dashboardStats,
          },
        });
      } catch (error) {
        console.error(
          "Failed to get initial stats:",
          error
        );
      }

      // -----------------------------------------------
      // HEARTBEAT
      // -----------------------------------------------

      const heartbeat =
        setInterval(() => {
          if (!res.writableEnded) {
            res.write(
              ": heartbeat\n\n"
            );
          }
        }, 30000);

      // -----------------------------------------------
      // DISCONNECT
      // -----------------------------------------------

      req.on("close", () => {
        console.log(
          "🔌 SSE client disconnected"
        );

        clearInterval(heartbeat);

        eventBus.off(
          "clinic-update",
          sendEvent
        );

        if (!res.writableEnded) {
          res.end();
        }
      });
    } catch (error) {
      console.error(
        "SSE error:",
        error
      );

      if (!res.headersSent) {
        res.status(500).json({
          error: "SSE connection failed",
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
  async (req, res) => {
    res.json({
      success: true,
      message: "Sarag Clinic API is running",
    });
  }
);

// =====================================================
// ERROR HANDLER
// =====================================================

app.use(
  (error, req, res, next) => {
    console.error(
      "Unhandled server error:",
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
// LOCAL DEVELOPMENT
// =====================================================

if (require.main === module) {
  const PORT =
    process.env.PORT || 3000;

  const startLocalServer = async () => {
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
        "Failed to start server:",
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