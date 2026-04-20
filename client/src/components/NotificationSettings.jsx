import React from 'react';

const NotificationSettings = ({ user, onUpdate, isOpen, onClose, t, lang }) => {
    if (!isOpen) return null;

    // Saat birimini dile göre ayarla
    const hourText = lang === 'tr' ? 'Saat' : (lang === 'pl' ? 'Godz.' : 'Hour');

    return (
        <div className="absolute top-24 right-0 w-72 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border-4 border-blue-50 dark:border-slate-700 p-8 z-[999] animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black text-[#0369a1] dark:text-sky-400 uppercase tracking-widest">
                    {t.notifStatus}
                </h3>
                <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-red-500 transition-colors text-xl font-bold"
                >✕</button>
            </div>

            <div className="space-y-6">
                {/* AKTİF / PASİF SWİTCH */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <span className="text-xs font-bold dark:text-slate-300">
                        {user.notificationsEnabled ? t.notifActive : t.notifPassive}
                    </span>
                    <button
                        onClick={() => onUpdate({ notificationsEnabled: !user.notificationsEnabled })}
                        className={`w-12 h-6 rounded-full transition-all relative ${user.notificationsEnabled ? 'bg-sky-500 shadow-lg shadow-sky-200' : 'bg-slate-300'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${user.notificationsEnabled ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>

                {/* ZAMAN ARALIĞI SEÇİMİ */}
                <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        {t.notifInterval}
                    </label>
                    <select
                        value={user.notificationInterval}
                        onChange={(e) => onUpdate({ notificationInterval: Number(e.target.value) })}
                        disabled={!user.notificationsEnabled}
                        className="w-full bg-slate-100 dark:bg-slate-900 border-2 border-transparent focus:border-sky-500 rounded-xl p-3 text-xs font-bold outline-none text-sky-600 transition-all disabled:opacity-50"
                    >
                        <option value={1}>1 {hourText}</option>
                        <option value={2}>2 {hourText}</option>
                        <option value={3}>3 {hourText}</option>
                        <option value={6}>6 {hourText}</option>
                    </select>
                </div>
            </div>

            <p className="mt-6 text-[9px] text-center text-slate-400 font-medium leading-tight">
                {t.notifBody}
            </p>
        </div>
    );
};

export default NotificationSettings;