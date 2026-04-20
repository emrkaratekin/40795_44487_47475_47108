import React, { useState, useEffect } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { translations } from './translations';

// Bileşenler
import WeeklyChart from './components/WeeklyChart';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';
import CalendarModal from './components/CalendarModal';
import SettingsModal from './components/SettingsModal';
import NotificationSettings from './components/NotificationSettings';
// Diğer importların hemen altına ekle:
import LanguageDropdown from './components/LanguageDropdown';
const API_BASE_URL = 'http://192.168.0.104:5000/api';
function App() {
  const [user, setUser] = useState(null);
  const [ml, setMl] = useState(0);
  const [lang, setLang] = useState('en');
  const [goal, setGoal] = useState(2000);
  const [history, setHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [darkMode, setDarkMode] = useState(false);

  // Modallar
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const t = translations[lang];

  // Karanlık Mod
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  // 🔔 BİLDİRİM MOTORU (Geliştirilmiş)
  useEffect(() => {
    let intervalId;
    if (user?.notificationsEnabled) {
      if (Notification.permission !== "granted") {
        Notification.requestPermission();
      }

      intervalId = setInterval(() => {
        if (Notification.permission === "granted") {
          new Notification(t.notifTitle, {
            body: t.notifBody,
            icon: "https://cdn-icons-png.flaticon.com/512/3105/3105807.png"
          });
        }
      }, user.notificationInterval * 60 * 60 * 1000);
    }
    return () => clearInterval(intervalId);
  }, [user?.notificationsEnabled, user?.notificationInterval, lang, t.notifTitle, t.notifBody]);

  // 🌍 YARDIMCI FONKSİYON: Tarihi yerel formatta (YYYY-MM-DD) verir
  const getLocalDateString = (date) => {
    return new Date(date).toLocaleDateString('sv-SE');
  };

  // Veri Çekme (Bug Fix: Bugünün verisini yerel tarihe göre süzer)
  const fetchHistory = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/water/history/${user.userId}`);
      setHistory(res.data);

      // BUG FIX: ISO yerine Local Date kullanıyoruz
      const todayStr = getLocalDateString(new Date());

      const totalToday = res.data
        .filter(log => getLocalDateString(log.date) === todayStr)
        .reduce((sum, log) => sum + log.amount, 0);

      setMl(totalToday);
    } catch (err) { console.error("Fetch error:", err); }
  };

  // Su Ekleme
  const addWater = async (amount) => {
    const newAmount = ml + amount;
    setMl(newAmount);

    if (newAmount >= goal && ml < goal) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }

    try {
      // Not: Backend genellikle tarihi kendi atar, 
      // ama fetchHistory yerel tarihe göre hesaplayacağı için sorun kalmaz.
      await axios.post(`${API_BASE_URL}/water/add`, { userId: user.userId, amount });
      fetchHistory();
    } catch (err) { console.error(err); }
  };

  // Profil & Bildirim Güncelleme
  const handleProfileUpdate = async (updatedData) => {
    try {
      let finalGoal = updatedData.dailyGoal;
      if (!finalGoal || finalGoal == 0) {
        finalGoal = updatedData.weight ? Math.round(updatedData.weight * 35) : 2000;
      }

      const res = await axios.post(`${API_BASE_URL}/auth/update-profile`, {
        userId: user.userId,
        ...updatedData,
        dailyGoal: finalGoal
      });

      setGoal(res.data.dailyGoal);
      setUser({ ...user, ...res.data });

      // Modalları kapatma mantığı
      if (isSettingsOpen && !updatedData.notificationsEnabled && !updatedData.notificationInterval) {
        setIsSettingsOpen(false);
      }
      if (isNotifOpen && (updatedData.notificationsEnabled !== undefined)) {
        setIsNotifOpen(false);
      }

    } catch (err) { console.error("Update error:", err); }
  };

  // ⚡ SIFIRLAMA MANTIĞI (BUG FIX)
  const handleReset = async () => {
    if (!window.confirm(t.confirmReset)) return;
    try {
      await axios.delete(`${API_BASE_URL}/water/reset/${user.userId}`);
      setMl(0);
      fetchHistory();
    } catch (err) { console.error(err); }
  };

  // Auth / Onboarding Kontrolleri
  if (!user) return <Auth API_BASE_URL={API_BASE_URL} onLogin={(d) => { setUser(d); if (!d.weight) setShowOnboarding(true); }} t={t} />;
  if (showOnboarding) return <Onboarding userId={user.userId} API_BASE_URL={API_BASE_URL} onComplete={(g) => { setGoal(g); setShowOnboarding(false); }} />;

  const percentage = Math.min((ml / goal) * 100, 100);

  return (
    <div className="min-h-screen bg-[#f0f9ff] dark:bg-slate-900 transition-colors duration-500 pt-28 pb-12 px-6 relative overflow-x-hidden text-slate-900 dark:text-white">

      {/* NAVBAR */}
      <div className="fixed top-0 left-0 right-0 h-24 bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg z-[100] flex items-center px-8 justify-between border-b border-blue-50 dark:border-slate-700">

        {/* SOL: Tema Toggle */}
        <button onClick={() => setDarkMode(!darkMode)} className="bg-white dark:bg-slate-700 p-3 rounded-2xl shadow-sm text-2xl hover:scale-110 transition-transform">
          {darkMode ? '☀️' : '🌙'}
        </button>

        {/* SAĞ: Aksiyon Butonları */}
        <div className="flex gap-3 items-center">
          {/* Yeni Dil Dropdown */}
          <LanguageDropdown currentLang={lang} onLangChange={setLang} />

          {/* Bildirim Butonu */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setIsNotifOpen(!isNotifOpen); }}
              className={`p-3 rounded-2xl shadow-sm text-2xl relative transition-all ${isNotifOpen ? 'bg-sky-100 dark:bg-sky-900 ring-2 ring-sky-500' : 'bg-white dark:bg-slate-700'}`}
            >
              🔔 {user?.notificationsEnabled && <span className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse"></span>}
            </button>

            <NotificationSettings
              user={user}
              isOpen={isNotifOpen}
              onClose={() => setIsNotifOpen(false)}
              onUpdate={handleProfileUpdate}
              t={t}
            />
          </div>

          <button onClick={() => setIsCalendarOpen(true)} className="bg-white dark:bg-slate-700 p-3 rounded-2xl shadow-sm text-2xl">📅</button>
          <button onClick={() => setIsSettingsOpen(true)} className="bg-white dark:bg-slate-700 p-3 rounded-2xl shadow-sm text-2xl">⚙️</button>
        </div>
      </div>

      {/* ANA İÇERİK */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-2 flex flex-col items-center">
          <h1 className="text-3xl font-black text-[#0369a1] dark:text-sky-400 mb-1">{t.title}</h1>
          <p className="text-[#38bdf8] dark:text-sky-300 mb-10 font-bold uppercase text-[10px] tracking-[0.4em]">Developed by Emir Karatekin</p>

          <div className="relative w-64 h-64 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full shadow-2xl border-[12px] border-white dark:border-slate-700 overflow-hidden mb-10 transition-all hover:shadow-sky-200 dark:hover:shadow-sky-900/20">
            <div className="z-10 text-center">
              <span className="text-5xl font-black text-[#0284c7] dark:text-sky-400">{ml}</span>
              <span className="text-[#7dd3fc] dark:text-sky-200/50 block font-extrabold text-xs">/ {goal} ml</span>
            </div>
            <div className="absolute bottom-0 w-full bg-[#0ea5e9] dark:bg-sky-500 transition-all duration-1000 ease-out opacity-30" style={{ height: `${percentage}%` }}></div>
          </div>

          <div className="flex gap-6 mb-12">
            {[250, 500].map(amt => (
              <button key={amt} onClick={() => addWater(amt)} className="bg-[#0284c7] dark:bg-sky-600 text-white w-24 h-24 rounded-[2rem] shadow-xl flex flex-col items-center justify-center active:scale-95 transition-all border-b-4 border-blue-900 dark:border-sky-900">
                <span className="text-3xl mb-1">{amt === 250 ? '💧' : '🌊'}</span>
                <span className="font-black text-[9px] uppercase tracking-wider">{amt === 250 ? t.cup : t.bottle}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1 w-full animate-in slide-in-from-right duration-700">
          <WeeklyChart history={history} t={t} lang={lang} />
        </div>
      </div>

      {/* Modallar */}
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        history={history}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        darkMode={darkMode}
        t={t}       // 🌍 Dil nesnesi
        lang={lang} // 🌍 Dil kodu (tr/en/pl)
      />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={user} onUpdate={handleProfileUpdate} onLogout={() => setUser(null)} t={t} />

      <div className="w-full flex justify-center mt-16 pb-10">
        <button
          onClick={handleReset}
          className="bg-red-600 hover:bg-red-700 text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-red-200 dark:shadow-none transition-all active:scale-95 uppercase tracking-[0.3em] text-xs flex items-center gap-2"
        >
          <span></span> {t.reset}
        </button>
      </div>
    </div>
  );
}

export default App;