'use client';

import { useEffect, useRef } from 'react';
import { HQ_COORDS, TRADE_LOCATIONS } from '@/lib/locations';

/*
 * HeroGlobe — a true three-dimensional globe whose centre is pinned to the RIGHT
 * EDGE of its container, so only the western half is visible and its left silhouette
 * reads as one huge arc sweeping in from off-screen.
 *
 * Rendered with d3's orthographic projection onto a 2-D canvas: each frame advances
 * projection.rotate() and re-draws the land, so the continents travel across a
 * silhouette that never moves. (Rotating a flat map image with CSS would not do
 * this — the land would shear instead of turning.)
 *
 * The sphere itself is greyscale; the only colour on it is the trade network — the same
 * locations the flat world map renders further down the page, joined to the Bangkok HQ by
 * great-circle routes, with a light beam running outward along one route after another.
 *
 * d3 + topojson are already dependencies of this repo (see components/ui/world-map.tsx),
 * so this adds no graphics library, and canvas 2-D needs no WebGL.
 */

/** One route out of the HQ for every other location on the shared table. */
const ROUTES: [number, number][] = TRADE_LOCATIONS
    .filter((location) => !location.isHQ)
    .map((location) => [location.lng, location.lat]);

/** Samples per great-circle route — enough for a smooth beam at negligible per-frame cost. */
const ROUTE_SAMPLES = 64;
/** Seconds for one beam to travel from the HQ to its destination. */
const BEAM_TRAVEL_S = 1.3;
/**
 * Delay between consecutive launches. Deliberately LONGER than the travel time, so a
 * beam always lands before the next one leaves: exactly one is ever in the air, with a
 * 0.2s pause between them, and the twelve routes complete a round every 18s. Shortening
 * this below BEAM_TRAVEL_S puts several beams in flight at once, which reads as a swarm
 * leaving the HQ together rather than as one route firing after another.
 */
const BEAM_STAGGER_S = 1.5;
/** How much of its route a beam occupies. */
const BEAM_TAIL = 0.24;
/** Sub-segments per beam, brightening toward the head. */
const BEAM_SEGMENTS = 5;
/** Time for the whole sequence to come round again. */
const BEAM_CYCLE_S = ROUTES.length * BEAM_STAGGER_S;

/** Seconds per full axial rotation. */
const ROTATION_PERIOD_S = 100;
/** Degrees of spin per second. */
const DEG_PER_S = 360 / ROTATION_PERIOD_S;

/** Initial view — South-East Asia facing the viewer. */
const INITIAL_LAMBDA = -HQ_COORDS[0];
const INITIAL_PHI = -14;
/** Static axial tilt (gamma), so the spin axis reads as a tilted 3-D axis. */
const AXIS_TILT = -12;

/** Redraw cadence. The rotation is slow, so 30fps looks identical to 60 and costs half. */
const TARGET_FPS = 30;

const LOCAL_TOPOLOGY = '/geo/countries-110m.json';
const REMOTE_TOPOLOGY = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

/* Sphere box geometry. The box is a square whose centre sits exactly on the
 * container's right edge, so precisely half of it is inside the viewport.
 * The sphere's radius is 0.465 * side, leaving a margin for the atmosphere glow —
 * so a side of 1.075 * width makes the visible half span half the hero. */
const RADIUS_RATIO = 0.465;
const WIDE_SIDE_OF_WIDTH = 1.075;  // visible sphere then spans ~50% of the container
/** At this size the sphere is far taller than the hero, so it is cropped top and
 *  bottom by design; the cap only stops short windows from cropping it to a wall. */
const WIDE_SIDE_MAX_OF_HEIGHT = 2.40;
const WIDE_SIDE_MIN_OF_WIDTH = 0.78;
const BAND_SIDE_OF_HEIGHT = 1.05;
const BAND_SIDE_OF_WIDTH = 1.075;
/** Below Tailwind's `md`, the globe is its own band under the copy rather than an overlay. */
const BAND_BREAKPOINT = 768;

/* The sphere is greyscale. Only the trade network carries colour. */
const OCEAN_LIT = '#4a525c';
const OCEAN_MID = '#2b3138';
const OCEAN_DEEP = '#15181d';
const LAND_LIT = '#a8b0ba';
const LAND_DEEP = '#5f6771';
const GOLD = '#C9A84C';
const NODE = '#e2e7ec';

/**
 * Square side for a container of w x h.
 *
 * The mode is chosen by width, not by aspect ratio: the stacked band only exists
 * below `md`, and a tall tablet in the desktop layout must not be mistaken for it
 * (that mistake pushes the sphere over the headline).
 */
function sideFor(w: number, h: number) {
    if (w < BAND_BREAKPOINT) {
        return Math.max(h * BAND_SIDE_OF_HEIGHT, w * BAND_SIDE_OF_WIDTH);
    }
    return Math.max(
        w * WIDE_SIDE_MIN_OF_WIDTH,
        Math.min(w * WIDE_SIDE_OF_WIDTH, h * WIDE_SIDE_MAX_OF_HEIGHT),
    );
}

export default function HeroGlobe() {
    const layerRef = useRef<HTMLDivElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const layer = layerRef.current;
        const box = boxRef.current;
        const canvas = canvasRef.current;
        if (!layer || !box || !canvas) return;

        const ctx = canvas.getContext('2d');
        // No 2-D context: the CSS sphere underneath already holds the composition.
        if (!ctx) return;

        let disposed = false;
        let frame = 0;
        let resizeTimer: ReturnType<typeof setTimeout> | undefined;
        let lambda = INITIAL_LAMBDA;
        /** Seconds of animation elapsed — drives the beams. */
        let clockS = 0;
        let lastTick = 0;
        let onScreen = true;
        let side = 0;
        let radius = 0;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let d3: any = null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let land: any = null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let borders: any = null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let projection: any = null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let path: any = null;
        /** Great-circle samples per route, computed once — they do not depend on rotation. */
        let routePoints: [number, number][][] = [];
        /** Beams are motion: they stay off when the visitor asks for less of it. */
        let beamsOn = false;

        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

        /** Size the square box + canvas backing store to the layer's current box. */
        function measure() {
            if (!layer || !box || !canvas) return;
            const w = layer.clientWidth;
            const h = layer.clientHeight;
            if (!w || !h) return;

            side = Math.round(sideFor(w, h));
            radius = side * RADIUS_RATIO;

            box.style.width = `${side}px`;
            box.style.height = `${side}px`;

            // Cap the pixel ratio: 2 is indistinguishable from 3 here and costs 2.25x.
            const dpr = Math.min(window.devicePixelRatio || 1, side < 520 ? 1.5 : 2);
            canvas.width = Math.round(side * dpr);
            canvas.height = Math.round(side * dpr);
            canvas.style.width = `${side}px`;
            canvas.style.height = `${side}px`;
            ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

            if (d3) {
                projection = d3.geoOrthographic()
                    .scale(radius)
                    .translate([side / 2, side / 2])
                    .rotate([lambda, INITIAL_PHI, AXIS_TILT]);
                path = d3.geoPath(projection, ctx);
            }
        }

        function draw() {
            if (!ctx || !side) return;
            const c = side / 2;

            ctx.clearRect(0, 0, side, side);

            // ── Atmosphere: a restrained neutral halo just outside the limb ──
            const halo = ctx.createRadialGradient(c, c, radius * 0.96, c, c, radius * 1.16);
            halo.addColorStop(0, 'rgba(190,199,210,0.26)');
            halo.addColorStop(0.45, 'rgba(160,170,182,0.10)');
            halo.addColorStop(1, 'rgba(160,170,182,0)');
            ctx.fillStyle = halo;
            ctx.beginPath();
            ctx.arc(c, c, radius * 1.16, 0, Math.PI * 2);
            ctx.fill();

            // ── Ocean: lit from the upper left, deepening toward the limb ──
            const ocean = ctx.createRadialGradient(
                c - radius * 0.32, c - radius * 0.36, radius * 0.08,
                c, c, radius,
            );
            ocean.addColorStop(0, OCEAN_LIT);
            ocean.addColorStop(0.55, OCEAN_MID);
            ocean.addColorStop(1, OCEAN_DEEP);
            ctx.fillStyle = ocean;
            ctx.beginPath();
            ctx.arc(c, c, radius, 0, Math.PI * 2);
            ctx.fill();

            if (!path) return;

            // Everything below is clipped to the sphere.
            ctx.save();
            ctx.beginPath();
            ctx.arc(c, c, radius, 0, Math.PI * 2);
            ctx.clip();

            // ── Graticule ──
            ctx.beginPath();
            path(d3.geoGraticule10());
            ctx.strokeStyle = 'rgba(255,255,255,0.055)';
            ctx.lineWidth = 0.6;
            ctx.stroke();

            // ── Land ──
            if (land) {
                ctx.beginPath();
                path(land);
                const soil = ctx.createLinearGradient(c - radius, c - radius, c + radius, c + radius);
                soil.addColorStop(0, LAND_LIT);
                soil.addColorStop(1, LAND_DEEP);
                ctx.fillStyle = soil;
                ctx.fill();
                ctx.strokeStyle = 'rgba(20,24,29,0.5)';
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }

            // ── Country borders, very faint ──
            if (borders) {
                ctx.beginPath();
                path(borders);
                ctx.strokeStyle = 'rgba(255,255,255,0.10)';
                ctx.lineWidth = 0.45;
                ctx.stroke();
            }

            // ── Limb darkening: radially even, so the sphere reads round rather
            //    than split into a light half and a dark half. Applied before the
            //    network, so the routes and beams stay crisp on top of it. ──
            const limb = ctx.createRadialGradient(c, c, radius * 0.42, c, c, radius);
            limb.addColorStop(0, 'rgba(8,10,13,0)');
            limb.addColorStop(0.78, 'rgba(8,10,13,0.24)');
            limb.addColorStop(1, 'rgba(5,6,8,0.66)');
            ctx.fillStyle = limb;
            ctx.beginPath();
            ctx.arc(c, c, radius, 0, Math.PI * 2);
            ctx.fill();

            const centre = projection.invert([c, c]);

            // ── Routes: the standing great-circle path of every run out of the HQ.
            //    d3 clips each one to the near hemisphere, so they disappear round
            //    the limb instead of cutting across the sphere. ──
            ctx.strokeStyle = 'rgba(201,168,76,0.22)';
            ctx.lineWidth = 0.9;
            routePoints.forEach((points) => {
                ctx.beginPath();
                path({ type: 'LineString', coordinates: points });
                ctx.stroke();
            });

            // ── Beams: a pulse of light runs outward along one route after another. ──
            if (beamsOn) {
                routePoints.forEach((points, i) => {
                    const phase = (((clockS - i * BEAM_STAGGER_S) % BEAM_CYCLE_S) + BEAM_CYCLE_S) % BEAM_CYCLE_S;
                    const progress = phase / BEAM_TRAVEL_S;
                    if (progress > 1) return; // this route is between pulses

                    const head = Math.round(progress * (ROUTE_SAMPLES - 1));
                    const tail = Math.max(2, Math.round(ROUTE_SAMPLES * BEAM_TAIL));

                    for (let seg = 0; seg < BEAM_SEGMENTS; seg++) {
                        const from = Math.max(0, head - Math.round((tail * (BEAM_SEGMENTS - seg)) / BEAM_SEGMENTS));
                        const to = Math.max(0, head - Math.round((tail * (BEAM_SEGMENTS - seg - 1)) / BEAM_SEGMENTS));
                        if (to - from < 1) continue;
                        const heat = (seg + 1) / BEAM_SEGMENTS;
                        ctx.beginPath();
                        path({ type: 'LineString', coordinates: points.slice(from, to + 1) });
                        ctx.strokeStyle = `rgba(233,208,143,${0.10 + 0.78 * heat})`;
                        ctx.lineWidth = 0.9 + 1.7 * heat;
                        ctx.stroke();
                    }

                    // Bright head, while it faces the viewer.
                    const tip = points[head];
                    if (centre && d3.geoDistance(tip, centre) < Math.PI / 2) {
                        const at = projection(tip);
                        if (at) {
                            const flare = radius * 0.05;
                            const glow = ctx.createRadialGradient(at[0], at[1], 0, at[0], at[1], flare);
                            glow.addColorStop(0, 'rgba(255,245,214,0.9)');
                            glow.addColorStop(0.3, 'rgba(201,168,76,0.4)');
                            glow.addColorStop(1, 'rgba(201,168,76,0)');
                            ctx.fillStyle = glow;
                            ctx.beginPath();
                            ctx.arc(at[0], at[1], flare, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                });
            }

            // ── Nodes: every location the flat world map shows, the HQ picked out in gold. ──
            if (centre) {
                TRADE_LOCATIONS.forEach((location) => {
                    const at: [number, number] = [location.lng, location.lat];
                    const angle = d3.geoDistance(at, centre);
                    if (angle > Math.PI / 2) return; // far side of the sphere
                    const point = projection(at);
                    if (!point) return;

                    // Fade toward the limb, so the markers read as sitting on a sphere.
                    const depth = 1 - angle / (Math.PI / 2);
                    const alpha = 0.3 + 0.7 * depth;

                    if (location.isHQ) {
                        ctx.globalAlpha = alpha;
                        ctx.beginPath();
                        ctx.arc(point[0], point[1], radius * 0.021, 0, Math.PI * 2);
                        ctx.fillStyle = GOLD;
                        ctx.fill();
                        ctx.strokeStyle = GOLD;
                        ctx.globalAlpha = alpha * 0.55;
                        ctx.lineWidth = 1.4;
                        ctx.beginPath();
                        ctx.arc(point[0], point[1], radius * 0.042, 0, Math.PI * 2);
                        ctx.stroke();
                        ctx.globalAlpha = alpha * 0.24;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.arc(point[0], point[1], radius * 0.064, 0, Math.PI * 2);
                        ctx.stroke();
                    } else {
                        ctx.globalAlpha = alpha * 0.9;
                        ctx.beginPath();
                        ctx.arc(point[0], point[1], radius * 0.0105, 0, Math.PI * 2);
                        ctx.fillStyle = NODE;
                        ctx.fill();
                        ctx.globalAlpha = alpha * 0.3;
                        ctx.lineWidth = 0.9;
                        ctx.strokeStyle = NODE;
                        ctx.beginPath();
                        ctx.arc(point[0], point[1], radius * 0.022, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                    ctx.globalAlpha = 1;
                });
            }

            ctx.restore();

            // ── Rim highlight ──
            ctx.beginPath();
            ctx.arc(c, c, radius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(214,221,229,0.24)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        function tick(now: number) {
            if (disposed) return;
            const elapsed = now - lastTick;
            if (elapsed >= 1000 / TARGET_FPS) {
                lastTick = now;
                clockS += elapsed / 1000;
                lambda = (lambda + DEG_PER_S * (elapsed / 1000)) % 360;
                if (projection) projection.rotate([lambda, INITIAL_PHI, AXIS_TILT]);
                draw();
            }
            frame = requestAnimationFrame(tick);
        }

        function stop() {
            if (frame) cancelAnimationFrame(frame);
            frame = 0;
        }

        /** Spin only while the globe is on screen, the tab is visible, and motion is welcome. */
        function sync() {
            beamsOn = !motionQuery.matches;
            const shouldRun = onScreen && !document.hidden && !motionQuery.matches;
            if (shouldRun && !frame) {
                lastTick = performance.now();
                frame = requestAnimationFrame(tick);
            } else if (!shouldRun) {
                stop();
                draw(); // hold a complete static frame
            }
        }

        async function init() {
            measure();
            draw(); // ocean + atmosphere immediately, before any network work

            const [d3Module, topoModule] = await Promise.all([
                import('d3'),
                import('topojson-client'),
            ]);
            if (disposed) return;
            d3 = d3Module;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const topojson = topoModule as any;

            // Routes first: the network draws even if the topology never arrives.
            const toHQ = d3.geoInterpolate;
            routePoints = ROUTES.map((target) => {
                const along = toHQ(HQ_COORDS, target);
                return Array.from(
                    { length: ROUTE_SAMPLES },
                    (_, i) => along(i / (ROUTE_SAMPLES - 1)) as [number, number],
                );
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let world: any = null;
            for (const url of [LOCAL_TOPOLOGY, REMOTE_TOPOLOGY]) {
                try {
                    world = await d3.json(url);
                    if (world) break;
                } catch {
                    // try the next source
                }
            }
            if (disposed) return;

            if (world) {
                land = topojson.feature(world, world.objects.land);
                borders = topojson.mesh(world, world.objects.countries, (a: unknown, b: unknown) => a !== b);
            }
            // Without topology the globe keeps its ocean, atmosphere and graticule —
            // the same half-sphere composition, just without coastlines.

            measure();
            sync();
        }

        const onResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (disposed) return;
                measure();
                draw();
            }, 200);
        };

        const onVisibility = () => sync();
        const onMotionChange = () => sync();

        const observer = typeof IntersectionObserver === 'function'
            ? new IntersectionObserver((entries) => {
                onScreen = entries.some((entry) => entry.isIntersecting);
                sync();
            }, { threshold: 0 })
            : null;
        observer?.observe(layer);

        window.addEventListener('resize', onResize);
        document.addEventListener('visibilitychange', onVisibility);
        motionQuery.addEventListener('change', onMotionChange);

        init();

        return () => {
            disposed = true;
            stop();
            clearTimeout(resizeTimer);
            observer?.disconnect();
            window.removeEventListener('resize', onResize);
            document.removeEventListener('visibilitychange', onVisibility);
            motionQuery.removeEventListener('change', onMotionChange);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            d3 = land = borders = projection = path = null;
        };
    }, []);

    return (
        // Purely decorative: hidden from assistive tech and out of the focus order.
        <div ref={layerRef} className="absolute inset-0 overflow-hidden" aria-hidden="true">
            {/* The square box's centre sits on the container's right edge, so exactly
                half the sphere is inside the viewport and the rest is clipped away. */}
            <div
                ref={boxRef}
                className="pointer-events-none absolute left-full top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
                {/* CSS sphere: the static fallback composition, drawn over by the canvas. */}
                <div
                    className="absolute inset-[3.5%] rounded-full"
                    style={{
                        background:
                            'radial-gradient(circle at 34% 32%, #4a525c 0%, #2b3138 55%, #15181d 100%)',
                        boxShadow: '0 0 90px 10px rgba(170,180,192,0.16)',
                    }}
                />
                <canvas ref={canvasRef} className="relative block h-full w-full" />
            </div>
        </div>
    );
}
