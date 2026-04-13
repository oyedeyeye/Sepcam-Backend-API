"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchMessages = void 0;
const prisma_1 = require("../../lib/prisma");
const searchMessages = async (req, res) => {
    try {
        const keyword = req.query.keyword;
        if (!keyword) {
            res.status(400).json({ message: 'Search keyword is required.' });
            return;
        }
        const messages = await prisma_1.prisma.message.findMany({
            where: {
                title: {
                    contains: keyword
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ data: messages });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.searchMessages = searchMessages;
