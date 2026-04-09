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

    icons: {
        icon: [
            { url: '/favicon.ico',        sizes: 'any' },
            { url: '/favicon-16x16.png',  sizes: '16x16',  type: 'image/png' },
            { url: '/favicon-32x32.png',  sizes: '32x32',  type: 'image/png' },
            { url: '/icon-192.png',       sizes: '192x192', type: 'image/png' },
            { url: '/icon-512.png',       sizes: '512x512', type: 'image/png' },
        ],
        apple: [
            { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        ],
        shortcut: '/favicon.ico',
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
                url: '/icon-512.png',
                width: 512,
                height: 512,
                alt: 'TYB Holdings Logo',
            },
        ],
        locale: 'en_GB',
    },

    twitter: {
        card: 'summary',
        title: 'TYB Holdings | International Business Group',
        description:
            "TYB Holdings connects Southeast Asia's resource strength with global demand through trade, partnerships, and industrial development.",
        images: ['/icon-512.png'],
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

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TYB Holdings',
    url: siteUrl,
    logo: `${siteUrl}/icon-512.png`,
    image: `${siteUrl}/icon-512.png`,
    description:
        'TYB Holdings is an international business group based in Bangkok, Thailand, operating across rubber trading, metals, construction, and brand partnerships in Southeast Asia.',
    address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bangkok',
        addressCountry: 'TH',
    },
    contactPoint: {
        '@type': 'ContactPoint',
        email: 'enquiries@tyb-int.com',
        contactType: 'customer service',
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en-GB">
            <body className={inter.className}>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                <LanguageProvider>{children}</LanguageProvider>
            </body>
        </html>
    );
}
