"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResources = void 0;
const prisma_1 = require("../../lib/prisma");
const node_cache_1 = __importDefault(require("node-cache"));
const myCache = new node_cache_1.default({ stdTTL: 300 }); // Cache for 5 minutes
const getResources = async (req, res) => {
    /* #swagger.tags = ['Public API']
       #swagger.summary = 'Fetch paginated messages'
       #swagger.parameters['page'] = { description: 'Page number (default: 1)', type: 'integer' }
       #swagger.parameters['limit'] = { description: 'Items per page (default: 10)', type: 'integer' }
       #swagger.responses[200] = {
         description: 'Successfully fetched paginated messages',
         schema: {
           data: [{
             id: "uuid",
             title: "Message Title",
             messageThumbnail: "https://sepcam.blob.core.windows.net/...jpg",
             audioFile: "https://sepcam.blob.core.windows.net/...mp3",
             pdfFile: "https://sepcam.blob.core.windows.net/...pdf",
             createdAt: "2026-05-09T00:00:00.000Z",
             updatedAt: "2026-05-09T00:00:00.000Z"
           }],
           meta: { total: 100, page: 1, limit: 10 }
         }
       }
       #swagger.responses[500] = { description: 'Server Error' }
    */
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const cacheKey = `resources_page_${page}_limit_${limit}`;
        const cachedResponse = myCache.get(cacheKey);
        if (cachedResponse) {
            res.status(200).json(cachedResponse);
            return;
        }
        const [messages, total] = await Promise.all([
            prisma_1.prisma.message.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma_1.prisma.message.count()
        ]);
        const accountMatch = (process.env.AZURE_STORAGE_CONNECTION_STRING || '').match(/AccountName=([^;]+)/);
        const accountName = accountMatch ? accountMatch[1] : 'sepcamwebadmin001';
        const audioContainer = process.env.AZURE_AUDIO_CONTAINER || 'audios';
        const pdfContainer = process.env.AZURE_PDF_CONTAINER || 'pdfs';
        const imageContainer = process.env.AZURE_IMAGE_CONTAINER || 'images';
        const messagesWithLinks = messages.map((message) => {
            const audioFileLink = message.audioFile ? `https://${accountName}.blob.core.windows.net/${audioContainer}/${message.audioFile}` : '';
            const pdfFileLink = message.pdfFile ? `https://${accountName}.blob.core.windows.net/${pdfContainer}/${message.pdfFile}` : '';
            const messageThumbnailLink = message.messageThumbnail ? `https://${accountName}.blob.core.windows.net/${imageContainer}/${message.messageThumbnail}` : '';
            return {
                ...message,
                audioFileLink,
                pdfFileLink,
                messageThumbnailLink
            };
        });
        const responsePayload = {
            data: messagesWithLinks,
            meta: {
                total,
                page,
                limit
            }
        };
        myCache.set(cacheKey, responsePayload);
        res.status(200).json(responsePayload);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getResources = getResources;
