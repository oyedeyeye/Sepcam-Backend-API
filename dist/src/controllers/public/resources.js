"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResources = void 0;
const prisma_1 = require("../../lib/prisma");
const getResources = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const [messages, total] = await Promise.all([
            prisma_1.prisma.message.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma_1.prisma.message.count()
        ]);
        res.status(200).json({
            data: messages,
            meta: {
                total,
                page,
                limit
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getResources = getResources;
