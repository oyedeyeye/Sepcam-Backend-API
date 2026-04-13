"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMessage = void 0;
const prisma_1 = require("../../lib/prisma");
const updateMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updated = await prisma_1.prisma.message.update({
            where: { id: id },
            data: updateData
        });
        res.status(200).json({ message: 'Updated successfully', data: updated });
    }
    catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: 'Message not found for update' });
            return;
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.updateMessage = updateMessage;
