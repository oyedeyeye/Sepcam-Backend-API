"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = void 0;
const prisma_1 = require("../../lib/prisma");
const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        // TODO: Depending on the requirements, we should optionally delete the tied Azure Blobs.
        await prisma_1.prisma.message.delete({
            where: { id: id }
        });
        res.status(204).send();
    }
    catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: 'Message not found for deletion' });
            return;
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.deleteMessage = deleteMessage;
