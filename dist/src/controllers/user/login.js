"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const prisma_1 = require("../../lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required.' });
            return;
        }
        const user = await prisma_1.prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials.' });
            return;
        }
        const validPassword = await bcrypt_1.default.compare(password, user.password);
        if (!validPassword) {
            res.status(401).json({ message: 'Invalid credentials.' });
            return;
        }
        const secret = process.env.JWT_SECRET || 'fallback_secret';
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, secret, { expiresIn: '1d' });
        res.status(200).json({ token });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.loginUser = loginUser;
