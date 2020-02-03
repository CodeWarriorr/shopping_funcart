import config from '../config';
import swagger from 'swagger-jsdoc';
import { RequestHandler } from 'express';


const spec = swagger({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Shopping Cart API docs',
            version: config.version,
        },
    },
    apis: [
        '**/controller.ts',
    ],
});

export const home: RequestHandler = (req, res) => res.render('index');
export const apiSpec: RequestHandler = (req, res) => {
    res.status(200).json(spec);
}



