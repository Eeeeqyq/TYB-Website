'use client';
import Link from 'next/link';
import { MapPin, Mail } from 'lucide-react';
import { useLanguage } from '@/components/ui/language-context';

export function SiteFooter() {
    const { t } = useLanguage();

    return (
        <footer className="bg-[#0A1628] text-white">
            <div className="container mx-auto max-w-7xl px-4 md:px-6">
                <div className="grid md:grid-cols-4 gap-10 md:gap-12 py-16 border-b border-white/10">

                    {/* Brand column */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <img src="/TYB_logo.jpeg" alt="TYB Holdings" className="h-10 w-auto object-contain" />
                            <div>
                                <div className="font-bold text-lg text-white leading-tight">TYB Holdings</div>
                                <div className="text-[0.6rem] text-[#C9A84C]/60 tracking-[0.18em] uppercase mt-0.5">
                                    {t.nav.logoSubtitle}
                                </div>
                            </div>
                        </div>
                        <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-xs">
                            {t.footer.description}
                        </p>
                        <div className="text-sm text-white/35 space-y-1.5">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5 text-[#C9A84C]/50 flex-shrink-0" />
                                <span>{t.footer.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="h-3.5 w-3.5 text-[#C9A84C]/50 flex-shrink-0" />
                                <a href="mailto:enquiries@tyb-int.com" className="text-[#C9A84C]/60 hover:text-[#C9A84C] transition-colors">
                                    enquiries@tyb-int.com
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Quick links */}
                    <div>
                        <div className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-[#C9A84C]/60 mb-5">
                            {t.footer.quickLinks}
                        </div>
                        <ul className="space-y-3">
                            {[
                                { label: t.footer.aboutUs,      href: '/about' },
                                { label: t.footer.ourBusinesses, href: '/businesses' },
                                { label: t.footer.relationships, href: '/relationships' },
                                { label: t.footer.contactUs,    href: '/contact' },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-white/40 hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Businesses */}
                    <div>
                        <div className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-[#C9A84C]/60 mb-5">
                            {t.footer.ourBusinesses}
                        </div>
                        <ul className="space-y-3">
                            {t.footer.divisions.map((name) => (
                                <li key={name}>
                                    <Link href="/businesses" className="text-sm text-white/40 hover:text-white transition-colors">
                                        {name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-6">
                    <p className="text-white/25 text-xs">
                        &copy; {new Date().getFullYear()} {t.footer.rights}
                    </p>
                    <p className="text-white/15 text-xs">{t.footer.city}</p>
                </div>
            </div>
        </footer>
    );
}
