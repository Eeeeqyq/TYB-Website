'use client';
import { useEffect, useRef } from 'react';

interface LocationLabel {
    name: string;
    detail: string;
}

interface Location extends LocationLabel {
    lat: number;
    lng: number;
    isHQ?: boolean;
}

// Static geographic data — names/details come from props
const GEO: Omit<Location, 'name' | 'detail'>[] = [
    { lat: 13.75,  lng: 100.52, isHQ: true },
    { lat: 16.87,  lng:  96.19 },
    { lat:  3.14,  lng: 101.69 },
    { lat:  1.35,  lng: 103.82 },
    { lat: 10.82,  lng: 106.63 },
    { lat: 22.32,  lng: 114.17 },
    { lat: 39.91,  lng: 116.39 },
    { lat: 37.57,  lng: 126.98 },
    { lat: 43.26,  lng:  76.95 },
    { lat: 41.01,  lng:  28.95 },
    { lat: 44.82,  lng:  20.46 },
    { lat: 48.21,  lng:  16.37 },
    { lat: 47.38,  lng:   8.54 },
];

interface WorldMapProps {
    locations: readonly { name: string; detail: string }[];
}

export function WorldMap({ locations }: WorldMapProps) {
    const svgRef  = useRef<SVGSVGElement>(null);
    const tipRef  = useRef<HTMLDivElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const svgEl = svgRef.current;
        const tip   = tipRef.current;
        const wrap  = wrapRef.current;
        if (!svgEl || !tip || !wrap) return;

        let cancelled = false;
        let hideOnClick: (() => void) | null = null;

        async function buildMap() {
            // Dynamically import heavy libraries to keep initial bundle light
            const [d3, topoLib] = await Promise.all([
                import('d3'),
                import('topojson-client'),
            ]);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const topojson = topoLib as any;
            if (cancelled || !svgEl || !wrap) return;

            // Fetch world topology data
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let world: any;
            try {
                world = await d3.json(
                    'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json',
                );
            } catch {
                return; // silently fail — no map if CDN is unreachable
            }
            if (cancelled || !svgEl) return;

            const countries = topojson.feature(world, world.objects.countries);
            const graticule = d3.geoGraticule();

            const W = wrap.clientWidth || 900;
            const H = Math.round(W * 0.50);

            const projection = d3.geoNaturalEarth1()
                .scale(W / 6.28)
                .translate([W / 2, H / 2]);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const path = d3.geoPath().projection(projection as any);

            const svg = d3.select(svgEl)
                .attr('viewBox', `0 0 ${W} ${H}`)
                .attr('preserveAspectRatio', 'xMidYMid meet');

            // ── Defs ─────────────────────────────────────────────────────
            const defs = svg.append('defs');

            // Gold gradient for markers
            const grad = defs.append('linearGradient')
                .attr('id', 'tyb-gold-grad')
                .attr('x1', '0%').attr('y1', '0%')
                .attr('x2', '100%').attr('y2', '100%');
            grad.append('stop').attr('offset', '0%').attr('stop-color', '#C9A84C');
            grad.append('stop').attr('offset', '100%').attr('stop-color', '#8a6620');

            // Glow filter
            const filt = defs.append('filter')
                .attr('id', 'tyb-glow')
                .attr('x', '-60%').attr('y', '-60%')
                .attr('width', '220%').attr('height', '220%');
            filt.append('feGaussianBlur')
                .attr('in', 'SourceGraphic').attr('stdDeviation', '2.5').attr('result', 'blur');
            filt.append('feColorMatrix')
                .attr('in', 'blur').attr('type', 'matrix')
                .attr('values', '0 0 0 0 0.79  0 0 0 0 0.66  0 0 0 0 0.30  0 0 0 0.7 0')
                .attr('result', 'glow');
            const fm = filt.append('feMerge');
            fm.append('feMergeNode').attr('in', 'glow');
            fm.append('feMergeNode').attr('in', 'SourceGraphic');

            // ── Base layers ──────────────────────────────────────────────
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const sphere = { type: 'Sphere' } as any;

            svg.append('path').datum(sphere)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .attr('d', path as any).attr('fill', '#dce8f8');

            svg.append('path').datum(graticule())
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .attr('d', path as any).attr('fill', 'none')
                .attr('stroke', '#b8cde0').attr('stroke-width', 0.25);

            svg.append('g').selectAll('path')
                .data(countries.features)
                .join('path')
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .attr('d', path as any)
                .attr('fill', '#c8d8ec')
                .attr('stroke', '#9fb8d2')
                .attr('stroke-width', 0.3);

            svg.append('path').datum(sphere)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .attr('d', path as any).attr('fill', 'none')
                .attr('stroke', '#7a9ab8').attr('stroke-width', 0.6);

            // ── Markers ──────────────────────────────────────────────────
            const markerGroup = svg.append('g');

            // Merge static geo data with translated labels
            const LOCATIONS: Location[] = GEO.map((geo, i) => ({
                ...geo,
                name:   locations[i]?.name   ?? '',
                detail: locations[i]?.detail ?? '',
            }));

            LOCATIONS.forEach((loc) => {
                const coords = projection([loc.lng, loc.lat]);
                if (!coords) return;
                const [x, y] = coords;
                const r = loc.isHQ ? 6 : 4.5;

                const outer = markerGroup.append('g')
                    .attr('transform', `translate(${x},${y})`);
                const g = outer.append('g').style('cursor', 'pointer');

                // Pulse ring (animated via CSS class)
                g.append('circle')
                    .attr('class', 'map-pulse')
                    .attr('r', r)
                    .attr('fill', 'none')
                    .attr('stroke', '#C9A84C')
                    .attr('stroke-width', 1.5)
                    .attr('opacity', 0.55);

                // Glow halo
                g.append('circle')
                    .attr('r', r)
                    .attr('fill', 'rgba(201,168,76,0.08)')
                    .attr('filter', 'url(#tyb-glow)');

                // White fill with gold border
                g.append('circle')
                    .attr('r', r - 1)
                    .attr('fill', 'white')
                    .attr('stroke', 'url(#tyb-gold-grad)')
                    .attr('stroke-width', loc.isHQ ? 2 : 1.5);

                // Center dot
                g.append('circle')
                    .attr('r', loc.isHQ ? 2.5 : 1.6)
                    .attr('fill', 'url(#tyb-gold-grad)');

                // HQ label
                if (loc.isHQ) {
                    g.append('text')
                        .attr('x', 0).attr('y', -10)
                        .attr('text-anchor', 'middle')
                        .attr('font-size', '7')
                        .attr('font-weight', '700')
                        .attr('letter-spacing', '0.05em')
                        .attr('fill', '#0A1628')
                        .text('HQ');
                }

                // Invisible hit area for easier hover
                g.append('circle').attr('r', 12).attr('fill', 'transparent');

                // Tooltip events
                outer
                    .on('mouseenter', function (event: MouseEvent) {
                        if (!tip || !wrap) return;
                        const rect = wrap.getBoundingClientRect();
                        (tip.querySelector('.tip-name') as HTMLElement).textContent = loc.name;
                        (tip.querySelector('.tip-detail') as HTMLElement).textContent = loc.detail;
                        tip.style.display = 'block';
                        tip.style.left = `${event.clientX - rect.left + 14}px`;
                        tip.style.top  = `${event.clientY - rect.top  - 10}px`;
                    })
                    .on('mousemove', function (event: MouseEvent) {
                        if (!tip || !wrap) return;
                        const rect = wrap.getBoundingClientRect();
                        tip.style.left = `${event.clientX - rect.left + 14}px`;
                        tip.style.top  = `${event.clientY - rect.top  - 10}px`;
                    })
                    .on('mouseleave', function () {
                        if (tip) tip.style.display = 'none';
                    });
            });

            hideOnClick = () => { if (tip) tip.style.display = 'none'; };
            document.addEventListener('click', hideOnClick);

            // ── Resize handler ───────────────────────────────────────────
            let resizeTimer: ReturnType<typeof setTimeout>;
            const onResize = () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    if (!cancelled && svgEl) {
                        while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);
                        buildMap();
                    }
                }, 250);
            };
            window.addEventListener('resize', onResize);

            // Store resize cleanup
            const prevCleanup = hideOnClick;
            hideOnClick = () => {
                if (tip) tip.style.display = 'none';
                window.removeEventListener('resize', onResize);
                if (prevCleanup) prevCleanup();
            };
        }

        buildMap();

        return () => {
            cancelled = true;
            if (hideOnClick) hideOnClick();
            if (svgEl) while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);
        };
    }, [locations]);

    return (
        <div ref={wrapRef} className="relative w-full rounded-2xl overflow-hidden border border-border shadow-sm bg-[#dce8f8]">
            <svg
                ref={svgRef}
                className="w-full block"
                aria-label="World map showing TYB Holdings international presence"
            />
            {/* Tooltip */}
            <div
                ref={tipRef}
                className="absolute pointer-events-none z-10 rounded-lg px-3 py-2 shadow-xl text-xs"
                style={{
                    display: 'none',
                    background: '#0A1628',
                    color: 'white',
                }}
            >
                <div className="tip-name font-semibold mb-0.5" />
                <div className="tip-detail text-[0.65rem]" style={{ color: 'rgba(255,255,255,0.6)' }} />
            </div>
        </div>
    );
}
