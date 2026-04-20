import React from 'react';

const CalendarModal = ({ isOpen, onClose, history, selectedDate, setSelectedDate, darkMode, t, lang }) => {
    if (!isOpen) return null;

    // Takvim yardımcı fonksiyonları
    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    // Yerelleştirme ayarları
    const monthName = new Intl.DateTimeFormat(lang, { month: 'long' }).format(selectedDate);
    const year = selectedDate.getFullYear();
    const weekDays = [...Array(7).keys()].map(i =>
        new Intl.DateTimeFormat(lang, { weekday: 'short' }).format(new Date(2024, 0, i + 1))
    );

    const prevMonth = () => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
    const nextMonth = () => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));

    // 🔥 O GÜNÜN TOPLAM SUYUNU HESAPLA
    // CalendarModal.jsx içinde getDayTotal fonksiyonunu güncelle:
    const getDayTotal = (day) => {
        // O günün tarihini yerel olarak oluştur
        const targetDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
        const targetDateStr = targetDate.toLocaleDateString('sv-SE');

        const dayLogs = history.filter(log =>
            new Date(log.date).toLocaleDateString('sv-SE') === targetDateStr
        );

        return dayLogs.reduce((sum, log) => sum + log.amount, 0);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[3rem] shadow-2xl border-8 border-white dark:border-slate-700 overflow-hidden">

                {/* HEADER */}
                <div className="p-8 bg-sky-500 text-white flex justify-between items-center">
                    <button onClick={prevMonth} className="text-2xl hover:scale-125 transition-transform">❮</button>
                    <div className="text-center">
                        <h2 className="text-2xl font-black capitalize">{monthName}</h2>
                        <p className="text-sky-100 font-bold opacity-80">{year}</p>
                    </div>
                    <button onClick={nextMonth} className="text-2xl hover:scale-125 transition-transform">❯</button>
                </div>

                {/* CALENDAR GRID */}
                <div className="p-6">
                    <div className="grid grid-cols-7 mb-4">
                        {weekDays.map(day => (
                            <span key={day} className="text-center text-[10px] font-black text-slate-400 uppercase">{day}</span>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {[...Array(firstDayOfMonth(selectedDate.getFullYear(), selectedDate.getMonth())).keys()].map(i => (
                            <div key={`empty-${i}`} />
                        ))}

                        {[...Array(daysInMonth(selectedDate.getFullYear(), selectedDate.getMonth())).keys()].map(i => {
                            const day = i + 1;
                            const dailyTotal = getDayTotal(day);
                            const isToday = new Date().toDateString() === new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day).toDateString();

                            return (
                                <div
                                    key={day}
                                    className={`
                    h-16 w-full rounded-2xl flex flex-col items-center justify-center transition-all
                    ${isToday ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-700 dark:text-slate-200'}
                    ${dailyTotal > 0 && !isToday ? 'bg-sky-50 dark:bg-sky-900/30' : ''}
                  `}
                                >
                                    <span className="font-bold text-xs">{day}</span>
                                    {dailyTotal > 0 && (
                                        <span className={`text-[8px] font-black mt-1 ${isToday ? 'text-sky-100' : 'text-sky-500'}`}>
                                            {dailyTotal}ml
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="p-6 border-t border-slate-50 dark:border-slate-700">
                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 font-black rounded-2xl uppercase tracking-widest text-xs"
                    >
                        {lang === 'tr' ? 'KAPAT' : (lang === 'pl' ? 'ZAMKNIJ' : 'CLOSE')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CalendarModal;