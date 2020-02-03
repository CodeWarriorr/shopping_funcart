
import config from '../config';
import { createLogger, format, transports } from 'winston';


const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
    ),
    defaultMeta: { service: 'shopping_cart' },
    transports: [
        new transports.File({ filename: 'shopping_cart-error.log', level: 'error' }),
        new transports.File({ filename: 'shopping_cart-combined.log' }),
    ]
});


if (config.env !== 'production') {
    logger.add(new transports.Console({
        format: format.combine(
            format.colorize(),
            format.simple()
        ),
    }));
}

export default logger;
