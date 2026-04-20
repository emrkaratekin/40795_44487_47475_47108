import React, { useState } from 'react';
import axios from 'axios';

const Auth = ({ API_BASE_URL, onLogin, t }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? '/auth/login' : '/auth/register';
        try {
            const res = await axios.post(`${API_BASE_URL}${endpoint}`, { username, password });
            if (isLogin) onLogin(res.data);
            else { alert("Success! Please Login."); setIsLogin(true); }
        } catch (err) { alert(err.response?.data?.error || "Connection Error!"); }
    };

    return (
        <div className="min-h-screen bg-sky-50 dark:bg-slate-900 flex items-center justify-center p-6 transition-colors duration-500">
            <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-2xl w-full max-w-md border-4 border-white dark:border-slate-700 text-center">
                <h2 className="text-3xl font-black text-sky-600 dark:text-sky-400 mb-8">{isLogin ? 'Welcome! 💧' : 'Join Us! 🚀'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Username" className="w-full p-4 bg-sky-50 dark:bg-slate-900 dark:text-white rounded-2xl outline-none font-bold" onChange={(e) => setUsername(e.target.value)} />
                    <input type="password" placeholder="Password" className="w-full p-4 bg-sky-50 dark:bg-slate-900 dark:text-white rounded-2xl outline-none font-bold" onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit" className="w-full bg-sky-500 text-white p-4 rounded-2xl font-black shadow-lg hover:bg-sky-600 transition-all active:scale-95">
                        {isLogin ? 'LOGIN' : 'REGISTER'}
                    </button>
                </form>
                <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-6 text-sky-400 font-bold text-sm uppercase">
                    {isLogin ? "Need an account? Sign Up" : "Have an account? Login"}
                </button>
            </div>
        </div>
    );
};

export default Auth;