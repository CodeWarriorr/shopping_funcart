"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server = __importStar(require("./lib/server"));
const logger_1 = __importDefault(require("./lib/logger"));
const routes_1 = __importDefault(require("./routes"));
/**
 * Create Express server.
 */
const app = server.createServer();
// server.databaseConnect();
routes_1.default(app);
/**
 * Error Handler.
 */
app.use(server.errorHandler());
process.on('unhandledRejection', (reason, p) => {
    logger_1.default.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});
/**
 * Start Express server.
 */
const appInstance = app.listen(app.get('port'), () => {
    console.log('App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
});
/**
 * Register graceful exit procedure.
 */
server.registerShutdownSignals(appInstance);
