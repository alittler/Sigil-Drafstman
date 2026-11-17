import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import type {
  AlchemySymbolId,
  DraftingOptions,
  ElementType,
  LunarPhase,
  ManualOverrides,
  PlanetId,
  RunePaletteMode,
  SacredMotif,
  SigilSpec,
} from '../types/sigil';
import {
  ALL_RUNE_PALETTES,
  RUNE_PALETTE_LABELS,
} from '../engine/runeCatalog';
import {
  ALCHEMY_LABELS,
  ALL_ALCHEMY_SYMBOLS,
  ALL_ELEMENTS,
  ALL_LUNAR_PHASES,
  ALL_PLANETS,
  ALL_SACRED_MOTIFS,
  countActiveOverrides,
  ELEMENT_LABELS,
  LUNAR_LABELS,
  PLANET_LABELS,
  SACRED_MOTIF_LABELS,
  VALID_INNER_SIDES,
  VALID_POLYGON_SIDES,
} from '../engine/sigilEngine';
import { AlchemyGlyph, ElementGlyph, PlanetGlyph } from '../engine/glyphPrimitives';

interface ManualTuningPanelProps {
  spec: SigilSpec;
  overrides: ManualOverrides;
  draftingOptions: DraftingOptions;
  showBounding: boolean;
  onToggleBounding: () => void;
  onUpdateOverride: <K extends keyof ManualOverrides>(key: K, value: ManualOverrides[K]) => void;
  onUpdateDraftingOption: <K extends keyof DraftingOptions>(key: K, value: DraftingOptions[K]) => void;
  onResetAll: () => void;
}

const Slider15Deg: React.FC<{
  id: string;
  label: string;
  value: number;
  onChange: (val: number) => void;
}> = ({ id, label, value, onChange }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between text-xs">
      <label htmlFor={id} className="font-medium text-[#111315]">
        {label}
      </label>
      <span className="font-mono tabular-nums text-[#1D4ED8] font-medium">{value}°</span>
    </div>
    <input
      id={id}
      type="range"
      min={0}
      max={345}
      step={15}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="draft-slider w-full"
    />
    <div className="flex justify-between font-mono tabular-nums text-[10px] text-[#767A82]">
      <span>0°</span>
      <span>90°</span>
      <span>180°</span>
      <span>270°</span>
      <span>345°</span>
    </div>
  </div>
);

export const ManualTuningPanel: React.FC<ManualTuningPanelProps> = ({
  spec,
  overrides,
  draftingOptions,
  showBounding,
  onToggleBounding,
  onUpdateOverride,
  onUpdateDraftingOption,
  onResetAll,
}) => {
  const [selectedCoreIdx, setSelectedCoreIdx] = useState(-1);

  const isCompound = spec.subSigils.length >= 1;
  const safeCoreIdx = isCompound
    ? selectedCoreIdx >= 0
      ? Math.min(selectedCoreIdx, spec.subSigils.length - 1)
      : -1
    : -1;
  const activeCore = safeCoreIdx >= 0 ? spec.subSigils[safeCoreIdx] : spec;
  const primaryWord =
    (spec.profile.baseText || spec.text).trim().split(/\s+/).filter(Boolean)[0] ?? 'Main';
  const activeCoreWord = safeCoreIdx >= 0 ? spec.subSigils[safeCoreIdx].word : primaryWord;

  const updateCoreOverride = <K extends keyof ManualOverrides>(
    key: K,
    value: ManualOverrides[K]
  ) => {
    if (safeCoreIdx < 0) {
      onUpdateOverride(key, value);
      return;
    }
    const existingSubs = overrides.subOverrides ?? {};
    const currentSub = existingSubs[safeCoreIdx] ?? {};
    onUpdateOverride('subOverrides', {
      ...existingSubs,
      [safeCoreIdx]: {
        ...currentSub,
        [key]: value,
      },
    });
  };

  const activeOverrideCount = countActiveOverrides(overrides);

  const maxStarStep = Math.max(1, Math.floor((activeCore.polygons.sides - 1) / 2));
  const activePlanets = activeCore.planets.nodes.map((n) => n.planet);

  const togglePlanet = (planet: PlanetId) => {
    const exists = activePlanets.includes(planet);
    if (exists) {
      if (activePlanets.length <= 2) return;
      updateCoreOverride(
        'planetSelection',
        activePlanets.filter((p) => p !== planet)
      );
    } else {
      if (activePlanets.length >= 6) return;
      updateCoreOverride('planetSelection', [...activePlanets, planet]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Global Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E2DFD7]">
        <div>
          <h2 className="text-sm font-semibold text-[#111315]">Manual Geometry & Symbol Tuning</h2>
          <p className="text-xs text-[#4B4F56] mt-0.5">
            {activeOverrideCount === 0
              ? 'All layers match pure text derivation.'
              : `${activeOverrideCount} manual override${activeOverrideCount === 1 ? '' : 's'} active.`}
          </p>
        </div>
        {activeOverrideCount > 0 && (
          <button
            type="button"
            onClick={onResetAll}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#1D4ED8] bg-[#F1EFE9] hover:bg-[#E2DFD7] rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset to Text</span>
          </button>
        )}
      </div>

      {/* Drafting Sheet Controls */}
      <section className="space-y-3 pb-5 border-b border-[#E2DFD7]">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#4B4F56]">
          Drafting Ink & Guides
        </h3>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="stroke-weight" className="font-medium text-[#111315]">
              Ink Line Weight
            </label>
            <span className="font-mono tabular-nums text-[#4B4F56]">
              {draftingOptions.strokeWeight.toFixed(2)} px
            </span>
          </div>
          <input
            id="stroke-weight"
            type="range"
            min={1.0}
            max={2.8}
            step={0.05}
            value={draftingOptions.strokeWeight}
            onChange={(e) => onUpdateDraftingOption('strokeWeight', Number(e.target.value))}
            className="draft-slider w-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <label className="flex items-center gap-2 text-xs text-[#111315] cursor-pointer">
            <input
              type="checkbox"
              checked={draftingOptions.showGridGuides}
              onChange={(e) => onUpdateDraftingOption('showGridGuides', e.target.checked)}
              className="accent-[#1D4ED8] w-4 h-4"
            />
            <span>15° Compass Guides</span>
          </label>
          <label className="flex items-center gap-2 text-xs text-[#111315] cursor-pointer">
            <input
              type="checkbox"
              checked={draftingOptions.showDegreeLabels}
              onChange={(e) => onUpdateDraftingOption('showDegreeLabels', e.target.checked)}
              className="accent-[#1D4ED8] w-4 h-4"
            />
            <span>Degree Markers</span>
          </label>
          <label className="flex items-center gap-2 text-xs text-[#111315] cursor-pointer">
            <input
              type="checkbox"
              checked={draftingOptions.showSeedOfLife}
              onChange={(e) => onUpdateDraftingOption('showSeedOfLife', e.target.checked)}
              className="accent-[#1D4ED8] w-4 h-4"
            />
            <span>Seed of Life Lattice</span>
          </label>
          <label className="flex items-center gap-2 text-xs text-[#111315] cursor-pointer">
            <input
              type="checkbox"
              checked={showBounding}
              onChange={onToggleBounding}
              className="accent-[#1D4ED8] w-4 h-4"
            />
            <span>Bounding Ring (Outer Frame)</span>
          </label>
          <label className="flex items-center gap-2 text-xs text-[#111315] cursor-pointer col-span-2">
            <input
              type="checkbox"
              checked={draftingOptions.showDashedLines}
              onChange={(e) => onUpdateDraftingOption('showDashedLines', e.target.checked)}
              className="accent-[#1D4ED8] w-4 h-4"
            />
            <span>Light Dashed Lines (Orbits, Chords &amp; Tethers)</span>
          </label>
        </div>
      </section>

      {/* Perimeter Frame & Satellite Sub-Sigil Angle */}
      <section className="space-y-3 pb-5 border-b border-[#E2DFD7]">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#4B4F56]">
          Perimeter Frame & Satellite Placement
        </h3>
        {isCompound && (
          <Slider15Deg
            id="compound-axis-slider"
            label="Satellite Sub-Sigil Orbit Angle (15° steps)"
            value={spec.compoundAxisDeg}
            onChange={(v) => onUpdateOverride('compoundAxisDeg', v)}
          />
        )}
        <div className="space-y-2 pt-1">
          <label className="flex items-center gap-2 text-xs text-[#111315] cursor-pointer">
            <input
              type="checkbox"
              checked={spec.bounding.eldritchArcs}
              onChange={(e) => onUpdateOverride('boundingEldritchArcs', e.target.checked)}
              className="accent-[#1D4ED8] w-4 h-4"
            />
            <span>Eldritch Segmented Spell Arcs</span>
          </label>
          <label className="flex items-center gap-2 text-xs text-[#111315] cursor-pointer">
            <input
              type="checkbox"
              checked={spec.bounding.doubleRing}
              onChange={(e) => onUpdateOverride('boundingDoubleRing', e.target.checked)}
              className="accent-[#1D4ED8] w-4 h-4"
            />
            <span>Double Containment Hairline</span>
          </label>
        </div>
      </section>

      {/* 15° Arcane Runes & Seals */}
      <section className="space-y-3 pb-5 border-b border-[#E2DFD7]">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#4B4F56]">
          15° Arcane Runes & Seals
        </h3>
        <div className="space-y-1.5">
          <label htmlFor="rune-palette-select" className="block text-xs font-medium text-[#111315]">
            Character & Seal Palette
          </label>
          <select
            id="rune-palette-select"
            value={spec.runes.palette}
            onChange={(e) => onUpdateOverride('runePalette', e.target.value as RunePaletteMode)}
            className="w-full px-2.5 py-1.5 text-xs bg-[#FFFFFF] border border-[#E2DFD7] rounded text-[#111315] focus:outline-none focus:border-[#1D4ED8]"
          >
            {ALL_RUNE_PALETTES.map((mode) => (
              <option key={mode} value={mode}>
                {RUNE_PALETTE_LABELS[mode]}
              </option>
            ))}
          </select>
        </div>
        <Slider15Deg
          id="rune-rot-slider"
          label={isCompound ? 'Rune & Seal Sequence Offset' : 'Rune Ring Rotation (15° steps)'}
          value={spec.runes.rotationDeg}
          onChange={(v) => onUpdateOverride('runeRotationDeg', v)}
        />
        <div className="space-y-1.5">
          <span className="block text-xs font-medium text-[#111315]">Radial Rune Station Count</span>
          <div className="grid grid-cols-5 gap-1 p-1 bg-[#F1EFE9] rounded-md">
            {([4, 6, 8, 12, 24] as const).map((cnt) => (
              <button
                key={cnt}
                type="button"
                onClick={() => onUpdateOverride('runeStationCount', cnt)}
                className={`py-1.5 text-xs font-mono tabular-nums font-medium rounded transition-colors cursor-pointer ${
                  spec.runes.stationCount === cnt
                    ? 'bg-[#FFFFFF] text-[#111315] shadow-xs'
                    : 'text-[#4B4F56] hover:text-[#111315]'
                }`}
              >
                {cnt}
              </button>
            ))}
          </div>
        </div>
        <label
          className={`flex items-center gap-2 text-xs pt-1 ${
            isCompound ? 'text-[#767A82] cursor-not-allowed' : 'text-[#111315] cursor-pointer'
          }`}
        >
          <input
            type="checkbox"
            disabled={isCompound}
            checked={!isCompound && spec.runes.dualBand}
            onChange={(e) => onUpdateOverride('runeDualBand', e.target.checked)}
            className="accent-[#1D4ED8] w-4 h-4 disabled:opacity-40"
          />
          <span>
            {isCompound
              ? 'Dual Rune Band paused (satellites dock on inner belt)'
              : 'Dual Concentric Rune Band (+15° offset)'}
          </span>
        </label>
      </section>

      {/* Celestial Markers */}
      <section className="space-y-3 pb-5 border-b border-[#E2DFD7]">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#4B4F56]">
          Celestial Markers
        </h3>
        <Slider15Deg
          id="celestial-rot-slider"
          label="Celestial & Arc Rotation"
          value={spec.celestial.rotationDeg}
          onChange={(v) => onUpdateOverride('celestialRotationDeg', v)}
        />
        <div className="space-y-1.5">
          <span className="block text-xs font-medium text-[#111315]">Lunar Phase</span>
          <div className="grid grid-cols-2 gap-1.5">
            {ALL_LUNAR_PHASES.map((phase: LunarPhase) => (
              <button
                key={phase}
                type="button"
                onClick={() => onUpdateOverride('celestialLunarPhase', phase)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded border text-left transition-colors cursor-pointer ${
                  spec.celestial.lunarPhase === phase
                    ? 'border-[#1D4ED8] bg-[#F1EFE9] text-[#111315]'
                    : 'border-[#E2DFD7] bg-[#FFFFFF] text-[#4B4F56] hover:text-[#111315]'
                }`}
              >
                {LUNAR_LABELS[phase]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main vs Satellite Sub-Sigil Selector */}
      {isCompound && (
        <section className="space-y-2 pb-4 border-b border-[#E2DFD7]">
          <div className="flex items-baseline justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#4B4F56]">
              Target Sigil
            </h3>
            <span className="font-mono tabular-nums text-[11px] text-[#767A82]">
              {safeCoreIdx < 0 ? 'Main (Layers 3–6)' : `Sub ${safeCoreIdx + 1}/${spec.subSigils.length} (Layers 3 & 6)`}
            </span>
          </div>
          <div className="flex flex-wrap gap-1 p-1 bg-[#F1EFE9] rounded-md">
            <button
              type="button"
              onClick={() => setSelectedCoreIdx(-1)}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                safeCoreIdx === -1
                  ? 'bg-[#FFFFFF] text-[#111315] shadow-xs'
                  : 'text-[#4B4F56] hover:text-[#111315]'
              }`}
            >
              Main ({primaryWord})
            </button>
            {spec.subSigils.map((sub, idx) => (
              <button
                key={`core-tab-${idx}-${sub.word}`}
                type="button"
                onClick={() => setSelectedCoreIdx(idx)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  safeCoreIdx === idx
                    ? 'bg-[#FFFFFF] text-[#111315] shadow-xs'
                    : 'text-[#4B4F56] hover:text-[#111315]'
                }`}
              >
                Sub {idx + 1} ({sub.word})
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Sacred Geometry, Yantra Triangles, Polygons & Stars */}
      <section className="space-y-3 pb-5 border-b border-[#E2DFD7]">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#4B4F56]">
          Sacred Geometry & Yantra Core
        </h3>
        <div className="space-y-1.5">
          <span className="block text-xs font-medium text-[#111315]">
            {isCompound ? `Geometric Archetype (${activeCoreWord})` : 'Geometric Archetype'}
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {ALL_SACRED_MOTIFS.map((motif: SacredMotif) => (
              <button
                key={motif}
                type="button"
                onClick={() => updateCoreOverride('polygonSacredMotif', motif)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded border text-left transition-colors cursor-pointer ${
                  activeCore.polygons.sacredMotif === motif
                    ? 'border-[#1D4ED8] bg-[#F1EFE9] text-[#111315]'
                    : 'border-[#E2DFD7] bg-[#FFFFFF] text-[#4B4F56] hover:text-[#111315]'
                }`}
              >
                {SACRED_MOTIF_LABELS[motif]}
              </button>
            ))}
          </div>
        </div>
        <Slider15Deg
          id="poly-rot-slider"
          label="Polygon, Star & Yantra Rotation"
          value={activeCore.polygons.rotationDeg}
          onChange={(v) => updateCoreOverride('polygonRotationDeg', v)}
        />
        <div className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-[#111315]">Polygon Vertices (squares excluded)</span>
              <span className="font-mono tabular-nums text-[#4B4F56]">
                {activeCore.polygons.sides}-gon
              </span>
            </div>
            <div className="grid grid-cols-9 gap-1 p-1 bg-[#F1EFE9] rounded-md">
              {VALID_POLYGON_SIDES.map((cnt) => (
                <button
                  key={`poly-${cnt}`}
                  type="button"
                  onClick={() => updateCoreOverride('polygonSides', cnt)}
                  className={`py-1 text-xs font-mono tabular-nums font-medium rounded transition-colors cursor-pointer ${
                    activeCore.polygons.sides === cnt
                      ? 'bg-[#FFFFFF] text-[#111315] shadow-xs'
                      : 'text-[#4B4F56] hover:text-[#111315]'
                  }`}
                >
                  {cnt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label htmlFor="star-step" className="font-medium text-[#111315]">
                Star Chord Step
              </label>
              <span className="font-mono tabular-nums text-[#4B4F56]">
                {activeCore.polygons.yantraTriangles === 1
                  ? 'Shatkona'
                  : activeCore.polygons.starStep === 1
                  ? 'None'
                  : `{${activeCore.polygons.sides}/${activeCore.polygons.starStep}}`}
              </span>
            </div>
            <input
              id="star-step"
              type="range"
              min={1}
              max={maxStarStep}
              step={1}
              disabled={maxStarStep <= 1 || activeCore.polygons.yantraTriangles === 1}
              value={activeCore.polygons.starStep}
              onChange={(e) => updateCoreOverride('polygonStarStep', Number(e.target.value))}
              className="draft-slider w-full disabled:opacity-40"
            />
          </div>
        </div>
        {activeCore.polygons.yantraTriangles === 0 && activeCore.polygons.starStep === 1 && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-[#111315]">Inscribed Inner Polygon</span>
              <span className="font-mono tabular-nums text-[#4B4F56]">
                {activeCore.polygons.innerSides}-gon
              </span>
            </div>
            <div className="grid grid-cols-7 gap-1 p-1 bg-[#F1EFE9] rounded-md">
              {VALID_INNER_SIDES.map((cnt) => (
                <button
                  key={`inner-${cnt}`}
                  type="button"
                  onClick={() => updateCoreOverride('polygonInnerSides', cnt)}
                  className={`py-1 text-xs font-mono tabular-nums font-medium rounded transition-colors cursor-pointer ${
                    activeCore.polygons.innerSides === cnt
                      ? 'bg-[#FFFFFF] text-[#111315] shadow-xs'
                      : 'text-[#4B4F56] hover:text-[#111315]'
                  }`}
                >
                  {cnt}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-[#111315]">Third Inner Polygon</span>
            <span className="font-mono tabular-nums text-[#4B4F56]">
              {activeCore.polygons.tertiaryStarStep > 1
                ? `{${activeCore.polygons.tertiarySides}/${activeCore.polygons.tertiaryStarStep}} star`
                : `${activeCore.polygons.tertiarySides}-gon`}
            </span>
          </div>
          <div className="grid grid-cols-7 gap-1 p-1 bg-[#F1EFE9] rounded-md">
            {VALID_INNER_SIDES.map((cnt) => {
              const level2Plain =
                activeCore.polygons.yantraTriangles === 0 && activeCore.polygons.starStep === 1;
              const isDisallowed =
                cnt === activeCore.polygons.sides ||
                (activeCore.polygons.yantraTriangles === 1 && cnt === 3) ||
                (level2Plain && (cnt < 5 || cnt === activeCore.polygons.innerSides));
              return (
                <button
                  key={`tertiary-${cnt}`}
                  type="button"
                  disabled={isDisallowed}
                  onClick={() => updateCoreOverride('polygonTertiarySides', cnt)}
                  className={`py-1 text-xs font-mono tabular-nums font-medium rounded transition-colors cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed ${
                    activeCore.polygons.tertiarySides === cnt
                      ? 'bg-[#FFFFFF] text-[#111315] shadow-xs'
                      : 'text-[#4B4F56] hover:text-[#111315]'
                  }`}
                >
                  {cnt}
                </button>
              );
            })}
          </div>
        </div>
        <div className="space-y-2 pt-1">
          <label className="flex items-center gap-2 text-xs text-[#111315] cursor-pointer">
            <input
              type="checkbox"
              checked={activeCore.polygons.yantraTriangles === 1}
              onChange={(e) => updateCoreOverride('polygonYantraTriangles', e.target.checked ? 1 : 0)}
              className="accent-[#1D4ED8] w-4 h-4"
            />
            <span>Shatkona Interlocking Triangles (replaces star)</span>
          </label>
        </div>
      </section>

      {/* Alchemical & Bindu Core */}
      <section className="space-y-3 pb-5 border-b border-[#E2DFD7]">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#4B4F56]">
          Bindu Core & Flanking Alchemy
        </h3>
        {safeCoreIdx >= 0 && (
          <div className="space-y-1.5">
            <span className="block text-xs font-medium text-[#111315]">
              Satellite Bindu Element ({activeCoreWord})
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {ALL_ELEMENTS.map((el: ElementType) => (
                <button
                  key={`sub-el-${el}`}
                  type="button"
                  onClick={() => updateCoreOverride('elementPrimary', el)}
                  className={`flex items-center gap-1.5 px-2 py-1.5 text-xs rounded border transition-colors cursor-pointer ${
                    activeCore.elements.primary === el
                      ? 'border-[#1D4ED8] bg-[#F1EFE9] text-[#111315] font-semibold'
                      : 'border-[#E2DFD7] bg-[#FFFFFF] text-[#4B4F56]'
                  }`}
                >
                  <svg width="14" height="14" viewBox="-12 -12 24 24" aria-hidden="true">
                    <ElementGlyph element={el} size={18} stroke="#111315" strokeWidth={1.6} />
                  </svg>
                  <span>{ELEMENT_LABELS[el]}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        <Slider15Deg
          id="alchemy-rot-slider"
          label="Core Compass Rotation"
          value={activeCore.alchemy.rotationDeg}
          onChange={(v) => updateCoreOverride('alchemyRotationDeg', v)}
        />
        {safeCoreIdx < 0 && (
          <>
            <div className="space-y-1.5">
              <span className="block text-xs font-medium text-[#111315]">Primary Flanking Node (0°)</span>
              <div className="grid grid-cols-2 gap-1.5">
                {ALL_ALCHEMY_SYMBOLS.map((sym: AlchemySymbolId) => (
                  <button
                    key={`alc-p-${sym}`}
                    type="button"
                    onClick={() => updateCoreOverride('alchemyPrimary', sym)}
                    className={`flex items-center gap-2 px-2.5 py-1.5 text-xs rounded border text-left transition-colors cursor-pointer ${
                      activeCore.alchemy.primary === sym
                        ? 'border-[#1D4ED8] bg-[#F1EFE9] text-[#111315] font-semibold'
                        : 'border-[#E2DFD7] bg-[#FFFFFF] text-[#4B4F56] hover:text-[#111315]'
                    }`}
                  >
                    <svg width="16" height="16" viewBox="-16 -16 32 32" aria-hidden="true">
                      <AlchemyGlyph symbol={sym} size={24} stroke="#111315" strokeWidth={1.8} />
                    </svg>
                    <span className="truncate">{ALCHEMY_LABELS[sym]}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="aux-alchemy" className="block text-xs font-medium text-[#111315]">
                Opposing Flanking Node (180°)
              </label>
              <select
                id="aux-alchemy"
                value={activeCore.alchemy.auxiliary}
                onChange={(e) => updateCoreOverride('alchemyAuxiliary', e.target.value as AlchemySymbolId)}
                className="w-full px-2.5 py-1.5 text-xs bg-[#FFFFFF] border border-[#E2DFD7] rounded text-[#111315] focus:outline-none focus:border-[#1D4ED8]"
              >
                {ALL_ALCHEMY_SYMBOLS.map((sym) => (
                  <option key={sym} value={sym}>
                    {ALCHEMY_LABELS[sym]}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </section>

      {safeCoreIdx >= 0 ? (
        <p className="text-xs leading-relaxed text-[#4B4F56]">
          Satellite sub-sigils render Layer 03 (Sacred Geometry & Yantra Core) and the central Layer 06 (Elemental Bindu Core) emblem. Select{' '}
          <button
            type="button"
            onClick={() => setSelectedCoreIdx(-1)}
            className="font-medium text-[#1D4ED8] hover:underline cursor-pointer"
          >
            Main ({primaryWord})
          </button>{' '}
          above to tune Classical Elements or Planetary Alignments.
        </p>
      ) : (
        <>
          {/* Elements */}
          <section className="space-y-3 pb-5 border-b border-[#E2DFD7]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#4B4F56]">
              Classical Elements
            </h3>
            <Slider15Deg
              id="element-rot-slider"
              label="Elemental Axis Rotation"
              value={activeCore.elements.rotationDeg}
              onChange={(v) => updateCoreOverride('elementRotationDeg', v)}
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <span className="block text-xs font-medium text-[#111315]">Primary Element (Core)</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {ALL_ELEMENTS.map((el: ElementType) => (
                    <button
                      key={`prim-${el}`}
                      type="button"
                      onClick={() => updateCoreOverride('elementPrimary', el)}
                      className={`flex items-center gap-1.5 px-2 py-1.5 text-xs rounded border transition-colors cursor-pointer ${
                        activeCore.elements.primary === el
                          ? 'border-[#1D4ED8] bg-[#F1EFE9] text-[#111315] font-semibold'
                          : 'border-[#E2DFD7] bg-[#FFFFFF] text-[#4B4F56]'
                      }`}
                    >
                      <svg width="14" height="14" viewBox="-12 -12 24 24" aria-hidden="true">
                        <ElementGlyph element={el} size={18} stroke="#111315" strokeWidth={1.6} />
                      </svg>
                      <span>{ELEMENT_LABELS[el]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="block text-xs font-medium text-[#111315]">Secondary Element</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {ALL_ELEMENTS.map((el: ElementType) => (
                    <button
                      key={`sec-${el}`}
                      type="button"
                      onClick={() => updateCoreOverride('elementSecondary', el)}
                      className={`flex items-center gap-1.5 px-2 py-1.5 text-xs rounded border transition-colors cursor-pointer ${
                        activeCore.elements.secondary === el
                          ? 'border-[#1D4ED8] bg-[#F1EFE9] text-[#111315] font-semibold'
                          : 'border-[#E2DFD7] bg-[#FFFFFF] text-[#4B4F56]'
                      }`}
                    >
                      <svg width="14" height="14" viewBox="-12 -12 24 24" aria-hidden="true">
                        <ElementGlyph element={el} size={18} stroke="#111315" strokeWidth={1.6} />
                      </svg>
                      <span>{ELEMENT_LABELS[el]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs font-medium text-[#111315]">Polar Symmetry:</span>
              <div className="inline-flex p-0.5 bg-[#F1EFE9] rounded">
                {([2, 4] as const).map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => updateCoreOverride('elementQuadrantCount', cnt)}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                      activeCore.elements.quadrantCount === cnt
                        ? 'bg-[#FFFFFF] text-[#111315]'
                        : 'text-[#4B4F56]'
                    }`}
                  >
                    {cnt === 2 ? '2 Axial' : '4 Cardinal'}
                  </button>
                ))}
              </div>
            </div>
          </section>

      {/* Planetary Alignments */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#4B4F56]">
          Planetary Alignments ({activePlanets.length}/6 active)
        </h3>
        <Slider15Deg
          id="planet-rot-slider"
          label="Orbital Longitude Offset"
          value={activeCore.planets.rotationDeg}
          onChange={(v) => updateCoreOverride('planetRotationDeg', v)}
        />
        <div className="grid grid-cols-3 gap-1.5">
          {ALL_PLANETS.map((planet) => {
            const selected = activePlanets.includes(planet);
            return (
              <button
                key={`pl-${planet}`}
                type="button"
                onClick={() => togglePlanet(planet)}
                aria-pressed={selected}
                className={`flex items-center gap-1.5 px-2 py-1.5 text-xs rounded border transition-colors cursor-pointer ${
                  selected
                    ? 'border-[#1D4ED8] bg-[#F1EFE9] text-[#111315] font-medium'
                    : 'border-[#E2DFD7] bg-[#FFFFFF] text-[#767A82] hover:text-[#111315]'
                }`}
              >
                <svg width="14" height="14" viewBox="-14 -14 28 28" aria-hidden="true">
                  <PlanetGlyph planet={planet} size={20} stroke={selected ? '#111315' : '#767A82'} strokeWidth={1.7} />
                </svg>
                <span className="truncate">{PLANET_LABELS[planet]}</span>
              </button>
            );
          })}
        </div>
        <label className="flex items-center gap-2 text-xs text-[#111315] cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={activeCore.planets.showAspectChords}
            onChange={(e) => updateCoreOverride('planetShowAspectChords', e.target.checked)}
            className="accent-[#1D4ED8] w-4 h-4"
          />
          <span>Show Geometric Aspect Chords</span>
        </label>
      </section>
        </>
      )}
    </div>
  );
};
