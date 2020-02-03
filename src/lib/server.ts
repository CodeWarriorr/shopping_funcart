
import config from '../config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { Server } from 'http';
import bodyParser, { json } from 'body-parser';
import logger from './logger';
import {RequestHandler, ErrorRequestHandler} from 'express';

/**
 * Express configuration.
 */
export const createServer = (): express.Application => {
    const server = express();

    server.set('host', config.host);
    server.set('port', config.port);
    server.set('trust proxy', config.trusted_proxy);
    server.set('x-powered-by', false);

    server.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));
    server.use(bodyParser.json({ limit: '1mb' }));
    server.set('view engine', 'ejs');
    server.set('views', path.join(__dirname, '../../public'));
    server.use(express.static(path.join(__dirname, '../../public')));

    return server;
}

/**
 * Error handler.
 */
export const errorHandler = () => {
    return (err: Error, req: express.Request, res: express.Response, next: Function): void => {

        let status = 500;
        let message = 'Something went wrong.';

        if (res.headersSent) {
            return next(err);
        }

        if (err.name === 'ValidationError') {
            res.status(400).json({message: err.message});
            return;
        }

        logger.error('Exception Handler', {path: req.path, err, stack: err.stack});

        if (config.env === 'production') {
            res.status(status).json({message});
            return;
        }

        if (err.name === 'MongoError') {
            status = 400;
            message = err.message;
        }

        res.status(status).json({message});
    }
}


/**
 * Register shutdown signals.
 */
export const registerShutdownSignals = (app: Server) => {
    process.once('SIGTERM', gracefulExit(app))
    process.once('SIGINT', gracefulExit(app))
}

/**
 * Close application gracefuly.
 */
function gracefulExit(app: Server) {
    return async (signal: string) => {
        logger.info(signal + ' signal received.')

        // Any actions like disconnect database or processes

        // Stop listening to requests, Close application
        if (app) {
            app.close(() => {
                logger.info('Closed out remaining connections');
                process.kill(process.pid, signal);
            });
        } else {
            process.kill(process.pid, signal);
        }
    }
}