import React from 'react';
import type { DraftingOptions, LayerVisibility, SigilSpec } from '../types/sigil';
import {
  AlchemyGlyph,
  ArcaneRuneGlyph,
  ElementGlyph,
  LunarPhaseGlyph,
  PlanetGlyph,
} from '../engine/glyphPrimitives';
import {
  ALCHEMY_LABELS,
  deriveInnerSealGlyphs,
  ELEMENT_LABELS,
  LUNAR_LABELS,
  PLANET_LABELS,
  SACRED_MOTIF_LABELS,
  transliteratePhraseToMicroGlyphs,
  transliterateWordToFuthark,
} from '../engine/sigilEngine';

interface SigilLegendStripProps {
  spec: SigilSpec;
  visibility: LayerVisibility;
  draftingOptions: DraftingOptions;
}

const MiniSolarGlyph: React.FC = () => (
  <svg width="16" height="16" viewBox="-14 -14 28 28" aria-hidden="true">
    <circle cx={0} cy={0} r={6.5} fill="none" stroke="#111315" strokeWidth={1.5} />
    <circle cx={0} cy={0} r={2.2} fill="#111315" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
      const rad = ((deg - 90) * Math.PI) / 180;
      const x1 = Number((8.5 * Math.cos(rad)).toFixed(2));
      const y1 = Number((8.5 * Math.sin(rad)).toFixed(2));
      const x2 = Number((11.5 * Math.cos(rad)).toFixed(2));
      const y2 = Number((11.5 * Math.sin(rad)).toFixed(2));
      return (
        <line
          key={`mini-sun-${deg}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#111315"
          strokeWidth={1.3}
          strokeLinecap="round"
        />
      );
    })}
  </svg>
);

export const SigilLegendStrip: React.FC<SigilLegendStripProps> = ({
  spec,
  visibility,
  draftingOptions,
}) => {
  const words = spec.text.trim().split(/\s+/).filter(Boolean);
  const primaryWord = words[0] ?? 'sigil';
  const futharkSpelling = transliterateWordToFuthark(primaryWord);
  const futharkWordStr = futharkSpelling.map((item) => item.rune).join('');

  const stationedString = spec.runes.glyphs.map((g) => g.char).join(' ');
  const innerSealGlyphs = deriveInnerSealGlyphs(spec);
  const innerSealString = innerSealGlyphs.map((g) => g.char).join(' ');

  const microTokens = transliteratePhraseToMicroGlyphs(spec.text);
  const microPhraseString = microTokens.map((token) => token.char).join('');

  const mainLevel2 =
    spec.polygons.yantraTriangles === 1
      ? 'Shatkona'
      : spec.polygons.starStep > 1
      ? `{${spec.polygons.sides}/${spec.polygons.starStep}} Star`
      : `${spec.polygons.innerSides}-gon`;
  const mainLevel3 =
    spec.polygons.tertiaryStarStep > 1
      ? `{${spec.polygons.tertiarySides}/${spec.polygons.tertiaryStarStep}} Star`
      : `${spec.polygons.tertiarySides}-gon`;

  return (
    <section
      aria-label="Active sigil strings and symbols"
      className="bg-[#FFFFFF] border-t border-[#E2DFD7] px-6 py-4 space-y-4"
    >
      {/* Part 1: Strings of Text & Glyphs Rendered in the Sigil */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#4B4F56]">
            Sigil Text Strings & Rune Sequences
          </h2>
          <span className="font-mono text-[11px] text-[#767A82]">
            {visibility.runes ? 'Layer 02 active' : 'Layer 02 hidden'}
          </span>
        </div>

        <div className={`space-y-2.5 ${visibility.runes ? '' : 'opacity-50'}`}>
          {/* Futhark Transliteration of Primary Word */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 bg-[#F8F7F4] border border-[#E2DFD7] rounded px-3 py-2">
            <span className="text-[11px] font-semibold text-[#111315] whitespace-nowrap">
              Futhark Transliteration ({primaryWord}):
            </span>
            <span className="font-mono text-xs text-[#1D4ED8] select-all tracking-wider">
              {futharkWordStr || '—'}
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {futharkSpelling.map((pair, idx) => (
                <span
                  key={`futhark-pair-${idx}`}
                  title={`${pair.letter} → ${pair.rune} (${pair.name})`}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#FFFFFF] border border-[#E2DFD7] rounded text-[11px] font-mono text-[#4B4F56]"
                >
                  <span>{pair.letter}</span>
                  <span className="text-[#767A82]">→</span>
                  <svg width="13" height="13" viewBox="-12 -12 24 24" aria-hidden="true">
                    <ArcaneRuneGlyph char={pair.rune} size={18} stroke="#111315" strokeWidth={1.6} />
                  </svg>
                  <span className="text-[#111315]">{pair.rune}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Stationed Outer Rune Ring (r = 300) */}
          <div className="bg-[#F8F7F4] border border-[#E2DFD7] rounded px-3 py-2 space-y-1.5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-[11px] font-semibold text-[#111315]">
                Outer Rune Stations (r = 300 · {spec.runes.glyphs.length} glyphs):
              </span>
              <span className="font-mono text-xs text-[#111315] select-all tracking-wider">
                {stationedString}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {spec.runes.glyphs.map((glyph) => (
                <span
                  key={`manifest-${glyph.id}`}
                  title={`${glyph.angleDeg}° · ${glyph.char} (${glyph.name})`}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#FFFFFF] border border-[#E2DFD7] rounded text-[11px] font-mono tabular-nums text-[#4B4F56]"
                >
                  <svg width="13" height="13" viewBox="-12 -12 24 24" aria-hidden="true">
                    <ArcaneRuneGlyph char={glyph.char} size={18} stroke="#111315" strokeWidth={1.6} />
                  </svg>
                  <span className="text-[#111315]">{glyph.char}</span>
                  <span className="text-[10px] text-[#767A82]">{glyph.angleDeg}°</span>
                </span>
              ))}
            </div>
          </div>

          {/* Optional Secondary Inner Seal Band (r = 214) */}
          {innerSealGlyphs.length > 0 && (
            <div className="bg-[#F8F7F4] border border-[#E2DFD7] rounded px-3 py-2 space-y-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-[11px] font-semibold text-[#111315]">
                  Inner Seal Band (r = 214 · {innerSealGlyphs.length} glyphs):
                </span>
                <span className="font-mono text-xs text-[#111315] select-all tracking-wider">
                  {innerSealString}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {innerSealGlyphs.map((item, idx) => (
                  <span
                    key={`inner-seal-manifest-${idx}`}
                    title={`${item.angleDeg}° · ${item.char} (${item.name})`}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#FFFFFF] border border-[#E2DFD7] rounded text-[11px] font-mono tabular-nums text-[#4B4F56]"
                  >
                    <svg width="13" height="13" viewBox="-12 -12 24 24" aria-hidden="true">
                      <ArcaneRuneGlyph char={item.char} size={18} stroke="#111315" strokeWidth={1.6} />
                    </svg>
                    <span className="text-[#111315]">{item.char}</span>
                    <span className="text-[10px] text-[#767A82]">{item.angleDeg}°</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Micro-Script Channel (r = 264 / 270) */}
          <div className="bg-[#F8F7F4] border border-[#E2DFD7] rounded px-3 py-2 space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-[11px] font-semibold text-[#111315]">
                Micro-Script Cipher Channel (r = {spec.subSigils.length >= 1 ? 264 : 270} · 1-to-1 Cipher + ❁ Divider, repeats in ring):
              </span>
              <span className="font-mono text-xs text-[#1D4ED8] select-all tracking-wider">
                {microPhraseString}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {microTokens.map((token, idx) => (
                <span
                  key={`micro-cipher-pair-${idx}`}
                  title={`${token.source} → ${token.char} (${token.name})`}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#FFFFFF] border border-[#E2DFD7] rounded text-[11px] font-mono text-[#4B4F56]"
                >
                  <span>{token.isDivider ? '÷' : token.source}</span>
                  <span className="text-[#767A82]">→</span>
                  <svg width="13" height="13" viewBox="-12 -12 24 24" aria-hidden="true">
                    <ArcaneRuneGlyph char={token.char} size={18} stroke="#111315" strokeWidth={1.6} />
                  </svg>
                  <span className="text-[#111315]">{token.char}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: All Other Symbols Rendered in the Sigil */}
      <div className="space-y-2.5 pt-2 border-t border-[#E2DFD7]">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#4B4F56]">
          Celestial, Planetary, Elemental & Alchemical Symbols
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2.5">
          {/* Celestial */}
          <div className={`bg-[#F8F7F4] border border-[#E2DFD7] rounded px-3 py-2 space-y-1.5 ${visibility.celestial ? '' : 'opacity-50'}`}>
            <div className="text-[11px] font-semibold text-[#111315]">
              01. Celestial ({spec.celestial.chordCount} chords)
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#4B4F56]">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#FFFFFF] border border-[#E2DFD7] rounded">
                <svg width="16" height="16" viewBox="-14 -14 28 28" aria-hidden="true">
                  <LunarPhaseGlyph phase={spec.celestial.lunarPhase} size={18} stroke="#111315" strokeWidth={1.6} />
                </svg>
                <span className="text-[#111315] font-medium">{LUNAR_LABELS[spec.celestial.lunarPhase]}</span>
                <span className="font-mono text-[10px] text-[#767A82]">{spec.celestial.lunarAngleDeg}°</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#FFFFFF] border border-[#E2DFD7] rounded">
                <MiniSolarGlyph />
                <span className="text-[#111315] font-medium">Solar</span>
                <span className="font-mono text-[10px] text-[#767A82]">{spec.celestial.solarAngleDeg}°</span>
              </span>
            </div>
          </div>

          {/* Planets */}
          <div className={`bg-[#F8F7F4] border border-[#E2DFD7] rounded px-3 py-2 space-y-1.5 ${visibility.planets ? '' : 'opacity-50'}`}>
            <div className="text-[11px] font-semibold text-[#111315]">
              04. Planets ({spec.planets.nodes.length} nodes · {spec.planets.aspects.length} aspects)
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#4B4F56]">
              {spec.planets.nodes.map((node) => (
                <span
                  key={`planet-manifest-${node.planet}`}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#FFFFFF] border border-[#E2DFD7] rounded"
                >
                  <svg width="15" height="15" viewBox="-14 -14 28 28" aria-hidden="true">
                    <PlanetGlyph planet={node.planet} size={18} stroke="#111315" strokeWidth={1.6} />
                  </svg>
                  <span className="text-[#111315] font-medium">{PLANET_LABELS[node.planet]}</span>
                  <span className="font-mono text-[10px] text-[#767A82]">{node.angleDeg}°</span>
                </span>
              ))}
            </div>
          </div>

          {/* Classical Elements */}
          <div className={`bg-[#F8F7F4] border border-[#E2DFD7] rounded px-3 py-2 space-y-1.5 ${visibility.elements ? '' : 'opacity-50'}`}>
            <div className="text-[11px] font-semibold text-[#111315]">
              05. Classical Elements ({spec.elements.quadrantCount} poles · {spec.elements.rotationDeg}°)
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#4B4F56]">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#FFFFFF] border border-[#E2DFD7] rounded">
                <svg width="15" height="15" viewBox="-14 -14 28 28" aria-hidden="true">
                  <ElementGlyph element={spec.elements.primary} size={18} stroke="#111315" strokeWidth={1.6} />
                </svg>
                <span className="text-[#111315] font-medium">{ELEMENT_LABELS[spec.elements.primary]}</span>
                <span className="text-[10px] text-[#767A82]">Primary</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#FFFFFF] border border-[#E2DFD7] rounded">
                <svg width="15" height="15" viewBox="-14 -14 28 28" aria-hidden="true">
                  <ElementGlyph element={spec.elements.secondary} size={18} stroke="#111315" strokeWidth={1.6} />
                </svg>
                <span className="text-[#111315] font-medium">{ELEMENT_LABELS[spec.elements.secondary]}</span>
                <span className="text-[10px] text-[#767A82]">Secondary</span>
              </span>
            </div>
          </div>

          {/* Alchemy Core & Geometry */}
          <div className={`bg-[#F8F7F4] border border-[#E2DFD7] rounded px-3 py-2 space-y-1.5 ${visibility.alchemy ? '' : 'opacity-50'}`}>
            <div className="text-[11px] font-semibold text-[#111315]">
              06. Alchemical Core & Geometry
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#4B4F56]">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#FFFFFF] border border-[#E2DFD7] rounded">
                <svg width="15" height="15" viewBox="-16 -16 32 32" aria-hidden="true">
                  <AlchemyGlyph symbol={spec.alchemy.primary} size={24} stroke="#111315" strokeWidth={1.8} />
                </svg>
                <span className="text-[#111315] font-medium">{ALCHEMY_LABELS[spec.alchemy.primary]}</span>
                <span className="text-[10px] text-[#767A82]">Core</span>
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#FFFFFF] border border-[#E2DFD7] rounded">
                <svg width="15" height="15" viewBox="-16 -16 32 32" aria-hidden="true">
                  <AlchemyGlyph symbol={spec.alchemy.auxiliary} size={24} stroke="#111315" strokeWidth={1.8} />
                </svg>
                <span className="text-[#111315] font-medium">{ALCHEMY_LABELS[spec.alchemy.auxiliary]}</span>
                <span className="text-[10px] text-[#767A82]">Flank</span>
              </span>
            </div>
            <div className="text-[10px] font-mono text-[#767A82]">
              {SACRED_MOTIF_LABELS[spec.polygons.sacredMotif]} · {spec.polygons.sides}-gon · {mainLevel2} · {mainLevel3}
              {draftingOptions.showSeedOfLife ? ' · Seed of Life' : ''}
            </div>
          </div>
        </div>

        {/* Docked Sub-Sigil Symbols (when compound phrase) */}
        {spec.subSigils.length >= 1 && (
          <div className="bg-[#F8F7F4] border border-[#E2DFD7] rounded px-3 py-2 space-y-1.5">
            <div className="text-[11px] font-semibold text-[#111315]">
              Docked Satellite Sub-Sigils ({spec.subSigils.length}):
            </div>
            <div className="flex flex-wrap gap-2">
              {spec.subSigils.map((sub, idx) => {
                const subL2 =
                  sub.polygons.yantraTriangles === 1
                    ? 'Shatkona'
                    : sub.polygons.starStep > 1
                    ? `{${sub.polygons.sides}/${sub.polygons.starStep}}`
                    : `${sub.polygons.innerSides}-gon`;
                const subL3 =
                  sub.polygons.tertiaryStarStep > 1
                    ? `{${sub.polygons.tertiarySides}/${sub.polygons.tertiaryStarStep}}`
                    : `${sub.polygons.tertiarySides}-gon`;
                const subAngle = Math.round((spec.compoundAxisDeg + (idx * 360) / spec.subSigils.length) % 360);
                return (
                  <span
                    key={`sub-manifest-${idx}-${sub.word}`}
                    className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#FFFFFF] border border-[#E2DFD7] rounded text-xs"
                  >
                    <svg width="16" height="16" viewBox="-16 -16 32 32" aria-hidden="true">
                      <AlchemyGlyph symbol={sub.alchemy.primary} size={24} stroke="#111315" strokeWidth={1.8} />
                    </svg>
                    <span className="font-mono font-semibold text-[#111315]">{sub.word}</span>
                    <span className="text-[#4B4F56]">{ALCHEMY_LABELS[sub.alchemy.primary]}</span>
                    <span className="font-mono text-[10px] text-[#767A82]">
                      {sub.polygons.sides}-gon · {subL2} · {subL3} · {subAngle}°
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
