'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageContext';

interface Props {
    onTokenChange: (token: string) => void;
}

export default function TokenInput({ onTokenChange }: Props) {
    const [token, setToken] = useState('');
    const { t } = useLanguage();

    useEffect(() => {
        const stored = localStorage.getItem('startgg_token');
        if (stored) {
            setToken(stored);
            onTokenChange(stored);
        }
    }, [onTokenChange]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setToken(val);
        localStorage.setItem('startgg_token', val);
        onTokenChange(val);
    };

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor="token" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t.tokenLabel}
            </label>
            <input
                type="password"
                id="token"
                value={token}
                onChange={handleChange}
                placeholder={t.tokenPlaceholder}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
                {t.tokenHelpStart} <a href="https://start.gg/admin/profile/developer" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{t.tokenHelpLink}</a>{t.tokenHelpEnd} <a href="https://github.com/Geloon/startgg-entrants" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{t.checkRepo}</a>.
            </p>
        </div>
    );
}
