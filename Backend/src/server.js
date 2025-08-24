import express from "express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { functions, inngest } from "./config/inngest.js";
import { serve } from "inngest/express";

const app = express();

app.use(clerkMiddleware());

app.use(express.json());
// Set up the "/api/inngest" (recommended) routes with the serve handler
app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/", (req, res) => {
  res.send("hello");
});

const startServer = async () => {
  try {
    await connectDB();
    if (ENV.NODE_ENV !== "production") {
      app.listen(ENV.PORT, () => {
        console.log(`Server started on port ${ENV.PORT}`);
      });
    }
  } catch (error) {
    console.error("Error starting the server", error);
    process.exit(1);
  }
};

startServer();

export default app;
