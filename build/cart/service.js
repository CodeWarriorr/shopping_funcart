"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Product = __importStar(require("./products"));
const axios_1 = __importDefault(require("axios"));
const decimal_js_1 = require("decimal.js");
const error_1 = require("../lib/error");
// Init memory cart storage
const cart = {
    currency: 'EUR',
    products: [],
};
exports.createNewCart = () => cart.products = [];
const dereferenceProduct = (product) => JSON.parse(JSON.stringify(product));
exports.getCart = () => cart.products.map((quantity, productId) => {
    let product = Product.findById(productId);
    if (product) {
        product = dereferenceProduct(product);
        product.quantity = quantity;
        return product;
    }
}).filter(ele => ele);
exports.addToCart = (productId, quantity) => {
    if (false == /^\d$/.test(String(productId))) {
        throw new error_1.ValidationError('Invalid product id');
    }
    const product = Product.findById(productId);
    if (!product) {
        throw new error_1.ValidationError('Product not found');
    }
    if (false == /^\d{1,5}$/.test(String(productId))) {
        throw new error_1.ValidationError('Invalid quantity');
    }
    if (product.quantity < quantity) {
        throw new error_1.ValidationError('Not enought product in stock');
    }
    if (!cart.products[productId]) {
        cart.products[productId] = quantity;
        return;
    }
    quantity = cart.products[productId] + quantity;
    if (product.quantity < quantity) {
        throw new error_1.ValidationError('Not enought product in stock');
    }
    cart.products[productId] = quantity;
};
exports.removeFromCart = (productId, quantity) => {
    if (false == /^\d$/.test(String(productId))) {
        throw new error_1.ValidationError('Invalid product id');
    }
    const product = Product.findById(productId);
    if (!product) {
        throw new error_1.ValidationError('Product not found');
    }
    if (!cart.products[productId]) {
        return;
    }
    if (!quantity) {
        delete cart.products[productId];
        return;
    }
    cart.products[productId] -= quantity;
    if (cart.products[productId] <= 0) {
        delete cart.products[productId];
        return;
    }
};
const getCurrencyRates = async (currency) => {
    if (!currency) {
        return {
            curr: cart.currency,
            rate: new decimal_js_1.Decimal(1),
        };
    }
    if (false == /^[A-Za-z]{3,3}$/.test(String(currency))) {
        throw new error_1.ValidationError('Invalid currency');
    }
    const response = await axios_1.default.get('https://api.exchangeratesapi.io/latest');
    const rates = response.data.rates;
    // const rate = response?.data?.rates?.[currency];
    if (!rates[currency.toUpperCase()]) {
        return {
            curr: cart.currency,
            rate: new decimal_js_1.Decimal(1),
        };
    }
    return {
        curr: currency,
        rate: new decimal_js_1.Decimal(rates[currency.toUpperCase()]),
    };
};
exports.summary = async (currency) => {
    let { curr, rate } = await getCurrencyRates(currency);
    let sum = new decimal_js_1.Decimal(0);
    let products = exports.getCart().map(product => {
        if (!product) {
            return null;
        }
        let value = (new decimal_js_1.Decimal(product.price.value)).times(rate).toDecimalPlaces(2, decimal_js_1.Decimal.ROUND_HALF_UP);
        let quantityValue = value.times(product.quantity).toDecimalPlaces(2, decimal_js_1.Decimal.ROUND_HALF_UP);
        sum = sum.add(quantityValue);
        product.price.value = value.toString();
        product.price.currency = curr;
        product.total = {
            value: quantityValue.toString(),
            currency: curr,
        };
        return product;
    }).filter(ele => ele);
    return {
        products: products ? products : [],
        total: {
            value: sum.toDecimalPlaces(2, decimal_js_1.Decimal.ROUND_HALF_UP).toString(),
            currency: curr,
        },
    };
};
