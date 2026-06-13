"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const prisma_1 = require("../../../lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUser = async (req, res) => {
    /* #swagger.tags = ['Admin Users']
       #swagger.summary = 'Create a new administrative user'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.requestBody = {
         required: true,
         content: {
           "application/json": {
             schema: {
               type: "object",
               properties: {
                 email: { type: "string", example: "admin@sepcam.com" },
                 password: { type: "string", example: "securepassword123" },
                 role: { type: "string", example: "ADMIN" }
               },
               required: ["email", "password"]
             }
           }
         }
       }
       #swagger.responses[201] = {
         description: 'User created successfully',
         schema: {
           message: "User created successfully",
           data: {
             id: "uuid",
             email: "admin@sepcam.com",
             role: "ADMIN",
             createdAt: "2026-05-09T00:00:00.000Z",
             updatedAt: "2026-05-09T00:00:00.000Z"
           }
         }
       }
       #swagger.responses[400] = { description: 'Email and password are required' }
       #swagger.responses[401] = { description: 'Unauthorized' }
       #swagger.responses[409] = { description: 'User with this email already exists' }
       #swagger.responses[500] = { description: 'Server Error' }
    */
    try {
        const { email, password, role } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }
        const existingUser = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(409).json({ message: 'User with this email already exists' });
            return;
        }
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
        const newUser = await prisma_1.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: role || 'ADMIN'
            },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });
        res.status(201).json({ message: 'User created successfully', data: newUser });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.createUser = createUser;
