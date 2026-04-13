"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentMessage = void 0;
const prisma_1 = require("../../lib/prisma");
const getRecentMessage = async (req, res) => {
    try {
        const message = await prisma_1.prisma.message.findFirst({
            orderBy: { createdAt: 'desc' }
        });
        if (!message) {
            res.status(404).json({ message: 'No messages found.' });
            return;
        }
        res.status(200).json({ data: message });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getRecentMessage = getRecentMessage;
