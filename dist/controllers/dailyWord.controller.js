"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDevotional = exports.updateDevotional = exports.createDevotional = exports.getTodayDevotional = void 0;
const prisma_1 = require("../lib/prisma");
// ==========================================
// PUBLIC ENDPOINTS
// ==========================================
const getTodayDevotional = async (req, res) => {
    try {
        // 1. Try to find today's devotional based on server date (without time)
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0); // normalize to midnight UTC for date comparison
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        let devotional = await prisma_1.prisma.dailyWord.findFirst({
            where: {
                date: {
                    gte: today,
                    lt: tomorrow
                }
            }
        });
        // 2. Fallback to isActive = true
        if (!devotional) {
            devotional = await prisma_1.prisma.dailyWord.findFirst({
                where: { isActive: true },
                orderBy: { date: 'desc' }
            });
        }
        // 3. 404
        if (!devotional) {
            return res.status(404).json({ message: 'No devotional found for today' });
        }
        // Remove isActive from response as per spec
        const { isActive, ...dataToReturn } = devotional;
        res.json({
            data: {
                ...dataToReturn,
                // Format date string
                date: devotional.date.toISOString().split('T')[0] // returns YYYY-MM-DD
            }
        });
    }
    catch (error) {
        console.error('Error fetching today devotional:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.getTodayDevotional = getTodayDevotional;
// ==========================================
// ADMIN ENDPOINTS
// ==========================================
const createDevotional = async (req, res) => {
    try {
        const { date, ...rest } = req.body;
        const newDevotional = await prisma_1.prisma.dailyWord.create({
            data: {
                ...rest,
                date: new Date(date)
            }
        });
        res.status(201).json({ message: 'Devotional created successfully', data: newDevotional });
    }
    catch (error) {
        console.error('Error creating devotional:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.createDevotional = createDevotional;
const updateDevotional = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, isActive, ...rest } = req.body;
        const dataToUpdate = { ...rest };
        if (date) {
            dataToUpdate.date = new Date(date);
        }
        // If setting this one to active, we deactivate all others first to ensure single active state
        if (isActive === true) {
            await prisma_1.prisma.dailyWord.updateMany({
                where: { isActive: true },
                data: { isActive: false }
            });
            dataToUpdate.isActive = true;
        }
        else if (isActive === false) {
            dataToUpdate.isActive = false;
        }
        const updatedDevotional = await prisma_1.prisma.dailyWord.update({
            where: { id: id },
            data: dataToUpdate
        });
        res.json({ message: 'Devotional updated successfully', data: updatedDevotional });
    }
    catch (error) {
        console.error('Error updating devotional:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.updateDevotional = updateDevotional;
const deleteDevotional = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.prisma.dailyWord.delete({ where: { id: id } });
        res.json({ message: 'Devotional deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting devotional:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.deleteDevotional = deleteDevotional;
