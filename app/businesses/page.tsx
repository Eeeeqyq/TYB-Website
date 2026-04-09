'use client';
import { useState } from 'react';
import { useLanguage } from '@/components/ui/language-context';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export default function BusinessesPage() {
    const { t } = useLanguage();
    const [openCategories, setOpenCategories] = useState<Set<string>>(
        new Set(['international-trade'])
    );

    function toggleCategory(id: string) {
        setOpenCategories((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

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
                        {t.businesses.kicker}
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                        {t.businesses.headline}
                    </h1>
                </div>
            </section>

            {/* ── ACCORDION ─────────────────────────────────────────────── */}
            <section className="py-24 bg-[#F5F7FB]">
                <div className="container mx-auto max-w-5xl px-4 md:px-6">
                    <div className="space-y-4">
                        {t.businesses.categories.map((cat) => {
                            const isOpen = openCategories.has(cat.id);
                            return (
                                <div
                                    key={cat.id}
                                    className={cn(
                                        'bg-white border rounded-xl overflow-hidden transition-all duration-200',
                                        isOpen ? 'border-primary/40 shadow-sm' : 'border-border hover:border-primary/25',
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
                                            <p className="text-sm text-muted-foreground mt-0.5">{cat.desc}</p>
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
                                                        <h4 className="font-semibold text-foreground mb-2 text-sm">{item.title}</h4>
                                                        <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
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
        </>
    );
}
