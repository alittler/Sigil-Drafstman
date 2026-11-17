import React from 'react';
import { Eye, EyeOff, Focus } from 'lucide-react';
import type { LayerId, LayerVisibility, SigilSpec } from '../types/sigil';
import {
  ALCHEMY_LABELS,
  ELEMENT_LABELS,
  LUNAR_LABELS,
  PLANET_LABELS,
  SACRED_MOTIF_LABELS,
} from '../engine/sigilEngine';

interface LayerBreakdownPanelProps {
  spec: SigilSpec;
  visibility: LayerVisibility;
  hoveredLayer: LayerId | null;
  onHoverLayer: (layer: LayerId | null) => void;
  onToggleLayer: (layer: LayerId) => void;
  onIsolateLayer: (layer: LayerId) => void;
  onShowAllLayers: () => void;
}

interface LayerMeta {
  id: LayerId;
  order: string;
  name: string;
  summary: (spec: SigilSpec) => string;
  derivation: (spec: SigilSpec) => string;
}

const LAYER_META: LayerMeta[] = [
  {
    id: 'celestial',
    order: '01',
    name: 'Celestial Markers',
    summary: (s) =>
      `${LUNAR_LABELS[s.celestial.lunarPhase]} (${s.celestial.lunarAngleDeg}°) · Solar (${s.celestial.solarAngleDeg}°)`,
    derivation: (s) => s.notes.celestial,
  },
  {
    id: 'runes',
    order: '02',
    name: '15° Arcane Runes & Seals',
    summary: (s) =>
      `${s.runes.stationCount} glyphs · ${s.runes.rotationDeg}°${
        s.subSigils.length >= 1
          ? ' · Outer band'
          : s.runes.dualBand
          ? ' · Dual band'
          : ''
      }`,
    derivation: (s) => s.notes.runes,
  },
  {
    id: 'polygons',
    order: '03',
    name: 'Sacred Geometry & Yantra Core',
    summary: (s) =>
      `${SACRED_MOTIF_LABELS[s.polygons.sacredMotif]} · ${s.polygons.sides}-gon · ${
        s.polygons.yantraTriangles === 1
          ? 'Shatkona'
          : s.polygons.starStep > 1
          ? `{${s.polygons.sides}/${s.polygons.starStep}} star`
          : `${s.polygons.innerSides}-gon`
      } · ${
        s.polygons.tertiaryStarStep > 1
          ? `{${s.polygons.tertiarySides}/${s.polygons.tertiaryStarStep}}`
          : `${s.polygons.tertiarySides}-gon`
      }${s.subSigils.length >= 1 ? ` + ${s.subSigils.length} satellite${s.subSigils.length === 1 ? '' : 's'}` : ''}`,
    derivation: (s) => s.notes.polygons,
  },
  {
    id: 'planets',
    order: '04',
    name: 'Planetary Alignments',
    summary: (s) =>
      `${s.planets.nodes.map((n) => PLANET_LABELS[n.planet]).join(', ')} · ${s.planets.aspects.length} aspect${s.planets.aspects.length === 1 ? '' : 's'}`,
    derivation: (s) => s.notes.planets,
  },
  {
    id: 'elements',
    order: '05',
    name: 'Classical Elements',
    summary: (s) =>
      `${ELEMENT_LABELS[s.elements.primary]} (Core) / ${ELEMENT_LABELS[s.elements.secondary]} · ${s.elements.quadrantCount} poles · ${s.elements.rotationDeg}°`,
    derivation: (s) => s.notes.elements,
  },
  {
    id: 'alchemy',
    order: '06',
    name: 'Alchemical & Bindu Core',
    summary: (s) =>
      `${ELEMENT_LABELS[s.elements.primary]} core · ${ALCHEMY_LABELS[s.alchemy.primary]} / ${ALCHEMY_LABELS[s.alchemy.auxiliary]} · ${s.alchemy.rotationDeg}°${
        s.subSigils.length >= 1 ? ` + ${s.subSigils.length} satellite${s.subSigils.length === 1 ? '' : 's'}` : ''
      }`,
    derivation: (s) => s.notes.alchemy,
  },
];

export const LayerBreakdownPanel: React.FC<LayerBreakdownPanelProps> = ({
  spec,
  visibility,
  hoveredLayer,
  onHoverLayer,
  onToggleLayer,
  onIsolateLayer,
  onShowAllLayers,
}) => {
  const hiddenCount = LAYER_META.filter((layer) => !visibility[layer.id]).length;

  return (
    <div className="flex flex-col">
      <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#E2DFD7]">
        <div>
          <h2 className="text-sm font-semibold text-[#111315]">Layer Anatomy & Derivation</h2>
          <p className="text-xs text-[#4B4F56] mt-0.5">
            Hover any layer to highlight its geometry on the drafting stage.
          </p>
          <div className="mt-1.5 font-mono text-[11px] text-[#1D4ED8]">
            {spec.category.summary}
            {spec.profile.modifier ? ` · Seed ${spec.profile.modifier}` : ''}
          </div>
        </div>
        {hiddenCount > 0 && (
          <button
            type="button"
            onClick={onShowAllLayers}
            className="text-xs font-medium text-[#1D4ED8] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
          >
            Show All ({LAYER_META.length - hiddenCount}/{LAYER_META.length})
          </button>
        )}
      </div>

      <div className="divide-y divide-[#E2DFD7]">
        {LAYER_META.map((layer) => {
          const isVisible = visibility[layer.id];
          const isHovered = hoveredLayer === layer.id;

          return (
            <div
              key={layer.id}
              onMouseEnter={() => onHoverLayer(layer.id)}
              onMouseLeave={() => onHoverLayer(null)}
              className={`py-3.5 px-2 -mx-2 rounded transition-colors duration-150 ${
                isHovered ? 'bg-[#F1EFE9]' : 'hover:bg-[#F8F7F4]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono tabular-nums text-xs text-[#767A82]">
                      {layer.order}.
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        isVisible ? 'text-[#111315]' : 'text-[#767A82] line-through'
                      }`}
                    >
                      {layer.name}
                    </span>
                  </div>
                  <div className="mt-1 text-xs font-mono tabular-nums text-[#4B4F56]">
                    {layer.summary(spec)}
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#4B4F56]">
                    {layer.derivation(spec)}
                  </p>
                  {spec.subSigils.length >= 1 &&
                    (layer.id === 'polygons' || layer.id === 'alchemy') && (() => {
                      const noteKey = layer.id;
                      return (
                        <ul className="mt-2 space-y-1 border-l-2 border-[#E2DFD7] pl-2.5 text-[11px] text-[#4B4F56]">
                          {spec.subSigils.map((sub, idx) => (
                            <li key={`${noteKey}-sub-${idx}`}>
                              <span className="font-mono font-medium text-[#111315]">
                                {idx + 1}. {sub.word}:
                              </span>{' '}
                              {sub.notes[noteKey]}
                            </li>
                          ))}
                        </ul>
                      );
                    })()}
                </div>

                <div className="flex items-center gap-1 shrink-0 pt-0.5">
                  <button
                    type="button"
                    onClick={() => onIsolateLayer(layer.id)}
                    title={`Isolate ${layer.name}`}
                    aria-label={`Isolate ${layer.name}`}
                    className="p-2 rounded text-[#4B4F56] hover:text-[#1D4ED8] hover:bg-[#FFFFFF] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1D4ED8]"
                  >
                    <Focus className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleLayer(layer.id)}
                    title={isVisible ? `Hide ${layer.name}` : `Show ${layer.name}`}
                    aria-label={isVisible ? `Hide ${layer.name}` : `Show ${layer.name}`}
                    aria-pressed={isVisible}
                    className={`p-2 rounded transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1D4ED8] ${
                      isVisible
                        ? 'text-[#111315] hover:bg-[#FFFFFF]'
                        : 'text-[#767A82] hover:text-[#111315] hover:bg-[#FFFFFF]'
                    }`}
                  >
                    {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
