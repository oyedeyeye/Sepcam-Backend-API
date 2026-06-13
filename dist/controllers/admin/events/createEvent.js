"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEvent = void 0;
const prisma_1 = require("../../../lib/prisma");
const storage_1 = require("../../../services/storage");
const path_1 = __importDefault(require("path"));
const createEvent = async (req, res) => {
    /* #swagger.tags = ['Admin Events']
       #swagger.summary = 'Create a church event'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.consumes = ['multipart/form-data']
       #swagger.requestBody = {
         required: true,
         content: {
           "multipart/form-data": {
             schema: {
               type: "object",
               properties: {
                 title: { type: "string" },
                 description: { type: "string" },
                 date: { type: "string", format: "date-time" },
                 location: { type: "string" },
                 file: { type: "string", format: "binary" }
               },
               required: ["title", "date"]
             }
           }
         }
       }
       #swagger.responses[201] = {
         description: 'Event created successfully',
         schema: {
           message: "Event created successfully",
           data: {
             id: "uuid",
             title: "Event Title",
             description: "Event description",
             date: "2026-10-10T00:00:00.000Z",
             location: "Auditorium",
             thumbnail: "event-1778321832216.jpg",
             createdAt: "2026-05-09T00:00:00.000Z",
             updatedAt: "2026-05-09T00:00:00.000Z"
           }
         }
       }
       #swagger.responses[400] = { description: 'Title and Date are required' }
       #swagger.responses[401] = { description: 'Unauthorized' }
       #swagger.responses[500] = { description: 'Server Error' }
    */
    try {
        const { title, description, date, location } = req.body;
        if (!title || !date) {
            res.status(400).json({ message: 'Title and Date are required fields for an event.' });
            return;
        }
        let thumbnailBlobName = null;
        const file = req.file;
        if (file) {
            const safeTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            const ext = path_1.default.extname(file.originalname) || '.jpg';
            thumbnailBlobName = `${safeTitle}-${Date.now()}${ext}`;
            await (0, storage_1.uploadBlobToContainer)((0, storage_1.imageClient)(), file.path, thumbnailBlobName);
        }
        const newEvent = await prisma_1.prisma.event.create({
            data: {
                title,
                description,
                date: new Date(date),
                location,
                thumbnail: thumbnailBlobName
            }
        });
        res.status(201).json({ message: 'Event created successfully', data: newEvent });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.createEvent = createEvent;
