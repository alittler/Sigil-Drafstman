import React from 'react';
import type {
  AlchemySymbolId,
  ElementType,
  LunarPhase,
  PlanetId,
} from '../types/sigil';
import { ArcaneGlyphVector } from './runeCatalog';

interface GlyphProps {
  size?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
}

/**
 * Curated geometric node, polygon, triangle, starburst, syllabic, seal, or Futhark rune glyph.
 * Drawn inside a local [-size/2, size/2] coordinate space with uniform architectural linework.
 */
export const ArcaneRuneGlyph: React.FC<{
  char: string;
  size?: number;
  stroke?: string;
  strokeWidth?: number;
}> = ({ char, size = 24, stroke = '#111315', strokeWidth = 1.6 }) => (
  <ArcaneGlyphVector
    char={char}
    size={size}
    stroke={stroke}
    strokeWidth={strokeWidth}
  />
);

/**
 * Classical Elemental Triangles (Fire, Air, Water, Earth).
 */
export const ElementGlyph: React.FC<GlyphProps & { element: ElementType }> = ({
  element,
  size = 24,
  stroke = '#111315',
  strokeWidth = 1.6,
}) => {
  const r = size * 0.48;
  const h = r * 0.866;

  if (element === 'fire') {
    return (
      <g stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <polygon points={`0,${-r} ${h},${r * 0.6} ${-h},${r * 0.6}`} />
      </g>
    );
  }

  if (element === 'air') {
    return (
      <g stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <polygon points={`0,${-r} ${h},${r * 0.6} ${-h},${r * 0.6}`} />
        <line x1={-h * 0.78} y1={-r * 0.12} x2={h * 0.78} y2={-r * 0.12} />
      </g>
    );
  }

  if (element === 'water') {
    return (
      <g stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <polygon points={`0,${r} ${h},${-r * 0.6} ${-h},${-r * 0.6}`} />
      </g>
    );
  }

  // earth
  return (
    <g stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none">
      <polygon points={`0,${r} ${h},${-r * 0.6} ${-h},${-r * 0.6}`} />
      <line x1={-h * 0.78} y1={r * 0.12} x2={h * 0.78} y2={r * 0.12} />
    </g>
  );
};

/**
 * Classical Alchemical Symbols rendered with clean geometric primitives.
 */
export const AlchemyGlyph: React.FC<GlyphProps & { symbol: AlchemySymbolId }> = ({
  symbol,
  size = 36,
  stroke = '#111315',
  strokeWidth = 1.8,
}) => {
  const s = size / 2;
  const common = {
    stroke,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };

  switch (symbol) {
    case 'sulfur':
      // Triangle atop a cross
      return (
        <g {...common}>
          <polygon points={`0,${-s * 0.9} ${s * 0.56},${s * 0.05} ${-s * 0.56},${s * 0.05}`} />
          <line x1={0} y1={s * 0.05} x2={0} y2={s * 0.9} />
          <line x1={-s * 0.45} y1={s * 0.48} x2={s * 0.45} y2={s * 0.48} />
        </g>
      );
    case 'mercury':
      // Horns atop circle atop cross
      return (
        <g {...common}>
          <path d={`M ${-s * 0.4} ${-s * 0.8} A ${s * 0.4} ${s * 0.38} 0 0 0 ${s * 0.4} ${-s * 0.8}`} />
          <circle cx={0} cy={-s * 0.15} r={s * 0.34} />
          <line x1={0} y1={s * 0.19} x2={0} y2={s * 0.88} />
          <line x1={-s * 0.38} y1={s * 0.54} x2={s * 0.38} y2={s * 0.54} />
        </g>
      );
    case 'salt':
      // Circle bisected by horizontal bar
      return (
        <g {...common}>
          <circle cx={0} cy={0} r={s * 0.68} />
          <line x1={-s * 0.68} y1={0} x2={s * 0.68} y2={0} />
        </g>
      );
    case 'gold':
      // Circumpunct (Sun / Gold)
      return (
        <g {...common}>
          <circle cx={0} cy={0} r={s * 0.7} />
          <circle cx={0} cy={0} r={strokeWidth * 1.05} fill={stroke} stroke="none" />
        </g>
      );
    case 'silver':
      // Crescent (Luna / Silver)
      return (
        <g {...common}>
          <path d={`M ${s * 0.25} ${-s * 0.7} A ${s * 0.7} ${s * 0.7} 0 1 0 ${s * 0.25} ${s * 0.7} A ${s * 0.52} ${s * 0.68} 0 1 1 ${s * 0.25} ${-s * 0.7} Z`} />
        </g>
      );
    case 'copper':
      // Venus mirror
      return (
        <g {...common}>
          <circle cx={0} cy={-s * 0.24} r={s * 0.44} />
          <line x1={0} y1={s * 0.2} x2={0} y2={s * 0.86} />
          <line x1={-s * 0.36} y1={s * 0.54} x2={s * 0.36} y2={s * 0.54} />
        </g>
      );
    case 'iron':
      // Mars shield and spear
      return (
        <g {...common}>
          <circle cx={-s * 0.14} cy={s * 0.16} r={s * 0.44} />
          <line x1={s * 0.17} y1={-s * 0.15} x2={s * 0.68} y2={-s * 0.66} />
          <polyline points={`${s * 0.28},${-s * 0.66} ${s * 0.68},${-s * 0.66} ${s * 0.68},${-s * 0.26}`} />
        </g>
      );
    case 'tin':
      // Jupiter stylised 4-like glyph
      return (
        <g {...common}>
          <path d={`M ${-s * 0.48} ${-s * 0.38} A ${s * 0.34} ${s * 0.34} 0 1 1 ${-s * 0.08} ${s * 0.22} L ${-s * 0.56} ${s * 0.22} L ${s * 0.58} ${s * 0.22}`} />
          <line x1={s * 0.22} y1={-s * 0.68} x2={s * 0.22} y2={s * 0.78} />
        </g>
      );
    case 'lead':
      // Saturn scythe
      return (
        <g {...common}>
          <line x1={-s * 0.26} y1={-s * 0.82} x2={-s * 0.26} y2={s * 0.76} />
          <line x1={-s * 0.58} y1={-s * 0.5} x2={s * 0.06} y2={-s * 0.5} />
          <path d={`M ${-s * 0.26} ${-s * 0.04} C ${s * 0.42} ${-s * 0.32}, ${s * 0.54} ${s * 0.32}, ${s * 0.04} ${s * 0.68}`} />
        </g>
      );
    case 'crucible':
    default:
      // Inverted chalice / crucible with horizontal brim & base cross
      return (
        <g {...common}>
          <polygon points={`${-s * 0.68},${-s * 0.56} ${s * 0.68},${-s * 0.56} ${s * 0.38},${s * 0.25} ${-s * 0.38},${s * 0.25}`} />
          <line x1={0} y1={s * 0.25} x2={0} y2={s * 0.82} />
          <line x1={-s * 0.42} y1={s * 0.82} x2={s * 0.42} y2={s * 0.82} />
        </g>
      );
  }
};

/**
 * Classical Planetary Symbols inside clean vector paths.
 */
export const PlanetGlyph: React.FC<GlyphProps & { planet: PlanetId }> = ({
  planet,
  size = 20,
  stroke = '#111315',
  strokeWidth = 1.5,
}) => {
  const s = size / 2;
  const common = {
    stroke,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };

  switch (planet) {
    case 'sun':
      return (
        <g {...common}>
          <circle cx={0} cy={0} r={s * 0.68} />
          <circle cx={0} cy={0} r={strokeWidth * 0.9} fill={stroke} stroke="none" />
        </g>
      );
    case 'moon':
      return (
        <g {...common}>
          <path d={`M ${s * 0.22} ${-s * 0.68} A ${s * 0.68} ${s * 0.68} 0 1 0 ${s * 0.22} ${s * 0.68} A ${s * 0.48} ${s * 0.66} 0 1 1 ${s * 0.22} ${-s * 0.68} Z`} />
        </g>
      );
    case 'mercury':
      return <AlchemyGlyph symbol="mercury" size={size} stroke={stroke} strokeWidth={strokeWidth} />;
    case 'venus':
      return <AlchemyGlyph symbol="copper" size={size} stroke={stroke} strokeWidth={strokeWidth} />;
    case 'mars':
      return <AlchemyGlyph symbol="iron" size={size} stroke={stroke} strokeWidth={strokeWidth} />;
    case 'jupiter':
      return <AlchemyGlyph symbol="tin" size={size} stroke={stroke} strokeWidth={strokeWidth} />;
    case 'saturn':
      return <AlchemyGlyph symbol="lead" size={size} stroke={stroke} strokeWidth={strokeWidth} />;
    case 'uranus':
      return (
        <g {...common}>
          <circle cx={0} cy={s * 0.36} r={s * 0.32} />
          <line x1={0} y1={s * 0.04} x2={0} y2={-s * 0.72} />
          <line x1={-s * 0.45} y1={-s * 0.34} x2={s * 0.45} y2={-s * 0.34} />
          <line x1={-s * 0.45} y1={-s * 0.72} x2={-s * 0.45} y2={s * 0.04} />
          <line x1={s * 0.45} y1={-s * 0.72} x2={s * 0.45} y2={s * 0.04} />
        </g>
      );
    case 'neptune':
      return (
        <g {...common}>
          <line x1={0} y1={-s * 0.78} x2={0} y2={s * 0.82} />
          <line x1={-s * 0.38} y1={s * 0.45} x2={s * 0.38} y2={s * 0.45} />
          <path d={`M ${-s * 0.56} ${-s * 0.48} A ${s * 0.56} ${s * 0.56} 0 0 0 ${s * 0.56} ${-s * 0.48}`} />
          <polyline points={`${-s * 0.18},${-s * 0.58} 0,${-s * 0.8} ${s * 0.18},${-s * 0.58}`} />
        </g>
      );
  }
};

/**
 * Celestial Lunar Phase Indicator.
 */
export const LunarPhaseGlyph: React.FC<GlyphProps & { phase: LunarPhase }> = ({
  phase,
  size = 20,
  stroke = '#111315',
  strokeWidth = 1.5,
}) => {
  const r = size * 0.44;
  return (
    <g stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {phase === 'new' && <circle cx={0} cy={0} r={r} fill={stroke} />}
      {phase === 'full' && <circle cx={0} cy={0} r={r} fill="#FFFFFF" />}
      {phase === 'waxing' && (
        <>
          <circle cx={0} cy={0} r={r} fill="#FFFFFF" />
          <path d={`M 0 ${-r} A ${r} ${r} 0 0 0 0 ${r} A ${r * 0.45} ${r} 0 0 1 0 ${-r} Z`} fill={stroke} />
        </>
      )}
      {phase === 'waning' && (
        <>
          <circle cx={0} cy={0} r={r} fill="#FFFFFF" />
          <path d={`M 0 ${-r} A ${r} ${r} 0 0 1 0 ${r} A ${r * 0.45} ${r} 0 0 0 0 ${-r} Z`} fill={stroke} />
        </>
      )}
    </g>
  );
};
