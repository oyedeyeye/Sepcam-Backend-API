"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitContactForm = void 0;
const email_service_1 = __importDefault(require("../services/email.service"));
const submitContactForm = async (req, res) => {
    try {
        const { name, email, phone, message, bot_check } = req.body;
        // 1. Anti-Spam: Honeypot Check
        // If the bot_check hidden field is filled, silently reject it as spam
        if (bot_check && bot_check.length > 0) {
            console.warn(`Spam detected via honeypot. Name: ${name}, Email: ${email}`);
            // Return 200 OK so bots think it succeeded and don't try harder
            return res.status(200).json({ success: true, message: 'Message sent successfully.' });
        }
        // 2. Validation: Required fields
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'Name, email, and message are required fields.' });
        }
        // 3. Validation: Email Format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email format.' });
        }
        // 4. Anti-Spam: Basic Content Filtering (excessive URLs or specific keywords)
        const urlCount = (message.match(/https?:\/\//g) || []).length;
        if (urlCount > 3) {
            console.warn(`Spam detected via URL count. Email: ${email}`);
            return res.status(200).json({ success: true, message: 'Message sent successfully.' }); // Silent drop
        }
        const spamKeywords = ['seo', 'cryptocurrency', 'bitcoin', 'investment', 'casino', 'viagra'];
        const lowerMessage = message.toLowerCase();
        const isSpam = spamKeywords.some((keyword) => lowerMessage.includes(keyword));
        if (isSpam) {
            console.warn(`Spam detected via keywords. Email: ${email}`);
            return res.status(200).json({ success: true, message: 'Message sent successfully.' }); // Silent drop
        }
        // 5. Send Email
        await email_service_1.default.sendContactEmail({
            name,
            email,
            phone: phone || '',
            message
        });
        return res.status(200).json({ success: true, message: 'Your message has been sent successfully!' });
    }
    catch (error) {
        console.error('Contact Form Submission Error:', error);
        return res.status(500).json({ success: false, message: 'An internal error occurred while sending your message. Please try again later.' });
    }
};
exports.submitContactForm = submitContactForm;
