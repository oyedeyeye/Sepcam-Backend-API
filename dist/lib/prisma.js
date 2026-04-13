"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const adapter_mariadb_1 = require("@prisma/adapter-mariadb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let adapter;
if (process.env.NODE_ENV !== 'test') {
    const connectionString = process.env.DATABASE_URL || "mysql://root:password@localhost:3306/sepcam_db";
    adapter = new adapter_mariadb_1.PrismaMariaDb(connectionString);
}
exports.prisma = new client_1.PrismaClient(adapter ? { adapter } : undefined);
