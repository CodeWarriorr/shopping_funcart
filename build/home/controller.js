"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const spec = swagger_jsdoc_1.default({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Shopping Cart API docs',
            version: config_1.default.version,
        },
    },
    apis: [
        '**/controller.ts',
    ],
});
exports.home = (req, res) => res.render('index');
exports.apiSpec = (req, res) => {
    res.status(200).json(spec);
};
