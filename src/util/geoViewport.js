import SphericalMercator from './sphericalmercator.js';

// The SphericalMercator library only accepts a variable
// tileSize on instantiation, which it uses to pre-cache
// calculations by zoom level.
// We cache each instantiation, keyed by tile size, to avoid
// repeating this cost when working with a single tile size
// (assumed to be the most-common use case).
var smCache = {};

function fetchMerc(tileSize) {
    tileSize = tileSize || 256;

    if (!smCache[tileSize]) {
        smCache[tileSize] = new SphericalMercator({ size: tileSize });
    }

    return smCache[tileSize];
};

function viewport(bounds, dimensions, minzoom, maxzoom, tileSize) {
    minzoom = (minzoom === undefined) ? 0 : minzoom;
    maxzoom = (maxzoom === undefined) ? 20 : maxzoom;
    var merc = fetchMerc(tileSize);
    var base = maxzoom,
        bl = merc.px([bounds[0], bounds[1]], base),
        tr = merc.px([bounds[2], bounds[3]], base),
        width = Math.abs(tr[0] - bl[0]),
        height = Math.abs(bl[1] - tr[1]),
        ratios = [width / dimensions[0], height / dimensions[1]],
        center = [(bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2],
        adjusted = Math.floor(Math.min(
            base - (Math.log(ratios[0]) / Math.log(2)),
            base - (Math.log(ratios[1]) / Math.log(2)))),
        zoom = Math.max(minzoom, Math.min(maxzoom, adjusted));

    return { center: center, zoom: zoom };
}

function bounds(viewport, zoom, dimensions, tileSize) {
    if (viewport.lon !== undefined) {
        viewport = [
            viewport.lon,
            viewport.lat
        ];
    }

    var merc = fetchMerc(tileSize);
    var px = merc.px(viewport, zoom);
    var tl = merc.ll([
        px[0] - (dimensions[0] / 2),
        px[1] - (dimensions[1] / 2)
    ], zoom);
    var br = merc.ll([
        px[0] + (dimensions[0] / 2),
        px[1] + (dimensions[1] / 2)
    ], zoom);
    return [tl[0], br[1], br[0], tl[1]];
}

function calcViewFromOuterPointsAndSize(outer_points, mapWidth, mapHeight) {
  const bounds = [
    outer_points.west,
    outer_points.south,
    outer_points.east,
    outer_points.north
  ];
  const size = [
    mapWidth,
    mapHeight
  ];

  return viewport(
    bounds,
    size
  );
}

var geoViewport = {
  viewport,
  bounds,
  calcViewFromOuterPointsAndSize
}

export default geoViewport;
