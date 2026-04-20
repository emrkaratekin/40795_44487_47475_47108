import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const WeeklyChart = ({ history, t, lang }) => {
    // Dil kodlarını eşleştirelim (tr, en, pl)
    const localeMap = {
        tr: 'tr-TR',
        en: 'en-US',
        pl: 'pl-PL'
    };

    const currentLocale = localeMap[lang] || 'en-US';

    // 1. Son 7 günü seçilen dile göre otomatik oluştur
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);

        // Gün ismini tarayıcıdan dile göre al (Mon, Pzt, Pon vb.)
        const dayName = new Intl.DateTimeFormat(currentLocale, { weekday: 'short' }).format(d);

        return {
            dateStr: d.toISOString().split('T')[0],
            dayName: dayName,
            amount: 0
        };
    }).reverse();

    // 2. History verisini bu günlerle eşleştir
    history.forEach(log => {
        const logDate = new Date(log.date).toISOString().split('T')[0];
        const dayObj = last7Days.find(d => d.dateStr === logDate);
        if (dayObj) dayObj.amount += log.amount;
    });

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-2xl border-4 border-white dark:border-slate-700 w-full h-full min-h-[400px]">
            <h3 className="text-[#0369a1] dark:text-sky-400 font-black text-lg mb-6 uppercase tracking-widest text-center">
                {/* Başlık translations.js dosyasında yoksa yedek başlık gösterir */}
                {t.weeklyAnalysis || (lang === 'tr' ? '7 GÜNLÜK ANALİZ' : lang === 'pl' ? 'ANALIZA 7-DNIOWA' : '7-DAY ANALYSIS')}
            </h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={last7Days}>
                        <XAxis
                            dataKey="dayName"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#7dd3fc', fontSize: 12, fontWeight: 'bold' }}
                        />
                        <Tooltip
                            cursor={{ fill: '#f0f9ff', opacity: 0.1 }}
                            contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="amount" radius={[10, 10, 10, 10]} barSize={25}>
                            {last7Days.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.amount > 0 ? '#0284c7' : '#e0f2fe'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <p className="text-center text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-widest">
                {lang === 'tr' ? 'Su tüketim istatistikleriniz' : lang === 'pl' ? 'Twoje statystyki wody' : 'Your water statistics'}
            </p>
        </div>
    );
};

export default WeeklyChart;