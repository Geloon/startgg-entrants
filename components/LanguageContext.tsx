'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { dictionary, Locale } from '@/lib/dictionary';

interface LanguageContextType {
    locale: Locale;
    t: typeof dictionary['en'];
    setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocale] = useState<Locale>('es'); // Default to Spanish as per context

    return (
        <LanguageContext.Provider value={{ locale, t: dictionary[locale], setLocale }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
