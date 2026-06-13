"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = void 0;
const prisma_1 = require("../../../lib/prisma");
const storage_1 = require("../../../services/storage");
const deleteEvent = async (req, res) => {
    /* #swagger.tags = ['Admin Events']
       #swagger.summary = 'Delete a church event'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.parameters['id'] = { description: 'Event ID', type: 'string', in: 'path' }
       #swagger.responses[204] = { description: 'No Content. Successfully deleted' }
       #swagger.responses[401] = { description: 'Unauthorized' }
       #swagger.responses[404] = { description: 'Event not found for deletion' }
       #swagger.responses[500] = { description: 'Server Error' }
    */
    try {
        const { id } = req.params;
        const existingEvent = await prisma_1.prisma.event.findUnique({
            where: { id: id }
        });
        if (!existingEvent) {
            res.status(404).json({ message: 'Event not found for deletion' });
            return;
        }
        if (existingEvent.thumbnail) {
            await (0, storage_1.deleteBlobFromContainer)((0, storage_1.imageClient)(), existingEvent.thumbnail);
        }
        await prisma_1.prisma.event.delete({
            where: { id: id }
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.deleteEvent = deleteEvent;
