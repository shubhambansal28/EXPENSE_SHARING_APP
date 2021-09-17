
const env = process.env.NODE_ENV || 'development';
let envConfig = {};
import { config } from "./development.js";

switch (env) {
    case 'development':
        envConfig = { ...config };
        break;
    // case 'staging':
    //     envConfig = { ...require('./staging.js').config };
    //     break;
    // case 'production':
    //     envConfig = { ...require('./production.js').config };
    //     break;
    default:
        envConfig = { ...config };
}

export default envConfig;
