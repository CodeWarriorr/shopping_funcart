"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const service = __importStar(require("./service"));
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
exports.get = async (req, res, next) => {
    const data = service.getCart();
    res.status(200).json({ message: 'success', data });
};
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
exports.create = async (req, res) => {
    service.createNewCart();
    res.status(200).json({ message: 'success' });
};
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
exports.add = async (req, res) => {
    const { productId, quantity } = req.body;
    service.addToCart(productId, quantity);
    res.status(200).json({ message: 'success' });
};
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
exports.remove = async (req, res) => {
    const { productId, quantity } = req.body;
    service.removeFromCart(productId, quantity);
    res.status(200).json({ message: 'success' });
};
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
exports.checkout = async (req, res) => {
    const { currency } = req.body;
    const data = await service.summary(currency);
    res.status(200).json({ message: 'success', data });
};
