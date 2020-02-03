
import * as Product from './products';
import { resolve } from 'dns';
import axios from 'axios';
import { Decimal } from 'decimal.js';
import { ValidationError } from '../lib/error';

interface Cart {
    currency: string,
    products: Array<number>,
}
type AssociativeArray<T = unknown> = {[key: string]: T | undefined} | T[];
interface CurrencyRates {
    curr: string,
    rate: Decimal,
}

// Init memory cart storage
const cart: Cart = {
    currency: 'EUR',
    products: [],
};


export const createNewCart = () => cart.products = [];


const dereferenceProduct = (product: Product.Product): Product.Product => JSON.parse(JSON.stringify(product));
export const getCart = () =>
    cart.products.map((quantity: number, productId: number) => {
        let product = Product.findById(productId);
        if (product) {
            product = dereferenceProduct(product);
            product.quantity = quantity;
            return product;
        }
    }).filter(ele => ele);



export const addToCart = (productId: number, quantity: number): void => {
    if (false == /^\d$/.test(String(productId))) {
        throw new ValidationError('Invalid product id');
    }
    const product = Product.findById(productId);
    if (!product) {
        throw new ValidationError('Product not found');
    }
    if (false == /^\d{1,5}$/.test(String(productId))) {
        throw new ValidationError('Invalid quantity');
    }
    if (product.quantity < quantity) {
        throw new ValidationError('Not enought product in stock');
    }
    if (!cart.products[productId]) {
        cart.products[productId] = quantity;
        return;
    }
    quantity = cart.products[productId] + quantity;
    if (product.quantity < quantity) {
        throw new ValidationError('Not enought product in stock');
    }
    cart.products[productId] = quantity;
}


export const removeFromCart = (productId: number, quantity?: number): void => {
    if (false == /^\d$/.test(String(productId))) {
        throw new ValidationError('Invalid product id');
    }
    const product = Product.findById(productId);
    if (!product) {
        throw new ValidationError('Product not found');
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
}


const getCurrencyRates = async (currency?: string): Promise<CurrencyRates> => {
    if (!currency) {
        return {
            curr: cart.currency,
            rate: new Decimal(1),
        }
    }
    if (false == /^[A-Za-z]{3,3}$/.test(String(currency))) {
        throw new ValidationError('Invalid currency');
    }
    const response = await axios.get('https://api.exchangeratesapi.io/latest');
    const rates = response.data.rates;
    // const rate = response?.data?.rates?.[currency];
    if (!rates[currency.toUpperCase()]) {
        return {
            curr: cart.currency,
            rate: new Decimal(1),
        }
    }
    return {
        curr: currency,
        rate: new Decimal(rates[currency.toUpperCase()]),
    }
}


export const summary = async (currency?: string) => {
    let { curr, rate } = await getCurrencyRates(currency);
    let sum = new Decimal(0);
    let products = getCart().map(product => {
        if (!product) {
            return null
        }
        let value = (new Decimal(product.price.value)).times(rate).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
        let quantityValue = value.times(product.quantity).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
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
            value: sum.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toString(),
            currency: curr,
        },
    };
}