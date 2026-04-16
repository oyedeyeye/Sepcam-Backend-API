"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const doc = {
    info: {
        title: 'Sepcam API v2',
        description: 'API documentation for Sepcam V2',
    },
    host: 'localhost:5000', // Update this based on the actual host in development or production
    schemes: ['http', 'https'],
};
const outputFile = './swagger-output.json'; // Outputs to src/swagger-output.json (relative to where it runs or we should put it inside src)
const endpointsFiles = ['./app.ts'];
// Actually, ts-node src/swagger.ts runs from project root usually, so paths are relative to root.
// Let's use absolute imports or assume run from root.
const runSwagger = async () => {
    await (0, swagger_autogen_1.default)({ openapi: '3.0.0' })('./src/swagger-output.json', ['./src/app.ts'], doc);
};
runSwagger();
