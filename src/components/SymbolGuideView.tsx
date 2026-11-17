import React from 'react';
import {
  ALCHEMY_LABELS,
  ALL_ALCHEMY_SYMBOLS,
  ALL_ELEMENTS,
  ALL_LUNAR_PHASES,
  ALL_PLANETS,
  ELEMENT_LABELS,
  LUNAR_LABELS,
  PLANET_LABELS,
} from '../engine/sigilEngine';
import {
  AlchemyGlyph,
  ElementGlyph,
  LunarPhaseGlyph,
  PlanetGlyph,
} from '../engine/glyphPrimitives';
import {
  ArcaneGlyphVector,
  CONCENTRIC_NODE_GLYPHS,
  POLYGON_NODE_GLYPHS,
  RUNIC_BLOCK_GLYPHS,
  SEAL_OPERATOR_GLYPHS,
  SEAL_SEQUENCES,
  STARBURST_PETAL_GLYPHS,
  SYLLABIC_GLYPHS,
  TRIANGLE_WEDGE_GLYPHS,
} from '../engine/runeCatalog';

interface SymbolGuideViewProps {
  onBackToWorkbench: () => void;
}

const ELEMENT_PHONETICS: Record<string, string> = {
  fire: 'Plosive consonants (p, b, t, d, k, g, c, q) drive sharp angular ignition.',
  air: 'Fricative & aspirate consonants (f, v, s, z, h, x) govern breath and star chords.',
  water: 'Vowels (a, e, i, o, u, y) modulate fluidity, lunar phase, and inscribed circles.',
  earth: 'Liquids & nasals (l, r, m, n, w, j) anchor polygon stability and grounding.',
};

export const SymbolGuideView: React.FC<SymbolGuideViewProps> = ({ onBackToWorkbench }) => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-[#E2DFD7]">
        <div className="space-y-1.5">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-[#111315] text-balance">
            Architectural Symbol & Translation Key
          </h1>
          <p className="text-sm text-[#4B4F56] max-w-2xl">
            Every sigil layer derives deterministically from phonetic articulation, Pythagorean gematria reduction, and 15-degree radial intervals.
          </p>
        </div>
        <button
          type="button"
          onClick={onBackToWorkbench}
          className="px-4 py-2 text-sm font-medium text-[#FFFFFF] bg-[#111315] hover:bg-[#1D4ED8] rounded transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          Return to Workbench
        </button>
      </div>

      {/* Translation Rules */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-[#111315]">01. Sacred Geometry, Mandala, Yantra & Eldritch Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FFFFFF] border border-[#E2DFD7] rounded-md p-6">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[#111315]">Eldritch Circles & 15° Interval Lattice</h3>
            <p className="text-xs leading-relaxed text-[#4B4F56]">
              Segmented spell arc brackets, caliper finials, and radial rune bands snap strictly to multiples of 15° (24 compass divisions). Station counts (4, 6, 8, 12, or 24) maintain exact 90°, 60°, 45°, 30°, or 15° spacing.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[#111315]">Yantra Shatkona & Nested Polygons</h3>
            <p className="text-xs leading-relaxed text-[#4B4F56]">
              Polygonal geometry strictly caps nesting at two levels: one outer regular polygon enclosing either a single upward/downward (Shiva/Shakti) Shatkona star, an inscribed {'{n/k}'} star polygon, or one inner polygon.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[#111315]">Sacred Rosette & Geometric Lattice</h3>
            <p className="text-xs leading-relaxed text-[#4B4F56]">
              Concentric orbital rails frame the Seed of Life / Flower of Life circle lattice and Schläfli star polygons {'{n/k}'}, excluding four-sided squares for pure radial flow.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[#111315]">Pythagorean Gematria & Phonetics</h3>
            <p className="text-xs leading-relaxed text-[#4B4F56]">
              Letters sum sequentially (A=1 through Z=26) and reduce to a digit root (1–9), driving motif selection, polygon vertices, and alchemical core symbols alongside an FNV-1a 32-bit hash.
            </p>
          </div>
        </div>
      </section>

      {/* Classical Elements */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-[#111315]">02. Classical Elements & Phonetics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ALL_ELEMENTS.map((el) => (
            <div key={el} className="bg-[#FFFFFF] border border-[#E2DFD7] rounded-md p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded border border-[#E2DFD7] flex items-center justify-center bg-[#F8F7F4]">
                  <svg width="26" height="26" viewBox="-14 -14 28 28" aria-hidden="true">
                    <ElementGlyph element={el} size={22} stroke="#111315" strokeWidth={1.7} />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-[#111315]">{ELEMENT_LABELS[el]}</span>
              </div>
              <p className="text-xs leading-relaxed text-[#4B4F56]">{ELEMENT_PHONETICS[el]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Alchemical Symbols */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-[#111315]">03. Alchemical Signifiers</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {ALL_ALCHEMY_SYMBOLS.map((sym) => (
            <div
              key={sym}
              className="bg-[#FFFFFF] border border-[#E2DFD7] rounded-md p-3.5 flex items-center gap-3"
            >
              <div className="w-9 h-9 shrink-0 rounded border border-[#E2DFD7] flex items-center justify-center bg-[#F8F7F4]">
                <svg width="24" height="24" viewBox="-16 -16 32 32" aria-hidden="true">
                  <AlchemyGlyph symbol={sym} size={24} stroke="#111315" strokeWidth={1.7} />
                </svg>
              </div>
              <span className="text-xs font-medium text-[#111315]">{ALCHEMY_LABELS[sym]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Planetary Bodies & Lunar Phases */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-semibold text-[#111315]">04. Planetary Alignments</h2>
          <div className="grid grid-cols-3 gap-3">
            {ALL_PLANETS.map((planet) => (
              <div
                key={planet}
                className="bg-[#FFFFFF] border border-[#E2DFD7] rounded-md p-3 flex items-center gap-3"
              >
                <div className="w-8 h-8 shrink-0 rounded-full border border-[#E2DFD7] flex items-center justify-center bg-[#F8F7F4]">
                  <svg width="20" height="20" viewBox="-14 -14 28 28" aria-hidden="true">
                    <PlanetGlyph planet={planet} size={18} stroke="#111315" strokeWidth={1.6} />
                  </svg>
                </div>
                <span className="text-xs font-medium text-[#111315]">{PLANET_LABELS[planet]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-semibold text-[#111315]">05. Lunar Phases</h2>
          <div className="grid grid-cols-1 gap-2.5">
            {ALL_LUNAR_PHASES.map((phase) => (
              <div
                key={phase}
                className="bg-[#FFFFFF] border border-[#E2DFD7] rounded-md p-2.5 flex items-center gap-3"
              >
                <div className="w-8 h-8 shrink-0 rounded-full border border-[#E2DFD7] flex items-center justify-center bg-[#F8F7F4]">
                  <svg width="20" height="20" viewBox="-14 -14 28 28" aria-hidden="true">
                    <LunarPhaseGlyph phase={phase} size={18} stroke="#111315" strokeWidth={1.5} />
                  </svg>
                </div>
                <span className="text-xs font-medium text-[#111315]">{LUNAR_LABELS[phase]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Arcane Runes, Seals & Syllabics */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-[#111315]">
            06. Arcane Runes, Seals, Syllabics & Runic Block
          </h2>
          <p className="text-xs text-[#4B4F56]">
            Layer 02 (15° Arcane Runes & Seals) draws from concentric nodes, interlocking polygons, directional wedges, starbursts, Canadian Aboriginal Syllabics, seal operators, and the complete 89-character Unicode Runic block (ᚠ–ᛸ).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Concentric & Dotted Nodes', items: CONCENTRIC_NODE_GLYPHS },
            { title: 'Nested & Interlocking Polygons', items: POLYGON_NODE_GLYPHS },
            { title: 'Triangles & Directional Wedges', items: TRIANGLE_WEDGE_GLYPHS },
            { title: 'Starbursts & Lotus Petals', items: STARBURST_PETAL_GLYPHS },
            { title: 'Seal Operators', items: SEAL_OPERATOR_GLYPHS },
            { title: 'Canadian Aboriginal Syllabics', items: SYLLABIC_GLYPHS },
          ].map((group) => (
            <div key={group.title} className="bg-[#FFFFFF] border border-[#E2DFD7] rounded-md p-4 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#4B4F56]">
                {group.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <div
                    key={item.char}
                    title={`${item.char} — ${item.name}`}
                    className="flex items-center gap-1.5 px-2 py-1 rounded border border-[#E2DFD7] bg-[#F8F7F4]"
                  >
                    <svg width="18" height="18" viewBox="-12 -12 24 24" aria-hidden="true">
                      <ArcaneGlyphVector char={item.char} size={18} stroke="#111315" strokeWidth={1.4} />
                    </svg>
                    <span className="text-xs font-mono text-[#111315]">{item.char}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#FFFFFF] border border-[#E2DFD7] rounded-md p-4 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#4B4F56]">
            Canonical Seal Sequences
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Warding Seal', seq: SEAL_SEQUENCES.warding },
              { label: 'Energy Containment', seq: SEAL_SEQUENCES.containment },
              { label: 'Astral / Portal Gate', seq: SEAL_SEQUENCES.astral },
              { label: 'Binding Circle', seq: SEAL_SEQUENCES.binding },
            ].map((seal) => (
              <div key={seal.label} className="p-3 rounded border border-[#E2DFD7] bg-[#F8F7F4] space-y-2">
                <div className="text-xs font-semibold text-[#111315]">{seal.label}</div>
                <div className="flex items-center gap-1.5">
                  {seal.seq.map((ch, i) => (
                    <svg key={`${seal.label}-${i}`} width="20" height="20" viewBox="-12 -12 24 24" aria-hidden="true">
                      <ArcaneGlyphVector char={ch} size={18} stroke="#111315" strokeWidth={1.45} />
                    </svg>
                  ))}
                </div>
                <div className="text-[11px] font-mono text-[#4B4F56]">{seal.seq.join(' ')}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E2DFD7] rounded-md p-4 space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#4B4F56]">
              Runic Block — Elder Futhark, Younger Futhark & Anglo-Saxon ({RUNIC_BLOCK_GLYPHS.length} characters)
            </h3>
            <span className="text-[11px] font-mono text-[#767A82]">U+16A0 – U+16F8</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {RUNIC_BLOCK_GLYPHS.map((r) => (
              <div
                key={r.char}
                title={r.name}
                className="w-8 h-8 rounded border border-[#E2DFD7] bg-[#F8F7F4] flex items-center justify-center"
              >
                <svg width="18" height="18" viewBox="-12 -12 24 24" aria-hidden="true">
                  <ArcaneGlyphVector char={r.char} size={18} stroke="#111315" strokeWidth={1.35} />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
