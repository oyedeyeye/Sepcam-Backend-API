"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentMessage = void 0;
const prisma_1 = require("../../lib/prisma");
const getRecentMessage = async (req, res) => {
    /* #swagger.tags = ['Public API']
       #swagger.summary = 'Fetch the most recent message'
       #swagger.responses[200] = {
         description: 'Most recent message',
         schema: {
           data: {
             id: "uuid",
             title: "Message Title",
             messageThumbnail: "https://sepcam.blob.core.windows.net/...jpg",
             audioFile: "https://sepcam.blob.core.windows.net/...mp3",
             pdfFile: "https://sepcam.blob.core.windows.net/...pdf",
             createdAt: "2026-05-09T00:00:00.000Z",
             updatedAt: "2026-05-09T00:00:00.000Z"
           }
         }
       }
       #swagger.responses[404] = { description: 'No messages found' }
       #swagger.responses[500] = { description: 'Server Error' }
    */
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
