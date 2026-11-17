import type {
  AlchemySymbolId,
  AspectType,
  ElementType,
  LayerVisibility,
  LunarPhase,
  MagicClassification,
  MagicDictionaryMode,
  ManualOverrides,
  PhoneticProfile,
  PlanetaryAspect,
  PlanetaryNode,
  PlanetId,
  RuneGlyphSpec,
  RunePaletteMode,
  SacredMotif,
  SigilCoreSpec,
  SigilSpec,
} from '../types/sigil';
import {
  buildDomainRuleProfile,
  classifyMagicPhrase,
  type DomainRuleProfile,
} from './magicDictionary';
import {
  ALL_ARCANE_GLYPHS,
  CONCENTRIC_NODE_GLYPHS,
  LATIN_TO_MICRO_GLYPH,
  LATIN_TO_RUNIC,
  lookupArcaneGlyph,
  POLYGON_NODE_GLYPHS,
  RUNE_PALETTE_LABELS,
  RUNIC_BLOCK_GLYPHS,
  SEAL_SEQUENCES,
  STARBURST_PETAL_GLYPHS,
  SYLLABIC_GLYPHS,
  TRIANGLE_WEDGE_GLYPHS,
} from './runeCatalog';

export const ALL_SACRED_MOTIFS: SacredMotif[] = [
  'eldritch-mandala',
  'sri-yantra',
  'sacred-rosette',
  'astral-compass',
];

export const SACRED_MOTIF_LABELS: Record<SacredMotif, string> = {
  'eldritch-mandala': 'Eldritch Mandala',
  'sri-yantra': 'Sri Yantra',
  'sacred-rosette': 'Sacred Rosette',
  'astral-compass': 'Astral Compass',
};

export const VALID_POLYGON_SIDES = [3, 5, 6, 7, 8, 9, 10, 11, 12] as const;
export const VALID_INNER_SIDES = [3, 5, 6, 7, 8, 9, 10] as const;

export const ALL_ELEMENTS: ElementType[] = ['fire', 'air', 'water', 'earth'];

export const ALL_ALCHEMY_SYMBOLS: AlchemySymbolId[] = [
  'sulfur',
  'mercury',
  'salt',
  'gold',
  'silver',
  'copper',
  'iron',
  'tin',
  'lead',
  'crucible',
];

export const ALL_PLANETS: PlanetId[] = [
  'sun',
  'moon',
  'mercury',
  'venus',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
];

export const ALL_LUNAR_PHASES: LunarPhase[] = ['new', 'waxing', 'full', 'waning'];

export const DEFAULT_LAYER_VISIBILITY: LayerVisibility = {
  bounding: false,
  celestial: true,
  runes: true,
  polygons: true,
  elements: true,
  alchemy: true,
  planets: true,
};

export const ELEMENT_LABELS: Record<ElementType, string> = {
  fire: 'Fire',
  air: 'Air',
  water: 'Water',
  earth: 'Earth',
};

export const ALCHEMY_LABELS: Record<AlchemySymbolId, string> = {
  sulfur: 'Sulfur',
  mercury: 'Mercury',
  salt: 'Salt',
  gold: 'Gold (Sol)',
  silver: 'Silver (Luna)',
  copper: 'Copper (Venus)',
  iron: 'Iron (Mars)',
  tin: 'Tin (Jupiter)',
  lead: 'Lead (Saturn)',
  crucible: 'Crucible',
};

export const PLANET_LABELS: Record<PlanetId, string> = {
  sun: 'Sun',
  moon: 'Moon',
  mercury: 'Mercury',
  venus: 'Venus',
  mars: 'Mars',
  jupiter: 'Jupiter',
  saturn: 'Saturn',
  uranus: 'Uranus',
  neptune: 'Neptune',
};

export const LUNAR_LABELS: Record<LunarPhase, string> = {
  new: 'New Moon',
  waxing: 'Waxing Crescent',
  full: 'Full Moon',
  waning: 'Waning Crescent',
};

/**
 * Snap any angle in degrees to the nearest 15-degree interval within [0, 345].
 */
export function snap15(deg: number): number {
  const normalized = ((Math.round(deg / 15) * 15) % 360 + 360) % 360;
  return normalized;
}

/**
 * FNV-1a 32-bit deterministic hash.
 */
function fnv1aHash(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/**
 * Separate seed mixing algorithm used when a trailing modifier code
 * (e.g., "Ignis Et Terra-50868228" or "Fireball #alice") is present.
 * Produces an independent 32-bit hashSeed while preserving dictionary rules for baseText.
 */
function deriveModifiedSeed(normalizedBase: string, modifier: string): number {
  const baseHash = fnv1aHash(normalizedBase || 'empty');
  const modClean = modifier.trim().toLowerCase();
  let h = (baseHash ^ 0x9e3779b9) >>> 0;

  if (/^\d+$/.test(modClean)) {
    const numVal = Number(modClean);
    if (Number.isFinite(numVal)) {
      h ^= numVal >>> 0;
      h = Math.imul(h, 0x85ebca6b) >>> 0;
      h ^= Math.floor(numVal / 0x100000000) >>> 0;
      h = Math.imul(h, 0xc2b2ae35) >>> 0;
    }
  }

  for (let i = 0; i < modClean.length; i++) {
    h ^= modClean.charCodeAt(i);
    h = Math.imul(h ^ (h >>> 13), 0x27d4eb2d) >>> 0;
    h = ((h << 11) | (h >>> 21)) >>> 0;
  }

  // Murmur3 32-bit avalanche finalizer
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b) >>> 0;
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35) >>> 0;
  h ^= h >>> 16;
  return h >>> 0;
}

/**
 * Split raw input text into base spell/phrase text and an optional trailing modifier seed
 * (supports `-<code-with-digit>` like `Ignis Et Terra-50868228` or `#<tag>` like `Fireball #alice`).
 */
export function splitPhraseAndModifier(rawText: string): {
  baseText: string;
  modifier: string | null;
} {
  const trimmed = rawText.trim();
  if (!trimmed) return { baseText: '', modifier: null };

  const hashMatch = trimmed.match(/^(.*?)\s*#\s*([A-Za-z0-9_-]{1,32})\s*$/);
  if (hashMatch && hashMatch[1].trim().length > 0) {
    return {
      baseText: hashMatch[1].trim(),
      modifier: hashMatch[2].trim(),
    };
  }

  const dashMatch = trimmed.match(/^(.*\S)\s*-\s*([A-Za-z0-9]*\d[A-Za-z0-9]*)\s*$/);
  if (dashMatch && dashMatch[1].trim().length > 0) {
    return {
      baseText: dashMatch[1].trim(),
      modifier: dashMatch[2].trim(),
    };
  }

  return { baseText: trimmed, modifier: null };
}

/**
 * Pythagorean digit reduction (1..9, or 0 for empty).
 */
function reduceDigits(num: number): number {
  if (num <= 0) return 0;
  let n = num;
  while (n > 9) {
    let sum = 0;
    while (n > 0) {
      sum += n % 10;
      n = Math.floor(n / 10);
    }
    n = sum;
  }
  return n;
}

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'y']);
const PLOSIVES = new Set(['p', 'b', 't', 'd', 'k', 'g', 'c', 'q']);
const FRICATIVES = new Set(['f', 'v', 's', 'z', 'h', 'x']);
const LIQUIDS_NASALS = new Set(['l', 'r', 'm', 'n', 'w', 'j']);

/**
 * Analyze phonetic articulation, gematria sum, and deterministic hash seed
 * (applying the separate modifier seed algorithm when a modifier suffix is present).
 */
export function analyzeText(rawText: string, externalModifier?: string | null): PhoneticProfile {
  const split = splitPhraseAndModifier(rawText);
  const cleanExternal = externalModifier?.trim() ? externalModifier.trim() : null;
  const modifier = externalModifier !== undefined ? cleanExternal : split.modifier;
  const baseText = externalModifier !== undefined ? rawText.trim() : split.baseText;
  const normalized = baseText.toLowerCase();
  const letters = normalized.replace(/[^a-z0-9]/g, '');
  const words = normalized.split(/\s+/).filter(Boolean);

  let vowelCount = 0;
  let plosiveCount = 0;
  let fricativeCount = 0;
  let liquidNasalCount = 0;
  let gematriaSum = 0;

  for (let i = 0; i < letters.length; i++) {
    const ch = letters[i];
    const code = ch.charCodeAt(0);
    if (code >= 97 && code <= 122) {
      gematriaSum += code - 96; // a=1 .. z=26
    } else if (code >= 48 && code <= 57) {
      gematriaSum += code - 48;
    }

    if (VOWELS.has(ch)) vowelCount++;
    else if (PLOSIVES.has(ch)) plosiveCount++;
    else if (FRICATIVES.has(ch)) fricativeCount++;
    else if (LIQUIDS_NASALS.has(ch)) liquidNasalCount++;
  }

  const hashSeed = modifier
    ? deriveModifiedSeed(normalized, modifier)
    : fnv1aHash(normalized || 'empty');

  return {
    normalizedText: normalized,
    baseText,
    modifier,
    charCount: letters.length,
    wordCount: words.length,
    vowelCount,
    plosiveCount,
    fricativeCount,
    liquidNasalCount,
    gematriaSum,
    digitRoot: reduceDigits(gematriaSum),
    hashSeed,
  };
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

/**
 * Return true if two polygon vertex orders are too visually similar to nest adjacently.
 */
function arePolygonOrdersSimilar(a: number, b: number): boolean {
  if (a === b) return true;
  if (Math.abs(a - b) <= 1) return true;
  if (a >= 7 && b >= 7 && Math.abs(a - b) <= 2) return true;
  if (a >= 8 && b >= 8) return true;
  return false;
}

/**
 * Select a valid Schläfli star step k for an n-gon where 1 <= k < n / 2,
 * preferring open-chamber stars (cos(k*pi/n) >= 0.36) so inner layers never tangle.
 */
function pickValidStarStep(sides: number, seedByte: number, minInnerCosRatio = 0.36): number {
  const maxStep = Math.floor((sides - 1) / 2);
  if (maxStep < 2) return 1;
  const allSteps: number[] = [];
  for (let k = 2; k <= maxStep; k++) {
    allSteps.push(k);
  }
  const openChamber = allSteps.filter(
    (k) => Math.cos((k * Math.PI) / sides) >= minInnerCosRatio
  );
  const basePool = openChamber.length > 0 ? openChamber : allSteps;
  const coprime = basePool.filter((k) => gcd(sides, k) === 1);
  const pool = coprime.length > 0 ? coprime : basePool;
  return pool[seedByte % pool.length];
}

/**
 * Pick a third inner polygon that avoids identical shapes, visually similar vertex counts,
 * or 3 plain convex polygons stacked together.
 */
function resolveTertiaryPolygon(
  sides: number,
  innerSides: number,
  yantraTriangles: 0 | 1,
  starStep: number,
  seedByte: number,
  preferredSides?: number
): { tertiarySides: number; tertiaryStarStep: number } {
  const level2IsPlainPolygon = yantraTriangles === 0 && starStep === 1;
  const minSides = level2IsPlainPolygon ? 5 : 3;

  const isDistinctFromL2 = (n: number) => {
    if (yantraTriangles === 1) {
      return n !== 3 && n !== 6;
    }
    if (level2IsPlainPolygon) {
      return n !== innerSides && Math.abs(n - innerSides) >= 2 && !(n >= 7 && innerSides >= 7);
    }
    return true;
  };

  let candidates = VALID_INNER_SIDES.filter((n) => {
    if (n < minSides) return false;
    if (arePolygonOrdersSimilar(n, sides)) return false;
    if (!isDistinctFromL2(n)) return false;
    if (level2IsPlainPolygon && n > 8) return false;
    return true;
  });

  if (candidates.length === 0) {
    candidates = VALID_INNER_SIDES.filter((n) => {
      if (n < minSides) return false;
      if (n === sides || Math.abs(n - sides) <= 1) return false;
      if (level2IsPlainPolygon && n === innerSides) return false;
      if (yantraTriangles === 1 && (n === 3 || n === 6)) return false;
      return true;
    });
  }

  const pool = candidates.length > 0 ? candidates : [5, 7];
  const tertiarySides =
    preferredSides !== undefined && pool.includes(preferredSides)
      ? preferredSides
      : pool[seedByte % pool.length];

  const tertiaryStarStep = level2IsPlainPolygon
    ? pickValidStarStep(tertiarySides, seedByte ^ 0x5a, 0.30)
    : 1;

  return { tertiarySides, tertiaryStarStep };
}

function computePlanetaryAspects(nodes: PlanetaryNode[]): PlanetaryAspect[] {
  const aspects: PlanetaryAspect[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      const rawDiff = Math.abs(a.angleDeg - b.angleDeg);
      const diff = rawDiff > 180 ? 360 - rawDiff : rawDiff;

      let type: AspectType | null = null;
      if (diff === 0) type = 'conjunction';
      else if (diff === 60) type = 'sextile';
      else if (diff === 90) type = 'square';
      else if (diff === 120) type = 'trine';
      else if (diff === 180) type = 'opposition';

      if (type) {
        aspects.push({
          from: a.planet,
          to: b.planet,
          fromDeg: a.angleDeg,
          toDeg: b.angleDeg,
          type,
          angleDiff: diff,
        });
      }
    }
  }
  return aspects;
}

function deriveCoreSpec(
  profile: PhoneticProfile,
  word: string,
  isSubSigil = false,
  precomputedClassification?: MagicClassification,
  dictionaryMode: MagicDictionaryMode = 'auto'
): { core: SigilCoreSpec; classification: MagicClassification; rules: DomainRuleProfile } {
  const s = profile.hashSeed;
  const b0 = s & 0xff;
  const b1 = (s >>> 8) & 0xff;
  const b2 = (s >>> 16) & 0xff;
  const b3 = (s >>> 24) & 0xff;
  const hasModifier = profile.modifier !== null;

  // Phonetic elemental baseline (always computed as tie-breaker / fallback)
  const phoneticScores: Array<{ el: ElementType; score: number }> = [
    { el: 'fire', score: profile.plosiveCount * 3 + (b0 % 3) },
    { el: 'air', score: profile.fricativeCount * 3 + (b1 % 3) },
    { el: 'water', score: profile.vowelCount * 2 + (b2 % 3) },
    { el: 'earth', score: profile.liquidNasalCount * 3 + (b3 % 3) },
  ];
  phoneticScores.sort((a, b) => b.score - a.score);
  const phoneticPrimary = phoneticScores[0].el;
  const phoneticSecondary = phoneticScores[1].el;

  // Semantic / Spellbook dictionary classification (strictly from baseText, unaffected by modifier)
  const classification =
    precomputedClassification ??
    classifyMagicPhrase(
      profile.baseText || word,
      phoneticPrimary,
      phoneticSecondary,
      dictionaryMode
    );
  const rules = buildDomainRuleProfile(classification);
  const hasSemanticRule = classification.source !== 'phonetic';

  // Motif & Geometry — constrained by dictionary rules while varied by hashSeed bytes
  const motifPool = hasSemanticRule ? rules.allowedMotifs : ALL_SACRED_MOTIFS;
  const motifSeed = hasModifier
    ? profile.digitRoot + profile.wordCount + b0 + (b3 % 4)
    : profile.digitRoot + profile.wordCount + (b0 % 2);
  const sacredMotif = motifPool[motifSeed % motifPool.length];

  const sidesPool =
    hasSemanticRule && rules.allowedSides.length > 0 ? rules.allowedSides : VALID_POLYGON_SIDES;
  const sides =
    profile.charCount === 0
      ? 8
      : sidesPool[
          (profile.digitRoot + profile.wordCount + (hasModifier ? b1 : 0)) % sidesPool.length
        ];

  const candidateStarStep = pickValidStarStep(
    sides,
    hasModifier ? b1 ^ b2 : b1,
    isSubSigil ? 0.44 : 0.36
  );
  const yantraTriangles: 0 | 1 =
    sacredMotif === 'sri-yantra' || (rules.preferShatkona && b0 % 3 !== 2) ? 1 : 0;
  const starStep =
    yantraTriangles === 1
      ? 1
      : rules.preferStar && candidateStarStep > 1
      ? candidateStarStep
      : candidateStarStep;

  const distinctInnerPool = VALID_INNER_SIDES.filter((n) => !arePolygonOrdersSimilar(sides, n));
  const innerPool = distinctInnerPool.length > 0 ? distinctInnerPool : [3, 5];
  const innerSides = innerPool[(sides + b2 + (hasModifier ? b0 : 0)) % innerPool.length];
  const polygonRotationDeg = snap15(
    ((hasModifier ? b0 + b3 : profile.digitRoot) * 15 + (b3 % 4) * 15) % 360
  );
  const { tertiarySides, tertiaryStarStep } = resolveTertiaryPolygon(
    sides,
    innerSides,
    yantraTriangles,
    starStep,
    b2 ^ profile.charCount ^ (hasModifier ? b3 : 0)
  );
  const flowerOfLife =
    !isSubSigil &&
    Boolean(
      rules.preferFlowerOfLife ||
        sacredMotif === 'sacred-rosette' ||
        sacredMotif === 'eldritch-mandala' ||
        profile.vowelCount >= 4
    );

  // 6. Classical Elements (Dictionary classification primary/secondary with modifier rotation variation)
  const primaryElement = classification.primaryElement;
  let secondaryElement =
    classification.secondaryElement && classification.secondaryElement !== primaryElement
      ? classification.secondaryElement
      : phoneticPrimary !== primaryElement
      ? phoneticPrimary
      : phoneticSecondary;
  if (hasModifier && !classification.secondaryElement && b2 % 2 === 1) {
    const otherEls = ALL_ELEMENTS.filter((e) => e !== primaryElement);
    secondaryElement = otherEls[b2 % otherEls.length];
  }
  const elementRotationDeg = snap15(
    ((ALL_ELEMENTS.indexOf(primaryElement) * 6 +
      profile.wordCount +
      (hasModifier ? b2 % 8 : 0)) *
      15) %
      360
  );
  const quadrantCount: 2 | 4 =
    classification.source === 'spellbook' && (classification.spellLevel ?? 0) >= 5
      ? 4
      : profile.charCount >= 8
      ? 4
      : 2;

  // 7. Alchemical Symbols Core (selected from dictionary element/school pool, varied by hashSeed)
  const alcPool = hasSemanticRule ? rules.alchemyPool : ALL_ALCHEMY_SYMBOLS;
  const primaryAlchemy =
    alcPool[(profile.gematriaSum + profile.digitRoot + (hasModifier ? b2 : 0)) % alcPool.length];
  let auxiliaryAlchemy =
    ALL_ALCHEMY_SYMBOLS[(b2 + profile.wordCount + 3 + (hasModifier ? b1 : 0)) % ALL_ALCHEMY_SYMBOLS.length];
  if (auxiliaryAlchemy === primaryAlchemy) {
    auxiliaryAlchemy =
      ALL_ALCHEMY_SYMBOLS[
        (ALL_ALCHEMY_SYMBOLS.indexOf(primaryAlchemy) + 1) % ALL_ALCHEMY_SYMBOLS.length
      ];
  }
  const alchemyRotationDeg = snap15(
    ((profile.digitRoot * 2 + (hasModifier ? b0 % 12 : 0)) * 15) % 360
  );

  // 5. Planetary Alignments (anchored to domain planet pool + full pool fill, rotated by hashSeed)
  const planetCount =
    profile.charCount === 0
      ? 3
      : Math.min(5, Math.max(2, 2 + (profile.wordCount % 4) + (profile.charCount % 3)));
  const planetRotDeg = snap15(((b0 + profile.gematriaSum) % 24) * 15);
  const mergedPlanetPool = hasSemanticRule
    ? [...rules.planetPool, ...ALL_PLANETS.filter((p) => !rules.planetPool.includes(p))]
    : ALL_PLANETS;
  const selectedPlanets: PlanetId[] = [];
  for (let i = 0; i < planetCount; i++) {
    const idx =
      (i === 0 && hasSemanticRule && !hasModifier
        ? 0
        : profile.digitRoot + i * 2 + ((s >>> (i * 4)) & 0x07) + (hasModifier ? b1 % 3 : 0)) %
      mergedPlanetPool.length;
    let candidate = mergedPlanetPool[idx];
    while (selectedPlanets.includes(candidate)) {
      candidate =
        mergedPlanetPool[(mergedPlanetPool.indexOf(candidate) + 1) % mergedPlanetPool.length];
    }
    selectedPlanets.push(candidate);
  }

  const harmonicOffsets = [0, 120, 240, 60, 180, 90, 270, 150, 300];
  const nodes: PlanetaryNode[] = selectedPlanets.map((planet, idx) => {
    const harmonic = harmonicOffsets[(idx + (b3 % 3)) % harmonicOffsets.length];
    const angleDeg = snap15(planetRotDeg + harmonic);
    return { planet, angleDeg };
  });
  const aspects = computePlanetaryAspects(nodes);

  const polygonInnerSummary =
    yantraTriangles === 1
      ? 'enclosing Shatkona interlocking triangles'
      : starStep > 1
      ? `with inscribed {${sides}/${starStep}} star`
      : `enclosing ${innerSides}-gon`;
  const polygonTertiarySummary =
    tertiaryStarStep > 1
      ? ` & inner {${tertiarySides}/${tertiaryStarStep}} star`
      : ` & inner ${tertiarySides}-gon`;

  const core: SigilCoreSpec = {
    word,
    polygons: {
      sides,
      starStep,
      innerSides,
      tertiarySides,
      tertiaryStarStep,
      rotationDeg: polygonRotationDeg,
      showInscribedCircle:
        rules.preferInscribedCircle ?? profile.vowelCount > profile.plosiveCount,
      sacredMotif,
      yantraTriangles,
      flowerOfLife,
    },
    elements: {
      primary: primaryElement,
      secondary: secondaryElement,
      rotationDeg: elementRotationDeg,
      quadrantCount,
    },
    alchemy: {
      primary: primaryAlchemy,
      auxiliary: auxiliaryAlchemy,
      rotationDeg: alchemyRotationDeg,
      showCoreCollar: true,
    },
    planets: {
      nodes,
      aspects,
      rotationDeg: planetRotDeg,
      showAspectChords: true,
    },
    notes: {
      polygons: `${SACRED_MOTIF_LABELS[sacredMotif]}: ${sides}-gon ${polygonInnerSummary}${polygonTertiarySummary} at ${polygonRotationDeg}°${flowerOfLife ? ' over Seed of Life lattice' : ''}.`,
      elements: `${ELEMENT_LABELS[primaryElement]} Bindu core & primary pole (${classification.summary}), ${ELEMENT_LABELS[secondaryElement]} secondary.`,
      alchemy: isSubSigil
        ? `${ELEMENT_LABELS[primaryElement]} Bindu core emblem at ${alchemyRotationDeg}° (${ALCHEMY_LABELS[primaryAlchemy]} seal).`
        : `${ELEMENT_LABELS[primaryElement]} Bindu core flanked by ${ALCHEMY_LABELS[primaryAlchemy]} & ${ALCHEMY_LABELS[auxiliaryAlchemy]} nodes.`,
      planets: `${nodes.length} planetary bodies (${nodes.map((n) => PLANET_LABELS[n.planet]).join(', ')}) forming ${aspects.length} geometric aspect${aspects.length === 1 ? '' : 's'}.`,
    },
  };

  return { core, classification, rules };
}

function computeSubSigilAngles(compoundAxisDeg: number, subCount: number): number[] {
  if (subCount <= 0) return [];
  return Array.from({ length: subCount }, (_, idx) =>
    Number(((compoundAxisDeg + (idx * 360) / subCount) % 360).toFixed(2))
  );
}

function buildRuneStations(
  letters: string,
  stationCount: 4 | 6 | 8 | 12 | 24,
  runeRotationDeg: number,
  palette: RunePaletteMode,
  subAngles: number[]
): RuneGlyphSpec[] {
  const cleanLetters = letters || 'sigil';

  const nodesPolygonsPool = [
    ...CONCENTRIC_NODE_GLYPHS.map((g) => g.char),
    ...POLYGON_NODE_GLYPHS.map((g) => g.char),
    ...TRIANGLE_WEDGE_GLYPHS.map((g) => g.char),
  ];

  const runicSpelling: string[] = [];
  for (let i = 0; i < cleanLetters.length; i++) {
    const ch = cleanLetters[i];
    if (LATIN_TO_RUNIC[ch]) {
      runicSpelling.push(LATIN_TO_RUNIC[ch]);
    }
  }
  const futharkSequence =
    runicSpelling.length > 0 ? runicSpelling : ['ᚠ', 'ᚨ', 'ᚦ', 'ᛉ', 'ᛟ'];

  // Calculate station angles: in compound mode, distribute cleanly in the open arcs
  // strictly between docked sub-sigils on the r=300 band.
  const stationAngles: number[] = [];
  if (subAngles.length === 0) {
    const stepDeg = 360 / stationCount;
    for (let i = 0; i < stationCount; i++) {
      stationAngles.push(snap15(i * stepDeg + runeRotationDeg));
    }
  } else {
    const subCount = subAngles.length;
    const arcSpan = 360 / subCount;
    const basePerArc = Math.floor(stationCount / subCount);
    const extra = stationCount % subCount;

    for (let k = 0; k < subCount; k++) {
      const startDeg = subAngles[k];
      let m = basePerArc + (k < extra ? 1 : 0);
      if (m <= 0) continue;

      if (Math.abs(arcSpan % 15) < 0.01) {
        // Reserve 30° clearance on both sides of each sub-sigil medallion (safe for subRadius <= 86 at r=278)
        const minClearSteps = 2; // 2 * 15° = 30°
        const totalSteps = Math.round(arcSpan / 15);
        const firstOffsetDeg = minClearSteps * 15;
        const slotCount = Math.max(0, totalSteps - 2 * minClearSteps + 1);
        if (slotCount === 0) continue;
        m = Math.min(m, slotCount);
        for (let j = 0; j < m; j++) {
          const slotIdx =
            m === 1
              ? Math.floor((slotCount - 1) / 2)
              : Math.round((j * (slotCount - 1)) / (m - 1));
          const angle = snap15(startDeg + firstOffsetDeg + slotIdx * 15);
          stationAngles.push(angle);
        }
      } else {
        // 5 sub-sigils (72° span): maintain >= 24° clearance from sub-sigil centers
        const maxPerNon15Arc = 2;
        m = Math.min(m, maxPerNon15Arc);
        const offsets = m === 1 ? [arcSpan / 2] : [24, arcSpan - 24];
        for (const off of offsets) {
          const angle = Number((((startDeg + off) % 360) + 360) % 360);
          stationAngles.push(Number(angle.toFixed(2)));
        }
      }
    }
  }

  const phaseOffset = subAngles.length > 0 ? Math.round(runeRotationDeg / 15) : 0;

  return stationAngles.map((angleDeg, i) => {
    const seqIdx = i + phaseOffset;
    let selectedChar: string;

    if (
      palette === 'warding' ||
      palette === 'containment' ||
      palette === 'astral' ||
      palette === 'binding'
    ) {
      const chosenSeal = SEAL_SEQUENCES[palette];
      selectedChar = chosenSeal[seqIdx % chosenSeal.length];
    } else if (palette === 'runic') {
      const charSeed = cleanLetters.charCodeAt(seqIdx % cleanLetters.length) || 0;
      selectedChar = RUNIC_BLOCK_GLYPHS[(charSeed + seqIdx * 3) % RUNIC_BLOCK_GLYPHS.length].char;
    } else if (palette === 'nodes-polygons') {
      selectedChar = nodesPolygonsPool[seqIdx % nodesPolygonsPool.length];
    } else if (palette === 'starbursts-syllabics') {
      if (i % 2 === 0) {
        selectedChar = STARBURST_PETAL_GLYPHS[Math.floor(seqIdx / 2) % STARBURST_PETAL_GLYPHS.length].char;
      } else {
        selectedChar = SYLLABIC_GLYPHS[Math.floor(seqIdx / 2) % SYLLABIC_GLYPHS.length].char;
      }
    } else {
      // 'auto': Stationed anchors use strictly Futhark transliteration of the primary text
      selectedChar = futharkSequence[seqIdx % futharkSequence.length];
    }

    const entry = lookupArcaneGlyph(selectedChar);
    const catalogIdx = Math.max(
      0,
      ALL_ARCANE_GLYPHS.findIndex((g) => g.char === entry.char)
    );

    return {
      id: `rune-${i}`,
      char: entry.char,
      name: entry.name,
      label: entry.char,
      code: catalogIdx,
      angleDeg,
    };
  });
}

/**
 * Deterministically translate any input text into a complete 7-layer SigilSpec.
 */
export function deriveSigilFromText(
  rawText: string,
  externalModifier?: string | null,
  dictionaryMode: MagicDictionaryMode = 'auto'
): SigilSpec {
  const profile = analyzeText(rawText, externalModifier);
  const words = profile.baseText.split(/\s+/).filter(Boolean);
  const isCompound = words.length >= 2;
  const hasModifier = profile.modifier !== null;

  // In compound spells, the first word creates the large overall outer sigil (Layers 1–4 frame)
  // while subsequent words (words[1..]) become smaller inner sigils on the rune/seal band.
  // Phrase-level spellbook & keyword categorization runs on the full baseText (e.g., "Ignis Et Terra" or "Cone of Cold").
  const primaryWord = words[0] ?? 'sigil';
  const frameProfile = isCompound
    ? analyzeText(primaryWord, profile.modifier)
    : profile;
  const s = profile.hashSeed;

  const b0 = s & 0xff;
  const b1 = (s >>> 8) & 0xff;
  const b2 = (s >>> 16) & 0xff;
  const b3 = (s >>> 24) & 0xff;

  // Phrase-level magic classification
  const basePhoneticScores: Array<{ el: ElementType; score: number }> = [
    { el: 'fire', score: frameProfile.plosiveCount * 3 + (b0 % 3) },
    { el: 'air', score: frameProfile.fricativeCount * 3 + (b1 % 3) },
    { el: 'water', score: frameProfile.vowelCount * 2 + (b2 % 3) },
    { el: 'earth', score: frameProfile.liquidNasalCount * 3 + (b3 % 3) },
  ];
  basePhoneticScores.sort((a, b) => b.score - a.score);
  const phraseCategory = classifyMagicPhrase(
    profile.baseText || primaryWord,
    basePhoneticScores[0].el,
    basePhoneticScores[1].el,
    dictionaryMode
  );

  // Primary Core (uses phraseCategory so main sigil embodies the full spell's school & element)
  const { core: rootCore, rules: domainRules } = deriveCoreSpec(
    frameProfile,
    primaryWord,
    false,
    phraseCategory,
    dictionaryMode
  );

  const subWords = isCompound ? words.slice(1, 7) : [];
  const compoundAxisDeg = snap15(
    subWords.length <= 2 && !hasModifier ? 90 : ((b0 + (hasModifier ? b2 : 0)) % 24) * 15
  );
  const subAngles = computeSubSigilAngles(compoundAxisDeg, subWords.length);

  // 1. Singular Bounding Circle + Eldritch Arcs
  const doubleRing = Boolean(
    domainRules.preferDoubleRing ||
      isCompound ||
      (frameProfile.digitRoot % 2 === 0 && frameProfile.charCount > 0)
  );
  const eldritchArcs = frameProfile.charCount > 0;

  // 2. Celestial Markers
  const lunarIndex =
    (frameProfile.vowelCount + frameProfile.digitRoot + (hasModifier ? b3 % 4 : 0)) % 4;
  const lunarPhase = ALL_LUNAR_PHASES[lunarIndex];
  const celestialRot = snap15((b1 % 24) * 15);
  const lunarAngleDeg = snap15(
    (frameProfile.vowelCount * 45 + ((b0 + (hasModifier ? b2 : 0)) % 8) * 15) % 360
  );
  const solarAngleDeg = snap15(
    lunarAngleDeg + (frameProfile.charCount % 2 === 0 ? 180 : 120) + (hasModifier ? (b1 % 2) * 30 : 0)
  );
  const chordCount =
    frameProfile.charCount === 0 ? 0 : 2 + ((frameProfile.digitRoot + (hasModifier ? b3 : 0)) % 3);

  // 3. Arcane Runes & Seals (15-degree intervals, placed relative to sub-sigils when compound)
  const stationOptions: Array<4 | 6 | 8 | 12 | 24> = [4, 6, 8, 12, 24];
  let stationCount: 4 | 6 | 8 | 12 | 24 = 8;
  if (frameProfile.charCount === 0) stationCount = 4;
  else if (frameProfile.charCount <= 4) stationCount = 6;
  else if (frameProfile.charCount <= 9) stationCount = 8;
  else if (frameProfile.charCount <= 16) stationCount = 12;
  else stationCount = stationOptions[(frameProfile.wordCount + 2) % stationOptions.length];

  if (domainRules.minStationCount && stationCount < domainRules.minStationCount) {
    stationCount = domainRules.minStationCount;
  }

  const runeRotationDeg = snap15(((frameProfile.gematriaSum + b2 + (hasModifier ? b0 : 0)) % 24) * 15);
  const dualBand = frameProfile.charCount >= 10 || phraseCategory.source === 'spellbook';

  const stepDeg = 360 / stationCount;
  const letters = frameProfile.normalizedText.replace(/[^a-z0-9]/g, '') || 'sigil';

  const runePalette: RunePaletteMode =
    phraseCategory.source === 'spellbook' && domainRules.runePalettePool.length > 1
      ? domainRules.runePalettePool[hasModifier ? b2 % domainRules.runePalettePool.length : 1]
      : 'auto';
  const glyphs = buildRuneStations(
    letters,
    stationCount,
    runeRotationDeg,
    runePalette,
    subAngles
  );

  // Subsequent Words -> Sub-Sigils docked on the r=278 inner rune rail (preserving per-word dictionary rules)
  const subSigils: SigilCoreSpec[] = subWords.map(
    (word) =>
      deriveCoreSpec(
        analyzeText(word, profile.modifier),
        word,
        true,
        undefined,
        dictionaryMode
      ).core
  );

  const glyphPreview = glyphs.map((g) => g.char).join(' ');

  return {
    text: rawText,
    profile,
    category: phraseCategory,
    compoundAxisDeg,
    subSigils,
    bounding: {
      doubleRing,
      cardinalTicks: true,
      protractorTicks: true,
      eldritchArcs,
    },
    celestial: {
      lunarPhase,
      lunarAngleDeg,
      solarAngleDeg,
      chordCount,
      rotationDeg: celestialRot,
    },
    runes: {
      stationCount,
      rotationDeg: runeRotationDeg,
      dualBand,
      palette: runePalette,
      glyphs,
    },
    polygons: rootCore.polygons,
    elements: rootCore.elements,
    alchemy: rootCore.alchemy,
    planets: rootCore.planets,
    notes: {
      bounding: `${isCompound ? `"${primaryWord}" main frame: ` : ''}Singular bounding circle (r=380)${doubleRing ? ' with inner containment hairline' : ''}${eldritchArcs ? ' & eldritch segmented spell arcs' : ''}.`,
      celestial: `${LUNAR_LABELS[lunarPhase]} (${lunarAngleDeg}°) & Solar node (${solarAngleDeg}°) across ${chordCount} celestial chords${isCompound ? ` (from "${primaryWord}")` : ''}.`,
      runes: isCompound
        ? `${glyphs.length} stations anchored in arcs between ${subSigils.length} band-docked sub-sigil${subSigils.length === 1 ? '' : 's'} [${RUNE_PALETTE_LABELS[runePalette]}]: ${glyphPreview}.`
        : `${stationCount} stations every ${stepDeg}° (rotated ${runeRotationDeg}°) [${RUNE_PALETTE_LABELS[runePalette]}]: ${glyphPreview}${dualBand ? ' · dual band' : ''}.`,
      polygons: isCompound
        ? `Main "${primaryWord}": ${rootCore.notes.polygons} Docked on inner rune rail (r=278) at ${compoundAxisDeg}°: ${subSigils.length} satellite sub-sigil${subSigils.length === 1 ? '' : 's'} (${subSigils.map((c) => c.word).join(', ')}).`
        : rootCore.notes.polygons,
      elements: isCompound
        ? `Main "${primaryWord}": ${rootCore.notes.elements}`
        : rootCore.notes.elements,
      alchemy: isCompound
        ? `Main "${primaryWord}": ${rootCore.notes.alchemy} Satellites: ${subSigils.map((c) => `${c.word} (${ELEMENT_LABELS[c.elements.primary]})`).join(' · ')}.`
        : rootCore.notes.alchemy,
      planets: isCompound
        ? `Main "${primaryWord}": ${rootCore.notes.planets}`
        : rootCore.notes.planets,
    },
  };
}

function applyCoreOverrides(
  core: {
    polygons: SigilCoreSpec['polygons'];
    elements: SigilCoreSpec['elements'];
    alchemy: SigilCoreSpec['alchemy'];
    planets: SigilCoreSpec['planets'];
  },
  hashSeed: number,
  overrides: ManualOverrides,
  isSubSigil = false
): {
  polygons: SigilCoreSpec['polygons'];
  elements: SigilCoreSpec['elements'];
  alchemy: SigilCoreSpec['alchemy'];
  planets: SigilCoreSpec['planets'];
} {
  const rawSides = overrides.polygonSides ?? core.polygons.sides;
  const sides = rawSides === 4 ? 5 : rawSides;
  const rawInnerSides = overrides.polygonInnerSides ?? core.polygons.innerSides;
  const innerSides = rawInnerSides === 4 ? 5 : rawInnerSides;
  const maxValidStar = Math.max(1, Math.floor((sides - 1) / 2));
  const rawStarStep = overrides.polygonStarStep ?? core.polygons.starStep;
  const starStep = Math.min(rawStarStep, maxValidStar);
  const polygonRot = snap15(overrides.polygonRotationDeg ?? core.polygons.rotationDeg);
  const rawYantra = overrides.polygonYantraTriangles ?? core.polygons.yantraTriangles;
  const yantraTriangles: 0 | 1 = rawYantra >= 1 ? 1 : 0;
  const b2 = (hashSeed >>> 16) & 0xff;
  const { tertiarySides, tertiaryStarStep } = resolveTertiaryPolygon(
    sides,
    innerSides,
    yantraTriangles,
    starStep,
    b2,
    overrides.polygonTertiarySides ?? core.polygons.tertiarySides
  );

  const elementPrimary = overrides.elementPrimary ?? core.elements.primary;
  const elementSecondary = overrides.elementSecondary ?? core.elements.secondary;
  const elementRot = snap15(overrides.elementRotationDeg ?? core.elements.rotationDeg);

  const alchemyPrimary = overrides.alchemyPrimary ?? core.alchemy.primary;
  const alchemyAux = overrides.alchemyAuxiliary ?? core.alchemy.auxiliary;
  const alchemyRot = snap15(overrides.alchemyRotationDeg ?? core.alchemy.rotationDeg);

  const planetRot = snap15(overrides.planetRotationDeg ?? core.planets.rotationDeg);
  const planetDelta = planetRot - core.planets.rotationDeg;

  const selectedPlanets = overrides.planetSelection ?? core.planets.nodes.map((n) => n.planet);
  const harmonicOffsets = [0, 120, 240, 60, 180, 90, 270, 150, 300];
  const b3 = (hashSeed >>> 24) & 0xff;

  const planetNodes: PlanetaryNode[] = selectedPlanets.map((planet, idx) => {
    const existing = core.planets.nodes.find((n) => n.planet === planet);
    const baseAngle = existing
      ? existing.angleDeg
      : snap15(core.planets.rotationDeg + harmonicOffsets[(idx + (b3 % 3)) % harmonicOffsets.length]);
    return {
      planet,
      angleDeg: snap15(baseAngle + planetDelta),
    };
  });

  const aspects = computePlanetaryAspects(planetNodes);

  return {
    polygons: {
      ...core.polygons,
      sides,
      starStep,
      innerSides,
      tertiarySides,
      tertiaryStarStep,
      rotationDeg: polygonRot,
      sacredMotif: overrides.polygonSacredMotif ?? core.polygons.sacredMotif,
      yantraTriangles,
      flowerOfLife: isSubSigil
        ? false
        : overrides.polygonFlowerOfLife ?? core.polygons.flowerOfLife,
    },
    elements: {
      primary: elementPrimary,
      secondary: elementSecondary,
      rotationDeg: elementRot,
      quadrantCount: overrides.elementQuadrantCount ?? core.elements.quadrantCount,
    },
    alchemy: {
      ...core.alchemy,
      primary: alchemyPrimary,
      auxiliary: alchemyAux,
      rotationDeg: alchemyRot,
    },
    planets: {
      nodes: planetNodes,
      aspects,
      rotationDeg: planetRot,
      showAspectChords: overrides.planetShowAspectChords ?? core.planets.showAspectChords,
    },
  };
}

/**
 * Count top-level and per-core manual overrides currently active.
 */
export function countActiveOverrides(overrides: ManualOverrides): number {
  let count = 0;
  for (const [k, v] of Object.entries(overrides)) {
    if (v === undefined) continue;
    if (k === 'subOverrides' && v && typeof v === 'object') {
      for (const sub of Object.values(v as Record<number, ManualOverrides>)) {
        if (!sub) continue;
        count += Object.values(sub).filter((sv) => sv !== undefined).length;
      }
    } else {
      count += 1;
    }
  }
  return count;
}

/**
 * Apply manual user overrides non-destructively onto a text-derived SigilSpec.
 */
export function applyManualOverrides(derived: SigilSpec, overrides: ManualOverrides): SigilSpec {
  const isCompound = derived.subSigils.length >= 1;
  const words = derived.profile.baseText.split(/\s+/).filter(Boolean);
  const frameProfile = isCompound
    ? analyzeText(words[0] ?? 'sigil', derived.profile.modifier)
    : derived.profile;

  const stationCount = overrides.runeStationCount ?? derived.runes.stationCount;
  const runeRot = snap15(overrides.runeRotationDeg ?? derived.runes.rotationDeg);
  const runePalette = overrides.runePalette ?? derived.runes.palette;
  const stepDeg = 360 / stationCount;
  const letters = frameProfile.normalizedText.replace(/[^a-z0-9]/g, '') || 'sigil';

  const celestialRot = snap15(overrides.celestialRotationDeg ?? derived.celestial.rotationDeg);
  const celestialDelta = celestialRot - derived.celestial.rotationDeg;
  const compoundAxisDeg = snap15(overrides.compoundAxisDeg ?? derived.compoundAxisDeg);

  const rootCore = applyCoreOverrides(derived, derived.profile.hashSeed, overrides);
  const subAngles = computeSubSigilAngles(compoundAxisDeg, derived.subSigils.length);

  const glyphs = buildRuneStations(
    letters,
    stationCount,
    runeRot,
    runePalette,
    subAngles
  );

  const dualBand = overrides.runeDualBand ?? derived.runes.dualBand;
  const glyphPreview = glyphs.map((g) => g.char).join(' ');

  const subSigils: SigilCoreSpec[] = derived.subSigils.map((sub, idx) => {
    const subOvr = overrides.subOverrides?.[idx] ?? {};
    const updatedCore = applyCoreOverrides(
      sub,
      analyzeText(sub.word, derived.profile.modifier).hashSeed,
      subOvr,
      true
    );
    return {
      ...sub,
      ...updatedCore,
    };
  });

  return {
    ...derived,
    compoundAxisDeg,
    subSigils,
    bounding: {
      ...derived.bounding,
      doubleRing: overrides.boundingDoubleRing ?? derived.bounding.doubleRing,
      eldritchArcs: overrides.boundingEldritchArcs ?? derived.bounding.eldritchArcs,
    },
    celestial: {
      ...derived.celestial,
      lunarPhase: overrides.celestialLunarPhase ?? derived.celestial.lunarPhase,
      rotationDeg: celestialRot,
      lunarAngleDeg: snap15(derived.celestial.lunarAngleDeg + celestialDelta),
      solarAngleDeg: snap15(derived.celestial.solarAngleDeg + celestialDelta),
    },
    runes: {
      stationCount,
      rotationDeg: runeRot,
      dualBand,
      palette: runePalette,
      glyphs,
    },
    polygons: rootCore.polygons,
    elements: rootCore.elements,
    alchemy: rootCore.alchemy,
    planets: rootCore.planets,
    notes: {
      ...derived.notes,
      runes: isCompound
        ? `${glyphs.length} stations anchored in arcs between ${subSigils.length} band-docked sub-sigil${subSigils.length === 1 ? '' : 's'} [${RUNE_PALETTE_LABELS[runePalette]}]: ${glyphPreview}.`
        : `${stationCount} stations every ${stepDeg}° (rotated ${runeRot}°) [${RUNE_PALETTE_LABELS[runePalette]}]: ${glyphPreview}${dualBand ? ' · dual band' : ''}.`,
      elements: `${isCompound ? `Main "${words[0] ?? 'sigil'}": ` : ''}${ELEMENT_LABELS[rootCore.elements.primary]} Bindu core & primary pole (${derived.category.summary}), ${ELEMENT_LABELS[rootCore.elements.secondary]} secondary.`,
      alchemy: isCompound
        ? `Main "${words[0] ?? 'sigil'}": ${ELEMENT_LABELS[rootCore.elements.primary]} Bindu core flanked by ${ALCHEMY_LABELS[rootCore.alchemy.primary]} & ${ALCHEMY_LABELS[rootCore.alchemy.auxiliary]} nodes. Satellites: ${subSigils.map((c) => `${c.word} (${ELEMENT_LABELS[c.elements.primary]})`).join(' · ')}.`
        : `${ELEMENT_LABELS[rootCore.elements.primary]} Bindu core flanked by ${ALCHEMY_LABELS[rootCore.alchemy.primary]} & ${ALCHEMY_LABELS[rootCore.alchemy.auxiliary]} nodes.`,
    },
  };
}

export interface MicroGlyphToken {
  source: string;
  char: string;
  isDivider: boolean;
  name: string;
}

/**
 * Transliterate a phrase directly into the 1-to-1 micro-script cipher (A-Z, Space/'//' -> ❁ divider).
 */
export function transliteratePhraseToMicroGlyphs(phrase: string): MicroGlyphToken[] {
  const raw = (phrase.trim() || 'sigil').toLowerCase();
  const tokens: MicroGlyphToken[] = [];

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (ch === ' ' || ch === "'" || ch === '/' || ch === '-') {
      if (tokens.length > 0 && !tokens[tokens.length - 1].isDivider) {
        tokens.push({
          source: ch === ' ' ? 'Space' : ch,
          char: '❁',
          isDivider: true,
          name: `${lookupArcaneGlyph('❁').name} (Divider)`,
        });
      }
      continue;
    }

    const mapped = LATIN_TO_MICRO_GLYPH[ch];
    if (mapped) {
      tokens.push({
        source: ch.toUpperCase(),
        char: mapped,
        isDivider: false,
        name: lookupArcaneGlyph(mapped).name,
      });
    }
  }

  while (tokens.length > 0 && tokens[tokens.length - 1].isDivider) {
    tokens.pop();
  }

  if (tokens.length === 0) {
    return transliteratePhraseToMicroGlyphs('sigil');
  }

  return tokens;
}

export interface MicroScriptItem {
  index: number;
  angleDeg: number;
  char: string;
  isDivider: boolean;
  source: string;
}

/**
 * Derive the repeating 72-mark direct-cipher micro-script ring rendered in Layer 02.
 */
export function deriveMicroScriptItems(spec: SigilSpec, count = 72): MicroScriptItem[] {
  const baseTokens = transliteratePhraseToMicroGlyphs(spec.profile.baseText || spec.text);
  const ringCycle: MicroGlyphToken[] = [
    ...baseTokens,
    {
      source: 'Space',
      char: '❁',
      isDivider: true,
      name: `${lookupArcaneGlyph('❁').name} (Divider)`,
    },
  ];
  const totalStations = Math.max(count, ringCycle.length);
  const step = 360 / totalStations;

  const items: MicroScriptItem[] = [];
  for (let i = 0; i < totalStations; i++) {
    const token = ringCycle[i % ringCycle.length];
    items.push({
      index: i,
      angleDeg: Number((i * step).toFixed(2)),
      char: token.char,
      isDivider: token.isDivider,
      source: token.source,
    });
  }
  return items;
}

/**
 * Derive the exact inner seal band glyphs rendered at r = 214 when dualBand is active on single-word sigils.
 */
export function deriveInnerSealGlyphs(
  spec: SigilSpec
): Array<{ angleDeg: number; char: string; name: string }> {
  if (spec.subSigils.length >= 1 || !spec.runes.dualBand) return [];
  const innerSeal =
    spec.polygons.sacredMotif === 'eldritch-mandala'
      ? SEAL_SEQUENCES.warding
      : spec.polygons.sacredMotif === 'sri-yantra'
      ? SEAL_SEQUENCES.containment
      : spec.polygons.sacredMotif === 'astral-compass'
      ? SEAL_SEQUENCES.astral
      : SEAL_SEQUENCES.binding;

  return spec.runes.glyphs
    .slice(0, Math.min(12, spec.runes.glyphs.length))
    .map((glyph, idx) => {
      const char = innerSeal[idx % innerSeal.length];
      const entry = lookupArcaneGlyph(char);
      return {
        angleDeg: (glyph.angleDeg + 15) % 360,
        char,
        name: entry.name,
      };
    });
}

/**
 * Transliterate a word's letters directly into Elder Futhark runes (1-to-1).
 */
export function transliterateWordToFuthark(
  word: string
): Array<{ letter: string; rune: string; name: string }> {
  const clean = word.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const result: Array<{ letter: string; rune: string; name: string }> = [];
  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    const rune = LATIN_TO_RUNIC[ch];
    if (rune) {
      result.push({
        letter: ch.toUpperCase(),
        rune,
        name: lookupArcaneGlyph(rune).name,
      });
    }
  }
  return result;
}

