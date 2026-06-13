"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calendarEvents = void 0;
const googleapis_1 = require("googleapis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const CAL_ID = process.env.CAL_ID || '';
const CAL_API = process.env.CAL_API || '';
const calendarEvents = async (NO_OF_EVENTS = 3) => {
    if (!CAL_ID || !CAL_API) {
        console.error('Google Calendar credentials not configured in environment.');
        return [];
    }
    const calendar = googleapis_1.google.calendar({ version: 'v3', auth: CAL_API });
    try {
        const result = await calendar.events.list({
            calendarId: CAL_ID,
            timeMin: new Date().toISOString(),
            maxResults: NO_OF_EVENTS,
            singleEvents: true,
            orderBy: 'startTime',
        });
        return result.data.items || [];
    }
    catch (error) {
        console.error('Error retrieving Google Calendar events:', error.message);
        return [];
    }
};
exports.calendarEvents = calendarEvents;
