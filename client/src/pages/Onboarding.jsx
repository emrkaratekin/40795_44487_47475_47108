import React, { useState } from 'react';
import axios from 'axios';

const Onboarding = ({ userId, API_BASE_URL, onComplete }) => {
    const [data, setData] = useState({ age: '', weight: '', height: '', gender: 'male' });

    const handleUpdate = async () => {
        if (!data.weight || !data.height) return alert("Please fill all fields!");
        try {
            const res = await axios.post(`${API_BASE_URL}/user/update-profile`, { userId, ...data });
            onComplete(res.data.dailyGoal);
        } catch (err) { alert("Error updating profile"); }
    };

    return (
        <div className="min-h-screen bg-sky-100 dark:bg-slate-900 flex items-center justify-center p-6 text-center transition-colors duration-500">
            <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-2xl w-full max-w-md">
                <h2 className="text-2xl font-black text-sky-700 dark:text-sky-400 mb-2">Let's Calculate! 🧠</h2>
                <div className="space-y-4 mt-6">
                    <select className="w-full p-4 bg-sky-50 dark:bg-slate-900 dark:text-white rounded-2xl font-bold" onChange={(e) => setData({ ...data, gender: e.target.value })}>
                        <option value="male">Male</option><option value="female">Female</option>
                    </select>
                    <input type="number" placeholder="Weight (kg)" className="w-full p-4 bg-sky-50 dark:bg-slate-900 dark:text-white rounded-2xl font-bold" onChange={(e) => setData({ ...data, weight: e.target.value })} />
                    <input type="number" placeholder="Height (cm)" className="w-full p-4 bg-sky-50 dark:bg-slate-900 dark:text-white rounded-2xl font-bold" onChange={(e) => setData({ ...data, height: e.target.value })} />
                    <button onClick={handleUpdate} className="w-full bg-sky-500 text-white p-5 rounded-2xl font-black hover:bg-sky-600 transition-all active:scale-95">CALCULATE GOAL</button>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;