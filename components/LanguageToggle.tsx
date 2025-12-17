'use client';

import { useLanguage } from '@/components/LanguageContext';

export default function LanguageToggle() {
    const { locale, setLocale } = useLanguage();

    return (
        <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
            <button
                onClick={() => setLocale('es')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${locale === 'es'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
            >
                ES
            </button>
            <button
                onClick={() => setLocale('en')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${locale === 'en'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
            >
                EN
            </button>
        </div>
    );
}
