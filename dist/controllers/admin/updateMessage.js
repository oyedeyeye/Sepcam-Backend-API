"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMessage = void 0;
const prisma_1 = require("../../lib/prisma");
const storage_1 = require("../../services/storage");
const path_1 = __importDefault(require("path"));
const slugifyTitle = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};
const updateMessage = async (req, res) => {
    /* #swagger.tags = ['Admin Messages']
       #swagger.summary = 'Update an existing Sepcam Message'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.consumes = ['multipart/form-data']
       #swagger.parameters['id'] = { description: 'Message ID', type: 'string', in: 'path' }
       #swagger.requestBody = {
         required: false,
         content: {
           "multipart/form-data": {
             schema: {
               type: "object",
               properties: {
                 title: { type: "string" },
                 theme: { type: "string" },
                 caption: { type: "string" },
                 description: { type: "string" },
                 serviceTag: { type: "string" },
                 youtubeLink: { type: "string" },
                 preacher: { type: "string" },
                 preacherThumbnail: { type: "string" },
                 messageThumbnail: { type: "string", format: "binary" },
                 audioFile: { type: "string", format: "binary" },
                 pdfFile: { type: "string", format: "binary" }
               }
             }
           }
         }
       }
       #swagger.responses[200] = {
         description: 'Updated successfully',
         schema: {
           message: "Updated successfully",
           data: {
             id: "uuid",
             title: "Updated Title",
             messageThumbnail: "event-1778321832216.jpg",
             audioFile: "event-1778321832216.mp3",
             pdfFile: "event-1778321832216.pdf",
             createdAt: "2026-05-09T00:00:00.000Z",
             updatedAt: "2026-05-09T00:00:00.000Z"
           }
         }
       }
       #swagger.responses[401] = { description: 'Unauthorized' }
       #swagger.responses[404] = { description: 'Message not found for update' }
       #swagger.responses[500] = { description: 'Server Error' }
    */
    try {
        const { id } = req.params;
        const updateData = { ...req.body };
        const existingMessage = await prisma_1.prisma.message.findUnique({
            where: { id: id }
        });
        if (!existingMessage) {
            res.status(404).json({ message: 'Message not found for update' });
            return;
        }
        const safeTitle = slugifyTitle(updateData.title || existingMessage.title);
        const files = req.files;
        if (files && files.messageThumbnail && files.messageThumbnail[0]) {
            if (existingMessage.messageThumbnail) {
                await (0, storage_1.deleteBlobFromContainer)((0, storage_1.imageClient)(), existingMessage.messageThumbnail);
            }
            const ext = path_1.default.extname(files.messageThumbnail[0].originalname) || '.jpg';
            const imageBlobName = `${safeTitle}-${Date.now()}${ext}`;
            await (0, storage_1.uploadBlobToContainer)((0, storage_1.imageClient)(), files.messageThumbnail[0].path, imageBlobName);
            updateData.messageThumbnail = imageBlobName;
        }
        if (files && files.audioFile && files.audioFile[0]) {
            if (existingMessage.audioFile) {
                await (0, storage_1.deleteBlobFromContainer)((0, storage_1.audioClient)(), existingMessage.audioFile);
            }
            const ext = path_1.default.extname(files.audioFile[0].originalname) || '.mp3';
            const audioBlobName = `${safeTitle}-${Date.now()}${ext}`;
            await (0, storage_1.uploadBlobToContainer)((0, storage_1.audioClient)(), files.audioFile[0].path, audioBlobName);
            updateData.audioFile = audioBlobName;
        }
        if (files && files.pdfFile && files.pdfFile[0]) {
            if (existingMessage.pdfFile) {
                await (0, storage_1.deleteBlobFromContainer)((0, storage_1.pdfClient)(), existingMessage.pdfFile);
            }
            const ext = path_1.default.extname(files.pdfFile[0].originalname) || '.pdf';
            const pdfBlobName = `${safeTitle}-${Date.now()}${ext}`;
            await (0, storage_1.uploadBlobToContainer)((0, storage_1.pdfClient)(), files.pdfFile[0].path, pdfBlobName);
            updateData.pdfFile = pdfBlobName;
        }
        const updated = await prisma_1.prisma.message.update({
            where: { id: id },
            data: updateData
        });
        res.status(200).json({ message: 'Updated successfully', data: updated });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.updateMessage = updateMessage;
