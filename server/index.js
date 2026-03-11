const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware (Veri alışverişi için gerekli)
app.use(cors());
app.use(express.json());

// Test Rotası (Tarayıcıdan kontrol etmek için)
app.get('/', (req, res) => {
    res.send('Water Intake API is running! 💧🚀');
});

// Port Ayarı
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server currently running on port ${PORT}`);
});