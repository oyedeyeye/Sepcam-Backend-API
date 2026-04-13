"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateRequest = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateRequest = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        res.status(401).json({ message: 'Access denied. No token provided.' });
        return;
    }
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
        res.status(401).json({ message: 'Access denied. Invalid token format.' });
        return;
    }
    try {
        const secret = process.env.JWT_SECRET || 'fallback_secret';
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
        return;
    }
};
exports.authenticateRequest = authenticateRequest;
