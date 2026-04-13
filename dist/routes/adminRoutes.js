"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const uploadMessage_1 = require("../controllers/admin/uploadMessage");
const updateMessage_1 = require("../controllers/admin/updateMessage");
const deleteMessage_1 = require("../controllers/admin/deleteMessage");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: '/tmp/uploads/' });
// Base protection against unauthenticated access
router.use(auth_1.authenticateRequest);
router.post('/upload', upload.fields([
    { name: 'messageThumbnail', maxCount: 1 },
    { name: 'audioFile', maxCount: 1 },
    { name: 'pdfFile', maxCount: 1 }
]), uploadMessage_1.uploadMessage);
router.put('/update/:id', updateMessage_1.updateMessage);
router.delete('/delete/:id', deleteMessage_1.deleteMessage);
exports.default = router;
