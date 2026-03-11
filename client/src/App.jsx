import React, { useState } from 'react';
import axios from 'axios';
import { translations } from './translations';

function App() {
  const [ml, setMl] = useState(0);
  const [lang, setLang] = useState('en'); // Başlangıç dili İngilizce
  const goal = 2500; // Günlük hedef 2.5 Litre

  // Seçili dile göre çevirileri getir
  const t = translations[lang];

  // Su ekleme ve Backend'e gönderme fonksiyonu
  const addWater = async (amount) => {
    setMl(prev => prev + amount);

    try {
      // NOT: 192.168.x.x kısmını kendi bilgisayarının IPv4 adresiyle güncel tut!
      await axios.post('http://192.168.0.104:5000/api/add-water', {
        amount: amount,
        userId: 'emir_40795'
      });
      console.log("Data synced with MongoDB! 🚀");
    } catch (err) {
      console.error("Database connection error:", err);
    }
  };

  const percentage = Math.min((ml / goal) * 100, 100);

  return (
    <div className="min-h-screen bg-[#f0f9ff] flex flex-col items-center justify-center p-6 font-sans relative">

      {/* SAĞ ÜST KÖŞE: Dil Seçimi (Bayrak Resimleri ile) */}
      <div className="absolute top-6 right-6 flex gap-3 bg-white/70 p-2.5 rounded-2xl backdrop-blur-md shadow-lg border border-white/50">
        <button onClick={() => setLang('tr')} className="hover:scale-125 transition-all cursor-pointer">
          <img src="https://flagcdn.com/w40/tr.png" alt="TR" className="w-7 h-5 rounded shadow-sm" />
        </button>
        <button onClick={() => setLang('en')} className="hover:scale-125 transition-all cursor-pointer">
          <img src="https://flagcdn.com/w40/gb.png" alt="EN" className="w-7 h-5 rounded shadow-sm" />
        </button>
        <button onClick={() => setLang('pl')} className="hover:scale-125 transition-all cursor-pointer">
          <img src="https://flagcdn.com/w40/pl.png" alt="PL" className="w-7 h-5 rounded shadow-sm" />
        </button>
      </div>

      {/* BAŞLIK VE ALT BAŞLIK */}
      <h1 className="text-4xl font-black text-[#0369a1] mb-2 tracking-tight">{t.title}</h1>
      <p className="text-[#38bdf8] mb-10 font-bold uppercase text-xs tracking-[0.2em]">{t.subtitle}</p>

      {/* ANA GÖSTERGE: Su Halkası */}
      <div className="relative w-72 h-72 flex items-center justify-center bg-white rounded-full shadow-[0_25px_60px_rgba(8,_112,_184,_0.15)] border-[14px] border-white overflow-hidden">
        <div className="z-10 text-center">
          <span className="text-6xl font-black text-[#0284c7] drop-shadow-sm">{ml}</span>
          <span className="text-[#7dd3fc] block font-extrabold mt-1 text-lg">/ {goal} ml</span>
        </div>

        {/* Mavi Su Doluluk Efekti */}
        <div
          className="absolute bottom-0 w-full bg-[#0ea5e9] transition-all duration-1000 ease-in-out opacity-25"
          style={{ height: `${percentage}%` }}
        ></div>
      </div>

      {/* DURUM ÇUBUĞU */}
      <div className="mt-12 bg-white/80 backdrop-blur-sm px-8 py-4 rounded-3xl shadow-sm border border-blue-50">
        <p className="text-[#0369a1] font-bold text-lg">
          {percentage >= 100 ? t.reached : `%${Math.round(percentage)} ${t.completed}`}
        </p>
      </div>

      {/* BUTONLAR: Bardak ve Şişe */}
      <div className="flex gap-8 mt-12">
        <button
          onClick={() => addWater(250)}
          className="bg-[#0284c7] hover:bg-[#0369a1] text-white w-28 h-28 rounded-[2.5rem] shadow-2xl shadow-blue-200 flex flex-col items-center justify-center active:scale-90 transition-all border-b-4 border-blue-900"
        >
          <span className="text-4xl mb-1">💧</span>
          <span className="font-black text-xs uppercase tracking-wider">{t.cup}</span>
          <span className="text-[10px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full mt-2">250ml</span>
        </button>

        <button
          onClick={() => addWater(500)}
          className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white w-28 h-28 rounded-[2.5rem] shadow-2xl shadow-blue-200 flex flex-col items-center justify-center active:scale-90 transition-all border-b-4 border-blue-700"
        >
          <div className="flex mb-1">
            <span className="text-3xl">💧</span>
            <span className="text-2xl -ml-2 mt-2">💧</span>
          </div>
          <span className="font-black text-xs uppercase tracking-wider">{t.bottle}</span>
          <span className="text-[10px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full mt-2">500ml</span>
        </button>
      </div>

      {/* SIFIRLA BUTONU */}
      <button
        onClick={() => setMl(0)}
        className="mt-14 text-[#bae6fd] hover:text-[#0284c7] transition-all text-[11px] font-black tracking-[0.3em] uppercase"
      >
        {t.reset}
      </button>

    </div>
  );
}

export default App;