import React, { useMemo, useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import type { ElementType, MagicSchool } from '../types/sigil';
import { MAGIC_SCHOOL_LABELS, SRD_SPELLS } from '../engine/magicDictionary';
import { ALL_ELEMENTS, ELEMENT_LABELS } from '../engine/sigilEngine';
import { ElementGlyph } from '../engine/glyphPrimitives';
import { phraseToPath } from '../engine/sigilUrl';

interface SrdSpellbookViewProps {
  currentText: string;
  currentSeed: string;
  onSelectSpell: (spellName: string) => void;
  onBackToWorkbench: () => void;
}

const ALL_SCHOOLS: MagicSchool[] = [
  'abjuration',
  'conjuration',
  'divination',
  'enchantment',
  'evocation',
  'illusion',
  'necromancy',
  'transmutation',
];

export const SrdSpellbookView: React.FC<SrdSpellbookViewProps> = ({
  currentText,
  currentSeed,
  onSelectSpell,
  onBackToWorkbench,
}) => {
  const [query, setQuery] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<MagicSchool | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<number | 'all'>('all');
  const [selectedElement, setSelectedElement] = useState<ElementType | 'all'>('all');

  const normalizedCurrent = currentText.trim().toLowerCase();

  const filteredSpells = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SRD_SPELLS.filter((spell) => {
      if (selectedSchool !== 'all' && spell.school !== selectedSchool) return false;
      if (selectedLevel !== 'all' && spell.level !== selectedLevel) return false;
      if (
        selectedElement !== 'all' &&
        spell.element !== selectedElement &&
        spell.secondaryElement !== selectedElement
      ) {
        return false;
      }
      if (!q) return true;
      const schoolLabel = MAGIC_SCHOOL_LABELS[spell.school].toLowerCase();
      const elementLabel = ELEMENT_LABELS[spell.element].toLowerCase();
      return (
        spell.name.toLowerCase().includes(q) ||
        schoolLabel.includes(q) ||
        elementLabel.includes(q)
      );
    });
  }, [query, selectedSchool, selectedLevel, selectedElement]);

  const hasActiveFilter =
    query.trim().length > 0 ||
    selectedSchool !== 'all' ||
    selectedLevel !== 'all' ||
    selectedElement !== 'all';

  const resetFilters = () => {
    setQuery('');
    setSelectedSchool('all');
    setSelectedLevel('all');
    setSelectedElement('all');
  };

  return (
    <div className="max-w-6xl w-full mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="pb-5 border-b border-[#E2DFD7] flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-semibold text-[#111315]">
            D&amp;D 5.1 SRD Spellbook
          </h1>
          <p className="text-xs text-[#4B4F56] max-w-2xl">
            {SRD_SPELLS.length} deterministic spell definitions mapped to schools, elements, and sacred geometry. Select any spell to draft its sigil under your active domain seed (
            <span className="font-mono text-[#111315]">/{currentSeed}</span>).
          </p>
        </div>
        <button
          type="button"
          onClick={onBackToWorkbench}
          className="px-3.5 py-2 text-xs font-medium text-[#111315] bg-[#FFFFFF] border border-[#E2DFD7] hover:border-[#111315] rounded transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          Back to Workbench
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-[#FFFFFF] border border-[#E2DFD7] rounded-md p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="w-4 h-4 text-[#767A82] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search SRD spells by name, school, or element..."
              aria-label="Search SRD spells"
              className="w-full pl-9 pr-8 py-2 text-xs bg-[#F8F7F4] border border-[#E2DFD7] rounded text-[#111315] placeholder-[#767A82] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#1D4ED8]"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#767A82] hover:text-[#111315] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value as MagicSchool | 'all')}
              aria-label="Filter by magic school"
              className="px-2.5 py-2 text-xs bg-[#F8F7F4] border border-[#E2DFD7] rounded text-[#111315] focus:outline-none focus:border-[#1D4ED8]"
            >
              <option value="all">All Schools (8)</option>
              {ALL_SCHOOLS.map((school) => (
                <option key={school} value={school}>
                  {MAGIC_SCHOOL_LABELS[school]}
                </option>
              ))}
            </select>

            <select
              value={String(selectedLevel)}
              onChange={(e) =>
                setSelectedLevel(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              aria-label="Filter by spell level"
              className="px-2.5 py-2 text-xs bg-[#F8F7F4] border border-[#E2DFD7] rounded text-[#111315] focus:outline-none focus:border-[#1D4ED8]"
            >
              <option value="all">All Levels (0–9)</option>
              <option value="0">Cantrips (0)</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => (
                <option key={lvl} value={String(lvl)}>
                  Level {lvl}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1 p-1 bg-[#F1EFE9] rounded">
              <button
                type="button"
                onClick={() => setSelectedElement('all')}
                className={`px-2 py-1 text-xs rounded transition-colors cursor-pointer ${
                  selectedElement === 'all'
                    ? 'bg-[#FFFFFF] text-[#111315] font-medium'
                    : 'text-[#4B4F56] hover:text-[#111315]'
                }`}
              >
                All
              </button>
              {ALL_ELEMENTS.map((el) => (
                <button
                  key={el}
                  type="button"
                  onClick={() => setSelectedElement(el)}
                  className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors cursor-pointer ${
                    selectedElement === el
                      ? 'bg-[#FFFFFF] text-[#111315] font-medium'
                      : 'text-[#4B4F56] hover:text-[#111315]'
                  }`}
                >
                  <svg width="12" height="12" viewBox="-12 -12 24 24" aria-hidden="true">
                    <ElementGlyph element={el} size={16} stroke="#111315" strokeWidth={1.7} />
                  </svg>
                  <span>{ELEMENT_LABELS[el]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#767A82]">
          <span>
            Showing {filteredSpells.length} of {SRD_SPELLS.length} SRD spells
          </span>
          {hasActiveFilter && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-[#1D4ED8] hover:underline font-sans font-medium cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Spell Grid */}
      {filteredSpells.length === 0 ? (
        <div className="py-12 text-center bg-[#FFFFFF] border border-dashed border-[#E2DFD7] rounded-md">
          <p className="text-sm text-[#4B4F56]">No SRD spells match your current filters.</p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-2 text-xs font-medium text-[#1D4ED8] hover:underline cursor-pointer"
          >
            Clear search &amp; filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredSpells.map((spell) => {
            const isSelected = spell.name.toLowerCase() === normalizedCurrent;
            const lvlText = spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`;
            const spellPath = phraseToPath(spell.name, currentSeed, 'srd');

            return (
              <button
                key={spell.name}
                type="button"
                onClick={() => onSelectSpell(spell.name)}
                className={`group text-left bg-[#FFFFFF] border rounded-md p-4 transition-colors cursor-pointer flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'border-[#1D4ED8] ring-1 ring-[#1D4ED8]'
                    : 'border-[#E2DFD7] hover:border-[#111315]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 shrink-0 rounded border border-[#E2DFD7] bg-[#F8F7F4] flex items-center justify-center">
                      <svg width="20" height="20" viewBox="-14 -14 28 28" aria-hidden="true">
                        <ElementGlyph
                          element={spell.element}
                          size={18}
                          stroke="#111315"
                          strokeWidth={1.65}
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <div className="font-display text-sm font-semibold text-[#111315] group-hover:text-[#1D4ED8] truncate">
                        {spell.name}
                      </div>
                      <div className="text-xs text-[#4B4F56] mt-0.5">
                        {lvlText} · {MAGIC_SCHOOL_LABELS[spell.school]}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight
                    className="w-4 h-4 text-[#767A82] group-hover:text-[#1D4ED8] shrink-0 transition-colors"
                    aria-hidden="true"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#F1EFE9] text-[11px] font-mono text-[#767A82]">
                  <span>
                    {ELEMENT_LABELS[spell.element]}
                    {spell.secondaryElement ? ` / ${ELEMENT_LABELS[spell.secondaryElement]}` : ''}
                    {spell.ritual ? ' · Ritual' : ''}
                    {spell.concentration ? ' · Conc.' : ''}
                  </span>
                  <span className="truncate max-w-[165px] text-[#4B4F56]">{spellPath}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Attribution */}
      <p className="pt-4 border-t border-[#E2DFD7] text-[11px] text-[#767A82] leading-relaxed">
        Spell metadata follows the D&amp;D 5.1 Systems Reference Document (Wizards of the Coast LLC), licensed under Creative Commons Attribution 4.0 International (CC-BY-4.0). Elemental affinities and geometric rules are mapped deterministically by Sigil Draftsman.
      </p>
    </div>
  );
};
