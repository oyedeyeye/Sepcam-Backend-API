"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readMessage = void 0;
const prisma_1 = require("../../lib/prisma");
const readMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await prisma_1.prisma.message.findUnique({
            where: { id: id }
        });
        if (!message) {
            res.status(404).json({ message: 'Message not found.' });
            return;
        }
        res.status(200).json({ data: message });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.readMessage = readMessage;
