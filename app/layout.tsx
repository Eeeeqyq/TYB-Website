import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/components/ui/language-context';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
});

const siteUrl = 'https://tybholdings.com';

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),

    title: {
        default: 'TYB Holdings | International Business Group — Bangkok, Thailand',
        template: '%s | TYB Holdings',
    },
    description:
        'TYB Holdings is an international business group based in Bangkok, Thailand. Operating across rubber trading, metals, construction, and brand partnerships in Southeast Asia and beyond.',
    keywords: [
        'TYB Holdings',
        'international business group',
        'Bangkok trading company',
        'Myanmar rubber export',
        'RSS rubber Thailand',
        'Southeast Asia trade',
        'cross-border commerce',
        'metals trading',
        'TYB constructions Myanmar',
        'SEA market partnerships',
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
        title: 'TYB Holdings | International Business Group',
        description:
            'Bangkok-based international business group connecting Southeast Asia resources to global markets through trade, partnerships, and industrial development.',
        url: siteUrl,
        images: [
            {
                url: '/og-image.svg',
                width: 1200,
                height: 630,
                alt: 'TYB Holdings — International Business Group',
            },
        ],
        locale: 'en_GB',
    },

    twitter: {
        card: 'summary_large_image',
        title: 'TYB Holdings | International Business Group',
        description:
            "TYB Holdings connects Southeast Asia's resource strength with global demand through trade, partnerships, and industrial development.",
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
            <body className={inter.className}>
                <LanguageProvider>{children}</LanguageProvider>
            </body>
        </html>
    );
}
