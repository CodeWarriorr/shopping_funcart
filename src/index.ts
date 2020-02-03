
import express from 'express';
import * as server from './lib/server';
import logger from './lib/logger';
import routes from './routes';

/**
 * Create Express server.
 */
const app = server.createServer();
// server.databaseConnect();
routes(app);


/**
 * Error Handler.
 */
app.use(server.errorHandler());
process.on('unhandledRejection', (reason, p): void => {
    logger.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason);
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