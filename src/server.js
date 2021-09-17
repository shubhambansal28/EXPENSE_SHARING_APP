import mongoose from "mongoose";
import "dotenv/config";


import app from "./index.js";


const port = process.env.PORT;
console.log(port);

// for uncaught promise rejection
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at: ", reason.stack || reason);
    errorLogger.error(ex);
    //throw ex;
});

import http from "http";

const server = http.createServer(app);

server.listen(port, () => {
    // morganLogger.info(`Listening on port ${port}...`);
    console.info(`Listening on port ${port}...`);
});

process.on("SIGINT", () => {
    console.log("SIGINT signal received.");
    server.close(function (err) {
        if (err) {
            console.log(1111);
            console.error(err);
            //errorLogger.error(ex);
            process.exit(1);
        }
        mongoose.connection.close(function () {
            console.log("Mongoose connection disconnected.");
            process.exit(0);
        });
    });
});