"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardData = void 0;
const prisma_1 = require("../../lib/prisma");
const getDashboardData = async (req, res) => {
    /* #swagger.tags = ['Admin Dashboard']
       #swagger.summary = 'Fetch backwards-compatible dashboard content listing'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.responses[200] = {
         description: 'Successfully fetched dashboard content',
         schema: {
           entities: [{
             rowKey: "uuid",
             title: "Message Title",
             theme: "Theme",
             date: "2026-05-09T00:00:00.000Z"
           }]
         }
       }
       #swagger.responses[401] = { description: 'Unauthorized' }
       #swagger.responses[500] = { description: 'Server Error' }
    */
    try {
        const messages = await prisma_1.prisma.message.findMany({
            orderBy: { createdAt: 'desc' }
        });
        const entities = messages.map((message) => ({
            rowKey: message.id,
            title: message.title,
            theme: message.theme,
            date: message.createdAt
        }));
        res.status(200).json({ entities });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getDashboardData = getDashboardData;
