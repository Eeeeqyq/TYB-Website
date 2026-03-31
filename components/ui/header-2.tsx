'use client';
import React from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';
import { useLanguage } from '@/components/ui/language-context';
import { ChevronDown, Globe } from 'lucide-react';
import { Language } from '@/lib/translations';

function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const options: { value: Language; label: string; short: string }[] = [
        { value: 'en', label: 'English', short: 'EN' },
        { value: 'zh', label: '中文', short: '中文' },
    ];

    const current = options.find((o) => o.value === language)!;

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen((v) => !v)}
                className={cn(
                    buttonVariants({ variant: 'ghost', size: 'sm' }),
                    'gap-1.5 px-2',
                )}
                aria-label="Switch language"
            >
                <Globe className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{current.short}</span>
                <ChevronDown
                    className={cn('h-3 w-3 transition-transform duration-200', open && 'rotate-180')}
                />
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-1 min-w-[110px] overflow-hidden rounded-md border bg-background shadow-md z-50">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => {
                                setLanguage(opt.value);
                                setOpen(false);
                            }}
                            className={cn(
                                'flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
                                language === opt.value && 'bg-accent/50 font-medium',
                            )}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export function Header() {
    const [open, setOpen] = React.useState(false);
    const scrolled = useScroll(10);
    const { t } = useLanguage();

    const links = [
        { label: t.nav.about, href: '#about' },
        { label: t.nav.sectors, href: '#sectors' },
        { label: t.nav.network, href: '#network' },
        { label: t.nav.sustainability, href: '#sustainability' },
        { label: t.nav.contact, href: '#contact' },
    ];

    React.useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    return (
        <header
            className={cn(
                'sticky top-0 z-50 mx-auto w-full max-w-5xl border-b border-transparent md:rounded-md md:border md:transition-all md:ease-out',
                {
                    'bg-background/95 supports-[backdrop-filter]:bg-background/50 border-border backdrop-blur-lg md:top-4 md:max-w-4xl md:shadow':
                        scrolled && !open,
                    'bg-background/90': open,
                },
            )}
        >
            <nav
                className={cn(
                    'flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:ease-out',
                    { 'md:px-2': scrolled },
                )}
            >
                {/* Logo + wordmark */}
                <a href="#top" className="flex items-center gap-2.5 text-foreground no-underline">
                    <img
                        src="/TYB_logo.jpeg"
                        alt="TYB International"
                        className="h-7 w-auto object-contain"
                    />
                    <span className="text-muted-foreground text-[0.62rem] font-medium tracking-[0.18em] uppercase leading-none hidden sm:block">
                        International
                    </span>
                </a>

                {/* Desktop nav */}
                <div className="hidden items-center gap-1 md:flex">
                    {links.map((link, i) => (
                        <a
                            key={i}
                            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
                            href={link.href}
                        >
                            {link.label}
                        </a>
                    ))}
                    <LanguageSwitcher />
                    <Button size="sm" asChild>
                        <a href="#contact">{t.nav.contactUs}</a>
                    </Button>
                </div>

                {/* Mobile controls */}
                <div className="flex items-center gap-1 md:hidden">
                    <LanguageSwitcher />
                    <Button size="icon" variant="outline" onClick={() => setOpen(!open)}>
                        <MenuToggleIcon open={open} className="size-5" duration={300} />
                    </Button>
                </div>
            </nav>

            {/* Mobile menu */}
            <div
                className={cn(
                    'bg-background/90 fixed top-14 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-y md:hidden',
                    open ? 'block' : 'hidden',
                )}
            >
                <div
                    data-slot={open ? 'open' : 'closed'}
                    className={cn(
                        'data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 data-[slot=closed]:animate-out data-[slot=closed]:zoom-out-95 ease-out',
                        'flex h-full w-full flex-col p-4',
                    )}
                >
                    <div className="grid gap-y-1">
                        {links.map((link) => (
                            <a
                                key={link.label}
                                className={buttonVariants({ variant: 'ghost', className: 'justify-start' })}
                                href={link.href}
                                onClick={() => setOpen(false)}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                    <div className="mt-auto pt-4">
                        <Button className="w-full" asChild>
                            <a href="#contact" onClick={() => setOpen(false)}>{t.nav.contactUs}</a>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
