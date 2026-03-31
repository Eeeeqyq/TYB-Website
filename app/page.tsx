'use client';
import { Header } from '@/components/ui/header-2';
import { useLanguage } from '@/components/ui/language-context';

export default function Home() {
    const { t } = useLanguage();

    return (
        <div className="w-full">
            <Header />

            <main id="top">
                {/* Hero */}
                <section className="py-20 md:py-32">
                    <div className="container mx-auto max-w-5xl px-4">
                        <div className="grid md:grid-cols-2 gap-12 items-start">
                            <div>
                                <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-3">
                                    {t.hero.kicker}
                                </p>
                                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                                    {t.hero.headline}
                                </h1>
                                <p className="text-muted-foreground text-lg mb-8">
                                    {t.hero.body}
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <a
                                        href="#contact"
                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                                    >
                                        {t.hero.cta}
                                    </a>
                                    <a
                                        href="#sectors"
                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-6 border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                                    >
                                        {t.hero.ctaSecondary}
                                    </a>
                                </div>
                            </div>

                            <aside className="bg-muted rounded-lg p-8 border">
                                <h2 className="text-2xl font-semibold mb-3">{t.hero.since}</h2>
                                <p className="text-muted-foreground mb-8">{t.hero.sinceBody}</p>
                                <ul className="grid grid-cols-3 gap-4">
                                    <li className="text-center">
                                        <strong className="block text-3xl font-bold">8</strong>
                                        <span className="text-xs text-muted-foreground">{t.hero.stat1Label}</span>
                                    </li>
                                    <li className="text-center">
                                        <strong className="block text-3xl font-bold">5+</strong>
                                        <span className="text-xs text-muted-foreground">{t.hero.stat2Label}</span>
                                    </li>
                                    <li className="text-center">
                                        <strong className="block text-3xl font-bold">Asia+</strong>
                                        <span className="text-xs text-muted-foreground">{t.hero.stat3Label}</span>
                                    </li>
                                </ul>
                            </aside>
                        </div>
                    </div>
                </section>

                {/* About */}
                <section id="about" className="py-20 border-t">
                    <div className="container mx-auto max-w-5xl px-4">
                        <div className="grid md:grid-cols-2 gap-12">
                            <div>
                                <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-3">
                                    {t.about.kicker}
                                </p>
                                <h2 className="text-3xl font-bold">{t.about.headline}</h2>
                            </div>
                            <div className="space-y-4 text-muted-foreground">
                                <p>{t.about.body1}</p>
                                <p>{t.about.body2}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sectors */}
                <section id="sectors" className="py-20 bg-muted/40 border-t">
                    <div className="container mx-auto max-w-5xl px-4">
                        <div className="mb-12">
                            <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-3">
                                {t.sectors.kicker}
                            </p>
                            <h2 className="text-3xl font-bold">{t.sectors.headline}</h2>
                        </div>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {t.sectors.items.map((sector) => (
                                <article key={sector.index} className="bg-background rounded-lg border p-6">
                                    <p className="text-xs text-muted-foreground font-mono mb-3">{sector.index}</p>
                                    <h3 className="font-semibold text-lg mb-2">{sector.title}</h3>
                                    <p className="text-sm text-muted-foreground">{sector.desc}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Network */}
                <section id="network" className="py-20 border-t">
                    <div className="container mx-auto max-w-5xl px-4">
                        <div className="mb-12">
                            <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-3">
                                {t.network.kicker}
                            </p>
                            <h2 className="text-3xl font-bold">{t.network.headline}</h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {t.network.items.map((item) => (
                                <div key={item.title}>
                                    <h3 className="font-semibold text-lg mb-3">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Sustainability */}
                <section id="sustainability" className="py-20 bg-muted/40 border-t">
                    <div className="container mx-auto max-w-5xl px-4">
                        <div className="mb-12">
                            <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-3">
                                {t.sustainability.kicker}
                            </p>
                            <h2 className="text-3xl font-bold">{t.sustainability.headline}</h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {t.sustainability.items.map((pillar) => (
                                <article key={pillar.title}>
                                    <h3 className="font-semibold text-lg mb-3">{pillar.title}</h3>
                                    <p className="text-sm text-muted-foreground">{pillar.desc}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact */}
                <section id="contact" className="py-20 border-t">
                    <div className="container mx-auto max-w-5xl px-4">
                        <div className="max-w-xl">
                            <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-3">
                                {t.contact.kicker}
                            </p>
                            <h2 className="text-3xl font-bold mb-4">{t.contact.headline}</h2>
                            <p className="text-muted-foreground mb-8">{t.contact.body}</p>
                            <a
                                href="mailto:enquiries@tyb-int.com"
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                                enquiries@tyb-int.com
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t py-8">
                <div className="container mx-auto max-w-5xl px-4 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
                    <p>{t.footer.location}</p>
                    <p>&copy; {new Date().getFullYear()} {t.footer.rights}</p>
                </div>
            </footer>
        </div>
    );
}
