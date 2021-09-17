import express from "express";
import setGlobalMiddleware from "./global.js";
import { appRouter } from "./restRouter.js";
import { connect } from "./db.js";

const app = express();

setGlobalMiddleware(app);
connect();

app.use("/api", appRouter);

//app.use(apiErrorHandler);

export default app;
