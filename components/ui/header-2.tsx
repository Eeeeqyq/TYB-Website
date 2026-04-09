'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
                className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1.5 px-3')}
                aria-label="Switch language"
            >
                <Globe className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{current.short}</span>
                <ChevronDown className={cn('h-3 w-3 transition-transform duration-200', open && 'rotate-180')} />
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-1 min-w-[120px] overflow-hidden rounded-lg border bg-background shadow-lg z-50">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => { setLanguage(opt.value); setOpen(false); }}
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
    const pathname = usePathname();

    const links = [
        { label: t.nav.home,          href: '/' },
        { label: t.nav.about,         href: '/about' },
        { label: t.nav.businesses,    href: '/businesses' },
        { label: t.nav.relationships, href: '/relationships' },
        { label: t.nav.contact,       href: '/contact' },
    ];

    const isActive = (href: string) =>
        href === '/' ? pathname === '/' : pathname.startsWith(href);

    // Lock body scroll when mobile menu is open
    React.useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    // Close mobile menu on route change
    React.useEffect(() => {
        setOpen(false);
    }, [pathname]);

    return (
        <>
            {/*
             * The <header> is intentionally kept as a clean wrapper with NO
             * backdrop-filter children inside it.
             *
             * backdrop-filter creates a new CSS containing block which breaks
             * position:fixed descendants — so the mobile menu MUST live outside
             * this element (see sibling div below).
             */}
            <header
                className={cn(
                    'sticky top-0 z-50 w-full transition-all duration-200',
                    scrolled
                        ? 'bg-white/95 supports-[backdrop-filter]:bg-white/80 backdrop-blur-md border-b border-border shadow-sm'
                        : 'bg-white border-b border-border',
                )}
            >
                <nav className="container mx-auto max-w-7xl px-4 md:px-6 h-16 flex items-center justify-between">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 text-foreground no-underline flex-shrink-0">
                        <img
                            src="/TYB_logo.jpeg"
                            alt="TYB Holdings"
                            className="h-9 w-auto object-contain"
                            style={{ imageRendering: 'crisp-edges' }}
                        />
                        <div className="hidden sm:block leading-tight">
                            <div className="text-sm font-bold text-foreground tracking-tight">{t.nav.companyName}</div>
                            <div className="text-[0.58rem] font-medium tracking-[0.16em] uppercase text-muted-foreground">
                                {t.nav.logoSubtitle}
                            </div>
                        </div>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden items-center gap-1 md:flex">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    buttonVariants({ variant: 'ghost', size: 'sm' }),
                                    'px-4 text-sm font-medium transition-colors',
                                    isActive(link.href)
                                        ? 'text-foreground bg-accent/60'
                                        : 'text-muted-foreground hover:text-foreground',
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="w-px h-5 bg-border mx-2" />
                        <LanguageSwitcher />
                        <Button size="sm" className="ml-1 px-5" asChild>
                            <Link href="/contact">{t.nav.contactUs}</Link>
                        </Button>
                    </div>

                    {/* Mobile hamburger */}
                    <div className="flex items-center gap-1 md:hidden">
                        <LanguageSwitcher />
                        <Button size="icon" variant="outline" onClick={() => setOpen((v) => !v)}>
                            <MenuToggleIcon open={open} className="size-5" duration={300} />
                        </Button>
                    </div>
                </nav>
            </header>

            {/*
             * Mobile menu — rendered as a SIBLING to <header>, not inside it.
             *
             * Keeping it outside <header> ensures that backdrop-filter on the
             * header (applied when scrolled) cannot create a new containing
             * block that would mis-position this fixed overlay.
             *
             * z-40 keeps it below the header (z-50) but above all page content.
             */}
            <div
                aria-hidden={!open}
                className={cn(
                    'fixed inset-0 top-16 z-40 bg-background border-t border-border md:hidden',
                    open ? 'flex flex-col' : 'hidden',
                )}
            >
                <div className="flex h-full w-full flex-col overflow-y-auto p-5">
                    <nav className="grid gap-y-1">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    buttonVariants({ variant: 'ghost', className: 'justify-start text-base font-medium' }),
                                    isActive(link.href) && 'bg-accent/60 text-foreground',
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="mt-auto pt-6 border-t border-border">
                        <Button className="w-full" asChild>
                            <Link href="/contact" onClick={() => setOpen(false)}>
                                {t.nav.contactUs}
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
