const express = require('express');
const router = express.Router();
const WaterLog = require('../models/WaterLog');

// SU EKLE -> URL: /api/water/add
router.post('/add', async (req, res) => {
    try {
        const { userId, amount } = req.body;
        const newLog = new WaterLog({ userId, amount: Number(amount) });
        await newLog.save();
        res.json({ message: "Added!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// GEÇMİŞİ ÇEK -> URL: /api/water/history/:userId
router.get('/history/:userId', async (req, res) => {
    try {
        const history = await WaterLog.find({ userId: req.params.userId }).sort({ date: -1 });
        res.json(history);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// SIFIRLAMA (RESET) -> URL: /api/water/reset/:userId
router.delete('/reset/:userId', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        await WaterLog.deleteMany({
            userId: req.params.userId,
            date: { $gte: today }
        });
        res.json({ message: "Today's data cleared!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;