'use client';

import { useState } from 'react';
import { useLanguage } from '@/components/LanguageContext';

interface Props {
    onSearch: (url: string) => void;
    loading: boolean;
}

export default function TournamentInput({ onSearch, loading }: Props) {
    const [url, setUrl] = useState('');
    const { t } = useLanguage();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (url.trim()) {
            onSearch(url);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
            <div className="flex-grow flex flex-col gap-2">
                <label htmlFor="url" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t.tournamentLabel}
                </label>
                <input
                    type="url"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder={t.tournamentPlaceholder}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    required
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
                {loading ? t.loading : t.loadEntrants}
            </button>
        </form>
    );
}
