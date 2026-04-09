'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/ui/language-context';
import { ArrowRight } from 'lucide-react';
import { WorldMap } from '@/components/ui/world-map';

export default function Home() {
    const { t, language } = useLanguage();
    const heroRef = useRef<HTMLDivElement>(null);

    // Cinematic entrance animation — replays on language switch
    useEffect(() => {
        let ctx: { revert: () => void } | null = null;
        import('gsap').then(({ gsap }) => {
            if (!heroRef.current) return;
            ctx = gsap.context(() => {
                const tl = gsap.timeline({ delay: 0.15 });
                tl.fromTo('#hero-kicker',
                    { opacity: 0, y: 16 },
                    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
                 .fromTo('#hero-line1',
                    { opacity: 0, y: 48, filter: 'blur(8px)' },
                    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'expo.out' },
                    '-=0.3')
                 .fromTo('#hero-line2',
                    { clipPath: 'inset(0 100% 0 0)' },
                    { clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'power4.inOut' },
                    '-=0.9')
                 .fromTo('#hero-body',
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
                    '-=0.5')
                 .fromTo('#hero-ctas',
                    { opacity: 0, y: 16 },
                    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
                    '-=0.4');
            }, heroRef);
        });
        return () => { ctx?.revert(); };
    }, [language]);

    return (
        <>
            {/* ── HERO ──────────────────────────────────────────────────── */}
            <section
                ref={heroRef}
                className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#0A1628]"
            >
                <div
                    className="absolute inset-0 opacity-40"
                    style={{
                        backgroundImage: 'radial-gradient(circle, rgba(201,168,76,0.12) 1px, transparent 1px)',
                        backgroundSize: '36px 36px',
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#0d2744]/80 to-[#071422]" />
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-900/20 rounded-full blur-3xl" />

                <div className="relative z-10 container mx-auto max-w-7xl px-4 md:px-6 py-28 md:py-36">
                    <p id="hero-kicker" className="text-[#C9A84C] text-xs font-semibold tracking-[0.3em] uppercase mb-6">
                        {t.hero.kicker}
                    </p>

                    <div className="mb-6 max-w-4xl">
                        <div className="overflow-hidden">
                            <h1 id="hero-line1" className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05]">
                                {t.hero.line1}
                            </h1>
                        </div>
                        <div className="overflow-hidden">
                            <h1 id="hero-line2" className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05]" style={{ color: '#C9A84C' }}>
                                {t.hero.line2}
                            </h1>
                        </div>
                    </div>

                    <p id="hero-body" className="text-blue-100/60 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
                        {t.hero.body}
                    </p>

                    <div id="hero-ctas" className="flex flex-wrap gap-4">
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold h-12 px-7 bg-[#C9A84C] text-white hover:bg-[#B8922E] transition-all duration-200 hover:shadow-xl"
                        >
                            {t.hero.cta}
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/businesses"
                            className="inline-flex items-center rounded-lg text-sm font-semibold h-12 px-7 border border-white/20 text-white hover:bg-white/10 transition-all duration-200"
                        >
                            {t.hero.ctaSecondary}
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── COMPANY INTRO ─────────────────────────────────────────── */}
            <section className="py-24 bg-white">
                <div className="container mx-auto max-w-6xl px-4 md:px-6">
                    <div className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-20 items-start">
                        <div>
                            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary mb-4">
                                {t.intro.kicker}
                            </p>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                                {t.intro.headline}
                            </h2>
                            <div className="mt-8 h-1 w-14 bg-primary rounded-full" />
                        </div>
                        <div>
                            <p className="text-muted-foreground text-lg leading-relaxed">{t.intro.body}</p>
                            <div className="mt-8 flex flex-wrap gap-4">
                                <Link
                                    href="/about"
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                                >
                                    {t.footer.aboutUs} <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── WORLD MAP ─────────────────────────────────────────────── */}
            <section className="py-24 bg-[#0A1628]">
                <div className="container mx-auto max-w-6xl px-4 md:px-6">
                    <div className="text-center mb-12">
                        <p className="text-[#C9A84C] text-xs font-semibold tracking-[0.3em] uppercase mb-3">
                            {t.map.kicker}
                        </p>
                        <h2 className="text-3xl md:text-4xl font-bold text-white">{t.map.headline}</h2>
                        <p className="mt-4 text-white/40 text-base max-w-xl mx-auto leading-relaxed">{t.map.body}</p>
                    </div>
                    <WorldMap locations={t.map.locations} />
                </div>
            </section>

            {/* ── PAGE LINKS ────────────────────────────────────────────── */}
            <section className="py-20 bg-white">
                <div className="container mx-auto max-w-6xl px-4 md:px-6">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[
                            { label: t.nav.about,         href: '/about',         desc: t.about.kicker },
                            { label: t.nav.businesses,    href: '/businesses',    desc: t.businesses.kicker },
                            { label: t.nav.relationships, href: '/relationships', desc: t.relationships.kicker },
                            { label: t.nav.contact,       href: '/contact',       desc: t.contact.kicker },
                        ].map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="group flex flex-col justify-between rounded-2xl border border-border bg-white p-7 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                            >
                                <div>
                                    <p className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-primary/60 mb-3">
                                        {item.desc}
                                    </p>
                                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                                        {item.label}
                                    </h3>
                                </div>
                                <ArrowRight className="h-4 w-4 text-primary mt-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
