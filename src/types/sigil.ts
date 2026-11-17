export type LayerId =
  | 'bounding'
  | 'celestial'
  | 'runes'
  | 'polygons'
  | 'elements'
  | 'alchemy'
  | 'planets';

export type ElementType = 'fire' | 'air' | 'water' | 'earth';

export type AlchemySymbolId =
  | 'sulfur'
  | 'mercury'
  | 'salt'
  | 'gold'
  | 'silver'
  | 'copper'
  | 'iron'
  | 'tin'
  | 'lead'
  | 'crucible';

export type PlanetId =
  | 'sun'
  | 'moon'
  | 'mercury'
  | 'venus'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune';

export type LunarPhase = 'new' | 'waxing' | 'full' | 'waning';

export type AspectType = 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition';

export interface PlanetaryNode {
  planet: PlanetId;
  angleDeg: number; // Snapped to 15-degree intervals (0..345)
}

export interface PlanetaryAspect {
  from: PlanetId;
  to: PlanetId;
  fromDeg: number;
  toDeg: number;
  type: AspectType;
  angleDiff: number;
}

export type RunePaletteMode =
  | 'auto'
  | 'runic'
  | 'warding'
  | 'containment'
  | 'astral'
  | 'binding'
  | 'nodes-polygons'
  | 'starbursts-syllabics';

export interface RuneGlyphSpec {
  id: string;
  char: string;
  name: string;
  label: string;
  code: number;
  angleDeg: number; // Multiple of 15 degrees
}

export interface PhoneticProfile {
  normalizedText: string;
  charCount: number;
  wordCount: number;
  vowelCount: number;
  plosiveCount: number;
  fricativeCount: number;
  liquidNasalCount: number;
  gematriaSum: number;
  digitRoot: number;
  hashSeed: number;
}

export interface LayerDerivationNotes {
  bounding: string;
  celestial: string;
  runes: string;
  polygons: string;
  elements: string;
  alchemy: string;
  planets: string;
}

export type SacredMotif =
  | 'eldritch-mandala'
  | 'sri-yantra'
  | 'sacred-rosette'
  | 'astral-compass';

export interface SigilCoreSpec {
  word: string;
  polygons: {
    sides: number; // 3..12 (excluding 4)
    starStep: number; // 1..5 (1 = regular polygon only, >=2 = Schläfli star {n/k})
    innerSides: number; // 3..10 (excluding 4)
    tertiarySides: number; // 3..10 (excluding 4) — third inner polygon
    tertiaryStarStep: number; // 1 = plain polygon, >=2 = star (enforced when Level 2 is also a plain polygon)
    rotationDeg: number; // 15° interval
    showInscribedCircle: boolean;
    sacredMotif: SacredMotif;
    yantraTriangles: 0 | 1; // At most 1 interlocking Shiva/Shakti pair
    flowerOfLife: boolean;
  };
  elements: {
    primary: ElementType;
    secondary: ElementType;
    rotationDeg: number; // 15° interval
    quadrantCount: 2 | 4;
  };
  alchemy: {
    primary: AlchemySymbolId;
    auxiliary: AlchemySymbolId;
    rotationDeg: number; // 15° interval
    showCoreCollar: boolean;
  };
  planets: {
    nodes: PlanetaryNode[];
    aspects: PlanetaryAspect[];
    rotationDeg: number; // 15° interval
    showAspectChords: boolean;
  };
  notes: {
    polygons: string;
    elements: string;
    alchemy: string;
    planets: string;
  };
}

export interface SigilSpec {
  text: string;
  profile: PhoneticProfile;
  compoundAxisDeg: number; // 15° interval for multi-word sub-sigil placement
  subSigils: SigilCoreSpec[]; // Empty for single-word sigils; 1..6 inner sub-sigils for subsequent words (words 2+)
  bounding: {
    doubleRing: boolean;
    cardinalTicks: boolean;
    protractorTicks: boolean;
    eldritchArcs: boolean;
  };
  celestial: {
    lunarPhase: LunarPhase;
    lunarAngleDeg: number; // 15° interval
    solarAngleDeg: number; // 15° interval
    chordCount: number;
    rotationDeg: number; // 15° interval
  };
  runes: {
    stationCount: 4 | 6 | 8 | 12 | 24;
    rotationDeg: number; // 15° interval
    dualBand: boolean;
    palette: RunePaletteMode;
    glyphs: RuneGlyphSpec[];
  };
  polygons: SigilCoreSpec['polygons'];
  elements: SigilCoreSpec['elements'];
  alchemy: SigilCoreSpec['alchemy'];
  planets: SigilCoreSpec['planets'];
  notes: LayerDerivationNotes;
}

export interface ManualOverrides {
  compoundAxisDeg?: number;
  subOverrides?: Record<number, ManualOverrides>;
  boundingDoubleRing?: boolean;
  boundingEldritchArcs?: boolean;
  celestialLunarPhase?: LunarPhase;
  celestialRotationDeg?: number;
  runeStationCount?: 4 | 6 | 8 | 12 | 24;
  runeRotationDeg?: number;
  runeDualBand?: boolean;
  runePalette?: RunePaletteMode;
  polygonSides?: number;
  polygonStarStep?: number;
  polygonInnerSides?: number;
  polygonTertiarySides?: number;
  polygonRotationDeg?: number;
  polygonSacredMotif?: SacredMotif;
  polygonYantraTriangles?: 0 | 1;
  polygonFlowerOfLife?: boolean;
  elementPrimary?: ElementType;
  elementSecondary?: ElementType;
  elementRotationDeg?: number;
  elementQuadrantCount?: 2 | 4;
  alchemyPrimary?: AlchemySymbolId;
  alchemyAuxiliary?: AlchemySymbolId;
  alchemyRotationDeg?: number;
  planetSelection?: PlanetId[];
  planetRotationDeg?: number;
  planetShowAspectChords?: boolean;
}

export type LayerVisibility = Record<LayerId, boolean>;

export interface DraftingOptions {
  strokeWeight: number; // 1.0 to 2.8
  showGridGuides: boolean;
  showDegreeLabels: boolean;
  showSeedOfLife: boolean;
  showDashedLines: boolean;
}

export interface SavedSigilRecord {
  id: string;
  title: string;
  notes: string;
  text: string;
  overrides: ManualOverrides;
  visibility: LayerVisibility;
  strokeWeight: number;
  createdAt: number;
  updatedAt: number;
}
