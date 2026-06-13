"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = void 0;
const prisma_1 = require("../../lib/prisma");
const storage_1 = require("../../services/storage");
const deleteMessage = async (req, res) => {
    /* #swagger.tags = ['Admin Messages']
       #swagger.summary = 'Delete an existing Sepcam Message'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.parameters['id'] = { description: 'Message ID', type: 'string', in: 'path' }
       #swagger.responses[204] = { description: 'No Content. Successfully deleted' }
       #swagger.responses[401] = { description: 'Unauthorized' }
       #swagger.responses[404] = { description: 'Message not found for deletion' }
       #swagger.responses[500] = { description: 'Server Error' }
    */
    try {
        const { id } = req.params;
        const message = await prisma_1.prisma.message.findUnique({
            where: { id: id }
        });
        if (!message) {
            res.status(404).json({ message: 'Message not found for deletion' });
            return;
        }
        if (message.audioFile) {
            await (0, storage_1.deleteBlobFromContainer)((0, storage_1.audioClient)(), message.audioFile);
        }
        if (message.pdfFile) {
            await (0, storage_1.deleteBlobFromContainer)((0, storage_1.pdfClient)(), message.pdfFile);
        }
        if (message.messageThumbnail) {
            await (0, storage_1.deleteBlobFromContainer)((0, storage_1.imageClient)(), message.messageThumbnail);
        }
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
