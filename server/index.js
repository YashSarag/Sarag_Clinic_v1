const express = require("express");
const cors = require("cors");

const {
  ApolloServer,
} = require("@apollo/server");

const {
  expressMiddleware,
} = require("@as-integrations/express5");

const dotenv = require("dotenv");

const typeDefs =
  require("./graphql/schema");

const resolvers =
  require("./graphql/resolvers");

const connectDB =
  require("./config/db");

const eventBus =
  require("./events/eventBus");

const getDashboardStats =
  require("./utils/dashboardStats");

dotenv.config();

const app = express();

// =====================================================
// APOLLO SERVER
// =====================================================

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// =====================================================
// START SERVER
// =====================================================

async function startServer() {
  await server.start();

  // ===================================================
  // GRAPHQL
  // ===================================================

  app.use(
    "/graphql",

    cors({
      origin: "http://localhost:5173",
    }),

    express.json(),

    expressMiddleware(server)
  );

  // ===================================================
  // SSE REALTIME EVENTS
  // ===================================================

  app.get(
    "/events",

    cors({
      origin: "http://localhost:5173",
    }),

    async (req, res) => {

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
      // Initial connection event
      // -----------------------------------------------

      res.write(
        `event: connected\n` +
        `data: ${JSON.stringify({
          message:
            "SSE connection established",
        })}\n\n`
      );

      // -----------------------------------------------
      // Send event to client
      // -----------------------------------------------

      const sendEvent = (
        payload
      ) => {

        if (res.writableEnded) {
          return;
        }

        console.log(
          "📡 Sending event to client:",
          payload.type
        );

        res.write(
          `event: clinic-update\n` +
          `data: ${JSON.stringify(
            payload
          )}\n\n`
        );
      };

      // -----------------------------------------------
      // Subscribe
      // -----------------------------------------------

      eventBus.on(
        "clinic-update",
        sendEvent
      );

      // -----------------------------------------------
      // Send initial dashboard stats
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
          "Failed to get initial stats:",
          error
        );

      }

      // -----------------------------------------------
      // Heartbeat
      // -----------------------------------------------

      const heartbeat =
        setInterval(() => {

          if (
            !res.writableEnded
          ) {
            res.write(
              ": heartbeat\n\n"
            );
          }

        }, 30000);

      // -----------------------------------------------
      // Disconnect
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
    }
  );

  // ===================================================
  // DATABASE
  // ===================================================

  await connectDB();

  // ===================================================
  // START EXPRESS
  // ===================================================

  const PORT =
    process.env.PORT || 3000;

  app.listen(
    PORT,
    (err) => {

      if (err) {
        console.error(err);
        return;
      }

      console.log(
        `App is listening at ${PORT}`
      );

      console.log(
        `GraphQL: http://localhost:${PORT}/graphql`
      );

      console.log(
        `SSE: http://localhost:${PORT}/events`
      );
    }
  );
}

startServer();