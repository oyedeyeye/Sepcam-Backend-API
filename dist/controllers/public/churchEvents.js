"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChurchEvents = void 0;
const prisma_1 = require("../../lib/prisma");
const getChurchEvents = async (req, res) => {
    try {
        const events = await prisma_1.prisma.event.findMany({
            orderBy: { date: 'asc' }
        });
        res.status(200).json({ data: events });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getChurchEvents = getChurchEvents;
