import React, { useState, useRef, useEffect } from 'react';

const LanguageDropdown = ({ currentLang, onLangChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const languages = [
        { code: 'tr', label: 'Türkçe', flag: 'tr' },
        { code: 'en', label: 'English', flag: 'gb' },
        { code: 'pl', label: 'Polski', flag: 'pl' }
    ];

    // Dışarı tıklandığında menüyü kapat
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Dünya Butonu */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-3 rounded-2xl shadow-sm text-2xl transition-all ${isOpen ? 'bg-sky-100 dark:bg-sky-900 ring-2 ring-sky-500' : 'bg-white dark:bg-slate-700'}`}
            >
                🌐
            </button>

            {/* Dil Listesi (Dropdown) */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-blue-50 dark:border-slate-700 p-2 z-[150] animate-in slide-in-from-top-2 duration-200">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                onLangChange(lang.code);
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${currentLang === lang.code ? 'bg-sky-500 text-white' : 'hover:bg-sky-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'}`}
                        >
                            <img src={`https://flagcdn.com/w40/${lang.flag}.png`} className="w-5 h-3.5 rounded-sm object-cover" alt={lang.label} />
                            <span className="font-bold text-sm">{lang.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageDropdown;