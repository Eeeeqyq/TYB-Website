'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useLanguage } from '@/components/ui/language-context';
import { ArrowRight } from 'lucide-react';
import { WorldMap } from '@/components/ui/world-map';
import { cn } from '@/lib/utils';

// Decorative, canvas-driven and below the copy in importance: loaded on the client
// only, after the hero text and imagery have already painted.
const HeroGlobe = dynamic(() => import('@/components/ui/hero-globe'), { ssr: false });

/**
 * Hero showcase artwork. Index-aligned with `t.hero.gallery.items` — entry n supplies
 * the title and alt text for image n, exactly as GEO does in world-map.tsx.
 *
 * These are placeholder illustrations: the repository holds no photography of real
 * TYB sites. Replace the files in public/assets/images/hero/ (any wide 16:9 asset) without touching
 * this array, or swap the paths here if the file names change.
 */
const HERO_IMAGES = [
    '/assets/images/hero/01-trade.svg',
    '/assets/images/hero/02-rubber.svg',
    '/assets/images/hero/03-construction.svg',
    '/assets/images/hero/04-metals.svg',
];

export default function Home() {
    const { t, language } = useLanguage();
    const heroRef = useRef<HTMLDivElement>(null);
    const [activeImage, setActiveImage] = useState(0);

    // Cinematic entrance animation — replays on language switch
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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

    const gallery = t.hero.gallery;

    return (
        <>
            {/* ── HERO ──────────────────────────────────────────────────────
                Left: business imagery fading into navy, carrying the brand copy.
                Right: a globe whose centre sits on the right edge, so only its
                western half reaches into the page. Clipped here, never page-wide. */}
            <section
                ref={heroRef}
                className="relative flex min-h-[calc(100vh-4rem)] flex-col overflow-hidden bg-[#0A1628] md:block"
            >
                <div
                    className="pointer-events-none absolute inset-0 opacity-40"
                    style={{
                        backgroundImage: 'radial-gradient(circle, rgba(201,168,76,0.12) 1px, transparent 1px)',
                        backgroundSize: '36px 36px',
                    }}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#0d2744]/80 to-[#071422]" />

                {/* Globe layer — an overlay on desktop, its own band below the copy on phones. */}
                <div className="relative order-2 h-[36vh] min-h-[230px] w-full md:absolute md:inset-0 md:order-none md:h-auto md:min-h-0">
                    <HeroGlobe />
                </div>

                <div className="relative z-10 order-1 mx-auto w-full max-w-7xl px-4 py-12 md:order-none md:px-6 md:py-16 lg:py-20">
                    <div className="md:w-[44%] lg:w-[45%]">

                        {/* ── Showcase: the active image sits behind the copy and
                            dissolves into the navy, so there is no card edge. ── */}
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-x-0 -top-8 bottom-0 overflow-hidden md:-left-8 md:-top-14">
                                {HERO_IMAGES.map((src, i) => (
                                    <img
                                        key={src}
                                        src={src}
                                        alt={gallery.items[i].alt}
                                        aria-hidden={i !== activeImage}
                                        width={1600}
                                        height={900}
                                        loading={i === 0 ? 'eager' : 'lazy'}
                                        decoding="async"
                                        className={cn(
                                            'absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out motion-reduce:transition-none',
                                            i === activeImage ? 'opacity-100' : 'opacity-0',
                                        )}
                                    />
                                ))}
                                {/* Scrims: image readable at the top, pure navy by the bottom,
                                    and blended toward the globe on the right. */}
                                <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/15 via-[#0A1628]/75 to-[#0A1628]" />
                                <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628]/45 via-[#0A1628]/60 to-[#0A1628]/95" />
                            </div>

                            <div className="relative">
                                {/* Clear band where the artwork reads as a wide showcase. */}
                                <div className="h-[19vh] min-h-[120px] sm:h-[21vh] lg:h-[23vh]" aria-hidden="true" />

                                <p id="hero-kicker" className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">
                                    {t.hero.kicker}
                                </p>

                                <div className="mb-5 max-w-3xl">
                                    <div className="overflow-hidden">
                                        <h1 id="hero-line1" className="text-4xl font-bold leading-[1.06] text-white sm:text-5xl lg:text-6xl">
                                            {t.hero.line1}
                                        </h1>
                                    </div>
                                    <div className="overflow-hidden">
                                        <h1 id="hero-line2" className="text-4xl font-bold leading-[1.06] sm:text-5xl lg:text-6xl" style={{ color: '#C9A84C' }}>
                                            {t.hero.line2}
                                        </h1>
                                    </div>
                                </div>

                                <p id="hero-body" className="mb-8 max-w-xl text-base leading-relaxed text-blue-100/60 lg:text-lg">
                                    {t.hero.body}
                                </p>

                                <div id="hero-ctas" className="flex flex-wrap gap-4">
                                    <Link
                                        href="/contact"
                                        className="inline-flex h-12 items-center gap-2 rounded-lg bg-[#C9A84C] px-7 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#B8922E] hover:shadow-xl"
                                    >
                                        {t.hero.cta}
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                    <Link
                                        href="/businesses"
                                        className="inline-flex h-12 items-center rounded-lg border border-white/20 px-7 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10"
                                    >
                                        {t.hero.ctaSecondary}
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* ── Thumbnail strip: switches the showcase image ── */}
                        <div
                            role="group"
                            aria-label={gallery.label}
                            className="mt-9 grid max-w-xl grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-2 lg:grid-cols-4"
                        >
                            {gallery.items.map((item, i) => (
                                <button
                                    key={HERO_IMAGES[i]}
                                    type="button"
                                    onClick={() => setActiveImage(i)}
                                    aria-pressed={i === activeImage}
                                    className={cn(
                                        'group overflow-hidden rounded-lg border text-left transition-all duration-200',
                                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1628]',
                                        i === activeImage
                                            ? 'border-[#C9A84C] bg-white/[0.06] shadow-lg shadow-black/20'
                                            : 'border-white/15 hover:border-white/40',
                                    )}
                                >
                                    <img
                                        src={HERO_IMAGES[i]}
                                        alt=""
                                        aria-hidden="true"
                                        width={1600}
                                        height={900}
                                        loading="lazy"
                                        decoding="async"
                                        className={cn(
                                            'h-11 w-full object-cover transition-opacity duration-200 sm:h-14',
                                            i === activeImage ? 'opacity-100' : 'opacity-50 group-hover:opacity-80',
                                        )}
                                    />
                                    <span
                                        className={cn(
                                            'block truncate px-2 py-1.5 text-[0.62rem] font-medium leading-tight sm:text-[0.7rem]',
                                            i === activeImage ? 'text-white' : 'text-white/55',
                                        )}
                                    >
                                        {item.title}
                                    </span>
                                </button>
                            ))}
                        </div>
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
