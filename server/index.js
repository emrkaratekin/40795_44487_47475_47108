const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const waterRoutes = require('./routes/waterRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Bağlantısı
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ DB Connection Error:', err));

// API Rotaları - STANDARTLAŞTIRILDI
app.use('/api/auth', authRoutes);   // Kayıt, Giriş, Profil Güncelleme burada
app.use('/api/water', waterRoutes); // Su ekleme, Geçmiş, Reset burada

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is UP on port ${PORT}`);
});