'use client';
import { useLanguage } from '@/components/ui/language-context';
import { MapPin, Mail } from 'lucide-react';

export default function ContactPage() {
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
                        {t.contact.kicker}
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                        {t.contact.headline}
                    </h1>
                </div>
            </section>

            {/* ── CONTACT BODY ──────────────────────────────────────────── */}
            <section className="py-24 bg-[#EDF2FA]">
                <div className="container mx-auto max-w-5xl px-4 md:px-6">
                    <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">

                        {/* Left: info */}
                        <div>
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
                                <h3 className="font-bold text-xl text-foreground mb-2">{t.contact.formTitle}</h3>
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
                            <p className="text-xs text-muted-foreground">enquiries@tyb-int.com</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
