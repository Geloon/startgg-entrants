'use client';

import { useState } from 'react';
import { useLanguage } from '@/components/LanguageContext';

interface Props {
    onLogin: (password: string) => void;
    isLoggedIn: boolean;
}

export default function StaffLogin({ onLogin, isLoggedIn }: Props) {
    const [password, setPassword] = useState('');
    const [showInput, setShowInput] = useState(false);
    const { t } = useLanguage();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(password);
    };

    if (isLoggedIn) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-md mb-6">
                <p className="text-red-800 dark:text-red-200 font-bold flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                    {t.staffLoginActive}
                </p>
                <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                    {t.staffLoginDesc}
                </p>
            </div>
        );
    }

    return (
        <div className="mb-6">
            {!showInput ? (
                <button
                    onClick={() => setShowInput(true)}
                    className="text-sm text-gray-500 hover:text-red-600 hover:underline transition-colors"
                >
                    {t.staffLoginPrompt}
                </button>
            ) : (
                <form onSubmit={handleSubmit} className="flex gap-2 items-center animate-in fade-in slide-in-from-top-2">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t.passwordPlaceholder}
                        className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-red-500 dark:bg-gray-800 dark:border-gray-700"
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        {t.enter}
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowInput(false)}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </form>
            )}
        </div>
    );
}
