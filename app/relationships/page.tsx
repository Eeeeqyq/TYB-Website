'use client';
import { useLanguage } from '@/components/ui/language-context';

export default function RelationshipsPage() {
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
                        {t.relationships.kicker}
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                        {t.relationships.headline}
                    </h1>
                </div>
            </section>

            {/* ── RELATIONSHIPS ─────────────────────────────────────────── */}
            <section className="py-24 bg-white">
                <div className="container mx-auto max-w-5xl px-4 md:px-6">
                    <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed mb-14">
                        {t.relationships.body}
                    </p>

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
                                            <div className="font-semibold text-foreground text-sm">{item.name}</div>
                                            <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
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
                                            <div className="font-semibold text-foreground text-sm">{item.name}</div>
                                            <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
