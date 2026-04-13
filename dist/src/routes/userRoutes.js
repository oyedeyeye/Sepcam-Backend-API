"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const login_1 = require("../controllers/user/login");
const router = (0, express_1.Router)();
router.post('/login', login_1.loginUser);
exports.default = router;
