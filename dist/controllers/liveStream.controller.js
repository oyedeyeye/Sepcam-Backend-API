"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertLiveStream = exports.getLiveStreamConfig = void 0;
const prisma_1 = require("../lib/prisma");
// ==========================================
// PUBLIC ENDPOINTS
// ==========================================
const getLiveStreamConfig = async (req, res) => {
    try {
        const streamConfig = await prisma_1.prisma.liveStream.findFirst();
        if (!streamConfig) {
            return res.status(404).json({ message: 'Live stream configuration not found' });
        }
        const { id, createdAt, ...dataToReturn } = streamConfig;
        res.json({
            data: dataToReturn
        });
    }
    catch (error) {
        console.error('Error fetching live stream config:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.getLiveStreamConfig = getLiveStreamConfig;
// ==========================================
// ADMIN ENDPOINTS
// ==========================================
const upsertLiveStream = async (req, res) => {
    try {
        const { link, onGoing } = req.body;
        // Since this is a singleton, we update the first record if it exists, or create one.
        const existingConfig = await prisma_1.prisma.liveStream.findFirst();
        let streamConfig;
        if (existingConfig) {
            streamConfig = await prisma_1.prisma.liveStream.update({
                where: { id: existingConfig.id },
                data: {
                    link: link !== undefined ? link : existingConfig.link,
                    onGoing: onGoing !== undefined ? onGoing : existingConfig.onGoing
                }
            });
        }
        else {
            streamConfig = await prisma_1.prisma.liveStream.create({
                data: { link, onGoing: onGoing || false }
            });
        }
        res.json({ message: 'Live stream config updated successfully', data: streamConfig });
    }
    catch (error) {
        console.error('Error upserting live stream config:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.upsertLiveStream = upsertLiveStream;
