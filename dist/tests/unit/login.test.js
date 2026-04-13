"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const login_1 = require("../../src/controllers/user/login");
const prisma_1 = require("../../src/lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
jest.mock('../../src/lib/prisma', () => ({
    prisma: {
        user: {
            findUnique: jest.fn()
        }
    }
}));
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
describe('Login Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should issue a token for valid credentials', async () => {
        const req = { body: { email: 'admin@test.com', password: 'password123' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        prisma_1.prisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'admin@test.com', password: 'hashedpassword', role: 'ADMIN' });
        bcrypt_1.default.compare.mockResolvedValue(true);
        jsonwebtoken_1.default.sign.mockReturnValue('valid-jwt-token');
        await (0, login_1.loginUser)(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ token: 'valid-jwt-token' });
    });
    it('should return 401 for invalid credentials', async () => {
        const req = { body: { email: 'admin@test.com', password: 'wrong' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        prisma_1.prisma.user.findUnique.mockResolvedValue(null);
        await (0, login_1.loginUser)(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
    });
});
