"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = void 0;
const prisma_1 = require("../../../lib/prisma");
const deleteUser = async (req, res) => {
    /* #swagger.tags = ['Admin Users']
       #swagger.summary = 'Delete an administrative user'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.parameters['id'] = { description: 'User ID', type: 'string', in: 'path' }
       #swagger.responses[204] = { description: 'No Content. Successfully deleted' }
       #swagger.responses[401] = { description: 'Unauthorized' }
       #swagger.responses[404] = { description: 'User not found for deletion' }
       #swagger.responses[500] = { description: 'Server Error' }
    */
    try {
        const { id } = req.params;
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { id: id }
        });
        if (!existingUser) {
            res.status(404).json({ message: 'User not found for deletion' });
            return;
        }
        await prisma_1.prisma.user.delete({
            where: { id: id }
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.deleteUser = deleteUser;
