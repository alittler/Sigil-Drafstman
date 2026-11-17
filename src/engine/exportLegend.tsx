import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { SigilSpec } from '../types/sigil';
import {
  AlchemyGlyph,
  ArcaneRuneGlyph,
  ElementGlyph,
  LunarPhaseGlyph,
  PlanetGlyph,
} from './glyphPrimitives';
import {
  ALCHEMY_LABELS,
  ELEMENT_LABELS,
  LUNAR_LABELS,
  PLANET_LABELS,
  SACRED_MOTIF_LABELS,
  transliteratePhraseToMicroGlyphs,
  transliterateWordToFuthark,
} from './sigilEngine';

function wrapTitleLines(text: string, maxCharsPerLine = 38): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return ['Untitled Sigil'];
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    if (!current) {
      current = word;
    } else if (current.length + 1 + word.length <= maxCharsPerLine) {
      current = `${current} ${word}`;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

interface PlacedBadge {
  x: number;
  y: number;
  width: number;
  label: string;
  renderIcon?: () => React.ReactNode;
}

function layoutFlowBadges(
  items: Array<{ label: string; hasIcon?: boolean; renderIcon?: () => React.ReactNode }>,
  startX: number,
  startY: number,
  maxX: number,
  badgeHeight = 22,
  gapX = 6,
  gapY = 6
): { placed: PlacedBadge[]; endY: number } {
  const placed: PlacedBadge[] = [];
  let cx = startX;
  let cy = startY;

  for (const item of items) {
    const iconSpace = item.hasIcon ? 18 : 0;
    const width = Math.max(54, Math.ceil(16 + iconSpace + item.label.length * 6.15));
    if (cx > startX && cx + width > maxX) {
      cx = startX;
      cy += badgeHeight + gapY;
    }
    placed.push({
      x: cx,
      y: cy,
      width,
      label: item.label,
      renderIcon: item.renderIcon,
    });
    cx += width + gapX;
  }

  const endY = placed.length > 0 ? cy + badgeHeight : startY;
  return { placed, endY };
}

export interface RenderedExportLegend {
  groupMarkup: string;
  totalHeight: number;
}

/**
 * Render a deterministic, vector-pure SVG <g> legend below the 840x840 sigil plate
 * containing the translated phrase, Elder Futhark spelling, 1-to-1 micro-script cipher,
 * and active symbol definitions.
 */
export function renderExportLegendGroup(spec: SigilSpec): RenderedExportLegend {
  const left = 40;
  const right = 800;
  const maxWidth = right - left;

  const basePhraseDisplay = (spec.profile.baseText || spec.text).trim() || 'sigil';
  const rawPhraseDisplay = spec.text.trim() || 'sigil';
  const phraseDisplay =
    spec.profile.modifier && !rawPhraseDisplay.endsWith(`-${spec.profile.modifier}`)
      ? `${rawPhraseDisplay}-${spec.profile.modifier}`
      : rawPhraseDisplay;
  const words = basePhraseDisplay.split(/\s+/).filter(Boolean);
  const primaryWord = words[0] ?? 'sigil';
  const hashHex = `0x${spec.profile.hashSeed.toString(16).toUpperCase().padStart(8, '0')}`;
  const titleLines = wrapTitleLines(phraseDisplay, 36);

  const futharkSpelling = transliterateWordToFuthark(primaryWord);
  const microTokens = transliteratePhraseToMicroGlyphs(basePhraseDisplay);

  const futharkChipW = 54;
  const futharkGap = 6;
  const futharkPerRow = Math.floor((maxWidth + futharkGap) / (futharkChipW + futharkGap));
  const futharkRows = Math.max(1, Math.ceil(futharkSpelling.length / futharkPerRow));

  const microChipW = 48;
  const microGap = 5;
  const microPerRow = Math.floor((maxWidth + microGap) / (microChipW + microGap));
  const microRows = Math.max(1, Math.ceil(microTokens.length / microPerRow));

  let y = 834;
  const topDividerY = y;
  y += 22;

  const titleStartY = y;
  const headerBlockHeight = Math.max(54, 22 + titleLines.length * 25);
  y += headerBlockHeight + 12;

  // Futhark row
  const futharkHeaderY = y;
  y += 14;
  const futharkGridY = y;
  y += futharkRows * (22 + futharkGap) + 10;

  // Micro-script row
  const microHeaderY = y;
  y += 14;
  const microGridY = y;
  y += microRows * (22 + 6) + 12;

  const midDividerY = y;
  y += 18;

  // Celestial & Planets flow badges
  const celestialPlanetHeaderY = y;
  y += 12;
  const celestialItems: Array<{ label: string; hasIcon?: boolean; renderIcon?: () => React.ReactNode }> = [
    {
      label: `${LUNAR_LABELS[spec.celestial.lunarPhase]} ${spec.celestial.lunarAngleDeg}°`,
      hasIcon: true,
      renderIcon: () => (
        <LunarPhaseGlyph phase={spec.celestial.lunarPhase} size={13} stroke="#111315" strokeWidth={1.45} />
      ),
    },
    {
      label: `Solar ${spec.celestial.solarAngleDeg}°`,
      hasIcon: true,
      renderIcon: () => (
        <g>
          <circle cx={0} cy={0} r={4.2} fill="none" stroke="#111315" strokeWidth={1.3} />
          <circle cx={0} cy={0} r={1.5} fill="#111315" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const rad = ((deg - 90) * Math.PI) / 180;
            return (
              <line
                key={`ex-sun-${deg}`}
                x1={Number((5.5 * Math.cos(rad)).toFixed(2))}
                y1={Number((5.5 * Math.sin(rad)).toFixed(2))}
                x2={Number((7.4 * Math.cos(rad)).toFixed(2))}
                y2={Number((7.4 * Math.sin(rad)).toFixed(2))}
                stroke="#111315"
                strokeWidth={1.1}
                strokeLinecap="round"
              />
            );
          })}
        </g>
      ),
    },
    ...spec.planets.nodes.map((node) => ({
      label: `${PLANET_LABELS[node.planet]} ${node.angleDeg}°`,
      hasIcon: true,
      renderIcon: () => <PlanetGlyph planet={node.planet} size={13} stroke="#111315" strokeWidth={1.45} />,
    })),
  ];
  const celestialLayout = layoutFlowBadges(celestialItems, left, y, right);
  y = celestialLayout.endY + 14;

  // Elements, Alchemy & Geometry flow badges
  const elemAlcHeaderY = y;
  y += 12;
  const mainL2 =
    spec.polygons.yantraTriangles === 1
      ? 'Shatkona'
      : spec.polygons.starStep > 1
      ? `{${spec.polygons.sides}/${spec.polygons.starStep}}`
      : `${spec.polygons.innerSides}-gon`;
  const mainL3 =
    spec.polygons.tertiaryStarStep > 1
      ? `{${spec.polygons.tertiarySides}/${spec.polygons.tertiaryStarStep}}`
      : `${spec.polygons.tertiarySides}-gon`;

  const elemAlcItems: Array<{ label: string; hasIcon?: boolean; renderIcon?: () => React.ReactNode }> = [
    {
      label: `${ELEMENT_LABELS[spec.elements.primary]} (Bindu Core)`,
      hasIcon: true,
      renderIcon: () => <ElementGlyph element={spec.elements.primary} size={13} stroke="#111315" strokeWidth={1.45} />,
    },
    {
      label: `${ELEMENT_LABELS[spec.elements.secondary]} (Secondary)`,
      hasIcon: true,
      renderIcon: () => <ElementGlyph element={spec.elements.secondary} size={13} stroke="#111315" strokeWidth={1.45} />,
    },
    {
      label: `${ALCHEMY_LABELS[spec.alchemy.primary]} (Flank +)`,
      hasIcon: true,
      renderIcon: () => <AlchemyGlyph symbol={spec.alchemy.primary} size={14} stroke="#111315" strokeWidth={1.5} />,
    },
    {
      label: `${ALCHEMY_LABELS[spec.alchemy.auxiliary]} (Flank −)`,
      hasIcon: true,
      renderIcon: () => <AlchemyGlyph symbol={spec.alchemy.auxiliary} size={14} stroke="#111315" strokeWidth={1.5} />,
    },
    {
      label: `${SACRED_MOTIF_LABELS[spec.polygons.sacredMotif]} · ${spec.polygons.sides}-gon · ${mainL2} · ${mainL3}`,
      hasIcon: false,
    },
  ];
  const elemAlcLayout = layoutFlowBadges(elemAlcItems, left, y, right);
  y = elemAlcLayout.endY + 14;

  // Satellite Sub-Sigils (if compound)
  let subHeaderY = 0;
  let subLayout: { placed: PlacedBadge[]; endY: number } = { placed: [], endY: y };
  if (spec.subSigils.length >= 1) {
    subHeaderY = y;
    y += 12;
    const subItems = spec.subSigils.map((sub, idx) => {
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
      return {
        label: `${sub.word}: ${ELEMENT_LABELS[sub.elements.primary]} (${sub.polygons.sides}-gon · ${subL2} · ${subL3} · ${subAngle}°)`,
        hasIcon: true,
        renderIcon: () => <ElementGlyph element={sub.elements.primary} size={13} stroke="#111315" strokeWidth={1.45} />,
      };
    });
    subLayout = layoutFlowBadges(subItems, left, y, right);
    y = subLayout.endY + 12;
  }

  const totalHeight = Math.ceil(y + 18);
  const monoFont = "'SFMono-Regular', Menlo, Monaco, Consolas, monospace";
  const serifFont = "Georgia, 'Times New Roman', serif";
  const sansFont = "system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";

  const rightSummaryLine =
    spec.subSigils.length >= 1
      ? `Main: ${primaryWord} · ${spec.subSigils.length} satellite${spec.subSigils.length === 1 ? '' : 's'} · ${ELEMENT_LABELS[spec.elements.primary]}/${ELEMENT_LABELS[spec.elements.secondary]}`
      : `${SACRED_MOTIF_LABELS[spec.polygons.sacredMotif]} · ${ELEMENT_LABELS[spec.elements.primary]}/${ELEMENT_LABELS[spec.elements.secondary]}`;

  const groupMarkup = renderToStaticMarkup(
    <g xmlns="http://www.w3.org/2000/svg" data-export-legend="true">
      <line x1={left} y1={topDividerY} x2={right} y2={topDividerY} stroke="#D4D0C7" strokeWidth={1} />

      {/* Translated Text Header */}
      <text
        x={left}
        y={titleStartY}
        fontFamily={monoFont}
        fontSize={9.5}
        fontWeight={600}
        letterSpacing={1.2}
        fill="#767A82"
      >
        TRANSLATED TEXT
      </text>
      {titleLines.map((line, idx) => (
        <text
          key={`exp-title-${idx}`}
          x={left}
          y={titleStartY + 23 + idx * 25}
          fontFamily={serifFont}
          fontSize={21}
          fontWeight={600}
          fill="#111315"
        >
          {line}
        </text>
      ))}

      <text
        x={right}
        y={titleStartY}
        textAnchor="end"
        fontFamily={monoFont}
        fontSize={10}
        fill="#4B4F56"
      >
        {`Root ${spec.profile.digitRoot} (Sum ${spec.profile.gematriaSum}) · ${hashHex}${
          spec.profile.modifier ? ` · Seed ${spec.profile.modifier}` : ''
        }`}
      </text>
      <text
        x={right}
        y={titleStartY + 16}
        textAnchor="end"
        fontFamily={monoFont}
        fontSize={10}
        fill="#1D4ED8"
      >
        {spec.category.summary}
      </text>
      <text
        x={right}
        y={titleStartY + 32}
        textAnchor="end"
        fontFamily={monoFont}
        fontSize={9.5}
        fill="#767A82"
      >
        {rightSummaryLine}
      </text>

      {/* Elder Futhark Transliteration */}
      <text
        x={left}
        y={futharkHeaderY}
        fontFamily={monoFont}
        fontSize={9.5}
        fontWeight={600}
        letterSpacing={0.7}
        fill="#4B4F56"
      >
        {`ELDER FUTHARK (${primaryWord.toUpperCase()}) · OUTER RING ${spec.runes.glyphs.length} STATIONS`}
      </text>
      {futharkSpelling.map((pair, idx) => {
        const col = idx % futharkPerRow;
        const row = Math.floor(idx / futharkPerRow);
        const cx = left + col * (futharkChipW + futharkGap);
        const cy = futharkGridY + row * (22 + futharkGap);
        return (
          <g key={`exp-fut-${idx}`}>
            <rect
              x={cx}
              y={cy}
              width={futharkChipW}
              height={22}
              rx={3}
              fill="none"
              stroke="#D4D0C7"
              strokeWidth={0.85}
            />
            <text
              x={cx + 8}
              y={cy + 14.5}
              fontFamily={monoFont}
              fontSize={10}
              fill="#4B4F56"
            >
              {`${pair.letter} →`}
            </text>
            <g transform={`translate(${cx + 41}, ${cy + 11})`}>
              <ArcaneRuneGlyph char={pair.rune} size={13} stroke="#111315" strokeWidth={1.4} />
            </g>
          </g>
        );
      })}

      {/* Micro-Script 1-to-1 Cipher */}
      <text
        x={left}
        y={microHeaderY}
        fontFamily={monoFont}
        fontSize={9.5}
        fontWeight={600}
        letterSpacing={0.7}
        fill="#4B4F56"
      >
        {`MICRO-SCRIPT 1-TO-1 CIPHER (${microTokens.length} TOKENS · REPEATS IN RING)`}
      </text>
      {microTokens.map((token, idx) => {
        const col = idx % microPerRow;
        const row = Math.floor(idx / microPerRow);
        const cx = left + col * (microChipW + microGap);
        const cy = microGridY + row * (22 + 6);
        return (
          <g key={`exp-mic-${idx}`}>
            <rect
              x={cx}
              y={cy}
              width={microChipW}
              height={22}
              rx={3}
              fill="none"
              stroke="#D4D0C7"
              strokeWidth={0.85}
            />
            <text
              x={cx + 7}
              y={cy + 14.5}
              fontFamily={monoFont}
              fontSize={10}
              fill="#4B4F56"
            >
              {`${token.isDivider ? '÷' : token.source} →`}
            </text>
            <g transform={`translate(${cx + 36}, ${cy + 11})`}>
              <ArcaneRuneGlyph char={token.char} size={12} stroke="#111315" strokeWidth={1.35} />
            </g>
          </g>
        );
      })}

      <line x1={left} y1={midDividerY} x2={right} y2={midDividerY} stroke="#E2DFD7" strokeWidth={0.9} />

      {/* Celestial & Planets */}
      <text
        x={left}
        y={celestialPlanetHeaderY}
        fontFamily={monoFont}
        fontSize={9.5}
        fontWeight={600}
        letterSpacing={0.7}
        fill="#4B4F56"
      >
        CELESTIAL &amp; PLANETARY ALIGNMENTS
      </text>
      {celestialLayout.placed.map((badge, idx) => (
        <g key={`exp-cp-${idx}`}>
          <rect
            x={badge.x}
            y={badge.y}
            width={badge.width}
            height={22}
            rx={3}
            fill="none"
            stroke="#D4D0C7"
            strokeWidth={0.85}
          />
          {badge.renderIcon && (
            <g transform={`translate(${badge.x + 14}, ${badge.y + 11})`}>{badge.renderIcon()}</g>
          )}
          <text
            x={badge.x + (badge.renderIcon ? 25 : 8)}
            y={badge.y + 14.5}
            fontFamily={sansFont}
            fontSize={10.5}
            fontWeight={500}
            fill="#111315"
          >
            {badge.label}
          </text>
        </g>
      ))}

      {/* Elements, Alchemy & Geometry */}
      <text
        x={left}
        y={elemAlcHeaderY}
        fontFamily={monoFont}
        fontSize={9.5}
        fontWeight={600}
        letterSpacing={0.7}
        fill="#4B4F56"
      >
        CLASSICAL ELEMENTS, ALCHEMICAL CORE &amp; GEOMETRY
      </text>
      {elemAlcLayout.placed.map((badge, idx) => (
        <g key={`exp-ea-${idx}`}>
          <rect
            x={badge.x}
            y={badge.y}
            width={badge.width}
            height={22}
            rx={3}
            fill="none"
            stroke="#D4D0C7"
            strokeWidth={0.85}
          />
          {badge.renderIcon && (
            <g transform={`translate(${badge.x + 14}, ${badge.y + 11})`}>{badge.renderIcon()}</g>
          )}
          <text
            x={badge.x + (badge.renderIcon ? 25 : 8)}
            y={badge.y + 14.5}
            fontFamily={sansFont}
            fontSize={10.5}
            fontWeight={500}
            fill="#111315"
          >
            {badge.label}
          </text>
        </g>
      ))}

      {/* Satellite Sub-Sigils */}
      {spec.subSigils.length >= 1 && (
        <>
          <text
            x={left}
            y={subHeaderY}
            fontFamily={monoFont}
            fontSize={9.5}
            fontWeight={600}
            letterSpacing={0.7}
            fill="#4B4F56"
          >
            {`DOCKED SATELLITE SUB-SIGILS (${spec.subSigils.length})`}
          </text>
          {subLayout.placed.map((badge, idx) => (
            <g key={`exp-sub-${idx}`}>
              <rect
                x={badge.x}
                y={badge.y}
                width={badge.width}
                height={22}
                rx={3}
                fill="none"
                stroke="#D4D0C7"
                strokeWidth={0.85}
              />
              {badge.renderIcon && (
                <g transform={`translate(${badge.x + 14}, ${badge.y + 11})`}>{badge.renderIcon()}</g>
              )}
              <text
                x={badge.x + (badge.renderIcon ? 25 : 8)}
                y={badge.y + 14.5}
                fontFamily={sansFont}
                fontSize={10.5}
                fontWeight={500}
                fill="#111315"
              >
                {badge.label}
              </text>
            </g>
          ))}
        </>
      )}
    </g>
  );

  return { groupMarkup, totalHeight };
}
