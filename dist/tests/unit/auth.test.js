"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../../src/middlewares/auth");
jest.mock('jsonwebtoken');
describe('Auth Middleware', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should return 401 if no Authorization header is present', () => {
        const req = { header: jest.fn().mockReturnValue(null) };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();
        (0, auth_1.authenticateRequest)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Access denied. No token provided.' });
    });
    it('should call next() if valid token is provided', () => {
        const req = { header: jest.fn().mockReturnValue('Bearer valid-token'), user: null };
        const res = {};
        const next = jest.fn();
        jsonwebtoken_1.default.verify.mockReturnValue({ id: 'user1' });
        (0, auth_1.authenticateRequest)(req, res, next);
        expect(req.user).toEqual({ id: 'user1' });
        expect(next).toHaveBeenCalled();
    });
    it('should return 400 if token is invalid', () => {
        const req = { header: jest.fn().mockReturnValue('Bearer invalid-token') };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();
        jsonwebtoken_1.default.verify.mockImplementation(() => {
            throw new Error('Invalid token');
        });
        (0, auth_1.authenticateRequest)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token.' });
    });
});
