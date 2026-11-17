export const DEFAULT_SIGIL_PHRASE = 'Aurelia Astra';

const IGNORED_PATH_PREFIXES = ['assets/', 'public/', 'favicon', 'index.html'];

function safeDecode(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

/**
 * Convert a phrase into a clean URL pathname slug (e.g. "Aurelia Astra" -> "/Aurelia-Astra").
 */
export function phraseToPath(phrase: string): string {
  const words = phrase.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '/';
  const encodedWords = words.map((word) =>
    encodeURIComponent(word).replace(/\./g, '%2E')
  );
  return `/${encodedWords.join('-')}`;
}

/**
 * Build the full shareable URL for a sigil phrase using only its words in the path.
 */
export function buildShareableSigilUrl(
  phrase: string,
  origin: string = typeof window !== 'undefined' ? window.location.origin : ''
): string {
  return `${origin}${phraseToPath(phrase)}`;
}

/**
 * Parse a sigil phrase from the current browser URL path (or query/hash fallback).
 * Supports forms like:
 *   /Aurelia-Astra -> "Aurelia Astra"
 *   /Ignis/Et/Terra -> "Ignis Et Terra"
 *   /Aurelia%20Astra -> "Aurelia Astra"
 */
export function parsePhraseFromLocation(
  loc: Pick<Location, 'pathname' | 'search' | 'hash'> = window.location
): string | null {
  const rawPath = loc.pathname.replace(/^\/+|\/+$/g, '');
  if (
    rawPath.length > 0 &&
    !IGNORED_PATH_PREFIXES.some((prefix) => rawPath.toLowerCase().startsWith(prefix))
  ) {
    const decoded = safeDecode(rawPath);
    const parsed = decoded
      .replace(/[-_/+]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (parsed.length > 0) {
      return parsed;
    }
  }

  if (loc.search) {
    const params = new URLSearchParams(loc.search);
    const queryVal = params.get('phrase') || params.get('q') || params.get('s');
    if (queryVal) {
      const parsed = queryVal
        .replace(/[-_+]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (parsed.length > 0) return parsed;
    }
  }

  if (loc.hash && loc.hash.length > 1) {
    const rawHash = loc.hash.replace(/^#\/?/, '');
    const decoded = safeDecode(rawHash);
    const parsed = decoded
      .replace(/[-_/+]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (parsed.length > 0) return parsed;
  }

  return null;
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
