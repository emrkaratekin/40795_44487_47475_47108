const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// KAYIT OL -> URL: /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ error: "Username exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "Success" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// GİRİŞ YAP -> URL: /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" }); // 401 Hatası buradan gelir
        }
        res.json({
            userId: user._id,
            username: user.username,
            dailyGoal: user.dailyGoal,
            weight: user.weight,
            notificationsEnabled: user.notificationsEnabled,
            notificationInterval: user.notificationInterval
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// PROFİL GÜNCELLEME -> URL: /api/auth/update-profile
router.post('/update-profile', async (req, res) => {
    try {
        const { userId, weight, dailyGoal, notificationsEnabled, notificationInterval, username, gender, height } = req.body;

        let finalGoal = dailyGoal;
        if (!finalGoal || finalGoal == 0) {
            finalGoal = weight ? Math.round(weight * 35) : 2000;
        }

        const updated = await User.findByIdAndUpdate(
            userId,
            { weight, dailyGoal: finalGoal, notificationsEnabled, notificationInterval, username, gender, height },
            { returnDocument: 'after' } // Uyarıyı kesen modern yöntem
        );
        res.json(updated);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;