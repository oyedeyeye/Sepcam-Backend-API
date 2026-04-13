"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMessage = void 0;
const prisma_1 = require("../../lib/prisma");
const storage_1 = require("../../services/storage");
const path_1 = __importDefault(require("path"));
const slugifyTitle = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};
const uploadMessage = async (req, res) => {
    try {
        const { theme, title, caption, description, serviceTag, youtubeLink, preacher, preacherThumbnail } = req.body;
        if (!title) {
            res.status(400).json({ message: 'Title is required for slugification.' });
            return;
        }
        const safeTitle = slugifyTitle(title);
        let audioBlobName = null;
        let pdfBlobName = null;
        let imageBlobName = null;
        const files = req.files;
        if (files && files.messageThumbnail && files.messageThumbnail[0]) {
            const ext = path_1.default.extname(files.messageThumbnail[0].originalname) || '.jpg';
            imageBlobName = `${safeTitle}${ext}`;
            await (0, storage_1.uploadBlobToContainer)((0, storage_1.imageClient)(), files.messageThumbnail[0].path, imageBlobName);
        }
        if (files && files.audioFile && files.audioFile[0]) {
            const ext = path_1.default.extname(files.audioFile[0].originalname) || '.mp3';
            audioBlobName = `${safeTitle}${ext}`;
            await (0, storage_1.uploadBlobToContainer)((0, storage_1.audioClient)(), files.audioFile[0].path, audioBlobName);
        }
        if (files && files.pdfFile && files.pdfFile[0]) {
            const ext = path_1.default.extname(files.pdfFile[0].originalname) || '.pdf';
            pdfBlobName = `${safeTitle}${ext}`;
            await (0, storage_1.uploadBlobToContainer)((0, storage_1.pdfClient)(), files.pdfFile[0].path, pdfBlobName);
        }
        const newMessage = await prisma_1.prisma.message.create({
            data: {
                title,
                theme,
                caption,
                description,
                serviceTag,
                youtubeLink,
                preacher,
                preacherThumbnail,
                messageThumbnail: imageBlobName,
                audioFile: audioBlobName,
                pdfFile: pdfBlobName
            }
        });
        res.status(201).json(newMessage);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.uploadMessage = uploadMessage;
