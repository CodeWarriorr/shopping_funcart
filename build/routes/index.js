"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const HomeController = __importStar(require("../home/controller"));
const CartController = __importStar(require("../cart/controller"));
exports.default = (app) => {
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
};
