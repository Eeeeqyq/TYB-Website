/**
 * Geographic anchors for TYB's international presence.
 *
 * Index-aligned with `map.locations` in lib/translations.ts: entry n here supplies the
 * coordinates, entry n there supplies the name and detail, in every language. Both the
 * flat world map (components/ui/world-map.tsx) and the hero globe
 * (components/ui/hero-globe.tsx) read this array, so the two render the same network.
 *
 * Adding a location means adding coordinates here AND a label at the same index in all
 * three language blocks.
 */
export type TradeLocation = {
    lat: number;
    lng: number;
    /** Exactly one entry is the headquarters; it anchors every route arc. */
    isHQ?: boolean;
};

export const TRADE_LOCATIONS: readonly TradeLocation[] = [
    { lat: 13.75,  lng: 100.52, isHQ: true }, // Bangkok
    { lat: 16.87,  lng:  96.19 },             // Yangon
    { lat:  3.14,  lng: 101.69 },             // Kuala Lumpur
    { lat:  1.35,  lng: 103.82 },             // Singapore
    { lat: 10.82,  lng: 106.63 },             // Ho Chi Minh City
    { lat: 22.32,  lng: 114.17 },             // Hong Kong
    { lat: 39.91,  lng: 116.39 },             // Beijing
    { lat: 37.57,  lng: 126.98 },             // Seoul
    { lat: 43.26,  lng:  76.95 },             // Almaty
    { lat: 41.01,  lng:  28.95 },             // Istanbul
    { lat: 44.82,  lng:  20.46 },             // Belgrade
    { lat: 48.21,  lng:  16.37 },             // Vienna
    { lat: 47.38,  lng:   8.54 },             // Zurich
];

/** [lng, lat] of the headquarters, in the order d3's geo functions expect. */
export const HQ_COORDS: [number, number] = (() => {
    const hq = TRADE_LOCATIONS.find((l) => l.isHQ) ?? TRADE_LOCATIONS[0];
    return [hq.lng, hq.lat];
})();
