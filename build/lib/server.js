"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const logger_1 = __importDefault(require("./logger"));
/**
 * Express configuration.
 */
exports.createServer = () => {
    const server = express_1.default();
    server.set('host', config_1.default.host);
    server.set('port', config_1.default.port);
    server.set('trust proxy', config_1.default.trusted_proxy);
    server.set('x-powered-by', false);
    server.use(body_parser_1.default.urlencoded({ limit: '1mb', extended: true }));
    server.use(body_parser_1.default.json({ limit: '1mb' }));
    server.set('view engine', 'ejs');
    server.set('views', path_1.default.join(__dirname, '../../public'));
    server.use(express_1.default.static(path_1.default.join(__dirname, '../../public')));
    return server;
};
/**
 * Error handler.
 */
exports.errorHandler = () => {
    return (err, req, res, next) => {
        let status = 500;
        let message = 'Something went wrong.';
        if (res.headersSent) {
            return next(err);
        }
        if (err.name === 'ValidationError') {
            res.status(400).json({ message: err.message });
            return;
        }
        logger_1.default.error('Exception Handler', { path: req.path, err, stack: err.stack });
        if (config_1.default.env === 'production') {
            res.status(status).json({ message });
            return;
        }
        if (err.name === 'MongoError') {
            status = 400;
            message = err.message;
        }
        res.status(status).json({ message });
    };
};
/**
 * Register shutdown signals.
 */
exports.registerShutdownSignals = (app) => {
    process.once('SIGTERM', gracefulExit(app));
    process.once('SIGINT', gracefulExit(app));
};
/**
 * Close application gracefuly.
 */
function gracefulExit(app) {
    return async (signal) => {
        logger_1.default.info(signal + ' signal received.');
        // Any actions like disconnect database or processes
        // Stop listening to requests, Close application
        if (app) {
            app.close(() => {
                logger_1.default.info('Closed out remaining connections');
                process.kill(process.pid, signal);
            });
        }
        else {
            process.kill(process.pid, signal);
        }
    };
}
