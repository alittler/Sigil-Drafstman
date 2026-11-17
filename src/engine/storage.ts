import type { SavedSigilRecord } from '../types/sigil';
import { DEFAULT_LAYER_VISIBILITY } from './sigilEngine';

const STORAGE_KEY = 'sigil_draftsman_library_v1';

const STARTER_PRESETS: SavedSigilRecord[] = [
  {
    id: 'preset-aurelia-astra',
    title: 'Aurelia Astra',
    notes: 'Harmonic celestial study with heptagonal star geometry and trine planetary chord.',
    text: 'Aurelia Astra',
    overrides: {},
    visibility: { ...DEFAULT_LAYER_VISIBILITY },
    strokeWeight: 1.75,
    createdAt: 1730000000000,
    updatedAt: 1730000000000,
  },
  {
    id: 'preset-ignis-terra',
    title: 'Ignis Et Terra',
    notes: 'Cardinal fire-earth polarity aligned on 45-degree intervals.',
    text: 'Ignis Et Terra',
    overrides: {
      polygonRotationDeg: 45,
      elementPrimary: 'fire',
      elementSecondary: 'earth',
    },
    visibility: { ...DEFAULT_LAYER_VISIBILITY },
    strokeWeight: 1.9,
    createdAt: 1730000100000,
    updatedAt: 1730000100000,
  },
  {
    id: 'preset-chronos-meridian',
    title: 'Chronos Meridian',
    notes: 'Twelve-station 30-degree rune lattice around a Saturn-Jupiter opposition.',
    text: 'Chronos Meridian',
    overrides: {
      runeStationCount: 12,
      alchemyPrimary: 'lead',
    },
    visibility: { ...DEFAULT_LAYER_VISIBILITY },
    strokeWeight: 1.65,
    createdAt: 1730000200000,
    updatedAt: 1730000200000,
  },
];

export function loadSavedSigils(): SavedSigilRecord[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(STARTER_PRESETS));
      return STARTER_PRESETS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return STARTER_PRESETS;
    }
    return parsed;
  } catch {
    return STARTER_PRESETS;
  }
}

export function persistSavedSigils(records: SavedSigilRecord[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // Ignore quota errors gracefully
  }
}
