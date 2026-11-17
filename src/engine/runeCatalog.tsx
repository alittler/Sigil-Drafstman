import React from 'react';
import type { RunePaletteMode } from '../types/sigil';

export type RuneCategoryId =
  | 'nodes'
  | 'polygons'
  | 'triangles'
  | 'starbursts'
  | 'syllabics'
  | 'seals'
  | 'runic';

export interface ArcaneGlyphEntry {
  char: string;
  name: string;
  category: RuneCategoryId;
}

export const RUNE_CATEGORY_LABELS: Record<RuneCategoryId, string> = {
  nodes: 'Concentric & Dotted Nodes',
  polygons: 'Nested & Interlocking Polygons',
  triangles: 'Triangles & Directional Wedges',
  starbursts: 'Starbursts & Lotus Petals',
  syllabics: 'Canadian Aboriginal Syllabics',
  seals: 'Seal Operators',
  runic: 'Runic Block (Elder, Younger & Anglo-Saxon)',
};

export const RUNE_PALETTE_LABELS: Record<RunePaletteMode, string> = {
  auto: 'Futhark Text (Text-Derived)',
  runic: 'Runic Block (89 chars)',
  warding: 'Warding Seal (▣ ⟁ ❂ ⟁ ▣)',
  containment: 'Energy Containment (◎ ⊕ ⧖ ⊗ ◎)',
  astral: 'Astral / Portal Gate (⬡ ⵐ ⊙ ⵐ ⬡)',
  binding: 'Binding Circle (◌ ⴲ ⋈ ⴲ ◌)',
  'nodes-polygons': 'Nodes, Polygons & Triangles',
  'starbursts-syllabics': 'Starbursts & Syllabics',
};

export const ALL_RUNE_PALETTES: RunePaletteMode[] = [
  'auto',
  'runic',
  'warding',
  'containment',
  'astral',
  'binding',
  'nodes-polygons',
  'starbursts-syllabics',
];

export const SEAL_SEQUENCES = {
  warding: ['▣', '⟁', '❂', '⟁', '▣'],
  containment: ['◎', '⊕', '⧖', '⊗', '◎'],
  astral: ['⬡', 'ⵐ', '⊙', 'ⵐ', '⬡'],
  binding: ['◌', 'ⴲ', '⋈', 'ⴲ', '◌'],
} as const;

export const CONCENTRIC_NODE_GLYPHS: ArcaneGlyphEntry[] = [
  { char: '◉', name: 'Fisheye', category: 'nodes' },
  { char: '◎', name: 'Bullseye', category: 'nodes' },
  { char: '◌', name: 'Dotted Circle', category: 'nodes' },
  { char: '◍', name: 'Vertical Fill Circle', category: 'nodes' },
  { char: '⌖', name: 'Position Crosshair', category: 'nodes' },
];

export const POLYGON_NODE_GLYPHS: ArcaneGlyphEntry[] = [
  { char: '◈', name: 'Diamond in Diamond', category: 'polygons' },
  { char: '⟐', name: 'Diamond with Centred Dot', category: 'polygons' },
  { char: '▣', name: 'Square in Square', category: 'polygons' },
  { char: '⬡', name: 'White Hexagon', category: 'polygons' },
  { char: '⬣', name: 'Horizontal Black Hexagon', category: 'polygons' },
  { char: '⏣', name: 'Benzene Ring with Circle', category: 'polygons' },
  { char: '⯐', name: 'Square Position Indicator', category: 'polygons' },
];

export const TRIANGLE_WEDGE_GLYPHS: ArcaneGlyphEntry[] = [
  { char: '△', name: 'Upward Triangle', category: 'triangles' },
  { char: '▽', name: 'Downward Triangle', category: 'triangles' },
  { char: '⟁', name: 'Nested Triangle', category: 'triangles' },
  { char: '◬', name: 'Upward Triangle with Dot', category: 'triangles' },
  { char: '⧊', name: 'Triangle with Dot Above', category: 'triangles' },
  { char: '⧋', name: 'Triangle with Underbar', category: 'triangles' },
];

export const STARBURST_PETAL_GLYPHS: ArcaneGlyphEntry[] = [
  { char: '❂', name: 'Circled Eight-Pointed Star', category: 'starbursts' },
  { char: '✺', name: 'Sixteen-Pointed Asterisk', category: 'starbursts' },
  { char: '❈', name: 'Heavy Sparkle', category: 'starbursts' },
  { char: '❁', name: 'Eight-Petalled Florette', category: 'starbursts' },
  { char: '❃', name: 'Teardrop-Spoked Pinwheel', category: 'starbursts' },
];

export const SYLLABIC_GLYPHS: ArcaneGlyphEntry[] = [
  { char: 'ᐃ', name: 'Syllabic I (Up Wedge)', category: 'syllabics' },
  { char: 'ᐅ', name: 'Syllabic O (Right Wedge)', category: 'syllabics' },
  { char: 'ᐊ', name: 'Syllabic A (Left Wedge)', category: 'syllabics' },
  { char: 'ᐱ', name: 'Syllabic Pi (Up Chevron)', category: 'syllabics' },
  { char: 'ᐳ', name: 'Syllabic Po (Right Chevron)', category: 'syllabics' },
  { char: 'ᐸ', name: 'Syllabic Pa (Left Chevron)', category: 'syllabics' },
  { char: 'ᑎ', name: 'Syllabic Ti (Arch)', category: 'syllabics' },
  { char: 'ᑐ', name: 'Syllabic To (Right Loop)', category: 'syllabics' },
  { char: 'ᑕ', name: 'Syllabic Ta (Left Loop)', category: 'syllabics' },
  { char: 'ᑭ', name: 'Syllabic Ki (P-Loop)', category: 'syllabics' },
  { char: 'ᑯ', name: 'Syllabic Ko (D-Loop)', category: 'syllabics' },
  { char: 'ᑲ', name: 'Syllabic Ka (B-Loop)', category: 'syllabics' },
  { char: 'ᐁ', name: 'Syllabic E (Down Wedge)', category: 'syllabics' },
  { char: 'ᐯ', name: 'Syllabic Pe (Down Chevron)', category: 'syllabics' },
  { char: 'ᑌ', name: 'Syllabic Te (Cup Loop)', category: 'syllabics' },
  { char: 'ᑫ', name: 'Syllabic Ke (Q-Loop)', category: 'syllabics' },
  { char: 'ᔅ', name: 'Syllabic Final S', category: 'syllabics' },
  { char: 'ᔊ', name: 'Syllabic West-Cree Sh', category: 'syllabics' },
  { char: 'ᔐ', name: 'Syllabic She', category: 'syllabics' },
];

export const SEAL_OPERATOR_GLYPHS: ArcaneGlyphEntry[] = [
  { char: '⊕', name: 'Circled Plus', category: 'seals' },
  { char: '⧖', name: 'White Hourglass', category: 'seals' },
  { char: '⊗', name: 'Circled Times', category: 'seals' },
  { char: 'ⵐ', name: 'Tifinagh Yagn', category: 'seals' },
  { char: '⊙', name: 'Circled Dot', category: 'seals' },
  { char: 'ⴲ', name: 'Tifinagh Yabh', category: 'seals' },
  { char: '⋈', name: 'Bowtie', category: 'seals' },
];

export const NON_RUNIC_MICRO_GLYPHS: string[] = [
  ...CONCENTRIC_NODE_GLYPHS.map((g) => g.char),
  ...POLYGON_NODE_GLYPHS.map((g) => g.char),
  ...TRIANGLE_WEDGE_GLYPHS.map((g) => g.char),
  ...STARBURST_PETAL_GLYPHS.map((g) => g.char),
  ...SEAL_OPERATOR_GLYPHS.map((g) => g.char),
];

interface RunicStrokeDef {
  name: string;
  lines: Array<[number, number, number, number]>;
  dots?: Array<[number, number]>;
  circles?: Array<[number, number, number]>;
}

// Complete 89-character Unicode Runic Block (U+16A0 through U+16F8)
// Normalized [-1, 1] stroke coordinates for uniform crisp architectural rendering
const RUNIC_DEFINITIONS: RunicStrokeDef[] = [
  /* U+16A0 ᚠ */ { name: 'Fehu (ᚠ)', lines: [[-0.36, -0.88, -0.36, 0.88], [-0.36, 0.02, 0.42, -0.78], [-0.36, 0.44, 0.42, -0.3]] },
  /* U+16A1 ᚡ */ { name: 'Rune V (ᚡ)', lines: [[-0.36, -0.88, -0.36, 0.88], [-0.36, 0.02, 0.42, -0.78], [-0.36, 0.44, 0.42, -0.3]], dots: [[0.06, -0.58]] },
  /* U+16A2 ᚢ */ { name: 'Uruz (ᚢ)', lines: [[-0.4, -0.88, -0.4, 0.88], [-0.4, -0.88, 0.4, -0.28], [0.4, -0.28, 0.4, 0.88]] },
  /* U+16A3 ᚣ */ { name: 'Yr (ᚣ)', lines: [[-0.42, -0.88, -0.42, 0.88], [-0.42, -0.88, 0.42, -0.28], [0.42, -0.28, 0.42, 0.88], [0, -0.58, 0, 0.88]] },
  /* U+16A4 ᚤ */ { name: 'Rune Y (ᚤ)', lines: [[-0.4, -0.88, -0.4, 0.88], [-0.4, -0.88, 0.4, -0.28], [0.4, -0.28, 0.4, 0.88]], dots: [[0, 0.25]] },
  /* U+16A5 ᚥ */ { name: 'Rune W (ᚥ)', lines: [[-0.4, -0.88, -0.4, 0.88], [-0.4, -0.88, 0.4, -0.28], [0.4, -0.28, 0.4, 0.88], [0.4, 0.1, 0.08, 0.35]] },
  /* U+16A6 ᚦ */ { name: 'Thurisaz (ᚦ)', lines: [[-0.35, -0.88, -0.35, 0.88], [-0.35, -0.42, 0.42, 0], [0.42, 0, -0.35, 0.42]] },
  /* U+16A7 ᚧ */ { name: 'Eth (ᚧ)', lines: [[-0.35, -0.88, -0.35, 0.88], [-0.35, -0.42, 0.42, 0], [0.42, 0, -0.35, 0.42]], dots: [[-0.02, 0]] },
  /* U+16A8 ᚨ */ { name: 'Ansuz (ᚨ)', lines: [[-0.36, -0.88, -0.36, 0.88], [-0.36, -0.78, 0.42, -0.2], [-0.36, -0.25, 0.42, 0.32]] },
  /* U+16A9 ᚩ */ { name: 'Os (ᚩ)', lines: [[-0.36, -0.88, -0.36, 0.88], [-0.36, -0.78, 0.42, -0.22], [0.42, -0.22, 0.42, 0.08], [-0.36, -0.22, 0.42, 0.34]] },
  /* U+16AA ᚪ */ { name: 'Ac (ᚪ)', lines: [[-0.36, -0.88, -0.36, 0.88], [-0.36, -0.78, 0.42, -0.2], [0.12, -0.42, 0.12, -0.78], [-0.36, -0.24, 0.42, 0.34]] },
  /* U+16AB ᚫ */ { name: 'Aesc (ᚫ)', lines: [[-0.36, -0.88, -0.36, 0.88], [-0.36, -0.78, 0.42, -0.2], [-0.36, -0.24, 0.42, 0.34], [0.14, 0.14, 0.42, -0.1]] },
  /* U+16AC ᚬ */ { name: 'Long-Branch Oss (ᚬ)', lines: [[0.34, -0.88, 0.34, 0.88], [0.34, -0.75, -0.4, -0.18], [0.34, -0.22, -0.4, 0.35]] },
  /* U+16AD ᚭ */ { name: 'Short-Twig Oss (ᚭ)', lines: [[0.24, -0.88, 0.24, 0.88], [0.24, -0.6, -0.32, -0.24], [0.24, -0.12, -0.32, 0.24]] },
  /* U+16AE ᚮ */ { name: 'Rune O (ᚮ)', lines: [[0, -0.88, 0, 0.88], [0, -0.62, -0.44, -0.2], [0, -0.18, 0.44, 0.24]] },
  /* U+16AF ᚯ */ { name: 'Rune Oe (ᚯ)', lines: [[0, -0.88, 0, 0.88], [-0.44, -0.42, 0.44, 0.22], [-0.44, 0.12, 0.44, -0.42]] },
  /* U+16B0 ᚰ */ { name: 'Rune On (ᚰ)', lines: [[0, -0.88, 0, 0.88], [0, -0.42, 0.42, -0.78], [0, 0.08, -0.42, 0.45]] },
  /* U+16B1 ᚱ */ { name: 'Raido (ᚱ)', lines: [[-0.36, -0.88, -0.36, 0.88], [-0.36, -0.84, 0.4, -0.36], [0.4, -0.36, -0.36, 0.08], [-0.36, 0.08, 0.44, 0.88]] },
  /* U+16B2 ᚲ */ { name: 'Kaunan (ᚲ)', lines: [[0.38, -0.72, -0.38, 0], [-0.38, 0, 0.38, 0.72]] },
  /* U+16B3 ᚳ */ { name: 'Cen (ᚳ)', lines: [[-0.34, -0.88, -0.34, 0.88], [-0.34, 0.1, 0.42, -0.6]] },
  /* U+16B4 ᚴ */ { name: 'Kaun (ᚴ)', lines: [[-0.34, -0.88, -0.34, 0.88], [-0.34, -0.05, 0.42, -0.78]] },
  /* U+16B5 ᚵ */ { name: 'Rune G (ᚵ)', lines: [[-0.34, -0.88, -0.34, 0.88], [-0.34, -0.05, 0.42, -0.78]], dots: [[0.14, -0.18]] },
  /* U+16B6 ᚶ */ { name: 'Eng (ᚶ)', lines: [[-0.34, -0.88, -0.34, 0.88], [-0.34, -0.05, 0.42, -0.78], [0.42, -0.78, 0.42, -0.35]] },
  /* U+16B7 ᚷ */ { name: 'Gebo (ᚷ)', lines: [[-0.58, -0.82, 0.58, 0.82], [0.58, -0.82, -0.58, 0.82]] },
  /* U+16B8 ᚸ */ { name: 'Gar (ᚸ)', lines: [[0, -0.88, 0, 0.88], [-0.56, -0.76, 0.56, 0.76], [0.56, -0.76, -0.56, 0.76], [0, -0.45, 0.42, 0], [0.42, 0, 0, 0.45], [0, 0.45, -0.42, 0], [-0.42, 0, 0, -0.45]] },
  /* U+16B9 ᚹ */ { name: 'Wunjo (ᚹ)', lines: [[-0.36, -0.88, -0.36, 0.88], [-0.36, -0.84, 0.42, -0.34], [0.42, -0.34, -0.36, 0.16]] },
  /* U+16BA ᚺ */ { name: 'Hagalaz (ᚺ)', lines: [[-0.44, -0.88, -0.44, 0.88], [0.44, -0.88, 0.44, 0.88], [-0.44, -0.25, 0.44, 0.25]] },
  /* U+16BB ᚻ */ { name: 'Haegl (ᚻ)', lines: [[-0.44, -0.88, -0.44, 0.88], [0.44, -0.88, 0.44, 0.88], [-0.44, -0.42, 0.44, 0.02], [-0.44, -0.02, 0.44, 0.42]] },
  /* U+16BC ᚼ */ { name: 'Long-Branch Hagall (ᚼ)', lines: [[0, -0.88, 0, 0.88], [-0.48, -0.42, 0.48, 0.42], [0.48, -0.42, -0.48, 0.42]] },
  /* U+16BD ᚽ */ { name: 'Short-Twig Hagall (ᚽ)', lines: [[0, -0.88, 0, 0.88], [-0.42, 0, 0.42, 0]] },
  /* U+16BE ᚾ */ { name: 'Naudiz (ᚾ)', lines: [[0, -0.88, 0, 0.88], [-0.48, -0.36, 0.48, 0.36]] },
  /* U+16BF ᚿ */ { name: 'Short-Twig Naud (ᚿ)', lines: [[-0.14, -0.88, -0.14, 0.88], [-0.14, -0.1, 0.42, 0.36]] },
  /* U+16C0 ᛀ */ { name: 'Dotted N (ᛀ)', lines: [[-0.14, -0.88, -0.14, 0.88], [-0.14, -0.1, 0.42, 0.36]], dots: [[-0.44, 0]] },
  /* U+16C1 ᛁ */ { name: 'Isa (ᛁ)', lines: [[0, -0.88, 0, 0.88]] },
  /* U+16C2 ᛂ */ { name: 'Rune E (ᛂ)', lines: [[0, -0.88, 0, 0.88]], dots: [[0, 0]] },
  /* U+16C3 ᛃ */ { name: 'Jera (ᛃ)', lines: [[-0.42, -0.62, 0.14, -0.12], [0.14, -0.12, -0.42, 0.38], [0.42, -0.38, -0.14, 0.12], [-0.14, 0.12, 0.42, 0.62]] },
  /* U+16C4 ᛄ */ { name: 'Ger (ᛄ)', lines: [[0, -0.88, 0, 0.88], [0, -0.45, 0.44, 0], [0.44, 0, 0, 0.45], [0, 0.45, -0.44, 0], [-0.44, 0, 0, -0.45]] },
  /* U+16C5 ᛅ */ { name: 'Long-Branch Ar (ᛅ)', lines: [[0, -0.88, 0, 0.88], [-0.48, 0.36, 0.48, -0.36]] },
  /* U+16C6 ᛆ */ { name: 'Short-Twig Ar (ᛆ)', lines: [[0.14, -0.88, 0.14, 0.88], [-0.42, 0.3, 0.14, -0.16]] },
  /* U+16C7 ᛇ */ { name: 'Eihwaz (ᛇ)', lines: [[0, -0.88, 0, 0.88], [0, -0.88, 0.46, -0.42], [0, 0.88, -0.46, 0.42]] },
  /* U+16C8 ᛈ */ { name: 'Perthro (ᛈ)', lines: [[-0.38, -0.88, -0.38, 0.88], [-0.38, -0.84, 0.42, -0.36], [0.42, -0.36, -0.02, -0.04], [-0.38, 0.84, 0.42, 0.36], [0.42, 0.36, -0.02, 0.04]] },
  /* U+16C9 ᛉ */ { name: 'Algiz (ᛉ)', lines: [[0, -0.88, 0, 0.88], [0, -0.06, -0.52, -0.68], [0, -0.06, 0.52, -0.68]] },
  /* U+16CA ᛊ */ { name: 'Sowilo (ᛊ)', lines: [[0.42, -0.84, -0.42, -0.16], [-0.42, -0.16, 0.42, 0.16], [0.42, 0.16, -0.42, 0.84]] },
  /* U+16CB ᛋ */ { name: 'Sigel (ᛋ)', lines: [[-0.32, -0.84, 0.38, -0.16], [0.38, -0.16, -0.38, 0.16], [-0.38, 0.16, 0.32, 0.84]] },
  /* U+16CC ᛌ */ { name: 'Short-Twig Sol (ᛌ)', lines: [[0, -0.84, 0, 0.08]], dots: [[0, 0.24]] },
  /* U+16CD ᛍ */ { name: 'Rune C (ᛍ)', lines: [[0, -0.84, 0, 0.08], [0, -0.84, -0.36, -0.48]] },
  /* U+16CE ᛎ */ { name: 'Rune Z (ᛎ)', lines: [[0, -0.88, 0, 0.88], [0, 0.08, -0.52, 0.7], [0, 0.08, 0.52, 0.7]] },
  /* U+16CF ᛏ */ { name: 'Tiwaz (ᛏ)', lines: [[0, -0.88, 0, 0.88], [0, -0.88, -0.5, -0.32], [0, -0.88, 0.5, -0.32]] },
  /* U+16D0 ᛐ */ { name: 'Short-Twig Tyr (ᛐ)', lines: [[0.14, -0.88, 0.14, 0.88], [0.14, -0.88, -0.4, -0.34]] },
  /* U+16D1 ᛑ */ { name: 'Rune D (ᛑ)', lines: [[0, -0.88, 0, 0.88], [0, -0.88, -0.5, -0.32], [0, -0.88, 0.5, -0.32]], dots: [[0, 0.2]] },
  /* U+16D2 ᛒ */ { name: 'Berkano (ᛒ)', lines: [[-0.36, -0.88, -0.36, 0.88], [-0.36, -0.84, 0.42, -0.4], [0.42, -0.4, -0.36, 0], [-0.36, 0, 0.42, 0.42], [0.42, 0.42, -0.36, 0.84]] },
  /* U+16D3 ᛓ */ { name: 'Short-Twig Bjarkan (ᛓ)', lines: [[-0.26, -0.88, -0.26, 0.88], [-0.26, 0.02, 0.42, 0.44], [0.42, 0.44, -0.26, 0.86]] },
  /* U+16D4 ᛔ */ { name: 'Dotted P (ᛔ)', lines: [[-0.36, -0.88, -0.36, 0.88], [-0.36, -0.84, 0.42, -0.4], [0.42, -0.4, -0.36, 0], [-0.36, 0, 0.42, 0.42], [0.42, 0.42, -0.36, 0.84]], dots: [[-0.02, -0.42], [-0.02, 0.42]] },
  /* U+16D5 ᛕ */ { name: 'Open P (ᛕ)', lines: [[-0.36, -0.88, -0.36, 0.88], [-0.36, -0.82, 0.4, -0.42], [0.4, -0.42, 0.4, 0.42], [0.4, 0.42, -0.36, 0.82]] },
  /* U+16D6 ᛖ */ { name: 'Ehwaz (ᛖ)', lines: [[-0.48, -0.88, -0.48, 0.88], [0.48, -0.88, 0.48, 0.88], [-0.48, -0.84, 0, -0.24], [0, -0.24, 0.48, -0.84]] },
  /* U+16D7 ᛗ */ { name: 'Mannaz (ᛗ)', lines: [[-0.48, -0.88, -0.48, 0.88], [0.48, -0.88, 0.48, 0.88], [-0.48, -0.84, 0.48, 0.08], [0.48, -0.84, -0.48, 0.08]] },
  /* U+16D8 ᛘ */ { name: 'Long-Branch Madr (ᛘ)', lines: [[0, -0.88, 0, 0.88], [0, -0.06, -0.52, -0.68], [0, -0.06, 0.52, -0.68]], circles: [[0, -0.48, 0.2]] },
  /* U+16D9 ᛙ */ { name: 'Short-Twig Madr (ᛙ)', lines: [[0, -0.88, 0, 0.88], [0, 0.1, -0.46, 0.66], [0, 0.1, 0.46, 0.66]] },
  /* U+16DA ᛚ */ { name: 'Laguz (ᛚ)', lines: [[-0.32, -0.88, -0.32, 0.88], [-0.32, -0.88, 0.44, -0.22]] },
  /* U+16DB ᛛ */ { name: 'Dotted L (ᛛ)', lines: [[-0.32, -0.88, -0.32, 0.88], [-0.32, -0.88, 0.44, -0.22]], dots: [[0.06, -0.15]] },
  /* U+16DC ᛜ */ { name: 'Ingwaz (ᛜ)', lines: [[0, -0.52, 0.48, 0], [0.48, 0, 0, 0.52], [0, 0.52, -0.48, 0], [-0.48, 0, 0, -0.52]] },
  /* U+16DD ᛝ */ { name: 'Ing (ᛝ)', lines: [[-0.5, -0.82, 0.5, 0.82], [0.5, -0.82, -0.5, 0.82], [0, -0.42, 0.36, 0], [0.36, 0, 0, 0.42], [0, 0.42, -0.36, 0], [-0.36, 0, 0, -0.42]] },
  /* U+16DE ᛞ */ { name: 'Dagaz (ᛞ)', lines: [[-0.54, -0.82, -0.54, 0.82], [0.54, -0.82, 0.54, 0.82], [-0.54, -0.82, 0.54, 0.82], [0.54, -0.82, -0.54, 0.82]] },
  /* U+16DF ᛟ */ { name: 'Othala (ᛟ)', lines: [[0, -0.86, 0.48, -0.32], [0.48, -0.32, -0.48, 0.84], [0, -0.86, -0.48, -0.32], [-0.48, -0.32, 0.48, 0.84]] },
  /* U+16E0 ᛠ */ { name: 'Ear (ᛠ)', lines: [[0, -0.88, 0, 0.88], [-0.52, -0.25, 0, -0.88], [0, -0.88, 0.52, -0.25], [-0.52, -0.25, -0.52, 0.5], [0.52, -0.25, 0.52, 0.5]] },
  /* U+16E1 ᛡ */ { name: 'Ior (ᛡ)', lines: [[0, -0.88, 0, 0.88], [-0.48, -0.42, 0.48, 0.42], [0.48, -0.42, -0.48, 0.42], [-0.46, 0, 0.46, 0]] },
  /* U+16E2 ᛢ */ { name: 'Cweorth (ᛢ)', lines: [[0, -0.88, 0, 0.88], [0, -0.86, 0.42, -0.42], [0.42, -0.42, 0, 0.02], [0, 0.02, -0.42, -0.42], [-0.42, -0.42, 0, -0.86], [-0.44, 0.45, 0.44, 0.45]] },
  /* U+16E3 ᛣ */ { name: 'Calc (ᛣ)', lines: [[0, -0.88, 0, 0.88], [0, 0.14, -0.52, 0.78], [0, 0.14, 0.52, 0.78]] },
  /* U+16E4 ᛤ */ { name: 'Cealc (ᛤ)', lines: [[0, -0.88, 0, 0.88], [0, 0.14, -0.52, 0.78], [0, 0.14, 0.52, 0.78], [-0.48, 0.48, 0.48, 0.48]] },
  /* U+16E5 ᛥ */ { name: 'Stan (ᛥ)', lines: [[0, -0.88, 0, 0.88], [0, -0.56, 0.46, 0], [0.46, 0, 0, 0.56], [0, 0.56, -0.46, 0], [-0.46, 0, 0, -0.56], [-0.44, -0.76, 0.44, -0.76], [-0.44, 0.76, 0.44, 0.76]] },
  /* U+16E6 ᛦ */ { name: 'Long-Branch Yr (ᛦ)', lines: [[0, -0.88, 0, 0.88], [0, 0.05, -0.52, 0.72], [0, 0.05, 0.52, 0.72]] },
  /* U+16E7 ᛧ */ { name: 'Short-Twig Yr (ᛧ)', lines: [[0, -0.88, 0, 0.88], [0, 0.34, -0.38, 0.78], [0, 0.34, 0.38, 0.78]] },
  /* U+16E8 ᛨ */ { name: 'Icelandic Yr (ᛨ)', lines: [[0, -0.34, 0, 0.88], [0, 0.12, -0.5, 0.72], [0, 0.12, 0.5, 0.72]], circles: [[0, -0.58, 0.24]] },
  /* U+16E9 ᛩ */ { name: 'Rune Q (ᛩ)', lines: [[0.34, -0.88, 0.34, 0.88], [0.34, 0.84, -0.42, 0.36], [-0.42, 0.36, 0.34, -0.14]] },
  /* U+16EA ᛪ */ { name: 'Rune X (ᛪ)', lines: [[0, -0.88, 0, 0.88], [-0.46, -0.66, 0.46, 0.06], [0.46, -0.66, -0.46, 0.06]] },
  /* U+16EB ᛫ */ { name: 'Runic Single Punctuation (᛫)', lines: [], dots: [[0, 0]] },
  /* U+16EC ᛬ */ { name: 'Runic Multiple Punctuation (᛬)', lines: [], dots: [[0, -0.34], [0, 0.34]] },
  /* U+16ED ᛭ */ { name: 'Runic Cross Punctuation (᛭)', lines: [[-0.55, 0, 0.55, 0], [0, -0.55, 0, 0.55]] },
  /* U+16EE ᛮ */ { name: 'Arlaug (ᛮ)', lines: [[-0.24, -0.88, -0.24, 0.88]], circles: [[0.14, 0, 0.32]] },
  /* U+16EF ᛯ */ { name: 'Tvimadur (ᛯ)', lines: [[0, -0.88, 0, 0.88], [0, -0.12, -0.5, -0.72], [0, -0.12, 0.5, -0.72], [0, 0.12, -0.5, 0.72], [0, 0.12, 0.5, 0.72]] },
  /* U+16F0 ᛰ */ { name: 'Belgthor (ᛰ)', lines: [[0, -0.88, 0, 0.88]], circles: [[0, -0.38, 0.28], [0, 0.38, 0.28]] },
  /* U+16F1 ᛱ */ { name: 'Rune K (ᛱ)', lines: [[-0.32, -0.88, -0.32, 0.88], [-0.32, -0.22, 0.44, -0.74], [-0.32, -0.22, 0.44, 0.32]] },
  /* U+16F2 ᛲ */ { name: 'Rune Sh (ᛲ)', lines: [[0, -0.88, 0, 0.88], [-0.46, -0.68, 0.46, -0.18], [-0.46, -0.18, 0.46, 0.32], [-0.46, 0.32, 0.46, 0.74]] },
  /* U+16F3 ᛳ */ { name: 'Rune Oo (ᛳ)', lines: [], circles: [[0, -0.38, 0.32], [0, 0.38, 0.32]] },
  /* U+16F4 ᛴ */ { name: 'Franks Casket Os (ᛴ)', lines: [[-0.36, -0.88, -0.36, 0.88], [-0.36, -0.76, 0.42, -0.2], [-0.36, -0.2, 0.42, 0.36], [0.42, 0.36, 0.42, 0.68]] },
  /* U+16F5 ᛵ */ { name: 'Franks Casket Is (ᛵ)', lines: [[0, -0.88, 0, 0.88], [-0.28, -0.88, 0.28, -0.88], [-0.28, 0.88, 0.28, 0.88]] },
  /* U+16F6 ᛶ */ { name: 'Franks Casket Eh (ᛶ)', lines: [[-0.48, -0.88, -0.48, 0.88], [0.48, -0.88, 0.48, 0.88], [-0.48, -0.2, 0, -0.74], [0, -0.74, 0.48, -0.2]] },
  /* U+16F7 ᛷ */ { name: 'Franks Casket Ac (ᛷ)', lines: [[-0.36, -0.88, -0.36, 0.88], [-0.36, -0.78, 0.44, -0.2], [0.06, -0.46, 0.44, -0.78], [-0.36, -0.22, 0.44, 0.36]] },
  /* U+16F8 ᛸ */ { name: 'Franks Casket Aesc (ᛸ)', lines: [[-0.36, -0.88, -0.36, 0.88], [-0.36, -0.78, 0.44, -0.2], [-0.36, -0.22, 0.44, 0.36], [0.08, -0.44, 0.44, 0.14]] },
];

export const RUNIC_BLOCK_GLYPHS: ArcaneGlyphEntry[] = RUNIC_DEFINITIONS.map((def, idx) => ({
  char: String.fromCodePoint(0x16a0 + idx),
  name: def.name,
  category: 'runic',
}));

const RUNIC_BY_CHAR = new Map<string, RunicStrokeDef>(
  RUNIC_DEFINITIONS.map((def, idx) => [String.fromCodePoint(0x16a0 + idx), def])
);

export const ALL_ARCANE_GLYPHS: ArcaneGlyphEntry[] = [
  ...CONCENTRIC_NODE_GLYPHS,
  ...POLYGON_NODE_GLYPHS,
  ...TRIANGLE_WEDGE_GLYPHS,
  ...STARBURST_PETAL_GLYPHS,
  ...SYLLABIC_GLYPHS,
  ...SEAL_OPERATOR_GLYPHS,
  ...RUNIC_BLOCK_GLYPHS,
];

const GLYPH_BY_CHAR = new Map<string, ArcaneGlyphEntry>(
  ALL_ARCANE_GLYPHS.map((entry) => [entry.char, entry])
);

export function lookupArcaneGlyph(char: string): ArcaneGlyphEntry {
  return GLYPH_BY_CHAR.get(char) ?? CONCENTRIC_NODE_GLYPHS[0];
}

/**
 * Transliterate Latin characters into Elder/Younger/Anglo-Saxon Futhark runes (U+16A0..U+16F8).
 */
export const LATIN_TO_RUNIC: Record<string, string> = {
  a: 'ᚨ',
  b: 'ᛒ',
  c: 'ᚲ',
  d: 'ᛞ',
  e: 'ᛖ',
  f: 'ᚠ',
  g: 'ᚷ',
  h: 'ᚺ',
  i: 'ᛁ',
  j: 'ᛃ',
  k: 'ᚲ',
  l: 'ᛚ',
  m: 'ᛗ',
  n: 'ᚾ',
  o: 'ᛟ',
  p: 'ᛈ',
  q: 'ᛩ',
  r: 'ᚱ',
  s: 'ᛊ',
  t: 'ᛏ',
  u: 'ᚢ',
  v: 'ᚡ',
  w: 'ᚹ',
  x: 'ᛪ',
  y: 'ᚣ',
  z: 'ᛉ',
  '0': 'ᛰ',
  '1': 'ᛁ',
  '2': 'ᛒ',
  '3': 'ᚦ',
  '4': 'ᛜ',
  '5': 'ᛉ',
  '6': 'ᚺ',
  '7': 'ᛋ',
  '8': 'ᛟ',
  '9': 'ᛏ',
};

/**
 * Direct 1-to-1 Latin cipher table for the inner micro-script channel (A-Z + divider).
 */
export const LATIN_TO_MICRO_GLYPH: Record<string, string> = {
  a: '△',
  b: '▣',
  c: '◌',
  d: '◈',
  e: '⊙',
  f: '⟁',
  g: '◬',
  h: '⌖',
  i: '◉',
  j: '⧖',
  k: '⟐',
  l: '⬡',
  m: '⬣',
  n: '⊗',
  o: '◎',
  p: '❂',
  q: '⏣',
  r: '✺',
  s: '⊕',
  t: '▽',
  u: 'ⴲ',
  v: '⧊',
  w: '⋈',
  x: 'ⵐ',
  y: '❃',
  z: '⯐',
  ' ': '❁',
  "'": '❁',
  '/': '❁',
  '0': '◎',
  '1': '△',
  '2': '▣',
  '3': '◌',
  '4': '◈',
  '5': '⊙',
  '6': '⟁',
  '7': '◬',
  '8': '⌖',
  '9': '◉',
};

function regularPolyPoints(radius: number, sides: number, offsetDeg = 0): string {
  const pts: string[] = [];
  for (let i = 0; i < sides; i++) {
    const rad = (((i * 360) / sides + offsetDeg - 90) * Math.PI) / 180;
    pts.push(`${(radius * Math.cos(rad)).toFixed(2)},${(radius * Math.sin(rad)).toFixed(2)}`);
  }
  return pts.join(' ');
}

/**
 * Renders any curated geometric node, polygon, triangle, starburst, syllabic, seal operator,
 * or 89-character Runic glyph as uniform architectural SVG linework inside [-size/2, size/2].
 */
export const ArcaneGlyphVector: React.FC<{
  char: string;
  size?: number;
  stroke?: string;
  strokeWidth?: number;
}> = ({ char, size = 20, stroke = '#111315', strokeWidth = 1.6 }) => {
  const half = size / 2;
  const r = half * 0.88;
  const sw = strokeWidth;

  // Check 89-character Runic Block first
  const runicDef = RUNIC_BY_CHAR.get(char);
  if (runicDef) {
    const scaleX = half * 0.72;
    const scaleY = half * 0.92;
    return (
      <g strokeLinecap="round" strokeLinejoin="round" fill="none">
        {runicDef.lines.map(([x1, y1, x2, y2], idx) => (
          <line
            key={`rl-${idx}`}
            data-ink-role="primary"
            x1={Number((x1 * scaleX).toFixed(2))}
            y1={Number((y1 * scaleY).toFixed(2))}
            x2={Number((x2 * scaleX).toFixed(2))}
            y2={Number((y2 * scaleY).toFixed(2))}
            stroke={stroke}
            strokeWidth={sw}
          />
        ))}
        {runicDef.circles?.map(([cx, cy, cr], idx) => (
          <circle
            key={`rc-${idx}`}
            data-ink-role="primary"
            cx={Number((cx * scaleX).toFixed(2))}
            cy={Number((cy * scaleY).toFixed(2))}
            r={Number((cr * scaleX).toFixed(2))}
            stroke={stroke}
            strokeWidth={sw}
            fill="none"
          />
        ))}
        {runicDef.dots?.map(([dx, dy], idx) => (
          <circle
            key={`rd-${idx}`}
            data-ink-role="fill-primary"
            cx={Number((dx * scaleX).toFixed(2))}
            cy={Number((dy * scaleY).toFixed(2))}
            r={Math.max(1.2, sw * 0.85)}
            fill={stroke}
            stroke="none"
          />
        ))}
      </g>
    );
  }

  switch (char) {
    // 1. Concentric & Dotted Nodes
    case '◉': // Fisheye
      return (
        <g>
          <circle data-ink-role="primary" cx={0} cy={0} r={r} fill="none" stroke={stroke} strokeWidth={sw} />
          <circle data-ink-role="fill-primary" cx={0} cy={0} r={r * 0.48} fill={stroke} stroke="none" />
        </g>
      );
    case '◎': // Bullseye
      return (
        <g fill="none">
          <circle data-ink-role="primary" cx={0} cy={0} r={r} stroke={stroke} strokeWidth={sw} />
          <circle data-ink-role="primary" cx={0} cy={0} r={r * 0.48} stroke={stroke} strokeWidth={sw} />
        </g>
      );
    case '◌': // Dotted Circle
      return (
        <g>
          {Array.from({ length: 10 }, (_, idx) => {
            const rad = (idx * Math.PI * 2) / 10;
            return (
              <circle
                key={`dc-${idx}`}
                data-ink-role="fill-primary"
                cx={Number((r * 0.9 * Math.cos(rad)).toFixed(2))}
                cy={Number((r * 0.9 * Math.sin(rad)).toFixed(2))}
                r={Math.max(0.95, sw * 0.62)}
                fill={stroke}
                stroke="none"
              />
            );
          })}
        </g>
      );
    case '◍': // Vertical Fill Circle
      return (
        <g fill="none">
          <circle data-ink-role="primary" cx={0} cy={0} r={r} stroke={stroke} strokeWidth={sw} />
          {[-0.58, -0.29, 0, 0.29, 0.58].map((fx, idx) => {
            const x = fx * r;
            const ySpan = Math.sqrt(Math.max(0, r * r - x * x));
            return (
              <line
                key={`vf-${idx}`}
                data-ink-role="primary"
                x1={Number(x.toFixed(2))}
                y1={Number((-ySpan).toFixed(2))}
                x2={Number(x.toFixed(2))}
                y2={Number(ySpan.toFixed(2))}
                stroke={stroke}
                strokeWidth={sw * 0.72}
              />
            );
          })}
        </g>
      );
    case '⌖': // Position Indicator / Crosshair
      return (
        <g fill="none" strokeLinecap="round">
          <circle data-ink-role="primary" cx={0} cy={0} r={r * 0.64} stroke={stroke} strokeWidth={sw} />
          <line data-ink-role="primary" x1={0} y1={-r * 1.04} x2={0} y2={-r * 0.34} stroke={stroke} strokeWidth={sw * 0.9} />
          <line data-ink-role="primary" x1={0} y1={r * 0.34} x2={0} y2={r * 1.04} stroke={stroke} strokeWidth={sw * 0.9} />
          <line data-ink-role="primary" x1={-r * 1.04} y1={0} x2={-r * 0.34} y2={0} stroke={stroke} strokeWidth={sw * 0.9} />
          <line data-ink-role="primary" x1={r * 0.34} y1={0} x2={r * 1.04} y2={0} stroke={stroke} strokeWidth={sw * 0.9} />
        </g>
      );

    // 2. Nested & Interlocking Polygons
    case '◈': // Diamond in Diamond
      return (
        <g strokeLinejoin="round">
          <polygon
            data-ink-role="primary"
            points={`0,${-r} ${r},0 0,${r} ${-r},0`}
            fill="none"
            stroke={stroke}
            strokeWidth={sw}
          />
          <polygon
            data-ink-role="fill-primary"
            points={`0,${-r * 0.48} ${r * 0.48},0 0,${r * 0.48} ${-r * 0.48},0`}
            fill={stroke}
            stroke="none"
          />
        </g>
      );
    case '⟐': // Diamond with Centred Dot
      return (
        <g strokeLinejoin="round">
          <polygon
            data-ink-role="primary"
            points={`0,${-r} ${r},0 0,${r} ${-r},0`}
            fill="none"
            stroke={stroke}
            strokeWidth={sw}
          />
          <circle
            data-ink-role="fill-primary"
            cx={0}
            cy={0}
            r={Math.max(1.3, sw * 0.9)}
            fill={stroke}
            stroke="none"
          />
        </g>
      );
    case '▣': // Square in Square
      return (
        <g strokeLinejoin="round">
          <rect
            data-ink-role="primary"
            x={-r * 0.84}
            y={-r * 0.84}
            width={r * 1.68}
            height={r * 1.68}
            fill="none"
            stroke={stroke}
            strokeWidth={sw}
          />
          <rect
            data-ink-role="fill-primary"
            x={-r * 0.4}
            y={-r * 0.4}
            width={r * 0.8}
            height={r * 0.8}
            fill={stroke}
            stroke="none"
          />
        </g>
      );
    case '⬡': // White Hexagon (flat-top)
      return (
        <polygon
          data-ink-role="primary"
          points={regularPolyPoints(r * 0.96, 6, 30)}
          fill="none"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      );
    case '⬣': // Horizontal Black Hexagon (flat-top filled)
      return (
        <polygon
          data-ink-role="fill-primary"
          points={regularPolyPoints(r * 0.94, 6, 30)}
          fill={stroke}
          stroke="none"
        />
      );
    case '⏣': // Benzene Ring with Circle
      return (
        <g fill="none" strokeLinejoin="round">
          <polygon
            data-ink-role="primary"
            points={regularPolyPoints(r * 0.98, 6, 0)}
            stroke={stroke}
            strokeWidth={sw}
          />
          <circle data-ink-role="primary" cx={0} cy={0} r={r * 0.52} stroke={stroke} strokeWidth={sw * 0.9} />
        </g>
      );
    case '⯐': // Square Position Indicator
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <rect
            data-ink-role="primary"
            x={-r * 0.62}
            y={-r * 0.62}
            width={r * 1.24}
            height={r * 1.24}
            fill="none"
            stroke={stroke}
            strokeWidth={sw}
          />
          <line data-ink-role="primary" x1={0} y1={-r * 1.02} x2={0} y2={-r * 0.62} stroke={stroke} strokeWidth={sw * 0.9} />
          <line data-ink-role="primary" x1={0} y1={r * 0.62} x2={0} y2={r * 1.02} stroke={stroke} strokeWidth={sw * 0.9} />
          <line data-ink-role="primary" x1={-r * 1.02} y1={0} x2={-r * 0.62} y2={0} stroke={stroke} strokeWidth={sw * 0.9} />
          <line data-ink-role="primary" x1={r * 0.62} y1={0} x2={r * 1.02} y2={0} stroke={stroke} strokeWidth={sw * 0.9} />
          <circle data-ink-role="fill-primary" cx={0} cy={0} r={Math.max(1.1, sw * 0.72)} fill={stroke} stroke="none" />
        </g>
      );

    // 3. Triangles & Directional Wedges
    case '△': // Upward Triangle
      return (
        <polygon
          data-ink-role="primary"
          points={regularPolyPoints(r * 1.02, 3, 0)}
          fill="none"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      );
    case '▽': // Downward Triangle
      return (
        <polygon
          data-ink-role="primary"
          points={regularPolyPoints(r * 1.02, 3, 180)}
          fill="none"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      );
    case '⟁': // Nested Triangle
      return (
        <g fill="none" strokeLinejoin="round">
          <polygon
            data-ink-role="primary"
            points={`0,${-r * 0.98} ${r * 0.92},${r * 0.74} ${-r * 0.92},${r * 0.74}`}
            stroke={stroke}
            strokeWidth={sw}
          />
          <polygon
            data-ink-role="primary"
            points={`0,${-r * 0.36} ${r * 0.42},${r * 0.44} ${-r * 0.42},${r * 0.44}`}
            stroke={stroke}
            strokeWidth={sw * 0.85}
          />
        </g>
      );
    case '◬': // Upward Triangle with Dot
      return (
        <g strokeLinejoin="round">
          <polygon
            data-ink-role="primary"
            points={`0,${-r * 0.98} ${r * 0.92},${r * 0.74} ${-r * 0.92},${r * 0.74}`}
            fill="none"
            stroke={stroke}
            strokeWidth={sw}
          />
          <circle data-ink-role="fill-primary" cx={0} cy={r * 0.24} r={Math.max(1.3, sw * 0.88)} fill={stroke} stroke="none" />
        </g>
      );
    case '⧊': // Triangle with Dot Above
      return (
        <g strokeLinejoin="round">
          <circle data-ink-role="fill-primary" cx={0} cy={-r * 0.84} r={Math.max(1.25, sw * 0.85)} fill={stroke} stroke="none" />
          <polygon
            data-ink-role="primary"
            points={`0,${-r * 0.48} ${r * 0.86},${r * 0.86} ${-r * 0.86},${r * 0.86}`}
            fill="none"
            stroke={stroke}
            strokeWidth={sw}
          />
        </g>
      );
    case '⧋': // Triangle with Underbar
      return (
        <g fill="none" strokeLinejoin="round" strokeLinecap="round">
          <polygon
            data-ink-role="primary"
            points={`0,${-r * 0.92} ${r * 0.84},${r * 0.5} ${-r * 0.84},${r * 0.5}`}
            stroke={stroke}
            strokeWidth={sw}
          />
          <line data-ink-role="primary" x1={-r * 0.88} y1={r * 0.86} x2={r * 0.88} y2={r * 0.86} stroke={stroke} strokeWidth={sw} />
        </g>
      );

    // 4. Starbursts & Lotus Petals
    case '❂': // Circled Open Centre Eight-Pointed Star
      return (
        <g fill="none" strokeLinecap="round">
          <circle data-ink-role="primary" cx={0} cy={0} r={r} stroke={stroke} strokeWidth={sw * 0.9} />
          <circle data-ink-role="primary" cx={0} cy={0} r={r * 0.34} stroke={stroke} strokeWidth={sw * 0.8} />
          {Array.from({ length: 8 }, (_, idx) => {
            const rad = (idx * Math.PI) / 4;
            return (
              <line
                key={`c8-${idx}`}
                data-ink-role="primary"
                x1={Number((r * 0.34 * Math.cos(rad)).toFixed(2))}
                y1={Number((r * 0.34 * Math.sin(rad)).toFixed(2))}
                x2={Number((r * 0.96 * Math.cos(rad)).toFixed(2))}
                y2={Number((r * 0.96 * Math.sin(rad)).toFixed(2))}
                stroke={stroke}
                strokeWidth={sw * 0.85}
              />
            );
          })}
        </g>
      );
    case '✺': // Sixteen-Pointed Asterisk
      return (
        <g fill="none" strokeLinecap="round">
          {Array.from({ length: 16 }, (_, idx) => {
            const rad = (idx * Math.PI) / 8;
            const len = idx % 2 === 0 ? r * 0.98 : r * 0.78;
            return (
              <line
                key={`a16-${idx}`}
                data-ink-role="primary"
                x1={Number((r * 0.16 * Math.cos(rad)).toFixed(2))}
                y1={Number((r * 0.16 * Math.sin(rad)).toFixed(2))}
                x2={Number((len * Math.cos(rad)).toFixed(2))}
                y2={Number((len * Math.sin(rad)).toFixed(2))}
                stroke={stroke}
                strokeWidth={sw * 0.78}
              />
            );
          })}
        </g>
      );
    case '❈': // Heavy Sparkle
      return (
        <g fill="none" strokeLinecap="round">
          {Array.from({ length: 8 }, (_, idx) => {
            const rad = (idx * Math.PI) / 4;
            const outerR = idx % 2 === 0 ? r * 1.02 : r * 0.62;
            return (
              <line
                key={`sp-${idx}`}
                data-ink-role="primary"
                x1={0}
                y1={0}
                x2={Number((outerR * Math.cos(rad)).toFixed(2))}
                y2={Number((outerR * Math.sin(rad)).toFixed(2))}
                stroke={stroke}
                strokeWidth={idx % 2 === 0 ? sw * 1.05 : sw * 0.8}
              />
            );
          })}
          <circle data-ink-role="fill-primary" cx={0} cy={0} r={r * 0.2} fill={stroke} stroke="none" />
        </g>
      );
    case '❁': // Eight-Petalled Florette
      return (
        <g fill="none">
          {Array.from({ length: 8 }, (_, idx) => {
            const deg = idx * 45;
            return (
              <ellipse
                key={`fl-${idx}`}
                data-ink-role="primary"
                cx={0}
                cy={-r * 0.62}
                rx={r * 0.18}
                ry={r * 0.34}
                transform={`rotate(${deg})`}
                stroke={stroke}
                strokeWidth={sw * 0.8}
              />
            );
          })}
          <circle data-ink-role="primary" cx={0} cy={0} r={r * 0.24} fill="#FFFFFF" stroke={stroke} strokeWidth={sw * 0.85} />
        </g>
      );
    case '❃': // Heavy Teardrop-Spoked Pinwheel
      return (
        <g fill="none" strokeLinecap="round">
          {Array.from({ length: 8 }, (_, idx) => {
            const deg = idx * 45;
            return (
              <path
                key={`pw-${idx}`}
                data-ink-role="primary"
                d={`M 0 ${(-r * 0.18).toFixed(2)} Q ${(r * 0.32).toFixed(2)} ${(-r * 0.56).toFixed(2)} ${(r * 0.16).toFixed(2)} ${(-r * 0.94).toFixed(2)} Q ${(-r * 0.1).toFixed(2)} ${(-r * 0.68).toFixed(2)} 0 ${(-r * 0.18).toFixed(2)}`}
                transform={`rotate(${deg})`}
                stroke={stroke}
                strokeWidth={sw * 0.78}
              />
            );
          })}
          <circle data-ink-role="fill-primary" cx={0} cy={0} r={r * 0.16} fill={stroke} stroke="none" />
        </g>
      );

    // 5. Canadian Aboriginal Syllabics (Clean Triangles & Loops)
    case 'ᐃ':
      return <polygon data-ink-role="primary" points={`0,${-r * 0.9} ${r * 0.82},${r * 0.78} ${-r * 0.82},${r * 0.78}`} fill="none" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />;
    case 'ᐅ':
      return <polygon data-ink-role="primary" points={`${r * 0.86},0 ${-r * 0.78},${-r * 0.8} ${-r * 0.78},${r * 0.8}`} fill="none" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />;
    case 'ᐊ':
      return <polygon data-ink-role="primary" points={`${-r * 0.86},0 ${r * 0.78},${-r * 0.8} ${r * 0.78},${r * 0.8}`} fill="none" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />;
    case 'ᐁ':
      return <polygon data-ink-role="primary" points={`0,${r * 0.9} ${r * 0.82},${-r * 0.78} ${-r * 0.82},${-r * 0.78}`} fill="none" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />;
    case 'ᐱ':
      return <polyline data-ink-role="primary" points={`${-r * 0.76},${r * 0.68} 0,${-r * 0.76} ${r * 0.76},${r * 0.68}`} fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />;
    case 'ᐳ':
      return <polyline data-ink-role="primary" points={`${-r * 0.66},${-r * 0.76} ${r * 0.76},0 ${-r * 0.66},${r * 0.76}`} fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />;
    case 'ᐸ':
      return <polyline data-ink-role="primary" points={`${r * 0.66},${-r * 0.76} ${-r * 0.76},0 ${r * 0.66},${r * 0.76}`} fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />;
    case 'ᐯ':
      return <polyline data-ink-role="primary" points={`${-r * 0.76},${-r * 0.68} 0,${r * 0.76} ${r * 0.76},${-r * 0.68}`} fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />;
    case 'ᑎ':
      return <path data-ink-role="primary" d={`M ${-r * 0.66} ${r * 0.78} L ${-r * 0.66} ${-r * 0.1} A ${r * 0.66} ${r * 0.66} 0 0 1 ${r * 0.66} ${-r * 0.1} L ${r * 0.66} ${r * 0.78}`} fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />;
    case 'ᑐ':
      return <path data-ink-role="primary" d={`M ${-r * 0.76} ${-r * 0.66} L ${r * 0.1} ${-r * 0.66} A ${r * 0.66} ${r * 0.66} 0 0 1 ${r * 0.1} ${r * 0.66} L ${-r * 0.76} ${r * 0.66}`} fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />;
    case 'ᑕ':
      return <path data-ink-role="primary" d={`M ${r * 0.76} ${-r * 0.66} L ${-r * 0.1} ${-r * 0.66} A ${r * 0.66} ${r * 0.66} 0 0 0 ${-r * 0.1} ${r * 0.66} L ${r * 0.76} ${r * 0.66}`} fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />;
    case 'ᑌ':
      return <path data-ink-role="primary" d={`M ${-r * 0.66} ${-r * 0.78} L ${-r * 0.66} ${r * 0.1} A ${r * 0.66} ${r * 0.66} 0 0 0 ${r * 0.66} ${r * 0.1} L ${r * 0.66} ${-r * 0.78}`} fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />;
    case 'ᑭ':
      return <path data-ink-role="primary" d={`M ${-r * 0.48} ${r * 0.84} L ${-r * 0.48} ${-r * 0.82} L ${r * 0.06} ${-r * 0.82} A ${r * 0.48} ${r * 0.46} 0 0 1 ${r * 0.06} ${r * 0.08} L ${-r * 0.48} ${r * 0.08}`} fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />;
    case 'ᑯ':
      return <path data-ink-role="primary" d={`M ${r * 0.48} ${-r * 0.84} L ${r * 0.48} ${r * 0.82} L ${-r * 0.06} ${r * 0.82} A ${r * 0.48} ${r * 0.46} 0 0 1 ${-r * 0.06} ${-r * 0.08} L ${r * 0.48} ${-r * 0.08}`} fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />;
    case 'ᑲ':
      return <path data-ink-role="primary" d={`M ${-r * 0.48} ${-r * 0.84} L ${-r * 0.48} ${r * 0.82} L ${r * 0.06} ${r * 0.82} A ${r * 0.48} ${r * 0.46} 0 0 0 ${r * 0.06} ${-r * 0.08} L ${-r * 0.48} ${-r * 0.08}`} fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />;
    case 'ᑫ':
      return <path data-ink-role="primary" d={`M ${r * 0.48} ${r * 0.84} L ${r * 0.48} ${-r * 0.82} L ${-r * 0.06} ${-r * 0.82} A ${r * 0.48} ${r * 0.46} 0 0 0 ${-r * 0.06} ${r * 0.08} L ${r * 0.48} ${r * 0.08}`} fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />;
    case 'ᔅ':
      return <path data-ink-role="primary" d={`M ${r * 0.42} ${-r * 0.62} C ${-r * 0.56} ${-r * 0.72}, ${-r * 0.56} ${-r * 0.08}, 0 0 C ${r * 0.56} ${r * 0.08}, ${r * 0.56} ${r * 0.72}, ${-r * 0.42} ${r * 0.62}`} fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />;
    case 'ᔊ':
      return (
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path data-ink-role="primary" d={`M ${-r * 0.56} ${-r * 0.56} L ${r * 0.52} ${-r * 0.56} L ${-r * 0.52} ${r * 0.56} L ${r * 0.56} ${r * 0.56}`} stroke={stroke} strokeWidth={sw} />
          <circle data-ink-role="primary" cx={0} cy={0} r={r * 0.2} stroke={stroke} strokeWidth={sw * 0.85} />
        </g>
      );
    case 'ᔐ':
      return (
        <path
          data-ink-role="primary"
          d={`M ${-r * 0.54} ${-r * 0.78} Q 0 ${-r * 0.96} ${r * 0.48} ${-r * 0.48} C ${r * 0.6} ${-r * 0.02}, ${-r * 0.6} ${r * 0.02}, ${-r * 0.48} ${r * 0.48} Q 0 ${r * 0.96} ${r * 0.54} ${r * 0.78}`}
          fill="none"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
        />
      );

    // 6. Seal Operators
    case '⊕': // Circled Plus
      return (
        <g fill="none">
          <circle data-ink-role="primary" cx={0} cy={0} r={r} stroke={stroke} strokeWidth={sw} />
          <line data-ink-role="primary" x1={-r} y1={0} x2={r} y2={0} stroke={stroke} strokeWidth={sw * 0.9} />
          <line data-ink-role="primary" x1={0} y1={-r} x2={0} y2={r} stroke={stroke} strokeWidth={sw * 0.9} />
        </g>
      );
    case '⊗': // Circled Times
      return (
        <g fill="none">
          <circle data-ink-role="primary" cx={0} cy={0} r={r} stroke={stroke} strokeWidth={sw} />
          <line data-ink-role="primary" x1={-r * 0.707} y1={-r * 0.707} x2={r * 0.707} y2={r * 0.707} stroke={stroke} strokeWidth={sw * 0.9} />
          <line data-ink-role="primary" x1={r * 0.707} y1={-r * 0.707} x2={-r * 0.707} y2={r * 0.707} stroke={stroke} strokeWidth={sw * 0.9} />
        </g>
      );
    case '⊙': // Circled Dot
      return (
        <g>
          <circle data-ink-role="primary" cx={0} cy={0} r={r} fill="none" stroke={stroke} strokeWidth={sw} />
          <circle data-ink-role="fill-primary" cx={0} cy={0} r={Math.max(1.4, sw * 0.95)} fill={stroke} stroke="none" />
        </g>
      );
    case '⧖': // White Hourglass
      return (
        <polygon
          data-ink-role="primary"
          points={`${-r * 0.74},${-r * 0.88} ${r * 0.74},${-r * 0.88} 0,0 ${r * 0.74},${r * 0.88} ${-r * 0.74},${r * 0.88} 0,0`}
          fill="none"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      );
    case 'ⵐ': // Tifinagh Yagn (Vertical stave crossed by two horizontal bars)
      return (
        <g fill="none" strokeLinecap="round">
          <line data-ink-role="primary" x1={0} y1={-r * 0.96} x2={0} y2={r * 0.96} stroke={stroke} strokeWidth={sw} />
          <line data-ink-role="primary" x1={-r * 0.68} y1={-r * 0.34} x2={r * 0.68} y2={-r * 0.34} stroke={stroke} strokeWidth={sw} />
          <line data-ink-role="primary" x1={-r * 0.68} y1={r * 0.34} x2={r * 0.68} y2={r * 0.34} stroke={stroke} strokeWidth={sw} />
        </g>
      );
    case 'ⴲ': // Tifinagh Yabh (Circle enclosing inset cross)
      return (
        <g fill="none" strokeLinecap="round">
          <circle data-ink-role="primary" cx={0} cy={0} r={r} stroke={stroke} strokeWidth={sw} />
          <line data-ink-role="primary" x1={-r * 0.56} y1={0} x2={r * 0.56} y2={0} stroke={stroke} strokeWidth={sw * 0.9} />
          <line data-ink-role="primary" x1={0} y1={-r * 0.56} x2={0} y2={r * 0.56} stroke={stroke} strokeWidth={sw * 0.9} />
        </g>
      );
    case '⋈': // Bowtie
    default:
      return (
        <polygon
          data-ink-role="primary"
          points={`${-r * 0.88},${-r * 0.66} ${-r * 0.88},${r * 0.66} 0,0 ${r * 0.88},${r * 0.66} ${r * 0.88},${-r * 0.66} 0,0`}
          fill="none"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      );
  }
};
