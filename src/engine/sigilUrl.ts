import type { MagicDictionaryMode } from '../types/sigil';

export const DEFAULT_SIGIL_PHRASE = 'Aurelia Astra';

const IGNORED_PATH_PREFIXES = ['assets/', 'public/', 'favicon', 'index.html'];

const DICTIONARY_SLUG_ALIASES: Record<string, MagicDictionaryMode> = {
  auto: 'auto',
  srd: 'srd',
  dnd: 'srd',
  'dnd5e': 'srd',
  '5e': 'srd',
  spellbook: 'srd',
  roots: 'roots',
  arcane: 'roots',
  lexicon: 'roots',
  keywords: 'roots',
  phonetic: 'phonetic',
  freeform: 'phonetic',
  custom: 'phonetic',
};

export function parseDictionarySlug(segment: string): MagicDictionaryMode | null {
  const clean = segment.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  return DICTIONARY_SLUG_ALIASES[clean] ?? null;
}

function safeDecode(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

/**
 * Generate a deterministic-format random 8-digit domain seed (e.g. "50868228").
 */
export function generateRandomSeed(): string {
  return String(Math.floor(10000000 + Math.random() * 90000000));
}

/**
 * Sanitize a user-entered seed string for safe URL path usage.
 */
export function sanitizeSeedSegment(seed: string): string {
  return seed.trim().replace(/[^A-Za-z0-9_-]/g, '').slice(0, 24);
}

/**
 * Check whether a URL path segment represents a domain seed (e.g. "50868228", "caster99").
 * Requires at least one digit and no hyphens so spell slugs like "Ignis-Et-Terra" are never
 * mistaken for a seed segment.
 */
export function isValidSeedSegment(segment: string): boolean {
  const clean = segment.trim();
  if (!clean) return false;
  if (IGNORED_PATH_PREFIXES.some((prefix) => clean.toLowerCase().startsWith(prefix.replace('/', '')))) {
    return false;
  }
  return /^[A-Za-z0-9_]{1,24}$/.test(clean) && /\d/.test(clean);
}

/**
 * Convert a phrase, optional domain seed, and optional dictionary slug into a clean URL pathname:
 *   phraseToPath("Fireball", "50868228", "srd") -> "/50868228/srd/Fireball"
 */
export function phraseToPath(
  phrase: string,
  seed?: string | null,
  dictionary?: string | null
): string {
  const words = phrase.trim().split(/\s+/).filter(Boolean);
  const cleanSeed = seed ? sanitizeSeedSegment(seed) : '';
  const cleanDict = dictionary ? dictionary.trim().toLowerCase().replace(/[^a-z0-9-]/g, '') : '';
  const encodedWords = words.map((word) =>
    encodeURIComponent(word).replace(/\./g, '%2E')
  );
  const phraseSlug = encodedWords.join('-');

  const parts: string[] = [];
  if (cleanSeed) parts.push(encodeURIComponent(cleanSeed));
  if (cleanDict) parts.push(encodeURIComponent(cleanDict));
  if (phraseSlug) parts.push(phraseSlug);

  return parts.length > 0 ? `/${parts.join('/')}` : '/';
}

/**
 * Build the full shareable URL including the domain seed and dictionary path segments.
 */
export function buildShareableSigilUrl(
  phrase: string,
  seed?: string | null,
  dictionary?: string | null,
  origin: string = typeof window !== 'undefined' ? window.location.origin : ''
): string {
  return `${origin}${phraseToPath(phrase, seed, dictionary)}`;
}

function decodeSlugWords(raw: string): string {
  return raw
    .replace(/[-_/+]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface ParsedSigilLocation {
  seed: string | null;
  dictionary: MagicDictionaryMode | null;
  phrase: string | null;
}

/**
 * Parse `{ seed, dictionary, phrase }` from the current browser URL path (or query/hash fallback).
 * Supports:
 *   /50868228/srd/Fireball       -> { seed: "50868228", dictionary: "srd", phrase: "Fireball" }
 *   /50868228/srd                -> { seed: "50868228", dictionary: "srd", phrase: null }
 *   /50868228/Ignis-Et-Terra     -> { seed: "50868228", dictionary: null, phrase: "Ignis Et Terra" }
 *   /50868228                    -> { seed: "50868228", dictionary: null, phrase: null }
 *   /srd/Fireball                -> { seed: null, dictionary: "srd", phrase: "Fireball" }
 *   /Ignis-Et-Terra              -> { seed: null, dictionary: null, phrase: "Ignis Et Terra" }
 */
export function parseSigilLocation(
  loc: Pick<Location, 'pathname' | 'search' | 'hash'> = window.location
): ParsedSigilLocation {
  const rawPath = loc.pathname.replace(/^\/+|\/+$/g, '');
  if (
    rawPath.length > 0 &&
    !IGNORED_PATH_PREFIXES.some((prefix) => rawPath.toLowerCase().startsWith(prefix))
  ) {
    const segments = rawPath
      .split('/')
      .map((seg) => safeDecode(seg).trim())
      .filter(Boolean);

    if (segments.length >= 1 && isValidSeedSegment(segments[0])) {
      const seed = sanitizeSeedSegment(segments[0]) || null;
      if (segments.length === 1) {
        return { seed, dictionary: null, phrase: null };
      }

      const maybeDict = parseDictionarySlug(segments[1]);
      if (segments.length >= 3) {
        const phrase = decodeSlugWords(segments.slice(2).join(' ')) || null;
        return {
          seed,
          dictionary: maybeDict,
          phrase,
        };
      }

      // segments.length === 2
      if (maybeDict) {
        return { seed, dictionary: maybeDict, phrase: null };
      }
      return {
        seed,
        dictionary: null,
        phrase: decodeSlugWords(segments[1]) || null,
      };
    }

    // No valid seed in segment 0
    if (segments.length >= 2) {
      const maybeDict = parseDictionarySlug(segments[0]);
      if (maybeDict) {
        return {
          seed: null,
          dictionary: maybeDict,
          phrase: decodeSlugWords(segments.slice(1).join(' ')) || null,
        };
      }
      return {
        seed: null,
        dictionary: null,
        phrase: decodeSlugWords(segments.join(' ')) || null,
      };
    }

    if (segments.length === 1) {
      const single = segments[0];
      const maybeDict = parseDictionarySlug(single);
      if (maybeDict) {
        return { seed: null, dictionary: maybeDict, phrase: null };
      }

      // Backwards-compatible support for legacy `/Ignis-Et-Terra-50868228` links
      const legacyMatch = single.match(/^(.*\S)-([A-Za-z0-9]*\d[A-Za-z0-9]*)$/);
      if (legacyMatch && legacyMatch[1].trim().length > 0) {
        return {
          seed: sanitizeSeedSegment(legacyMatch[2]) || null,
          dictionary: null,
          phrase: decodeSlugWords(legacyMatch[1]) || null,
        };
      }

      return {
        seed: null,
        dictionary: null,
        phrase: decodeSlugWords(single) || null,
      };
    }
  }

  if (loc.search) {
    const params = new URLSearchParams(loc.search);
    const seedParam = params.get('seed');
    const dictParam = params.get('dict') || params.get('src');
    const queryVal = params.get('phrase') || params.get('q') || params.get('s');
    if (seedParam || dictParam || queryVal) {
      return {
        seed: seedParam ? sanitizeSeedSegment(seedParam) || null : null,
        dictionary: dictParam ? parseDictionarySlug(dictParam) : null,
        phrase: queryVal ? decodeSlugWords(queryVal) || null : null,
      };
    }
  }

  if (loc.hash && loc.hash.length > 1) {
    const rawHash = loc.hash.replace(/^#\/?/, '');
    const decoded = safeDecode(rawHash);
    const parts = decoded.split('/').filter(Boolean);
    if (parts.length >= 3 && isValidSeedSegment(parts[0])) {
      return {
        seed: sanitizeSeedSegment(parts[0]) || null,
        dictionary: parseDictionarySlug(parts[1]),
        phrase: decodeSlugWords(parts.slice(2).join(' ')) || null,
      };
    }
    if (parts.length === 2 && isValidSeedSegment(parts[0])) {
      return {
        seed: sanitizeSeedSegment(parts[0]) || null,
        dictionary: null,
        phrase: decodeSlugWords(parts[1]) || null,
      };
    }
    const parsed = decodeSlugWords(decoded);
    if (parsed.length > 0) return { seed: null, dictionary: null, phrase: parsed };
  }

  return { seed: null, dictionary: null, phrase: null };
}

/**
 * Copy text to clipboard with an iframe-safe fallback.
 */
export async function copyTextToClipboard(value: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Fallback below
    }
  }

  if (typeof document === 'undefined') return false;
  try {
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}
