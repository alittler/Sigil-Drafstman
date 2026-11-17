import React, { useState } from 'react';
import { Bookmark, Check, Circle, CircleDashed, Dices, Flower, Link2, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import type {
  DraftingOptions,
  LayerId,
  LayerVisibility,
  MagicDictionaryMode,
  ManualOverrides,
  ResolvedDictionaryId,
  SigilSpec,
} from '../types/sigil';
import {
  countActiveOverrides,
  ELEMENT_LABELS,
  SACRED_MOTIF_LABELS,
} from '../engine/sigilEngine';
import { DICTIONARY_LABELS } from '../engine/magicDictionary';
import { buildShareableSigilUrl, copyTextToClipboard, phraseToPath } from '../engine/sigilUrl';
import { SigilSvg } from './SigilSvg';
import { SigilLegendStrip } from './SigilLegendStrip';

interface SigilCanvasProps {
  text: string;
  seed: string;
  dictionaryMode: MagicDictionaryMode;
  effectiveDictionary: ResolvedDictionaryId;
  onTextChange: (value: string) => void;
  onSeedChange: (value: string) => void;
  onDictionaryChange: (mode: MagicDictionaryMode) => void;
  onRandomizeSeed: () => void;
  onSelectSample?: (value: string) => void;
  spec: SigilSpec;
  visibility: LayerVisibility;
  draftingOptions: DraftingOptions;
  overrides: ManualOverrides;
  hoveredLayer: LayerId | null;
  svgRef: React.RefObject<SVGSVGElement | null>;
  onToggleDegrees: () => void;
  onToggleSeedOfLife: () => void;
  onToggleDashedLines: () => void;
  showBounding: boolean;
  onToggleBounding: () => void;
  onQuickSave: () => void;
  onResetOverrides: () => void;
}

const SAMPLE_PHRASES = [
  'Aurelia',
  'Aurelia Astra',
  'Ignis Et Terra',
  'Fireball',
];

export const SigilCanvas: React.FC<SigilCanvasProps> = ({
  text,
  seed,
  dictionaryMode,
  effectiveDictionary,
  onTextChange,
  onSeedChange,
  onDictionaryChange,
  onRandomizeSeed,
  onSelectSample,
  spec,
  visibility,
  draftingOptions,
  overrides,
  hoveredLayer,
  svgRef,
  onToggleDegrees,
  onToggleSeedOfLife,
  onToggleDashedLines,
  showBounding,
  onToggleBounding,
  onQuickSave,
  onResetOverrides,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = React.useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const [pointerCoords, setPointerCoords] = useState<{ angle: number; radius: number } | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const [justCopiedUrl, setJustCopiedUrl] = useState(false);

  const overrideCount = countActiveOverrides(overrides);
  const canonicalPath = phraseToPath(text, seed, effectiveDictionary);
  const selectValue: MagicDictionaryMode = dictionaryMode === 'srd' ? 'auto' : dictionaryMode;
  const autoLabelDict: ResolvedDictionaryId =
    effectiveDictionary === 'srd' ? 'roots' : effectiveDictionary;

  const updateZoom = (nextZoom: number) => {
    const clamped = Math.min(2, Math.max(0.75, Number(nextZoom.toFixed(2))));
    setZoom(clamped);
    if (clamped <= 1) {
      setPan({ x: 0, y: 0 });
    } else {
      const maxOffset = (clamped - 1) * 320;
      setPan((prev) => ({
        x: Math.max(-maxOffset, Math.min(maxOffset, prev.x)),
        y: Math.max(-maxOffset, Math.min(maxOffset, prev.y)),
      }));
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (zoom <= 1 || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const maxOffset = (zoom - 1) * 320;
    setPan({
      x: Math.max(-maxOffset, Math.min(maxOffset, dragStartRef.current.panX + dx)),
      y: Math.max(-maxOffset, Math.min(maxOffset, dragStartRef.current.panY + dy)),
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
      setIsDragging(false);
      dragStartRef.current = null;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const radiusPx = Math.sqrt(dx * dx + dy * dy);
    const scaleToSvg = 840 / rect.width;
    const svgRadius = Math.round(radiusPx * scaleToSvg);

    let deg = Math.round((Math.atan2(dx, -dy) * 180) / Math.PI);
    if (deg < 0) deg += 360;

    setPointerCoords({ angle: deg, radius: svgRadius });
  };

  const handleSaveClick = () => {
    onQuickSave();
    setJustSaved(true);
    window.setTimeout(() => setJustSaved(false), 1800);
  };

  const handleCopyUrlClick = async () => {
    const shareUrl = buildShareableSigilUrl(text, seed, effectiveDictionary);
    const copied = await copyTextToClipboard(shareUrl);
    if (copied) {
      setJustCopiedUrl(true);
      window.setTimeout(() => setJustCopiedUrl(false), 1800);
    }
  };

  const hexSeed = `0x${spec.profile.hashSeed.toString(16).toUpperCase().padStart(8, '0')}`;
  const baseWords = (spec.profile.baseText || text).trim().split(/\s+/).filter(Boolean);
  const primaryWord = baseWords[0] ?? 'sigil';

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8F7F4]">
      {/* Text Input & Derivation Telemetry Strip */}
      <div className="bg-[#FFFFFF] border-b border-[#E2DFD7] px-6 py-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex flex-1 min-w-[260px] sm:min-w-[300px] items-stretch bg-[#F8F7F4] border border-[#E2DFD7] focus-within:border-[#1D4ED8] focus-within:bg-[#FFFFFF] rounded transition-colors overflow-hidden">
            <label htmlFor="sigil-dictionary-select" className="sr-only">
              Classification mode
            </label>
            <select
              id="sigil-dictionary-select"
              value={selectValue}
              onChange={(e) => onDictionaryChange(e.target.value as MagicDictionaryMode)}
              title={`Active dictionary: ${DICTIONARY_LABELS[autoLabelDict]}`}
              className="max-w-[155px] px-2.5 py-2 text-xs font-mono font-medium bg-[#F1EFE9] border-r border-[#E2DFD7] text-[#111315] focus:outline-none cursor-pointer shrink-0 truncate"
            >
              <option value="auto">
                Auto ({DICTIONARY_LABELS[autoLabelDict]})
              </option>
              <option value="roots">Arcane Roots</option>
              <option value="phonetic">Phonetic</option>
            </select>
            <label htmlFor="sigil-phrase-input" className="sr-only">
              Phrase to translate into an arcane sigil
            </label>
            <input
              id="sigil-phrase-input"
              type="text"
              value={text}
              onChange={(e) => {
                if (dictionaryMode === 'srd') {
                  onDictionaryChange('auto');
                }
                onTextChange(e.target.value);
              }}
              placeholder="Enter any word or phrase to draft its sigil..."
              className="w-full min-w-[140px] px-3.5 py-2 text-base leading-normal font-display bg-transparent text-[#111315] placeholder-[#767A82] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div
              className="h-[42px] inline-flex items-center bg-[#F8F7F4] border border-[#E2DFD7] focus-within:border-[#1D4ED8] focus-within:bg-[#FFFFFF] rounded px-2.5 transition-colors"
              title="Domain seed segment in URL (e.g. /50868228/Ignis-Et-Terra)"
            >
              <label htmlFor="sigil-domain-seed-input" className="text-[11px] font-mono leading-none text-[#767A82] mr-1.5 select-none whitespace-nowrap">
                Seed /
              </label>
              <input
                id="sigil-domain-seed-input"
                type="text"
                value={seed}
                onChange={(e) => onSeedChange(e.target.value)}
                onBlur={() => {
                  if (!seed.trim()) onRandomizeSeed();
                }}
                placeholder="50868228"
                aria-label="Domain URL Seed"
                className="w-24 h-full py-1 text-xs leading-normal font-mono tabular-nums text-[#111315] bg-transparent focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={onRandomizeSeed}
              title="Generate a new random domain seed while keeping the same dictionary rules"
              className="h-[42px] inline-flex items-center gap-1.5 px-3 text-xs font-medium text-[#111315] bg-[#FFFFFF] border border-[#E2DFD7] hover:border-[#1D4ED8] rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Dices className="w-3.5 h-3.5 text-[#1D4ED8]" aria-hidden="true" />
              <span>Vary Seed</span>
            </button>
            {overrideCount > 0 && (
              <button
                type="button"
                onClick={onResetOverrides}
                className="h-[42px] inline-flex items-center gap-1.5 px-3 text-xs font-medium text-[#1D4ED8] bg-[#F1EFE9] hover:bg-[#E2DFD7] rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset ({overrideCount})</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleCopyUrlClick}
              title={`Copy direct link (${canonicalPath})`}
              className="h-[42px] inline-flex items-center gap-1.5 px-3.5 text-xs font-medium text-[#111315] bg-[#FFFFFF] border border-[#E2DFD7] hover:border-[#111315] rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {justCopiedUrl ? (
                <Check className="w-3.5 h-3.5 text-[#1D4ED8]" aria-hidden="true" />
              ) : (
                <Link2 className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              <span>{justCopiedUrl ? 'Copied URL' : 'Share URL'}</span>
            </button>
            <button
              type="button"
              onClick={handleSaveClick}
              className="h-[42px] inline-flex items-center gap-1.5 px-3.5 text-xs font-medium text-[#111315] bg-[#FFFFFF] border border-[#E2DFD7] hover:border-[#111315] rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{justSaved ? 'Saved' : 'Save Sigil'}</span>
            </button>
          </div>
        </div>

        {/* Unboxed Metadata & Sample Triggers */}
        <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 text-xs text-[#4B4F56]">
          <div className="flex flex-wrap items-center gap-2 font-mono tabular-nums">
            <span>
              {spec.subSigils.length >= 1
                ? `Main: ${primaryWord} · Sub-sigils: ${spec.subSigils.map((c) => c.word).join(', ')}`
                : SACRED_MOTIF_LABELS[spec.polygons.sacredMotif]}
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-[#111315] font-medium">{spec.category.summary}</span>
            <span aria-hidden="true">·</span>
            <span>Root {spec.profile.digitRoot} (Sum {spec.profile.gematriaSum})</span>
            <span aria-hidden="true">·</span>
            <span>{ELEMENT_LABELS[spec.elements.primary]}</span>
            {spec.profile.modifier && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#1D4ED8]">Seed {spec.profile.modifier}</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span className="text-[#767A82]">{hexSeed}</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#1D4ED8]">{canonicalPath}</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#767A82]">Samples:</span>
            {SAMPLE_PHRASES.map((sample, idx) => (
              <React.Fragment key={sample}>
                {idx > 0 && <span className="text-[#D4D0C7]" aria-hidden="true">/</span>}
                <button
                  type="button"
                  onClick={() => (onSelectSample ? onSelectSample(sample) : onTextChange(sample))}
                  className={`hover:text-[#1D4ED8] transition-colors cursor-pointer whitespace-nowrap ${
                    text.trim() === sample ? 'text-[#111315] font-medium underline underline-offset-4' : 'text-[#4B4F56]'
                  }`}
                >
                  {sample}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Central Drafting Stage */}
      <div className="relative flex-1 bg-[#FFFFFF] drafting-grid flex items-center justify-center p-4 sm:p-8 overflow-hidden min-h-[460px]">
        {/* Unframed Drafting Plate */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setPointerCoords(null)}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transition: isDragging ? 'none' : 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
            touchAction: zoom > 1 ? 'none' : 'auto',
          }}
          className={`relative w-full max-w-[620px] aspect-square flex items-center justify-center p-2 ${
            zoom > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-crosshair'
          }`}
        >
          <SigilSvg
            svgRef={svgRef}
            spec={spec}
            visibility={visibility}
            options={draftingOptions}
            hoveredLayer={hoveredLayer}
            className="w-full h-full"
          />
        </div>

        {/* Bottom Coordinate Readout & Stage Controls */}
        <div className="absolute bottom-4 inset-x-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Bottom-Left Live Polar Coordinate Readout */}
          <div className="bg-[#FFFFFF]/95 border border-[#E2DFD7] rounded px-3 py-1.5 font-mono tabular-nums text-[11px] text-[#4B4F56]">
            {pointerCoords ? (
              <span>
                θ {String(pointerCoords.angle).padStart(3, '0')}° · r {pointerCoords.radius}u · Δ15° snap {Math.round(pointerCoords.angle / 15) * 15 % 360}°
              </span>
            ) : (
              <span>840×840 plate · 15° angular lattice</span>
            )}
          </div>

          {/* Bottom-Right Stage Controls */}
          <div className="ml-auto flex flex-wrap items-center gap-1 bg-[#FFFFFF]/95 border border-[#E2DFD7] rounded p-1 pointer-events-auto">
            <button
              type="button"
              onClick={onToggleBounding}
              aria-pressed={showBounding}
              title="Toggle outer bounding circle & eldritch arcs"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer whitespace-nowrap ${
                showBounding
                  ? 'bg-[#F1EFE9] text-[#111315]'
                  : 'text-[#4B4F56] hover:text-[#111315]'
              }`}
            >
              <Circle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Bounding Ring</span>
            </button>

            <button
              type="button"
              onClick={onToggleDegrees}
              aria-pressed={draftingOptions.showDegreeLabels}
              className={`px-2.5 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer whitespace-nowrap ${
                draftingOptions.showDegreeLabels
                  ? 'bg-[#F1EFE9] text-[#111315]'
                  : 'text-[#4B4F56] hover:text-[#111315]'
              }`}
            >
              Degrees
            </button>

            <button
              type="button"
              onClick={onToggleSeedOfLife}
              aria-pressed={draftingOptions.showSeedOfLife}
              title="Toggle Seed of Life sacred lattice in the central sigil"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer whitespace-nowrap ${
                draftingOptions.showSeedOfLife
                  ? 'bg-[#F1EFE9] text-[#111315]'
                  : 'text-[#4B4F56] hover:text-[#111315]'
              }`}
            >
              <Flower className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Seed of Life</span>
            </button>

            <button
              type="button"
              onClick={onToggleDashedLines}
              aria-pressed={draftingOptions.showDashedLines}
              title="Toggle light dashed orbital, chord, and tether lines"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer whitespace-nowrap ${
                draftingOptions.showDashedLines
                  ? 'bg-[#F1EFE9] text-[#111315]'
                  : 'text-[#4B4F56] hover:text-[#111315]'
              }`}
            >
              <CircleDashed className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Dashed Lines</span>
            </button>

            <span className="h-4 w-[1px] bg-[#E2DFD7]" aria-hidden="true" />

            <button
              type="button"
              onClick={() => updateZoom(zoom - 0.25)}
              disabled={zoom <= 0.75}
              aria-label="Zoom out"
              className="p-1.5 text-[#4B4F56] hover:text-[#111315] rounded cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              className="px-1.5 font-mono tabular-nums text-[11px] text-[#4B4F56] hover:text-[#111315] cursor-pointer"
              title="Reset zoom and pan"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              type="button"
              onClick={() => updateZoom(zoom + 0.25)}
              disabled={zoom >= 2}
              aria-label="Zoom in"
              className="p-1.5 text-[#4B4F56] hover:text-[#111315] rounded cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Live Strings & Active Symbols Manifest Underneath the Sigil */}
      <SigilLegendStrip
        spec={spec}
        visibility={visibility}
        draftingOptions={draftingOptions}
      />
    </div>
  );
};
