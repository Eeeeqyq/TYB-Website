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
                    'gap-1.5 px-3',
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
                <div className="absolute right-0 top-full mt-1 min-w-[120px] overflow-hidden rounded-lg border bg-background shadow-lg z-50">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => {
                                setLanguage(opt.value);
                                setOpen(false);
                            }}
                            className={cn(
                                'flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
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
        { label: t.nav.home, href: '#top' },
        { label: t.nav.about, href: '#about' },
        { label: t.nav.businesses, href: '#businesses' },
        { label: t.nav.relationships, href: '#relationships' },
        { label: t.nav.contact, href: '#contact' },
    ];

    React.useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    return (
        <header
            className={cn(
                'sticky top-0 z-50 w-full transition-all duration-200',
                scrolled
                    ? 'bg-white/95 supports-[backdrop-filter]:bg-white/80 backdrop-blur-md border-b border-border shadow-sm'
                    : 'bg-white border-b border-border',
            )}
        >
            <nav className="container mx-auto max-w-7xl px-4 md:px-6 h-16 flex items-center justify-between">

                {/* Logo + wordmark */}
                <a href="#top" className="flex items-center gap-3 text-foreground no-underline flex-shrink-0">
                    <img
                        src="/TYB_logo.jpeg"
                        alt="TYB Holdings"
                        className="h-9 w-auto object-contain"
                        style={{ imageRendering: 'crisp-edges' }}
                    />
                    <div className="hidden sm:block leading-tight">
                        <div className="text-sm font-bold text-foreground tracking-tight">TYB Holdings</div>
                        <div className="text-[0.58rem] font-medium tracking-[0.16em] uppercase text-muted-foreground">
                            {t.nav.logoSubtitle}
                        </div>
                    </div>
                </a>

                {/* Desktop nav */}
                <div className="hidden items-center gap-1 md:flex">
                    {links.map((link, i) => (
                        <a
                            key={i}
                            className={cn(
                                buttonVariants({ variant: 'ghost', size: 'sm' }),
                                'px-4 text-sm font-medium text-muted-foreground hover:text-foreground',
                            )}
                            href={link.href}
                        >
                            {link.label}
                        </a>
                    ))}
                    <div className="w-px h-5 bg-border mx-2" />
                    <LanguageSwitcher />
                    <Button size="sm" className="ml-1 px-5" asChild>
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
                    'bg-background fixed top-16 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-t md:hidden',
                    open ? 'block' : 'hidden',
                )}
            >
                <div
                    data-slot={open ? 'open' : 'closed'}
                    className={cn(
                        'data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 data-[slot=closed]:animate-out data-[slot=closed]:zoom-out-95 ease-out',
                        'flex h-full w-full flex-col p-5',
                    )}
                >
                    <div className="grid gap-y-1">
                        {links.map((link) => (
                            <a
                                key={link.label}
                                className={buttonVariants({ variant: 'ghost', className: 'justify-start text-base font-medium' })}
                                href={link.href}
                                onClick={() => setOpen(false)}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                    <div className="mt-auto pt-6 border-t border-border">
                        <Button className="w-full" asChild>
                            <a href="#contact" onClick={() => setOpen(false)}>{t.nav.contactUs}</a>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
