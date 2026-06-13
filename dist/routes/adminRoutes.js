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
const createEvent_1 = require("../controllers/admin/events/createEvent");
const updateEvent_1 = require("../controllers/admin/events/updateEvent");
const deleteEvent_1 = require("../controllers/admin/events/deleteEvent");
const createUser_1 = require("../controllers/admin/users/createUser");
const getUsers_1 = require("../controllers/admin/users/getUsers");
const updateUser_1 = require("../controllers/admin/users/updateUser");
const deleteUser_1 = require("../controllers/admin/users/deleteUser");
const auth_1 = require("../middlewares/auth");
const dashboard_1 = require("../controllers/admin/dashboard");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: '/tmp/uploads/' });
// Base protection against unauthenticated access
router.use(auth_1.authenticateRequest);
router.get('/dashboard', dashboard_1.getDashboardData);
router.post('/upload', upload.fields([
    { name: 'messageThumbnail', maxCount: 1 },
    { name: 'audioFile', maxCount: 1 },
    { name: 'pdfFile', maxCount: 1 }
]), uploadMessage_1.uploadMessage);
router.put('/update/:id', upload.fields([
    { name: 'messageThumbnail', maxCount: 1 },
    { name: 'audioFile', maxCount: 1 },
    { name: 'pdfFile', maxCount: 1 }
]), updateMessage_1.updateMessage);
router.delete('/delete/:id', deleteMessage_1.deleteMessage);
// Church Events Management Routes
router.post('/events', upload.single('thumbnail'), createEvent_1.createEvent);
router.put('/events/:id', upload.single('thumbnail'), updateEvent_1.updateEvent);
router.delete('/events/:id', deleteEvent_1.deleteEvent);
// Admin Users Management Routes
router.post('/users', createUser_1.createUser);
router.get('/users', getUsers_1.getUsers);
router.put('/users/:id', updateUser_1.updateUser);
router.delete('/users/:id', deleteUser_1.deleteUser);
exports.default = router;
