'use client';
import { useLanguage } from '@/components/ui/language-context';

export default function AboutPage() {
    const { t } = useLanguage();

    return (
        <>
            {/* ── PAGE HEADER ───────────────────────────────────────────── */}
            <section className="py-16 bg-[#0A1628] relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'radial-gradient(circle, rgba(201,168,76,0.10) 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                    }}
                />
                <div className="relative z-10 container mx-auto max-w-6xl px-4 md:px-6">
                    <p className="text-[#C9A84C] text-xs font-semibold tracking-[0.3em] uppercase mb-3">
                        {t.about.kicker}
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                        {t.about.headline}
                    </h1>
                </div>
            </section>

            {/* ── ABOUT BODY + 3 DIVISIONS ──────────────────────────────── */}
            <section className="py-24 bg-white">
                <div className="container mx-auto max-w-6xl px-4 md:px-6">
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mb-16">
                        {t.about.body}
                    </p>

                    <div className="grid md:grid-cols-3 gap-6">
                        {t.about.divisions.map((div) => (
                            <div
                                key={div.number}
                                className="group rounded-2xl border border-border bg-white p-8 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                            >
                                <div className="text-5xl font-bold text-primary/15 mb-6 leading-none">{div.number}</div>
                                <h3 className="text-xl font-bold text-foreground mb-2">{div.title}</h3>
                                <p className="text-sm font-semibold text-primary mb-4 leading-snug">{div.subtitle}</p>
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
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">{t.values.headline}</h2>
                    </div>

                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {t.values.items.map((val, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-xl border border-border p-6 text-center hover:border-primary/40 hover:shadow-md transition-all duration-200 group"
                            >
                                <div className="w-11 h-11 bg-primary/10 group-hover:bg-primary/15 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                                    <span className="text-primary font-bold text-sm">{String(i + 1).padStart(2, '0')}</span>
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
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">{t.timeline.headline}</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {t.timeline.items.map((item, i) => (
                            <div
                                key={i}
                                className="flex gap-4 bg-white border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-sm transition-all duration-200"
                            >
                                <div className="flex-shrink-0 mt-0.5">
                                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-primary text-xs font-bold">{String(i + 1).padStart(2, '0')}</span>
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
                        backgroundImage: 'radial-gradient(circle, rgba(201,168,76,0.10) 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                    }}
                />
                <div className="relative z-10 container mx-auto max-w-4xl px-4 md:px-6 text-center">
                    <p className="text-[#C9A84C] text-xs font-semibold tracking-[0.3em] uppercase mb-4">
                        {t.mission.kicker}
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">{t.mission.headline}</h2>
                    <div className="relative">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C9A84C] rounded-full" />
                        <blockquote className="pl-8 text-left text-xl md:text-2xl lg:text-3xl font-light text-white/80 leading-relaxed italic">
                            &ldquo;{t.mission.body}&rdquo;
                        </blockquote>
                    </div>
                </div>
            </section>
        </>
    );
}
