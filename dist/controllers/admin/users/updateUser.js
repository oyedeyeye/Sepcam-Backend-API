"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = void 0;
const prisma_1 = require("../../../lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const updateUser = async (req, res) => {
    /* #swagger.tags = ['Admin Users']
       #swagger.summary = 'Update an administrative user'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.parameters['id'] = { description: 'User ID', type: 'string', in: 'path' }
       #swagger.requestBody = {
         required: false,
         content: {
           "application/json": {
             schema: {
               type: "object",
               properties: {
                 email: { type: "string", example: "newadmin@sepcam.com" },
                 password: { type: "string", example: "newpassword123" },
                 role: { type: "string", example: "SUPER_ADMIN" }
               }
             }
           }
         }
       }
       #swagger.responses[200] = {
         description: 'User updated successfully',
         schema: {
           message: "User updated successfully",
           data: {
             id: "uuid",
             email: "newadmin@sepcam.com",
             role: "SUPER_ADMIN",
             createdAt: "2026-05-09T00:00:00.000Z",
             updatedAt: "2026-05-09T00:00:00.000Z"
           }
         }
       }
       #swagger.responses[401] = { description: 'Unauthorized' }
       #swagger.responses[404] = { description: 'User not found' }
       #swagger.responses[409] = { description: 'Email is already in use by another user' }
       #swagger.responses[500] = { description: 'Server Error' }
    */
    try {
        const { id } = req.params;
        const { email, password, role } = req.body;
        const existingUser = await prisma_1.prisma.user.findUnique({ where: { id: id } });
        if (!existingUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const updateData = {};
        if (email)
            updateData.email = email;
        if (role)
            updateData.role = role;
        if (password) {
            const salt = await bcrypt_1.default.genSalt(10);
            updateData.password = await bcrypt_1.default.hash(password, salt);
        }
        const updatedUser = await prisma_1.prisma.user.update({
            where: { id: id },
            data: updateData,
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });
        res.status(200).json({ message: 'User updated successfully', data: updatedUser });
    }
    catch (error) {
        if (error.code === 'P2002') {
            res.status(409).json({ message: 'Email is already in use by another user' });
            return;
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.updateUser = updateUser;
