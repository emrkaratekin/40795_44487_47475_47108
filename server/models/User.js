const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, default: 'male' },
    age: { type: Number, default: 20 },
    height: { type: Number, default: 170 },
    weight: { type: Number, default: 70 },
    dailyGoal: { type: Number, default: 2000 },
    // 🔔 YENİ: Bildirim Ayarları
    notificationsEnabled: { type: Boolean, default: false },
    notificationInterval: { type: Number, default: 2 } // Saat cinsinden
});

module.exports = mongoose.model('User', userSchema);