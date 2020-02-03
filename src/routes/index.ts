import express from 'express';
import * as HomeController from '../home/controller';
import * as CartController from '../cart/controller';

export default (app: express.Application): void => {
    // Home, documentation
    app.get('/', HomeController.home);
    app.get('/docs.json', HomeController.apiSpec);

    // Cart management
    app.get('/api/cart', CartController.get);
    app.post('/api/cart', CartController.create);
    app.put('/api/cart/add', CartController.add);
    app.put('/api/cart/remove', CartController.remove);

    // Checkout
    app.post('/api/checkout', CartController.checkout);
}