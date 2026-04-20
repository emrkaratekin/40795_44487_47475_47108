import React, { useState, useEffect } from 'react';

const SettingsModal = ({ isOpen, onClose, user, onUpdate, onLogout, t }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        gender: 'male',
        weight: '',
        height: '',
        dailyGoal: ''
    });

    // Modal her açıldığında mevcut kullanıcı bilgilerini forma yükle
    useEffect(() => {
        if (user && isOpen) {
            setFormData({
                username: user.username || '',
                gender: user.gender || 'male',
                weight: user.weight || '',
                height: user.height || '',
                dailyGoal: user.dailyGoal || '',
                password: '' // Güvenlik için şifre alanı boş başlar
            });
        }
    }, [user, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(formData); // App.jsx'teki güncelleme fonksiyonunu çağırır
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-6 transition-all">
            <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-300 overflow-y-auto max-h-[90vh]">

                {/* Başlık */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sky-700 dark:text-sky-400 font-black tracking-widest uppercase text-sm">
                        {t.settings || 'Profile Settings'}
                    </h3>
                    <button onClick={onClose} className="text-2xl text-slate-400 hover:text-slate-600 transition-colors">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-left">

                    {/* 1. Kullanıcı Adı */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase ml-2">Username</label>
                        <input
                            type="text"
                            value={formData.username}
                            className="w-full p-3 bg-sky-50 dark:bg-slate-900 dark:text-white rounded-xl outline-none border border-sky-100 dark:border-slate-700 font-bold focus:ring-2 ring-sky-400 transition-all"
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>

                    {/* 2. Şifre */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase ml-2">New Password (Optional)</label>
                        <input
                            type="password"
                            placeholder="••••••"
                            className="w-full p-3 bg-sky-50 dark:bg-slate-900 dark:text-white rounded-xl outline-none border border-sky-100 dark:border-slate-700 font-bold"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    {/* 3. Cinsiyet */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase ml-2">Gender</label>
                        <select
                            value={formData.gender}
                            className="w-full p-3 bg-sky-50 dark:bg-slate-900 dark:text-white rounded-xl outline-none border border-sky-100 dark:border-slate-700 font-bold"
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>

                    {/* 4 & 5. Boy ve Kilo */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase ml-2">Weight (kg)</label>
                            <input
                                type="number"
                                value={formData.weight}
                                className="w-full p-3 bg-sky-50 dark:bg-slate-900 dark:text-white rounded-xl outline-none border border-sky-100 dark:border-slate-700 font-bold"
                                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase ml-2">Height (cm)</label>
                            <input
                                type="number"
                                value={formData.height}
                                className="w-full p-3 bg-sky-50 dark:bg-slate-900 dark:text-white rounded-xl outline-none border border-sky-100 dark:border-slate-700 font-bold"
                                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* 6. Manuel Hedef */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-sky-500 uppercase ml-2">Manual Daily Goal (ml)</label>
                        <input
                            type="number"
                            value={formData.dailyGoal}
                            className="w-full p-3 bg-sky-100 dark:bg-slate-700 dark:text-sky-300 rounded-xl outline-none border border-sky-200 dark:border-sky-900 font-black text-sky-700"
                            onChange={(e) => setFormData({ ...formData, dailyGoal: e.target.value })}
                        />
                    </div>

                    {/* Kaydet ve Çıkış Butonları */}
                    <div className="pt-4 space-y-3">
                        <button
                            type="submit"
                            className="w-full bg-sky-500 text-white p-5 rounded-2xl font-black shadow-lg shadow-sky-100 dark:shadow-none hover:bg-sky-600 transition-all active:scale-95"
                        >
                            SAVE CHANGES
                        </button>

                        <hr className="border-slate-100 dark:border-slate-700 my-2" />

                        <button
                            type="button"
                            onClick={onLogout}
                            className="w-full bg-red-50 dark:bg-red-900/20 text-red-500 p-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-red-100 dark:border-red-900/40 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all"
                        >
                            Logout Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsModal;