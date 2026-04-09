'use client';
import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/ui/header-2';
import { useLanguage } from '@/components/ui/language-context';
import { cn } from '@/lib/utils';
import { ChevronDown, MapPin, Mail, ArrowRight } from 'lucide-react';
import { WorldMap } from '@/components/ui/world-map';

export default function Home() {
    const { t } = useLanguage();
    const heroRef = useRef<HTMLDivElement>(null);
    const [openCategories, setOpenCategories] = useState<Set<string>>(
        new Set(['international-trade'])
    );

    // Cinematic entrance animation on load
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
                    '-=0.4')
                 .fromTo('#hero-stats',
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
                    '-=0.3');
            }, heroRef);
        });
        return () => { ctx?.revert(); };
    }, []);

    function toggleCategory(id: string) {
        setOpenCategories((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    return (
        <div className="w-full">
            <Header />

            <main id="top">

                {/* ── HERO ─────────────────────────────────────────────────── */}
                <section
                    ref={heroRef}
                    className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#0A1628]"
                >
                    {/* Dot grid overlay */}
                    <div
                        className="absolute inset-0 opacity-40"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle, rgba(201,168,76,0.12) 1px, transparent 1px)',
                            backgroundSize: '36px 36px',
                        }}
                    />
                    {/* Radial depth gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#0d2744]/80 to-[#071422]" />
                    {/* Top-right accent glow */}
                    <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-900/20 rounded-full blur-3xl" />

                    <div className="relative z-10 container mx-auto max-w-7xl px-4 md:px-6 py-28 md:py-36">
                        {/* Kicker */}
                        <p
                            id="hero-kicker"
                            className="text-[#C9A84C] text-xs font-semibold tracking-[0.3em] uppercase mb-6"
                        >
                            {t.hero.kicker}
                        </p>

                        {/* Headline — two lines for cinematic wipe effect */}
                        <div className="mb-6 max-w-4xl">
                            <div className="overflow-hidden">
                                <h1
                                    id="hero-line1"
                                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05]"
                                >
                                    Building Bridges
                                </h1>
                            </div>
                            <div className="overflow-hidden">
                                <h1
                                    id="hero-line2"
                                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05]"
                                    style={{ color: '#C9A84C' }}
                                >
                                    Between Markets.
                                </h1>
                            </div>
                        </div>

                        {/* Body */}
                        <p
                            id="hero-body"
                            className="text-blue-100/60 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed"
                        >
                            {t.hero.body}
                        </p>

                        {/* CTAs */}
                        <div id="hero-ctas" className="flex flex-wrap gap-4 mb-24">
                            <a
                                href="#contact"
                                className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold h-12 px-7 bg-[#C9A84C] text-white hover:bg-[#B8922E] transition-all duration-200 hover:shadow-xl hover:shadow-[#0A1628]/40"
                            >
                                {t.hero.cta}
                                <ArrowRight className="h-4 w-4" />
                            </a>
                            <a
                                href="#businesses"
                                className="inline-flex items-center rounded-lg text-sm font-semibold h-12 px-7 border border-white/20 text-white hover:bg-white/10 transition-all duration-200"
                            >
                                {t.hero.ctaSecondary}
                            </a>
                        </div>

                        {/* Stats bar */}
                        <div
                            id="hero-stats"
                            className="grid grid-cols-2 md:grid-cols-4 overflow-hidden rounded-xl border border-white/10"
                        >
                            {[
                                { value: t.hero.stat1, label: t.hero.stat1Label },
                                { value: t.hero.stat2, label: t.hero.stat2Label },
                                { value: t.hero.stat3, label: t.hero.stat3Label },
                                { value: t.hero.stat4, label: t.hero.stat4Label },
                            ].map((stat, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        'bg-white/5 backdrop-blur-sm p-6 text-center',
                                        i < 3 && 'border-r border-white/10',
                                        i >= 2 && 'border-t border-white/10 md:border-t-0',
                                    )}
                                >
                                    <div className="text-2xl md:text-3xl font-bold text-white mb-1 whitespace-nowrap">
                                        {stat.value}
                                    </div>
                                    <div className="text-[0.7rem] text-[#C9A84C]/70 uppercase tracking-widest">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
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
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    {t.intro.body}
                                </p>
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
                            <h2 className="text-3xl md:text-4xl font-bold text-white">
                                {t.map.headline}
                            </h2>
                            <p className="mt-4 text-white/40 text-base max-w-xl mx-auto leading-relaxed">
                                {t.map.body}
                            </p>
                        </div>
                        <WorldMap />
                    </div>
                </section>

                {/* ── ABOUT / 3 DIVISIONS ───────────────────────────────────── */}
                <section id="about" className="py-24 bg-white">
                    <div className="container mx-auto max-w-6xl px-4 md:px-6">
                        <div className="max-w-2xl mb-16">
                            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary mb-4">
                                {t.about.kicker}
                            </p>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                                {t.about.headline}
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                {t.about.body}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {t.about.divisions.map((div) => (
                                <div
                                    key={div.number}
                                    className="group rounded-2xl border border-border bg-white p-8 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                                >
                                    <div className="text-5xl font-bold text-primary/15 mb-6 leading-none">
                                        {div.number}
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-2">{div.title}</h3>
                                    <p className="text-sm font-semibold text-primary mb-4 leading-snug">
                                        {div.subtitle}
                                    </p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{div.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── CORE VALUES ───────────────────────────────────────────── */}
                <section className="py-24 bg-[#EDF2FA]">
                    <div className="container mx-auto max-w-6xl px-4 md:px-6">
                        <div className="text-center mb-14">
                            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary mb-4">
                                {t.values.kicker}
                            </p>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                                {t.values.headline}
                            </h2>
                        </div>

                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {t.values.items.map((val, i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-xl border border-border p-6 text-center hover:border-primary/40 hover:shadow-md transition-all duration-200 group"
                                >
                                    <div className="w-11 h-11 bg-primary/10 group-hover:bg-primary/15 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                                        <span className="text-primary font-bold text-sm">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-foreground mb-3 text-base">{val.title}</h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{val.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── TIMELINE ─────────────────────────────────────────────── */}
                <section className="py-24 bg-white">
                    <div className="container mx-auto max-w-5xl px-4 md:px-6">
                        <div className="text-center mb-16">
                            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary mb-4">
                                {t.timeline.kicker}
                            </p>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                                {t.timeline.headline}
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {t.timeline.items.map((item, i) => (
                                <div
                                    key={i}
                                    className="flex gap-4 bg-white border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-sm transition-all duration-200"
                                >
                                    <div className="flex-shrink-0 mt-0.5">
                                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-primary text-xs font-bold">
                                                {String(i + 1).padStart(2, '0')}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="inline-block rounded-full px-3 py-0.5 text-[0.65rem] font-semibold bg-primary/10 text-primary mb-2 tracking-wider uppercase">
                                            {item.date}
                                        </div>
                                        <h3 className="font-bold text-foreground text-sm mb-1">{item.title}</h3>
                                        <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── MISSION & VISION ─────────────────────────────────────── */}
                <section className="py-24 bg-[#0A1628] relative overflow-hidden">
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle, rgba(201,168,76,0.10) 1px, transparent 1px)',
                            backgroundSize: '48px 48px',
                        }}
                    />
                    <div className="relative z-10 container mx-auto max-w-4xl px-4 md:px-6 text-center">
                        <p className="text-[#C9A84C] text-xs font-semibold tracking-[0.3em] uppercase mb-4">
                            {t.mission.kicker}
                        </p>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
                            {t.mission.headline}
                        </h2>
                        <div className="relative">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C9A84C] rounded-full" />
                            <blockquote className="pl-8 text-left text-xl md:text-2xl lg:text-3xl font-light text-white/80 leading-relaxed italic">
                                &ldquo;{t.mission.body}&rdquo;
                            </blockquote>
                        </div>
                    </div>
                </section>

                {/* ── OUR BUSINESSES ───────────────────────────────────────── */}
                <section id="businesses" className="py-24 bg-[#F5F7FB]">
                    <div className="container mx-auto max-w-5xl px-4 md:px-6">
                        <div className="mb-14">
                            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary mb-4">
                                {t.businesses.kicker}
                            </p>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                {t.businesses.headline}
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {t.businesses.categories.map((cat) => {
                                const isOpen = openCategories.has(cat.id);
                                return (
                                    <div
                                        key={cat.id}
                                        className={cn(
                                            'bg-white border rounded-xl overflow-hidden transition-all duration-200',
                                            isOpen
                                                ? 'border-primary/40 shadow-sm'
                                                : 'border-border hover:border-primary/25',
                                        )}
                                    >
                                        <button
                                            onClick={() => toggleCategory(cat.id)}
                                            className="w-full flex items-center justify-between p-6 text-left group"
                                        >
                                            <div>
                                                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                                                    {cat.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground mt-0.5">
                                                    {cat.desc}
                                                </p>
                                            </div>
                                            <ChevronDown
                                                className={cn(
                                                    'h-5 w-5 text-primary flex-shrink-0 ml-4 transition-transform duration-300',
                                                    isOpen && 'rotate-180',
                                                )}
                                            />
                                        </button>

                                        {isOpen && (
                                            <div className="px-6 pb-6 border-t border-border pt-5">
                                                <div className="grid sm:grid-cols-2 gap-4">
                                                    {cat.items.map((item) => (
                                                        <div
                                                            key={item.title}
                                                            className="bg-muted/50 rounded-lg p-5 hover:bg-primary/5 transition-colors"
                                                        >
                                                            <h4 className="font-semibold text-foreground mb-2 text-sm">
                                                                {item.title}
                                                            </h4>
                                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                                {item.desc}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ── RELATIONSHIPS ─────────────────────────────────────────── */}
                <section id="relationships" className="py-24 bg-white">
                    <div className="container mx-auto max-w-5xl px-4 md:px-6">
                        <div className="mb-14">
                            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary mb-4">
                                {t.relationships.kicker}
                            </p>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                {t.relationships.headline}
                            </h2>
                            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                                {t.relationships.body}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-10">
                            {/* Supported By */}
                            <div>
                                <h3 className="font-bold text-base text-foreground mb-5 pb-3 border-b border-border flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                                    {t.relationships.supportedBy.title}
                                </h3>
                                <div className="space-y-3">
                                    {t.relationships.supportedBy.items.map((item) => (
                                        <div
                                            key={item.name}
                                            className="flex items-center gap-4 p-4 rounded-xl bg-[#EDF2FA] border border-primary/10 hover:border-primary/25 transition-colors"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                                            <div>
                                                <div className="font-semibold text-foreground text-sm">
                                                    {item.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-0.5">
                                                    {item.desc}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Trade Partners */}
                            <div>
                                <h3 className="font-bold text-base text-foreground mb-5 pb-3 border-b border-border flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#C9A84C] inline-block" />
                                    {t.relationships.partners.title}
                                </h3>
                                <div className="space-y-3">
                                    {t.relationships.partners.items.map((item) => (
                                        <div
                                            key={item.name}
                                            className="flex items-center gap-4 p-4 rounded-xl bg-[#EDF2FA] border border-primary/10 hover:border-primary/25 transition-colors"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-[#C9A84C] flex-shrink-0" />
                                            <div>
                                                <div className="font-semibold text-foreground text-sm">
                                                    {item.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-0.5">
                                                    {item.desc}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── CONTACT ───────────────────────────────────────────────── */}
                <section id="contact" className="py-24 bg-[#EDF2FA]">
                    <div className="container mx-auto max-w-5xl px-4 md:px-6">
                        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
                            {/* Left: info */}
                            <div>
                                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary mb-4">
                                    {t.contact.kicker}
                                </p>
                                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5 leading-tight">
                                    {t.contact.headline}
                                </h2>
                                <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                                    {t.contact.body}
                                </p>

                                <div className="space-y-5">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <MapPin className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-[0.65rem] text-muted-foreground uppercase tracking-widest mb-1">
                                                {t.contact.labelAddress}
                                            </div>
                                            <div className="font-medium text-foreground">{t.contact.address}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Mail className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-[0.65rem] text-muted-foreground uppercase tracking-widest mb-1">
                                                {t.contact.labelEmail}
                                            </div>
                                            <a
                                                href="mailto:enquiries@tyb-int.com"
                                                className="font-medium text-primary hover:underline"
                                            >
                                                {t.contact.email}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: mailto card */}
                            <div className="bg-white rounded-2xl border border-border p-10 shadow-sm flex flex-col items-center justify-center text-center gap-6">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Mail className="h-7 w-7 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-foreground mb-2">
                                        {t.contact.formTitle}
                                    </h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                                        {t.contact.formBody}
                                    </p>
                                </div>
                                <a
                                    href="mailto:enquiries@tyb-int.com"
                                    className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:shadow-lg"
                                >
                                    <Mail className="h-4 w-4" />
                                    {t.contact.mailButton}
                                </a>
                                <p className="text-xs text-muted-foreground">
                                    enquiries@tyb-int.com
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* ── FOOTER ────────────────────────────────────────────────────── */}
            <footer className="bg-[#0A1628] text-white">
                <div className="container mx-auto max-w-7xl px-4 md:px-6">
                    {/* Main footer content */}
                    <div className="grid md:grid-cols-4 gap-10 md:gap-12 py-16 border-b border-white/10">

                        {/* Brand column */}
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <img
                                    src="/TYB_logo.jpeg"
                                    alt="TYB Holdings"
                                    className="h-10 w-auto object-contain"
                                />
                                <div>
                                    <div className="font-bold text-lg text-white leading-tight">
                                        TYB Holdings
                                    </div>
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
                                    <a
                                        href="mailto:enquiries@tyb-int.com"
                                        className="text-[#C9A84C]/60 hover:text-[#C9A84C] transition-colors"
                                    >
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
                                    { label: t.footer.aboutUs, href: '#about' },
                                    { label: t.footer.ourBusinesses, href: '#businesses' },
                                    { label: t.footer.relationships, href: '#relationships' },
                                    { label: t.footer.contactUs, href: '#contact' },
                                ].map((link) => (
                                    <li key={link.href}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-white/40 hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </a>
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
                                        <a
                                            href="#businesses"
                                            className="text-sm text-white/40 hover:text-white transition-colors"
                                        >
                                            {name}
                                        </a>
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
        </div>
    );
}
