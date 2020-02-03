
import * as service from './service';
import { RequestHandler } from 'express';

/**
 * @swagger
 * /api/cart:
 *  get:
 *    summary: Get Cart
 *    description: Get all products and quantities in cart
 *    responses:
 *      200:
 *        description: success
 */
// export const get = async (req: express.RequestParamHandler, res: express.Response): Promise<void> => {
export const get: RequestHandler = async (req, res, next): Promise<void> => {
    const data = service.getCart();
    res.status(200).json({ message: 'success', data });
}

/**
 * @swagger
 * /api/cart:
 *  post:
 *    summary: Create new cart
 *    description: Use to reset current cart
 *    responses:
 *      200:
 *        description: success
 */
export const create: RequestHandler = async (req, res): Promise<void> => {
    service.createNewCart();
    res.status(200).json({ message: 'success' });
}

/**
 * @swagger
 * /api/cart/add:
 *  put:
 *    summary: Add products to cart
 *    description: Use to add selected product and quantity to shopping cart
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              quantity:
 *                type: number
 *                required: true
 *                example: 5
 *                description: quantity of the product
 *              productId:
 *                type: number
 *                required: true
 *                description: chosen product id
 *                example: 1
 *    responses:
 *      200:
 *        description: successful response
 *      400:
 *        description: invalid product or quantity
 */
export const add: RequestHandler = async (req, res): Promise<void> => {
    const { productId, quantity } = req.body;

    service.addToCart(productId, quantity);
    res.status(200).json({ message: 'success' });
}

/**
 * @swagger
 * /api/cart/remove:
 *  put:
 *    summary: Remove products from cart
 *    description: Use to remove selected product and quantity from shopping cart
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              quantity:
 *                type: number
 *                required: true
 *                example: 5
 *                description: quantity of the product
 *              productId:
 *                type: number
 *                required: true
 *                description: chosen product id
 *                example: 1
 *    responses:
 *      200:
 *        description: successful response
 *      400:
 *        description: invalid product or quantity
 */
export const remove: RequestHandler = async (req, res): Promise<void> => {
    const { productId, quantity } = req.body;

    service.removeFromCart(productId, quantity);
    res.status(200).json({ message: 'success' });
}

/**
 * @swagger
 * /api/checkout:
 *  post:
 *    summary: Create checkout
 *    description: Use to view overall checkout summary with desired currency
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              currency:
 *                type: string
 *                required: true
 *                description: currency symbol
 *                enum:
 *                  - PLN
 *                  - CAD
 *                  - HKD
 *                  - ISK
 *                  - PHP
 *                  - DKK
 *                  - HUF
 *                  - CZK
 *                  - AUD
 *                  - RON
 *                  - SEK
 *                  - IDR
 *                  - INR
 *                  - BRL
 *                  - RUB
 *                  - HRK
 *                  - JPY
 *                  - THB
 *                  - CHF
 *                  - SGD
 *                  - TRY
 *                  - CNY
 *                  - NOK
 *                  - NZD
 *                  - ZAR
 *                  - USD
 *                  - MXN
 *                  - ILS
 *                  - GBP
 *                  - KRW
 *                  - MYR
 *    responses:
 *      200:
 *        description: successful response
 *      400:
 *        description: invalid currency
 */
export const checkout: RequestHandler = async (req, res): Promise<void> => {
    const { currency } = req.body;

    const data = await service.summary(currency);
    res.status(200).json({ message: 'success', data });
}
