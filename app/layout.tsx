import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/components/ui/language-context';

const siteUrl = 'https://tybholdings.com';

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),

    title: {
        default: 'TYB Holdings | Global Trading Company & International Sourcing',
        template: '%s | TYB Holdings',
    },
    description:
        'TYB Holdings is a Bangkok-based global trading company specialising in commodity trading, international sourcing, and supply chain solutions across Asia, Europe, and beyond.',
    keywords: [
        'global trading company',
        'international sourcing',
        'supply chain solutions',
        'commodity trading',
        'import and export services',
        'cross-border trade',
        'Bangkok trading company',
        'metals trading',
        'rubber trading',
        'chemicals supply',
    ],

    alternates: {
        canonical: '/',
        languages: {
            'en': '/',
            'zh': '/?lang=zh',
        },
    },

    openGraph: {
        type: 'website',
        siteName: 'TYB Holdings',
        title: 'TYB Holdings | Global Trading Company & International Sourcing',
        description:
            'Bangkok-based global trading company specialising in commodity trading, international sourcing, and supply chain solutions across Asia and beyond.',
        url: siteUrl,
        images: [
            {
                url: '/og-image.svg',
                width: 1200,
                height: 630,
                alt: 'TYB Holdings — Global Trading Company',
            },
        ],
        locale: 'en_GB',
    },

    twitter: {
        card: 'summary_large_image',
        title: 'TYB Holdings | Global Trading Company & International Sourcing',
        description:
            'TYB Holdings connects Southeast Asia's resource strength with global demand through disciplined commodity sourcing and end-to-end supply chain solutions.',
        images: ['/og-image.svg'],
    },

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en-GB">
            <body>
                <LanguageProvider>{children}</LanguageProvider>
            </body>
        </html>
    );
}
