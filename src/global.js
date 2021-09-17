import bodyParser from "body-parser";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import expressValidator from "express-validator";

const setGlobalMiddleware = app => {
    app.use(helmet());
    app.use(
        cors({
            methods: ["GET", "POST"],
            allowedHeaders: ["Content-Type"]
        })
    );
    app.use(compression());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(expressValidator());
};

export default setGlobalMiddleware;
