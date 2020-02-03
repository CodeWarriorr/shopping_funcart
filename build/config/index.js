"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
dotenv_1.config({ path: '.env' });
exports.default = {
    version: process.env.API_VERSION || '1.0.0.',
    env: process.env.NODE_ENV || 'production',
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 8981,
    trusted_proxy: process.env.TRUSTED_PROXY || true,
    mongo_uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/shopping_cart',
};
