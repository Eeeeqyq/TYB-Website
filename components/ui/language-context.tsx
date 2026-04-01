'use client';
import React from 'react';
import { translations, Language } from '@/lib/translations';

type Translations = typeof translations[Language];

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Translations;
};

const LanguageContext = React.createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = React.useState<Language>('en');
    const t = translations[language];

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const ctx = React.useContext(LanguageContext);
    if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
    return ctx;
}
