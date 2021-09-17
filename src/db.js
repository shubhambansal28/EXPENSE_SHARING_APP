import mongoose from "mongoose";
import envConfig from "./config/index.js";
import promiseRetry from "promise-retry";
import { env } from "shelljs";
let timer = 0;

const options = {
    reconnectTries: 60,
    reconnectInterval: 1000,
    poolSize: 10,
    bufferMaxEntries: 0, // If not connected, return errors immediately rather than waiting for reconnect
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const promiseRetryOptions = {
    retries: options.reconnectTries,
    factor: 2,
    minTimeout: options.reconnectInterval,
    maxTimeout: 5000
};

mongoose.connection.on("connected", function (ref) {
    console.log(
        new Date().toLocaleString(),
        `mongo connected to ${envConfig.db.agencydb.url}`
    );
    clearTimeout(timer);
});
mongoose.connection.on("error", function (err) {
    console.error(new Date().toLocaleString(), String(err));
    reconnectMongo(err);
});
mongoose.connection.on("disconnected", function () {
    console.error(new Date().toLocaleString(), "mongo server is disconnected");
    reconnectMongo();
});

mongoose.connection.on("connecting", function () {
    console.log(new Date().toLocaleString(), "connecting mongo server...");
});

function reconnectMongo(err) {
    console.log(err);
    console.log(envConfig);
    if (
        err &&
        err.message &&
        err.message.match(/failed to connect to server .* on first connect/)
    ) {
        timer = setTimeout(function () {
            console.log(new Date().toLocaleString(), "Retrying first connect...");
            mongoose.connect(envConfig.db.agencydb.url, options).catch(err => {
                console.log(new Date().toLocaleString(), String(err));
            });
            // Why the empty catch?
            // Well, errors thrown by db.open() will also be passed to .on('error'),
            // so we can handle them there, no need to log anything in the catch here.
            // But we still need this empty catch to avoid unhandled rejections.
        }, 20 * 1000);
    } else {
        // Some other error occurred.  Log it.
        console.error(new Date(), String(err + ""));
    }
}

export const connect = () => {
    return promiseRetry((retry, nunber) => {
        return mongoose.connect(envConfig.db.agencydb.url, options).catch(retry);
    }, promiseRetryOptions);
};

// export const connect = ({ db } = envConfig) => {
//   return mongoose.connect(
//     db.viator.url,
//     {
//       user: db.viator.user,
//       pass: db.viator.pass,
//       useCreateIndex: true,
//       useNewUrlParser: true
//     }
//   );
// };
