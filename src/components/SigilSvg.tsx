import React, { useId } from 'react';
import type {
  DraftingOptions,
  LayerId,
  LayerVisibility,
  SigilCoreSpec,
  SigilSpec,
} from '../types/sigil';
import {
  AlchemyGlyph,
  ArcaneRuneGlyph,
  ElementGlyph,
  LunarPhaseGlyph,
  PlanetGlyph,
} from '../engine/glyphPrimitives';
import {
  deriveInnerSealGlyphs,
  deriveMicroScriptItems,
} from '../engine/sigilEngine';

interface SigilSvgProps {
  spec: SigilSpec;
  visibility: LayerVisibility;
  options: DraftingOptions;
  hoveredLayer: LayerId | null;
  svgRef?: React.Ref<SVGSVGElement>;
  isThumbnail?: boolean;
  className?: string;
}

const CX = 420;
const CY = 420;
const CORE_UNIT_RADIUS = 272;

function polarToCartesian(cx: number, cy: number, radius: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: Number((cx + radius * Math.cos(rad)).toFixed(2)),
    y: Number((cy + radius * Math.sin(rad)).toFixed(2)),
  };
}

function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

function buildRegularPolygonPoints(
  cx: number,
  cy: number,
  radius: number,
  sides: number,
  rotationDeg: number
): string {
  const pts: string[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = rotationDeg + (i * 360) / sides;
    const { x, y } = polarToCartesian(cx, cy, radius, angle);
    pts.push(`${x},${y}`);
  }
  return pts.join(' ');
}

function buildStarSegments(
  cx: number,
  cy: number,
  radius: number,
  sides: number,
  step: number,
  rotationDeg: number
): Array<{ x1: number; y1: number; x2: number; y2: number }> {
  if (step <= 1) return [];
  const vertices = Array.from({ length: sides }, (_, i) =>
    polarToCartesian(cx, cy, radius, rotationDeg + (i * 360) / sides)
  );
  const segments: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
  for (let i = 0; i < sides; i++) {
    const p1 = vertices[i];
    const p2 = vertices[(i + step) % sides];
    segments.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y });
  }
  return segments;
}

function getCompoundLayoutMetrics(count: number): { offsetR: number; subRadius: number } {
  const offsetR = 278;
  const subRadius = count <= 4 ? 86 : count === 5 ? 82 : 76;
  return { offsetR, subRadius };
}

interface LayerVisualStyle {
  stroke: string;
  opacity: number;
}

interface SigilCoreLayersProps {
  core: Pick<SigilCoreSpec, 'polygons' | 'planets' | 'elements' | 'alchemy'>;
  visibility: LayerVisibility;
  strokeWeight: number;
  subScale: number;
  isCompound: boolean;
  hasSubSigils?: boolean;
  showSeedOfLife?: boolean;
  showDashedLines?: boolean;
  coreIndex: number;
  vPolygons: LayerVisualStyle;
  vPlanets: LayerVisualStyle;
  vElements: LayerVisualStyle;
  vAlchemy: LayerVisualStyle;
}

const SigilCoreLayers: React.FC<SigilCoreLayersProps> = ({
  core,
  visibility,
  strokeWeight,
  subScale,
  isCompound,
  hasSubSigils = false,
  showSeedOfLife = true,
  showDashedLines = false,
  coreIndex,
  vPolygons,
  vPlanets,
  vElements,
  vAlchemy,
}) => {
  const rawClipId = useId();
  const sacredClipId = `sacred-clip-${rawClipId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  // Compensate stroke weight when scaled inside a satellite sub-sigil so ink lines stay crisp
  const cw = subScale < 1 ? strokeWeight / Math.pow(subScale, 0.72) : strokeWeight;
  const polyRadius = isCompound ? 248 : hasSubSigils ? 246 : 262;
  const binduRadius = 44;
  const elementsRadius = 80;
  const planetOrbitRadius = 176;

  const primaryPolygonPts = buildRegularPolygonPoints(
    CX,
    CY,
    polyRadius,
    core.polygons.sides,
    core.polygons.rotationDeg
  );
  const starSegments = buildStarSegments(
    CX,
    CY,
    polyRadius,
    core.polygons.sides,
    core.polygons.starStep,
    core.polygons.rotationDeg
  );
  const inscribedRadius = polyRadius * Math.cos(Math.PI / core.polygons.sides);
  const isOuterTriangle = core.polygons.sides === 3;
  const directFitRadius = isOuterTriangle
    ? inscribedRadius * 0.78
    : isCompound
    ? Math.min(198, inscribedRadius * 0.84)
    : Math.min(hasSubSigils ? 204 : 194, inscribedRadius * 0.85);
  const yantraRadius = isOuterTriangle
    ? inscribedRadius * 0.8
    : isCompound
    ? Math.min(204, inscribedRadius * 0.86)
    : Math.min(hasSubSigils ? 202 : 196, inscribedRadius * 0.86);
  const innerPolyRadius = directFitRadius;
  const innerRotationDeg =
    core.polygons.rotationDeg + 180 / Math.max(3, core.polygons.innerSides) + 15;
  const innerPolygonPts = buildRegularPolygonPoints(
    CX,
    CY,
    innerPolyRadius,
    core.polygons.innerSides,
    innerRotationDeg
  );

  // Seed / Flower of Life lattice centers inside the Level 2 containment band
  const sacredClipRadius = hasSubSigils ? 198 : 192;
  const folRadius = Number((sacredClipRadius / 3).toFixed(2));
  const folCenters = [
    { x: CX, y: CY },
    ...Array.from({ length: 6 }, (_, i) =>
      polarToCartesian(CX, CY, folRadius, i * 60 + core.polygons.rotationDeg)
    ),
    ...Array.from({ length: 6 }, (_, i) =>
      polarToCartesian(CX, CY, folRadius * 2, i * 60 + core.polygons.rotationDeg)
    ),
    ...Array.from({ length: 6 }, (_, i) =>
      polarToCartesian(CX, CY, folRadius * Math.sqrt(3), i * 60 + 30 + core.polygons.rotationDeg)
    ),
  ];

  // Guarantee edge-to-edge (apothem) separation so Level 3 never runs parallel beside a triangle or polygon edge
  const level2InnerApothem =
    core.polygons.yantraTriangles === 1
      ? yantraRadius * 0.5
      : starSegments.length > 0
      ? polyRadius * Math.cos((core.polygons.starStep * Math.PI) / core.polygons.sides)
      : innerPolyRadius * Math.cos(Math.PI / core.polygons.innerSides);
  const l3EdgeRatio = Math.cos(
    (Math.max(1, core.polygons.tertiaryStarStep) * Math.PI) /
      Math.max(3, core.polygons.tertiarySides)
  );
  const level2HasTriangleSides =
    core.polygons.yantraTriangles === 1 ||
    (starSegments.length === 0 && core.polygons.innerSides === 3);

  const tertiaryRadius = (() => {
    if (isOuterTriangle) {
      return Number(Math.max(58, Math.min(74, level2InnerApothem - 16)).toFixed(2));
    }
    if (level2HasTriangleSides) {
      const minCap = isCompound ? 128 : 134;
      const maxCap = isCompound ? 154 : 156;
      const candidateOut = (level2InnerApothem + 26) / Math.max(0.45, l3EdgeRatio);
      if (l3EdgeRatio >= 0.72 || candidateOut <= maxCap) {
        return Number(Math.max(minCap, Math.min(maxCap, candidateOut)).toFixed(2));
      }
      const candidateIn = (level2InnerApothem - 24) / Math.max(0.28, l3EdgeRatio);
      return Number(Math.max(isCompound ? 98 : 124, Math.min(maxCap, candidateIn)).toFixed(2));
    }
    const tertiaryClearTarget = Math.min(level2InnerApothem * 0.74, level2InnerApothem - 24);
    if (isCompound) {
      return level2InnerApothem >= 140
        ? Number(Math.max(96, Math.min(132, tertiaryClearTarget)).toFixed(2))
        : Number(Math.max(102, Math.min(120, level2InnerApothem * 0.92)).toFixed(2));
    }
    return level2InnerApothem >= 140
      ? Number(Math.max(122, Math.min(138, tertiaryClearTarget)).toFixed(2))
      : Number(Math.max(124, Math.min(136, level2InnerApothem * 0.92)).toFixed(2));
  })();
  const tertiaryRotationDeg =
    core.polygons.rotationDeg + 180 / Math.max(3, core.polygons.tertiarySides);

  const tertiaryStarSegments =
    core.polygons.tertiaryStarStep > 1
      ? buildStarSegments(
          CX,
          CY,
          tertiaryRadius,
          core.polygons.tertiarySides,
          core.polygons.tertiaryStarStep,
          tertiaryRotationDeg
        )
      : [];
  const tertiaryPolygonPts =
    tertiaryStarSegments.length === 0
      ? buildRegularPolygonPoints(
          CX,
          CY,
          tertiaryRadius,
          core.polygons.tertiarySides,
          tertiaryRotationDeg
        )
      : '';

  const elementAngles =
    core.elements.quadrantCount === 4
      ? [0, 90, 180, 270].map((a) => (a + core.elements.rotationDeg) % 360)
      : [0, 180].map((a) => (a + core.elements.rotationDeg) % 360);

  const idSuffix = isCompound ? `-${coreIndex}` : '';

  const anyCoreLayerVisible = isCompound
    ? visibility.polygons || visibility.alchemy
    : visibility.polygons || visibility.planets || visibility.elements || visibility.alchemy;

  return (
    <g>
      <defs>
        <clipPath id={sacredClipId}>
          <circle cx={CX} cy={CY} r={sacredClipRadius} />
        </clipPath>
      </defs>

      {/* Opaque masking disc for docked satellite sub-sigils so main sigil lines behind them are cleanly occluded */}
      {isCompound && anyCoreLayerVisible && (
        <circle cx={CX} cy={CY} r={286} fill="#FFFFFF" />
      )}

      {/* LAYER 4: SACRED GEOMETRY, POLYGONS & STARS (3 LEVELS, MAX 2 IDENTICAL SHAPES) */}
      {visibility.polygons && (
        <g
          id={`layer-polygons${idSuffix}`}
          opacity={vPolygons.opacity}
          style={{ transition: 'opacity 180ms ease' }}
        >
          {/* Single containment border for docked satellite sub-sigil (Tier 2: Medium weight) */}
          {isCompound && (
            <circle
              data-ink-role="primary"
              cx={CX}
              cy={CY}
              r={278}
              fill="none"
              stroke={vPolygons.stroke}
              strokeWidth={cw * 0.92}
            />
          )}

          {/* Seed of Life / Flower of Life Sacred Lattice (Main sigil only, Tier 1: Fine) */}
          {!isCompound && (
            <g
              data-seed-of-life="true"
              clipPath={`url(#${sacredClipId})`}
              opacity={0.36}
              display={showSeedOfLife ? undefined : 'none'}
            >
              {folCenters.map((c, idx) => (
                <circle
                  key={`fol-${idx}`}
                  data-ink-role="primary"
                  cx={c.x}
                  cy={c.y}
                  r={folRadius}
                  fill="none"
                  stroke={vPolygons.stroke}
                  strokeWidth={cw * 0.42}
                />
              ))}
            </g>
          )}

          {/* Level 1: Outer Regular Containment Polygon (Tier 2: Medium weight) */}
          <polygon
            data-ink-role="primary"
            points={primaryPolygonPts}
            fill="none"
            stroke={vPolygons.stroke}
            strokeWidth={cw * 0.9}
            strokeLinejoin="round"
          />

          {/* Level 2 (Mutually exclusive so polygonal/star shapes never nest > 2 levels, Tier 2: Medium weight) */}
          {core.polygons.yantraTriangles === 1 ? (
            <g>
              <polygon
                data-ink-role="primary"
                points={buildRegularPolygonPoints(
                  CX,
                  CY,
                  yantraRadius,
                  3,
                  core.polygons.rotationDeg
                )}
                fill="none"
                stroke={vPolygons.stroke}
                strokeWidth={cw * 0.8}
                strokeLinejoin="round"
              />
              <polygon
                data-ink-role="primary"
                points={buildRegularPolygonPoints(
                  CX,
                  CY,
                  yantraRadius,
                  3,
                  core.polygons.rotationDeg + 180
                )}
                fill="none"
                stroke={vPolygons.stroke}
                strokeWidth={cw * 0.8}
                strokeLinejoin="round"
              />
            </g>
          ) : starSegments.length > 0 ? (
            <>
              {starSegments.map((seg, idx) => (
                <line
                  key={`star-seg-${idx}`}
                  data-ink-role="primary"
                  x1={seg.x1}
                  y1={seg.y1}
                  x2={seg.x2}
                  y2={seg.y2}
                  stroke={vPolygons.stroke}
                  strokeWidth={cw * 0.8}
                  strokeLinecap="round"
                />
              ))}
            </>
          ) : (
            <polygon
              data-ink-role="primary"
              points={innerPolygonPts}
              fill="none"
              stroke={vPolygons.stroke}
              strokeWidth={cw * 0.78}
              strokeLinejoin="round"
            />
          )}

          {/* Level 3: Third Inner Polygon or Star (replaces Element circle on sub-sigils; never 3 plain polygons or >2 identical shapes) */}
          {tertiaryStarSegments.length > 0 ? (
            <>
              {tertiaryStarSegments.map((seg, idx) => (
                <line
                  key={`tertiary-star-${idx}`}
                  data-ink-role="primary"
                  x1={seg.x1}
                  y1={seg.y1}
                  x2={seg.x2}
                  y2={seg.y2}
                  stroke={vPolygons.stroke}
                  strokeWidth={cw * 0.68}
                  strokeLinecap="round"
                />
              ))}
            </>
          ) : (
            <polygon
              data-ink-role="primary"
              points={tertiaryPolygonPts}
              fill="none"
              stroke={vPolygons.stroke}
              strokeWidth={cw * 0.68}
              strokeLinejoin="round"
            />
          )}

          {/* Optional Inscribed Tangent Circle (Main sigil only so sub-sigils never stack >2 circles, Tier 1: Fine dashed) */}
          {!isCompound && core.polygons.showInscribedCircle && (
            <g
              data-dashed-line="true"
              display={showDashedLines ? undefined : 'none'}
              opacity={0.58}
            >
              <circle
                data-ink-role="primary"
                cx={CX}
                cy={CY}
                r={inscribedRadius}
                fill="none"
                stroke={vPolygons.stroke}
                strokeWidth={cw * 0.48}
                strokeDasharray="3 4"
              />
            </g>
          )}
        </g>
      )}

      {/* LAYER 5: PLANETARY ALIGNMENTS (Main sigil only) */}
      {!isCompound && visibility.planets && (
        <g
          id={`layer-planets${idSuffix}`}
          opacity={vPlanets.opacity}
          style={{ transition: 'opacity 180ms ease' }}
        >
          <circle
            data-dashed-line="true"
            display={showDashedLines ? undefined : 'none'}
            data-ink-role="primary"
            cx={CX}
            cy={CY}
            r={planetOrbitRadius}
            fill="none"
            stroke={vPlanets.stroke}
            strokeWidth={cw * 0.7}
            strokeDasharray="5 3"
          />

          {core.planets.showAspectChords &&
            core.planets.aspects.map((asp, idx) => {
              const p1 = polarToCartesian(CX, CY, planetOrbitRadius, asp.fromDeg);
              const p2 = polarToCartesian(CX, CY, planetOrbitRadius, asp.toDeg);
              const isHard = asp.type === 'square' || asp.type === 'opposition';
              return (
                <line
                  key={`aspect-${idx}`}
                  data-dashed-line={isHard ? undefined : 'true'}
                  display={isHard || showDashedLines ? undefined : 'none'}
                  data-ink-role="primary"
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={vPlanets.stroke}
                  strokeWidth={isHard ? cw * 0.85 : cw * 0.6}
                  strokeDasharray={isHard ? undefined : '3 3'}
                  opacity={0.78}
                />
              );
            })}

          {core.planets.nodes.map((node) => {
            const pos = polarToCartesian(CX, CY, planetOrbitRadius, node.angleDeg);
            return (
              <g key={`planet-${node.planet}`} transform={`translate(${pos.x}, ${pos.y})`}>
                <circle
                  cx={0}
                  cy={0}
                  r={12}
                  fill="#FFFFFF"
                  stroke={vPlanets.stroke}
                  strokeWidth={cw * 0.85}
                  data-ink-role="primary"
                />
                <PlanetGlyph
                  planet={node.planet}
                  size={15.5}
                  stroke={vPlanets.stroke}
                  strokeWidth={cw * 0.85}
                />
              </g>
            );
          })}
        </g>
      )}

      {/* LAYER 6: CLASSICAL ELEMENTS (EARTH, AIR, FIRE, WATER) (Main sigil only; replaced in sub-sigils by 3rd polygon) */}
      {!isCompound && visibility.elements && (
        <g
          id={`layer-elements${idSuffix}`}
          opacity={vElements.opacity}
          style={{ transition: 'opacity 180ms ease' }}
        >
          <circle
            data-ink-role="primary"
            cx={CX}
            cy={CY}
            r={elementsRadius}
            fill="none"
            stroke={vElements.stroke}
            strokeWidth={cw * 0.65}
          />

          {elementAngles.map((deg, idx) => {
              const inner = polarToCartesian(CX, CY, binduRadius, deg);
              const outer = polarToCartesian(CX, CY, elementsRadius, deg);
              return (
                <line
                  key={`el-axis-${idx}`}
                  data-ink-role="primary"
                  x1={inner.x}
                  y1={inner.y}
                  x2={outer.x}
                  y2={outer.y}
                  stroke={vElements.stroke}
                  strokeWidth={cw * 0.75}
                />
              );
            })}

          {elementAngles.map((deg, idx) => {
              const pos = polarToCartesian(CX, CY, elementsRadius, deg);
              const element = idx % 2 === 0 ? core.elements.primary : core.elements.secondary;
              return (
                <g key={`el-node-${idx}`} transform={`translate(${pos.x}, ${pos.y})`}>
                  <circle
                    cx={0}
                    cy={0}
                    r={11.5}
                    fill="#FFFFFF"
                    stroke={vElements.stroke}
                    strokeWidth={cw * 0.8}
                    data-ink-role="primary"
                  />
                  <ElementGlyph
                    element={element}
                    size={14}
                    stroke={vElements.stroke}
                    strokeWidth={cw * 0.9}
                  />
                </g>
              );
            })}
        </g>
      )}

      {/* LAYER 7: ALCHEMICAL & BINDU CORE (Tier 3: Commanding hand-inked core) */}
      {visibility.alchemy && (
        <g
          id={`layer-alchemy${idSuffix}`}
          opacity={vAlchemy.opacity}
          style={{ transition: 'opacity 180ms ease' }}
        >
          <circle
            data-ink-role="primary"
            cx={CX}
            cy={CY}
            r={binduRadius}
            fill="#FFFFFF"
            stroke={vAlchemy.stroke}
            strokeWidth={subScale < 1 ? (strokeWeight * 1.45) / subScale : cw * 1.45}
          />
          {!isCompound && (
            <>
              <circle
                data-ink-role="primary"
                cx={CX}
                cy={CY}
                r={37}
                fill="none"
                stroke={vAlchemy.stroke}
                strokeWidth={cw * 0.52}
              />

              {[0, 90, 180, 270].map((offset) => {
                const deg = (core.alchemy.rotationDeg + offset) % 360;
                const p1 = polarToCartesian(CX, CY, 37, deg);
                const p2 = polarToCartesian(CX, CY, binduRadius, deg);
                return (
                  <line
                    key={`alc-tick-${offset}`}
                    data-ink-role="primary"
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={vAlchemy.stroke}
                    strokeWidth={cw * 1.0}
                  />
                );
              })}
            </>
          )}

          {/* Primary Alchemical Emblem */}
          <g transform={`translate(${CX}, ${CY})`}>
            <AlchemyGlyph
              symbol={core.alchemy.primary}
              size={38}
              stroke={vAlchemy.stroke}
              strokeWidth={subScale < 1 ? (strokeWeight * 1.25) / subScale : cw * 1.4}
            />
          </g>

          {/* Auxiliary Flanking Alchemical Nodes along rotation axis (Main sigil only) */}
          {!isCompound &&
            [0, 180].map((offset) => {
              const deg = (core.alchemy.rotationDeg + offset) % 360;
              const pos = polarToCartesian(CX, CY, 52, deg);
              return (
                <g key={`alc-aux-${offset}`} transform={`translate(${pos.x}, ${pos.y})`}>
                  <circle
                    cx={0}
                    cy={0}
                    r={9}
                    fill="#FFFFFF"
                    stroke={vAlchemy.stroke}
                    strokeWidth={cw * 0.75}
                    data-ink-role="primary"
                  />
                  <AlchemyGlyph
                    symbol={core.alchemy.auxiliary}
                    size={10.5}
                    stroke={vAlchemy.stroke}
                    strokeWidth={cw * 0.8}
                  />
                </g>
              );
            })}
        </g>
      )}
    </g>
  );
};

export const SigilSvg: React.FC<SigilSvgProps> = ({
  spec,
  visibility,
  options,
  hoveredLayer,
  svgRef,
  isThumbnail = false,
  className = '',
}) => {
  const w = options.strokeWeight;
  const isCompound = spec.subSigils.length >= 1;

  const getLayerVisuals = (layerId: LayerId): LayerVisualStyle => {
    if (!hoveredLayer || isThumbnail) {
      return { stroke: '#111315', opacity: 1 };
    }
    if (hoveredLayer === layerId) {
      return { stroke: '#1D4ED8', opacity: 1 };
    }
    return { stroke: '#111315', opacity: 0.22 };
  };

  // Celestial anchors
  const lunarPos = polarToCartesian(CX, CY, 348, spec.celestial.lunarAngleDeg);
  const solarPos = polarToCartesian(CX, CY, 348, spec.celestial.solarAngleDeg);

  const celestialChords: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
  for (let i = 0; i < spec.celestial.chordCount; i++) {
    const a1 = spec.celestial.lunarAngleDeg + i * 90;
    const a2 = spec.celestial.solarAngleDeg + i * 60;
    const p1 = polarToCartesian(CX, CY, 348, a1);
    const p2 = polarToCartesian(CX, CY, 348, a2);
    celestialChords.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y });
  }

  // Doctor Strange segmented eldritch arc angles (15° spacing)
  const eldritchArcSpans = [0, 90, 180, 270].map((base) => ({
    start: (base + 15 + spec.celestial.rotationDeg) % 360,
    end: (base + 75 + spec.celestial.rotationDeg) % 360,
  }));

  // Layer visual styles
  const vBounding = getLayerVisuals('bounding');
  const vCelestial = getLayerVisuals('celestial');
  const vRunes = getLayerVisuals('runes');
  const vPolygons = getLayerVisuals('polygons');
  const vPlanets = getLayerVisuals('planets');
  const vElements = getLayerVisuals('elements');
  const vAlchemy = getLayerVisuals('alchemy');

  // Docked satellite sub-sigil placements centered on the inner rail (r = 278) of the Arcane Runes & Seals bar
  const compoundMetrics = getCompoundLayoutMetrics(spec.subSigils.length);
  const compoundScale = compoundMetrics.subRadius / 286;
  const subPlacements = spec.subSigils.map((core, idx) => {
    const angle = (spec.compoundAxisDeg + (idx * 360) / spec.subSigils.length) % 360;
    const center = polarToCartesian(CX, CY, compoundMetrics.offsetR, angle);
    return { core, idx, angle, center };
  });

  const guideRadii = isCompound
    ? [80, 176, 246, 255, 278, 300, 348]
    : [80, 176, 214, 262, 278, 300, 348];

  const microScriptRadius = isCompound ? 264 : 270;
  const microScriptBoundaryRadius = isCompound ? 255 : 263;
  const microScriptItems = !isThumbnail
    ? deriveMicroScriptItems(spec).map((item) => ({
        ...item,
        ...polarToCartesian(CX, CY, microScriptRadius, item.angleDeg),
      }))
    : [];
  const innerSealGlyphs = !isThumbnail ? deriveInnerSealGlyphs(spec) : [];

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 840 840"
      className={className}
      role="img"
      aria-label={`Arcane sigil drafted for ${spec.text || 'empty phrase'}`}
    >
      {/* Tier 1: Drafting Compass Guides — Fine, faint dashed vector lines (Excluded from export unless requested) */}
      {!isThumbnail && options.showGridGuides && (
        <g data-drafting-guide="true" opacity={0.48}>
          {Array.from({ length: 24 }, (_, idx) => {
            const deg = idx * 15;
            const isMajor = deg % 45 === 0;
            const inner = polarToCartesian(CX, CY, isCompound ? 24 : 44, deg);
            const outer = polarToCartesian(CX, CY, 396, deg);
            return (
              <line
                key={`ray-${deg}`}
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke={isMajor ? '#C4C0B6' : '#DDD9D0'}
                strokeWidth={isMajor ? 0.65 : 0.45}
                strokeDasharray={isMajor ? '4 4' : '1.5 4.5'}
              />
            );
          })}

          {guideRadii.map((r) => (
            <circle
              key={`guide-r-${r}`}
              cx={CX}
              cy={CY}
              r={r}
              fill="none"
              stroke="#DDD9D0"
              strokeWidth={0.5}
              strokeDasharray="2 5"
            />
          ))}
        </g>
      )}

      {/* Degree Labels around outer perimeter */}
      {!isThumbnail && options.showDegreeLabels && (
        <g data-drafting-guide="true">
          {Array.from({ length: 24 }, (_, idx) => {
            const deg = idx * 15;
            const isMajor = deg % 45 === 0;
            const pos = polarToCartesian(CX, CY, 405, deg);
            return (
              <text
                key={`deg-lbl-${deg}`}
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={isMajor ? '10.5' : '9'}
                fontFamily="IBM Plex Mono, monospace"
                fontWeight={isMajor ? '500' : '400'}
                fill={isMajor ? '#4B4F56' : '#8A8E96'}
              >
                {deg}°
              </text>
            );
          })}
        </g>
      )}

      {/* LAYER 1: SINGULAR BOUNDING CIRCLE & ELDRITCH ARCS (Tier 2: Medium containment weight) */}
      <g
        id="layer-bounding"
        data-bounding-layer="true"
        opacity={vBounding.opacity}
        display={visibility.bounding ? undefined : 'none'}
        style={{ transition: 'opacity 180ms ease' }}
      >
          {/* Primary Singular Outer Circle */}
          <circle
            data-ink-role="primary"
            cx={CX}
            cy={CY}
            r={380}
            fill="none"
            stroke={vBounding.stroke}
            strokeWidth={w * 1.05}
          />
          {spec.bounding.doubleRing && (
            <circle
              data-ink-role="primary"
              cx={CX}
              cy={CY}
              r={368}
              fill="none"
              stroke={vBounding.stroke}
              strokeWidth={w * 0.52}
            />
          )}

          {/* Fine 5° protractor degree ticks between 15° intervals */}
          {!isThumbnail && spec.bounding.protractorTicks && (
            <g opacity={0.45}>
              {Array.from({ length: 72 }, (_, i) => {
                if (i % 3 === 0) return null;
                const deg = i * 5;
                const p1 = polarToCartesian(CX, CY, 376, deg);
                const p2 = polarToCartesian(CX, CY, 383, deg);
                return (
                  <line
                    key={`b-micro-tick-${deg}`}
                    data-ink-role="primary"
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={vBounding.stroke}
                    strokeWidth={w * 0.38}
                  />
                );
              })}
            </g>
          )}

          {/* Doctor Strange Segmented Eldritch Arc Brackets */}
          {spec.bounding.eldritchArcs &&
            eldritchArcSpans.map((span, idx) => {
              const sAbs = span.start;
              const eAbs = span.end < span.start ? span.end + 360 : span.end;
              const pStartIn = polarToCartesian(CX, CY, 357, sAbs);
              const pStartOut = polarToCartesian(CX, CY, 365, sAbs);
              const pEndIn = polarToCartesian(CX, CY, 357, eAbs);
              const pEndOut = polarToCartesian(CX, CY, 365, eAbs);
              return (
                <g key={`eldritch-arc-${idx}`}>
                  <path
                    data-ink-role="primary"
                    d={describeArc(CX, CY, 361, sAbs, eAbs)}
                    fill="none"
                    stroke={vBounding.stroke}
                    strokeWidth={w * 0.85}
                    strokeLinecap="butt"
                  />
                  <line
                    data-ink-role="primary"
                    x1={pStartIn.x}
                    y1={pStartIn.y}
                    x2={pStartOut.x}
                    y2={pStartOut.y}
                    stroke={vBounding.stroke}
                    strokeWidth={w * 0.85}
                  />
                  <line
                    data-ink-role="primary"
                    x1={pEndIn.x}
                    y1={pEndIn.y}
                    x2={pEndOut.x}
                    y2={pEndOut.y}
                    stroke={vBounding.stroke}
                    strokeWidth={w * 0.85}
                  />
                  <path
                    data-dashed-line="true"
                    display={options.showDashedLines ? undefined : 'none'}
                    data-ink-role="primary"
                    d={describeArc(CX, CY, 333, sAbs + 7.5, eAbs - 7.5)}
                    fill="none"
                    stroke={vBounding.stroke}
                    strokeWidth={w * 0.55}
                    strokeDasharray="2 4"
                    opacity={0.75}
                  />
                </g>
              );
            })}

          {/* 24 Protractor Ticks on 15-degree intervals */}
          {spec.bounding.protractorTicks &&
            Array.from({ length: 24 }, (_, i) => {
              const deg = i * 15;
              const isCardinal = deg % 90 === 0;
              const p1 = polarToCartesian(CX, CY, isCardinal ? 368 : 374, deg);
              const p2 = polarToCartesian(CX, CY, isCardinal ? 390 : 380, deg);
              return (
                <line
                  key={`b-tick-${deg}`}
                  data-ink-role="primary"
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={vBounding.stroke}
                  strokeWidth={isCardinal ? w * 1.1 : w * 0.65}
                />
              );
            })}
        </g>

      {/* LAYER 2: CELESTIAL MARKERS */}
      {visibility.celestial && (
        <g
          id="layer-celestial"
          opacity={vCelestial.opacity}
          style={{ transition: 'opacity 180ms ease' }}
        >
          <circle
            data-ink-role="primary"
            cx={CX}
            cy={CY}
            r={348}
            fill="none"
            stroke={vCelestial.stroke}
            strokeWidth={w * 0.7}
          />

          {celestialChords.map((c, idx) => (
            <line
              key={`cel-chord-${idx}`}
              data-dashed-line="true"
              display={options.showDashedLines ? undefined : 'none'}
              data-ink-role="primary"
              x1={c.x1}
              y1={c.y1}
              x2={c.x2}
              y2={c.y2}
              stroke={vCelestial.stroke}
              strokeWidth={w * 0.45}
              strokeDasharray="3 4"
              opacity={0.65}
            />
          ))}

          {Array.from({ length: 24 }, (_, idx) => {
            const deg = (idx * 15 + spec.celestial.rotationDeg) % 360;
            const pos = polarToCartesian(CX, CY, 348, deg);
            const isQuarter = idx % 6 === 0;
            return isQuarter ? (
              <g key={`cel-pip-${idx}`}>
                <circle
                  data-ink-role="primary"
                  cx={pos.x}
                  cy={pos.y}
                  r={4}
                  fill="#FFFFFF"
                  stroke={vCelestial.stroke}
                  strokeWidth={w * 0.75}
                />
                <circle
                  data-ink-role="fill-primary"
                  cx={pos.x}
                  cy={pos.y}
                  r={1.4}
                  fill={vCelestial.stroke}
                />
              </g>
            ) : (
              <circle
                key={`cel-pip-${idx}`}
                data-ink-role="fill-primary"
                cx={pos.x}
                cy={pos.y}
                r={1.6}
                fill={vCelestial.stroke}
              />
            );
          })}

          <g transform={`translate(${lunarPos.x}, ${lunarPos.y})`}>
            <circle
              cx={0}
              cy={0}
              r={15}
              fill="#FFFFFF"
              stroke={vCelestial.stroke}
              strokeWidth={w * 0.8}
              data-ink-role="primary"
            />
            <LunarPhaseGlyph
              phase={spec.celestial.lunarPhase}
              size={18}
              stroke={vCelestial.stroke}
              strokeWidth={w * 0.85}
            />
          </g>

          <g transform={`translate(${solarPos.x}, ${solarPos.y})`}>
            <circle
              cx={0}
              cy={0}
              r={15}
              fill="#FFFFFF"
              stroke={vCelestial.stroke}
              strokeWidth={w * 0.8}
              data-ink-role="primary"
            />
            <circle
              cx={0}
              cy={0}
              r={6.5}
              fill="none"
              stroke={vCelestial.stroke}
              strokeWidth={w * 0.85}
              data-ink-role="primary"
            />
            <circle
              cx={0}
              cy={0}
              r={2.2}
              fill={vCelestial.stroke}
              data-ink-role="fill-primary"
            />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((rayDeg) => {
              const p1 = polarToCartesian(0, 0, 8.5, rayDeg);
              const p2 = polarToCartesian(0, 0, 11.5, rayDeg);
              return (
                <line
                  key={`sun-ray-${rayDeg}`}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={vCelestial.stroke}
                  strokeWidth={w * 0.65}
                  data-ink-role="primary"
                />
              );
            })}
          </g>
        </g>
      )}

      {/* LAYER 3: 15-DEGREE ARCANE RUNES, SEALS & INNER MICRO-SCRIPT CHANNEL */}
      {visibility.runes && (
        <g
          id="layer-runes"
          opacity={vRunes.opacity}
          style={{ transition: 'opacity 180ms ease' }}
        >
          <g opacity={0.5}>
            <circle
              data-ink-role="primary"
              cx={CX}
              cy={CY}
              r={322}
              fill="none"
              stroke={vRunes.stroke}
              strokeWidth={w * 0.45}
            />
            <circle
              data-ink-role="primary"
              cx={CX}
              cy={CY}
              r={278}
              fill="none"
              stroke={vRunes.stroke}
              strokeWidth={w * 0.48}
            />
            <circle
              data-ink-role="primary"
              cx={CX}
              cy={CY}
              r={microScriptBoundaryRadius}
              fill="none"
              stroke={vRunes.stroke}
              strokeWidth={w * 0.44}
              strokeDasharray="2 3"
            />
          </g>

          {/* Inner Sub-Sigil Text: Repeating Direct Letter-Cipher Micro-Script Channel (r=264/270) */}
          {!isThumbnail && (
            <g opacity={0.62}>
              {microScriptItems.map((item, idx) => (
                <g
                  key={`micro-cipher-${idx}`}
                  transform={`translate(${item.x}, ${item.y}) rotate(${item.angleDeg})`}
                >
                  <ArcaneRuneGlyph
                    char={item.char}
                    size={isCompound ? 8.5 : 7}
                    stroke={vRunes.stroke}
                    strokeWidth={w * 0.45}
                  />
                </g>
              ))}
            </g>
          )}

          {/* Primary Outer Rune Ring at r = 300 */}
          {spec.runes.glyphs.map((glyph) => {
            const pos = polarToCartesian(CX, CY, 300, glyph.angleDeg);
            return (
              <g
                key={glyph.id}
                transform={`translate(${pos.x}, ${pos.y}) rotate(${glyph.angleDeg})`}
              >
                <circle cx={0} cy={0} r={14} fill="#FFFFFF" opacity={0.94} />
                <ArcaneRuneGlyph
                  char={glyph.char}
                  size={20}
                  stroke={vRunes.stroke}
                  strokeWidth={w * 0.92}
                />
              </g>
            );
          })}

          {/* Secondary Inner Rune Band (single-word only; uses canonical motif seal sequence) */}
          {innerSealGlyphs.map((item, idx) => {
            const pos = polarToCartesian(CX, CY, 214, item.angleDeg);
            return (
              <g
                key={`inner-${idx}-${item.angleDeg}`}
                transform={`translate(${pos.x}, ${pos.y}) rotate(${item.angleDeg})`}
              >
                <circle cx={0} cy={0} r={10.5} fill="#FFFFFF" opacity={0.94} />
                <ArcaneRuneGlyph
                  char={item.char}
                  size={14}
                  stroke={vRunes.stroke}
                  strokeWidth={w * 0.8}
                />
              </g>
            );
          })}
        </g>
      )}

      {/* MAIN WORD 1 SIGIL (CENTERED LAYERS 4–7) */}
      <SigilCoreLayers
        core={spec}
        visibility={visibility}
        strokeWeight={w}
        subScale={1}
        isCompound={false}
        hasSubSigils={isCompound}
        showSeedOfLife={options.showSeedOfLife}
        showDashedLines={options.showDashedLines}
        coreIndex={0}
        vPolygons={vPolygons}
        vPlanets={vPlanets}
        vElements={vElements}
        vAlchemy={vAlchemy}
      />

      {/* DOCKED SATELLITE SUB-SIGILS FOR SUBSEQUENT WORDS (CENTERED ON r = 278 INNER RUNE BAR RAIL) */}
      {isCompound &&
        subPlacements.map(({ core, idx, center }) => (
          <g
            key={`sub-sigil-${idx}-${core.word}`}
            transform={`translate(${center.x}, ${center.y}) scale(${compoundScale}) translate(${-CX}, ${-CY})`}
          >
            <SigilCoreLayers
              core={core}
              visibility={visibility}
              strokeWeight={w}
              subScale={compoundScale}
              isCompound
              showDashedLines={options.showDashedLines}
              coreIndex={idx}
              vPolygons={vPolygons}
              vPlanets={vPlanets}
              vElements={vElements}
              vAlchemy={vAlchemy}
            />
          </g>
        ))}

      {/* DYNAMIC ORBIT TETHERING: Resonant dotted gravitational arcs locking each satellite center back to the core wheel */}
      {isCompound && (visibility.polygons || visibility.alchemy) && (
        <g
          id="layer-orbit-tethers"
          data-dashed-line="true"
          display={options.showDashedLines ? undefined : 'none'}
          opacity={Math.min(vPolygons.opacity, vAlchemy.opacity) * 0.62}
          style={{ transition: 'opacity 180ms ease' }}
        >
          {subPlacements.map(({ idx, angle, center }) => {
            const satBinduR = 44 * compoundScale;
            const mainAnchor = polarToCartesian(CX, CY, 44, angle - 16);
            const mainCounterAnchor = polarToCartesian(CX, CY, 44, angle + 16);
            const satAnchor = polarToCartesian(center.x, center.y, satBinduR, angle + 180 + 22);
            const satCounterAnchor = polarToCartesian(center.x, center.y, satBinduR, angle + 180 - 22);

            const midR = (44 + (compoundMetrics.offsetR - satBinduR)) * 0.52;
            const ctrlPrimary = polarToCartesian(CX, CY, midR, angle - 26);
            const ctrlHarmonic = polarToCartesian(CX, CY, midR, angle + 26);

            // Midpoint along quadratic Bezier at t = 0.5
            const midNodeX = Number((0.25 * mainAnchor.x + 0.5 * ctrlPrimary.x + 0.25 * satAnchor.x).toFixed(2));
            const midNodeY = Number((0.25 * mainAnchor.y + 0.5 * ctrlPrimary.y + 0.25 * satAnchor.y).toFixed(2));

            return (
              <g key={`tether-${idx}`}>
                <path
                  data-ink-role="primary"
                  d={`M ${mainAnchor.x} ${mainAnchor.y} Q ${ctrlPrimary.x} ${ctrlPrimary.y} ${satAnchor.x} ${satAnchor.y}`}
                  fill="none"
                  stroke={vPolygons.stroke}
                  strokeWidth={w * 0.65}
                  strokeDasharray="1.8 4.2"
                  strokeLinecap="round"
                />
                <path
                  data-ink-role="primary"
                  d={`M ${mainCounterAnchor.x} ${mainCounterAnchor.y} Q ${ctrlHarmonic.x} ${ctrlHarmonic.y} ${satCounterAnchor.x} ${satCounterAnchor.y}`}
                  fill="none"
                  stroke={vPolygons.stroke}
                  strokeWidth={w * 0.45}
                  strokeDasharray="1.2 5.2"
                  strokeLinecap="round"
                />
                <circle
                  data-ink-role="fill-primary"
                  cx={mainAnchor.x}
                  cy={mainAnchor.y}
                  r={2.2}
                  fill={vPolygons.stroke}
                />
                <circle
                  data-ink-role="fill-primary"
                  cx={satAnchor.x}
                  cy={satAnchor.y}
                  r={2.2}
                  fill={vPolygons.stroke}
                />
                <circle
                  data-ink-role="primary"
                  cx={midNodeX}
                  cy={midNodeY}
                  r={3.2}
                  fill="#FFFFFF"
                  stroke={vPolygons.stroke}
                  strokeWidth={w * 0.6}
                />
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
};
