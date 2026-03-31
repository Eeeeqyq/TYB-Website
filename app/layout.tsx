import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/components/ui/language-context';

export const metadata: Metadata = {
    title: 'TYB International | Trade Across Asia and Beyond',
    description:
        'TYB International is a Bangkok-based trading and investment company specializing in metals, rubber, chemicals, commodities, and cross-border commerce.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <LanguageProvider>{children}</LanguageProvider>
            </body>
        </html>
    );
}
