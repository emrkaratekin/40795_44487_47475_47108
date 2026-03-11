// server/routes/waterRoutes.js
const express = require('express');
const router = express.Router();
const WaterLog = require('../models/WaterLog');

// Su ekleme rotası
router.post('/add', async (req, res) => {
    try {
        const newLog = new WaterLog(req.body);
        await newLog.save();
        res.status(201).json(newLog);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;