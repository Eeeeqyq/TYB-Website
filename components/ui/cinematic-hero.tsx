'use client';
import { useEffect, useRef } from 'react';

export function CinematicHero() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ctx: { revert: () => void } | null = null;

        async function init() {
            const { gsap } = await import('gsap');
            const { ScrollTrigger } = await import('gsap/ScrollTrigger');
            gsap.registerPlugin(ScrollTrigger);

            ctx = gsap.context(() => {
                // ── Intro: text animates in on load ──────────────────────
                gsap.set('.ch-text-line1', {
                    y: 40,
                    scale: 0.96,
                    filter: 'blur(10px)',
                    opacity: 0,
                });
                gsap.set('.ch-text-line2', {
                    clipPath: 'inset(0 100% 0 0)',
                    opacity: 1,
                });
                gsap.set('.ch-scroll-hint', { opacity: 0, y: 10 });
                gsap.set('.ch-sub', { opacity: 0, y: 12 });

                gsap.timeline({ delay: 0.2 })
                    .to('.ch-text-line1', {
                        duration: 1.4,
                        y: 0,
                        scale: 1,
                        filter: 'blur(0px)',
                        opacity: 1,
                        ease: 'expo.out',
                    })
                    .to(
                        '.ch-text-line2',
                        {
                            duration: 1.4,
                            clipPath: 'inset(0 0% 0 0)',
                            ease: 'power4.inOut',
                        },
                        '-=1.0',
                    )
                    .to(
                        '.ch-sub',
                        { duration: 0.8, opacity: 1, y: 0, ease: 'power2.out' },
                        '-=0.6',
                    )
                    .to(
                        '.ch-scroll-hint',
                        { duration: 0.6, opacity: 1, y: 0, ease: 'power2.out' },
                        '-=0.3',
                    );

                // ── Scroll-out: pinned zoom/fade as user scrolls ──────────
                gsap.timeline({
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top top',
                        end: '+=900',
                        pin: true,
                        scrub: 0.8,
                        anticipatePin: 1,
                    },
                })
                    .to('.ch-hero-text', {
                        scale: 1.1,
                        autoAlpha: 0,
                        filter: 'blur(20px)',
                        y: -50,
                        ease: 'power2.inOut',
                        duration: 1,
                    })
                    .to(
                        '.ch-bg-grid',
                        { opacity: 0, ease: 'power2.inOut', duration: 1 },
                        '<',
                    )
                    .to(
                        '.ch-scroll-hint',
                        { autoAlpha: 0, ease: 'power2.inOut', duration: 0.4 },
                        '<',
                    );
            }, containerRef);
        }

        init();
        return () => { ctx?.revert(); };
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative h-screen flex items-center justify-center overflow-hidden bg-[#0A1628]"
            aria-hidden="true"
        >
            {/* Gold grid overlay */}
            <div
                className="ch-bg-grid absolute inset-0"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(201,168,76,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.06) 1px, transparent 1px)',
                    backgroundSize: '80px 80px',
                }}
            />

            {/* Radial vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#0A1628_100%)]" />

            {/* Hero text */}
            <div className="ch-hero-text relative z-10 text-center px-4 select-none">
                {/* Kicker */}
                <p className="ch-sub text-[#C9A84C] text-xs font-semibold tracking-[0.35em] uppercase mb-8 opacity-0">
                    International Business Group &nbsp;·&nbsp; Bangkok, Thailand
                </p>

                {/* Line 1 */}
                <h1 className="ch-text-line1 text-[clamp(3rem,10vw,8rem)] font-bold text-white leading-[1.0] tracking-tight">
                    Building Bridges
                </h1>

                {/* Line 2 */}
                <h1
                    className="ch-text-line2 text-[clamp(3rem,10vw,8rem)] font-bold leading-[1.0] tracking-tight"
                    style={{ color: '#C9A84C' }}
                >
                    Between Markets.
                </h1>
            </div>

            {/* Scroll hint */}
            <div className="ch-scroll-hint absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0">
                <span className="text-white/30 text-[0.65rem] font-medium tracking-[0.3em] uppercase">
                    Scroll
                </span>
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </div>
        </div>
    );
}
