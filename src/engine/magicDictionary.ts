/**
 * Deterministic Magic Classification & D&D 5e SRD Spellbook Dictionary.
 * Core 5e SRD spell names, levels, and schools follow the D&D 5.1 Systems Reference Document
 * (Wizards of the Coast, Creative Commons Attribution 4.0 International / CC-BY-4.0).
 */
import type {
  AlchemySymbolId,
  ElementType,
  MagicClassification,
  MagicDictionaryMode,
  MagicSchool,
  PlanetId,
  ResolvedDictionaryId,
  RunePaletteMode,
  SacredMotif,
} from '../types/sigil';

export interface SrdSpellEntry {
  name: string;
  school: MagicSchool;
  level: number; // 0 = cantrip .. 9 = 9th level
  element: ElementType;
  secondaryElement?: ElementType;
  ritual?: boolean;
  concentration?: boolean;
}

export const MAGIC_SCHOOL_LABELS: Record<MagicSchool, string> = {
  abjuration: 'Abjuration',
  conjuration: 'Conjuration',
  divination: 'Divination',
  enchantment: 'Enchantment',
  evocation: 'Evocation',
  illusion: 'Illusion',
  necromancy: 'Necromancy',
  transmutation: 'Transmutation',
};

export const DICTIONARY_LABELS: Record<MagicDictionaryMode, string> = {
  auto: 'Auto',
  srd: 'D&D 5e SRD',
  roots: 'Arcane Roots',
  phonetic: 'Phonetic',
};

export function getEffectiveDictionarySlug(
  mode: MagicDictionaryMode,
  classification: MagicClassification
): ResolvedDictionaryId {
  if (mode !== 'auto') return mode;
  return classification.dictionaryId;
}

const RAW_SRD_SPELLS: Array<
  [
    name: string,
    school: MagicSchool,
    level: number,
    element: ElementType,
    secondaryElement?: ElementType,
    flags?: 'r' | 'c' | 'rc'
  ]
> = [
  // Cantrips (0)
  ['Acid Splash', 'conjuration', 0, 'water', 'earth'],
  ['Chill Touch', 'necromancy', 0, 'water', 'earth'],
  ['Dancing Lights', 'evocation', 0, 'fire', 'air', 'c'],
  ['Druidcraft', 'transmutation', 0, 'earth', 'air'],
  ['Eldritch Blast', 'evocation', 0, 'fire', 'air'],
  ['Fire Bolt', 'evocation', 0, 'fire'],
  ['Guidance', 'divination', 0, 'air', 'earth', 'c'],
  ['Light', 'evocation', 0, 'fire', 'air'],
  ['Mage Hand', 'conjuration', 0, 'air'],
  ['Mending', 'transmutation', 0, 'earth', 'water'],
  ['Message', 'transmutation', 0, 'air'],
  ['Minor Illusion', 'illusion', 0, 'air', 'water'],
  ['Poison Spray', 'conjuration', 0, 'water', 'earth'],
  ['Prestidigitation', 'transmutation', 0, 'air', 'fire'],
  ['Produce Flame', 'conjuration', 0, 'fire'],
  ['Ray of Frost', 'evocation', 0, 'water'],
  ['Resistance', 'abjuration', 0, 'earth', 'fire', 'c'],
  ['Sacred Flame', 'evocation', 0, 'fire', 'air'],
  ['Shillelagh', 'transmutation', 0, 'earth'],
  ['Shocking Grasp', 'evocation', 0, 'air', 'fire'],
  ['Spare the Dying', 'necromancy', 0, 'water', 'earth'],
  ['Thaumaturgy', 'transmutation', 0, 'air', 'fire'],
  ['True Strike', 'divination', 0, 'air', 'fire', 'c'],
  ['Vicious Mockery', 'enchantment', 0, 'air'],

  // Level 1
  ['Alarm', 'abjuration', 1, 'earth', 'air', 'r'],
  ['Animal Friendship', 'enchantment', 1, 'earth', 'water'],
  ['Bane', 'enchantment', 1, 'water', 'earth', 'c'],
  ['Bless', 'enchantment', 1, 'fire', 'water', 'c'],
  ['Burning Hands', 'evocation', 1, 'fire'],
  ['Charm Person', 'enchantment', 1, 'air', 'water'],
  ['Color Spray', 'illusion', 1, 'fire', 'air'],
  ['Command', 'enchantment', 1, 'air', 'fire'],
  ['Comprehend Languages', 'divination', 1, 'air', 'water', 'r'],
  ['Create or Destroy Water', 'transmutation', 1, 'water'],
  ['Cure Wounds', 'evocation', 1, 'water', 'earth'],
  ['Detect Evil and Good', 'divination', 1, 'air', 'fire', 'c'],
  ['Detect Magic', 'divination', 1, 'air', 'water', 'rc'],
  ['Detect Poison and Disease', 'divination', 1, 'water', 'earth', 'rc'],
  ['Disguise Self', 'illusion', 1, 'water', 'air'],
  ['Divine Favor', 'evocation', 1, 'fire', 'air', 'c'],
  ['Entangle', 'conjuration', 1, 'earth', 'water', 'c'],
  ['Expeditious Retreat', 'transmutation', 1, 'air', 'fire', 'c'],
  ['Faerie Fire', 'evocation', 1, 'fire', 'air', 'c'],
  ['False Life', 'necromancy', 1, 'earth', 'water'],
  ['Feather Fall', 'transmutation', 1, 'air'],
  ['Find Familiar', 'conjuration', 1, 'air', 'earth', 'r'],
  ['Floating Disk', 'conjuration', 1, 'earth', 'air', 'r'],
  ['Fog Cloud', 'conjuration', 1, 'water', 'air', 'c'],
  ['Goodberry', 'transmutation', 1, 'earth', 'water'],
  ['Grease', 'conjuration', 1, 'earth', 'water'],
  ['Guiding Bolt', 'evocation', 1, 'fire', 'air'],
  ['Healing Word', 'evocation', 1, 'water', 'air'],
  ['Hellish Rebuke', 'evocation', 1, 'fire'],
  ['Heroism', 'enchantment', 1, 'fire', 'earth', 'c'],
  ['Hideous Laughter', 'enchantment', 1, 'air', undefined, 'c'],
  ['Hunter\'s Mark', 'divination', 1, 'air', 'earth', 'c'],
  ['Identify', 'divination', 1, 'water', 'air', 'r'],
  ['Illusory Script', 'illusion', 1, 'air', 'water', 'r'],
  ['Inflict Wounds', 'necromancy', 1, 'earth', 'fire'],
  ['Jump', 'transmutation', 1, 'air', 'earth'],
  ['Longstrider', 'transmutation', 1, 'earth', 'air'],
  ['Mage Armor', 'abjuration', 1, 'earth', 'air'],
  ['Magic Missile', 'evocation', 1, 'fire', 'air'],
  ['Protection from Evil and Good', 'abjuration', 1, 'earth', 'fire', 'c'],
  ['Purify Food and Drink', 'transmutation', 1, 'water', 'earth', 'r'],
  ['Sanctuary', 'abjuration', 1, 'earth', 'water'],
  ['Shield', 'abjuration', 1, 'earth', 'air'],
  ['Shield of Faith', 'abjuration', 1, 'fire', 'earth', 'c'],
  ['Silent Image', 'illusion', 1, 'air', 'water', 'c'],
  ['Sleep', 'enchantment', 1, 'water', 'air'],
  ['Speak with Animals', 'divination', 1, 'earth', 'air', 'r'],
  ['Thunderwave', 'evocation', 1, 'air', 'earth'],
  ['Unseen Servant', 'conjuration', 1, 'air', undefined, 'r'],

  // Level 2
  ['Acid Arrow', 'evocation', 2, 'water', 'earth'],
  ['Aid', 'abjuration', 2, 'earth', 'fire'],
  ['Alter Self', 'transmutation', 2, 'water', 'earth', 'c'],
  ['Arcane Lock', 'abjuration', 2, 'earth'],
  ['Augury', 'divination', 2, 'air', 'water', 'r'],
  ['Barkskin', 'transmutation', 2, 'earth', undefined, 'c'],
  ['Blindness/Deafness', 'necromancy', 2, 'earth', 'water'],
  ['Blur', 'illusion', 2, 'air', 'water', 'c'],
  ['Calm Emotions', 'enchantment', 2, 'water', 'air', 'c'],
  ['Continual Flame', 'evocation', 2, 'fire'],
  ['Darkness', 'evocation', 2, 'earth', 'water', 'c'],
  ['Darkvision', 'transmutation', 2, 'air', 'earth'],
  ['Detect Thoughts', 'divination', 2, 'air', 'water', 'c'],
  ['Enhance Ability', 'transmutation', 2, 'earth', 'fire', 'c'],
  ['Enlarge/Reduce', 'transmutation', 2, 'earth', 'air', 'c'],
  ['Enthrall', 'enchantment', 2, 'air'],
  ['Find Steed', 'conjuration', 2, 'earth', 'air'],
  ['Find Traps', 'divination', 2, 'earth', 'air'],
  ['Flame Blade', 'evocation', 2, 'fire', undefined, 'c'],
  ['Flaming Sphere', 'conjuration', 2, 'fire', 'earth', 'c'],
  ['Gentle Repose', 'necromancy', 2, 'earth', 'water', 'r'],
  ['Gust of Wind', 'evocation', 2, 'air', undefined, 'c'],
  ['Heat Metal', 'transmutation', 2, 'fire', 'earth', 'c'],
  ['Hold Person', 'enchantment', 2, 'earth', 'air', 'c'],
  ['Invisibility', 'illusion', 2, 'air', 'water', 'c'],
  ['Knock', 'transmutation', 2, 'air', 'earth'],
  ['Lesser Restoration', 'abjuration', 2, 'water', 'earth'],
  ['Levitate', 'transmutation', 2, 'air', undefined, 'c'],
  ['Locate Object', 'divination', 2, 'earth', 'air', 'c'],
  ['Magic Mouth', 'illusion', 2, 'air', undefined, 'r'],
  ['Magic Weapon', 'transmutation', 2, 'earth', 'fire', 'c'],
  ['Mirror Image', 'illusion', 2, 'water', 'air'],
  ['Misty Step', 'conjuration', 2, 'air', 'water'],
  ['Moonbeam', 'evocation', 2, 'water', 'fire', 'c'],
  ['Pass without Trace', 'abjuration', 2, 'earth', 'air', 'c'],
  ['Prayer of Healing', 'evocation', 2, 'water', 'fire'],
  ['Protection from Poison', 'abjuration', 2, 'water', 'earth'],
  ['Ray of Enfeeblement', 'necromancy', 2, 'earth', 'water', 'c'],
  ['Rope Trick', 'transmutation', 2, 'air', 'earth'],
  ['Scorching Ray', 'evocation', 2, 'fire'],
  ['See Invisibility', 'divination', 2, 'air', 'fire'],
  ['Shatter', 'evocation', 2, 'air', 'earth'],
  ['Silence', 'illusion', 2, 'air', 'earth', 'rc'],
  ['Spider Climb', 'transmutation', 2, 'earth', undefined, 'c'],
  ['Spike Growth', 'transmutation', 2, 'earth', undefined, 'c'],
  ['Spiritual Weapon', 'evocation', 2, 'fire', 'earth'],
  ['Suggestion', 'enchantment', 2, 'air', undefined, 'c'],
  ['Warding Bond', 'abjuration', 2, 'earth', 'water'],
  ['Web', 'conjuration', 2, 'earth', 'air', 'c'],
  ['Zone of Truth', 'enchantment', 2, 'fire', 'air'],

  // Level 3
  ['Animate Dead', 'necromancy', 3, 'earth'],
  ['Beacon of Hope', 'abjuration', 3, 'fire', 'water', 'c'],
  ['Bestow Curse', 'necromancy', 3, 'earth', 'water', 'c'],
  ['Blink', 'transmutation', 3, 'air'],
  ['Call Lightning', 'conjuration', 3, 'air', 'fire', 'c'],
  ['Clairvoyance', 'divination', 3, 'air', 'water', 'c'],
  ['Conjure Animals', 'conjuration', 3, 'earth', 'air', 'c'],
  ['Counterspell', 'abjuration', 3, 'air', 'earth'],
  ['Create Food and Water', 'conjuration', 3, 'water', 'earth'],
  ['Daylight', 'evocation', 3, 'fire', 'air'],
  ['Dispel Magic', 'abjuration', 3, 'air', 'water'],
  ['Fear', 'illusion', 3, 'air', 'earth', 'c'],
  ['Fireball', 'evocation', 3, 'fire'],
  ['Fly', 'transmutation', 3, 'air', undefined, 'c'],
  ['Gaseous Form', 'transmutation', 3, 'air', 'water', 'c'],
  ['Glyph of Warding', 'abjuration', 3, 'earth', 'fire'],
  ['Haste', 'transmutation', 3, 'air', 'fire', 'c'],
  ['Hypnotic Pattern', 'illusion', 3, 'air', 'fire', 'c'],
  ['Lightning Bolt', 'evocation', 3, 'air', 'fire'],
  ['Magic Circle', 'abjuration', 3, 'earth', 'air'],
  ['Major Image', 'illusion', 3, 'air', 'water', 'c'],
  ['Mass Healing Word', 'evocation', 3, 'water', 'fire'],
  ['Meld into Stone', 'transmutation', 3, 'earth', undefined, 'r'],
  ['Nondetection', 'abjuration', 3, 'water', 'air'],
  ['Phantom Steed', 'illusion', 3, 'air', 'earth', 'r'],
  ['Protection from Energy', 'abjuration', 3, 'earth', 'water', 'c'],
  ['Remove Curse', 'abjuration', 3, 'water', 'fire'],
  ['Revivify', 'necromancy', 3, 'fire', 'water'],
  ['Sending', 'evocation', 3, 'air'],
  ['Sleet Storm', 'conjuration', 3, 'water', 'air', 'c'],
  ['Slow', 'transmutation', 3, 'earth', 'water', 'c'],
  ['Speak with Dead', 'necromancy', 3, 'earth', 'air'],
  ['Spirit Guardians', 'conjuration', 3, 'fire', 'air', 'c'],
  ['Stinking Cloud', 'conjuration', 3, 'air', 'earth', 'c'],
  ['Tongues', 'divination', 3, 'air'],
  ['Vampiric Touch', 'necromancy', 3, 'water', 'earth', 'c'],
  ['Water Breathing', 'transmutation', 3, 'water', 'air', 'r'],
  ['Water Walk', 'transmutation', 3, 'water', 'earth', 'r'],
  ['Wind Wall', 'evocation', 3, 'air', undefined, 'c'],

  // Level 4
  ['Arcane Eye', 'divination', 4, 'air', undefined, 'c'],
  ['Banishment', 'abjuration', 4, 'air', 'earth', 'c'],
  ['Black Tentacles', 'conjuration', 4, 'water', 'earth', 'c'],
  ['Blight', 'necromancy', 4, 'earth', 'water'],
  ['Confusion', 'enchantment', 4, 'air', 'water', 'c'],
  ['Conjure Minor Elementals', 'conjuration', 4, 'earth', 'fire', 'c'],
  ['Control Water', 'transmutation', 4, 'water', undefined, 'c'],
  ['Death Ward', 'abjuration', 4, 'earth', 'fire'],
  ['Dimension Door', 'conjuration', 4, 'air'],
  ['Divination', 'divination', 4, 'air', 'fire', 'r'],
  ['Dominate Beast', 'enchantment', 4, 'earth', 'air', 'c'],
  ['Fabricate', 'transmutation', 4, 'earth'],
  ['Fire Shield', 'evocation', 4, 'fire', 'water'],
  ['Freedom of Movement', 'abjuration', 4, 'air', 'water'],
  ['Greater Invisibility', 'illusion', 4, 'air', 'water', 'c'],
  ['Hallucinatory Terrain', 'illusion', 4, 'earth', 'water'],
  ['Ice Storm', 'evocation', 4, 'water', 'air'],
  ['Locate Creature', 'divination', 4, 'air', 'earth', 'c'],
  ['Phantasmal Killer', 'illusion', 4, 'air', 'water', 'c'],
  ['Polymorph', 'transmutation', 4, 'water', 'earth', 'c'],
  ['Private Sanctum', 'abjuration', 4, 'earth'],
  ['Stone Shape', 'transmutation', 4, 'earth'],
  ['Stoneskin', 'abjuration', 4, 'earth', undefined, 'c'],
  ['Wall of Fire', 'evocation', 4, 'fire', undefined, 'c'],

  // Level 5
  ['Animate Objects', 'transmutation', 5, 'earth', 'air', 'c'],
  ['Antilife Shell', 'abjuration', 5, 'earth', 'water', 'c'],
  ['Arcane Hand', 'evocation', 5, 'earth', 'fire', 'c'],
  ['Awaken', 'transmutation', 5, 'earth', 'water'],
  ['Cloudkill', 'conjuration', 5, 'air', 'water', 'c'],
  ['Commune', 'divination', 5, 'air', 'fire', 'r'],
  ['Cone of Cold', 'evocation', 5, 'water', 'air'],
  ['Conjure Elemental', 'conjuration', 5, 'fire', 'earth', 'c'],
  ['Contact Other Plane', 'divination', 5, 'air', undefined, 'r'],
  ['Contagion', 'necromancy', 5, 'water', 'earth'],
  ['Creation', 'illusion', 5, 'earth', 'air'],
  ['Dispel Evil and Good', 'abjuration', 5, 'fire', 'earth', 'c'],
  ['Dominate Person', 'enchantment', 5, 'air', 'fire', 'c'],
  ['Dream', 'illusion', 5, 'water', 'air'],
  ['Flame Strike', 'evocation', 5, 'fire'],
  ['Geas', 'enchantment', 5, 'earth', 'fire'],
  ['Greater Restoration', 'abjuration', 5, 'water', 'earth'],
  ['Hallow', 'evocation', 5, 'fire', 'earth'],
  ['Hold Monster', 'enchantment', 5, 'earth', 'air', 'c'],
  ['Legend Lore', 'divination', 5, 'air', 'earth'],
  ['Mass Cure Wounds', 'evocation', 5, 'water', 'fire'],
  ['Mislead', 'illusion', 5, 'air', undefined, 'c'],
  ['Modify Memory', 'enchantment', 5, 'water', 'air', 'c'],
  ['Passwall', 'transmutation', 5, 'earth'],
  ['Planar Binding', 'abjuration', 5, 'earth', 'fire'],
  ['Raise Dead', 'necromancy', 5, 'water', 'fire'],
  ['Reincarnate', 'transmutation', 5, 'earth', 'water'],
  ['Scrying', 'divination', 5, 'water', 'air', 'c'],
  ['Telekinesis', 'transmutation', 5, 'air', 'earth', 'c'],
  ['Teleportation Circle', 'conjuration', 5, 'air', 'earth'],
  ['Tree Stride', 'conjuration', 5, 'earth', 'air', 'c'],
  ['Wall of Force', 'evocation', 5, 'air', 'earth', 'c'],
  ['Wall of Stone', 'evocation', 5, 'earth', undefined, 'c'],

  // Level 6
  ['Blade Barrier', 'evocation', 6, 'earth', 'air', 'c'],
  ['Chain Lightning', 'evocation', 6, 'air', 'fire'],
  ['Circle of Death', 'necromancy', 6, 'earth', 'water'],
  ['Conjure Fey', 'conjuration', 6, 'earth', 'air', 'c'],
  ['Contingency', 'evocation', 6, 'air', 'earth'],
  ['Disintegrate', 'transmutation', 6, 'fire', 'earth'],
  ['Eyebite', 'necromancy', 6, 'water', 'earth', 'c'],
  ['Find the Path', 'divination', 6, 'air', 'earth', 'c'],
  ['Flesh to Stone', 'transmutation', 6, 'earth', undefined, 'c'],
  ['Forbiddance', 'abjuration', 6, 'earth', 'fire', 'r'],
  ['Globe of Invulnerability', 'abjuration', 6, 'earth', 'air', 'c'],
  ['Harm', 'necromancy', 6, 'water', 'earth'],
  ['Heal', 'evocation', 6, 'water', 'fire'],
  ['Heroes\' Feast', 'conjuration', 6, 'earth', 'water'],
  ['Mass Suggestion', 'enchantment', 6, 'air'],
  ['Move Earth', 'transmutation', 6, 'earth', undefined, 'c'],
  ['Planar Ally', 'conjuration', 6, 'fire', 'air'],
  ['Sunbeam', 'evocation', 6, 'fire', 'air', 'c'],
  ['Transport via Plants', 'conjuration', 6, 'earth', 'water'],
  ['True Seeing', 'divination', 6, 'fire', 'air'],
  ['Wall of Ice', 'evocation', 6, 'water', 'earth', 'c'],
  ['Wall of Thorns', 'conjuration', 6, 'earth', undefined, 'c'],
  ['Wind Walk', 'transmutation', 6, 'air', undefined, 'c'],
  ['Word of Recall', 'conjuration', 6, 'air', 'fire'],

  // Level 7
  ['Arcane Sword', 'evocation', 7, 'fire', 'earth', 'c'],
  ['Conjure Celestial', 'conjuration', 7, 'fire', 'air', 'c'],
  ['Delayed Blast Fireball', 'evocation', 7, 'fire', undefined, 'c'],
  ['Divine Word', 'evocation', 7, 'fire', 'air'],
  ['Etherealness', 'transmutation', 7, 'air', 'water'],
  ['Finger of Death', 'necromancy', 7, 'earth', 'water'],
  ['Fire Storm', 'evocation', 7, 'fire', 'air'],
  ['Forcecage', 'evocation', 7, 'earth', 'air'],
  ['Mirage Arcane', 'illusion', 7, 'earth', 'water'],
  ['Plane Shift', 'conjuration', 7, 'air', 'fire'],
  ['Prismatic Spray', 'evocation', 7, 'fire', 'air'],
  ['Project Image', 'illusion', 7, 'air', 'water', 'c'],
  ['Regenerate', 'transmutation', 7, 'water', 'earth'],
  ['Resurrection', 'necromancy', 7, 'fire', 'water'],
  ['Reverse Gravity', 'transmutation', 7, 'air', 'earth', 'c'],
  ['Sequester', 'transmutation', 7, 'earth', 'water'],
  ['Simulacrum', 'illusion', 7, 'water', 'earth'],
  ['Symbol', 'abjuration', 7, 'earth', 'fire'],
  ['Teleport', 'conjuration', 7, 'air'],

  // Level 8
  ['Antimagic Field', 'abjuration', 8, 'earth', 'air', 'c'],
  ['Antipathy/Sympathy', 'enchantment', 8, 'air', 'water'],
  ['Clone', 'necromancy', 8, 'water', 'earth'],
  ['Control Weather', 'transmutation', 8, 'air', 'water', 'c'],
  ['Demiplane', 'conjuration', 8, 'earth', 'air'],
  ['Dominate Monster', 'enchantment', 8, 'fire', 'air', 'c'],
  ['Earthquake', 'evocation', 8, 'earth', undefined, 'c'],
  ['Feeblemind', 'enchantment', 8, 'water', 'air'],
  ['Holy Aura', 'abjuration', 8, 'fire', 'air', 'c'],
  ['Incendiary Cloud', 'conjuration', 8, 'fire', 'air', 'c'],
  ['Maze', 'conjuration', 8, 'earth', 'air', 'c'],
  ['Mind Blank', 'abjuration', 8, 'air', 'earth'],
  ['Power Word Stun', 'enchantment', 8, 'air', 'fire'],
  ['Sunburst', 'evocation', 8, 'fire', 'air'],

  // Level 9
  ['Astral Projection', 'necromancy', 9, 'air', 'water'],
  ['Foresight', 'divination', 9, 'air', 'fire'],
  ['Gate', 'conjuration', 9, 'air', 'fire', 'c'],
  ['Imprisonment', 'abjuration', 9, 'earth', 'water'],
  ['Mass Heal', 'evocation', 9, 'water', 'fire'],
  ['Meteor Swarm', 'evocation', 9, 'fire', 'earth'],
  ['Power Word Kill', 'enchantment', 9, 'earth', 'fire'],
  ['Prismatic Wall', 'abjuration', 9, 'fire', 'air'],
  ['Shapechange', 'transmutation', 9, 'water', 'earth', 'c'],
  ['Storm of Vengeance', 'conjuration', 9, 'air', 'water', 'c'],
  ['Time Stop', 'transmutation', 9, 'air', 'earth'],
  ['True Polymorph', 'transmutation', 9, 'water', 'earth', 'c'],
  ['True Resurrection', 'necromancy', 9, 'fire', 'water'],
  ['Weird', 'illusion', 9, 'air', 'water', 'c'],
  ['Wish', 'conjuration', 9, 'fire', 'air'],
];

function normalizeSpellLookupKey(text: string): string {
  return text
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export const SRD_SPELLS: SrdSpellEntry[] = RAW_SRD_SPELLS.map(
  ([name, school, level, element, secondaryElement, flags]) => ({
    name,
    school,
    level,
    element,
    secondaryElement,
    ritual: flags ? flags.includes('r') : false,
    concentration: flags ? flags.includes('c') : false,
  })
);

const SRD_BY_KEY = new Map<string, SrdSpellEntry>();
const SRD_SORTED_BY_LENGTH: Array<{ key: string; entry: SrdSpellEntry }> = [];

for (const spell of SRD_SPELLS) {
  const key = normalizeSpellLookupKey(spell.name);
  SRD_BY_KEY.set(key, spell);
  SRD_SORTED_BY_LENGTH.push({ key, entry: spell });
}
SRD_SORTED_BY_LENGTH.sort((a, b) => b.key.length - a.key.length);

interface MorphemeRule {
  stem: string;
  exactWordOnly?: boolean;
  element?: ElementType;
  school?: MagicSchool;
  weight?: number;
}

const NEGATION_WORDS = new Set([
  'extinguish',
  'quench',
  'douse',
  'dampen',
  'banish',
  'dispel',
  'counter',
  'anti',
  'antimagic',
  'nullify',
  'suppress',
]);

const MORPHEME_RULES: MorphemeRule[] = [
  // Fire & Solar
  { stem: 'ignis', element: 'fire', school: 'evocation', weight: 3 },
  { stem: 'ignit', element: 'fire', school: 'evocation', weight: 3 },
  { stem: 'pyro', element: 'fire', school: 'evocation', weight: 3 },
  { stem: 'fire', element: 'fire', school: 'evocation', weight: 3 },
  { stem: 'flame', element: 'fire', school: 'evocation', weight: 3 },
  { stem: 'ember', element: 'fire', school: 'evocation', weight: 2 },
  { stem: 'inferno', element: 'fire', school: 'evocation', weight: 3 },
  { stem: 'blaze', element: 'fire', school: 'evocation', weight: 2 },
  { stem: 'scorch', element: 'fire', school: 'evocation', weight: 2 },
  { stem: 'cinder', element: 'fire', weight: 2 },
  { stem: 'ash', exactWordOnly: true, element: 'fire', weight: 2 },
  { stem: 'ashes', exactWordOnly: true, element: 'fire', weight: 2 },
  { stem: 'magma', element: 'fire', school: 'evocation', weight: 3 },
  { stem: 'lava', element: 'fire', school: 'evocation', weight: 3 },
  { stem: 'solar', element: 'fire', school: 'evocation', weight: 2 },
  { stem: 'helios', element: 'fire', weight: 2 },
  { stem: 'sun', exactWordOnly: true, element: 'fire', weight: 2 },
  { stem: 'burn', element: 'fire', school: 'evocation', weight: 2 },
  { stem: 'flare', element: 'fire', school: 'evocation', weight: 2 },
  { stem: 'radiant', element: 'fire', school: 'evocation', weight: 2 },
  { stem: 'aurel', element: 'fire', weight: 2 },
  { stem: 'aurum', element: 'fire', school: 'transmutation', weight: 2 },
  { stem: 'phoenix', element: 'fire', school: 'conjuration', weight: 3 },
  { stem: 'sol', exactWordOnly: true, element: 'fire', weight: 2 },
  { stem: 'lux', exactWordOnly: true, element: 'fire', school: 'evocation', weight: 2 },

  // Water, Frost, Ice, Healing
  { stem: 'aqua', element: 'water', weight: 3 },
  { stem: 'hydro', element: 'water', weight: 3 },
  { stem: 'water', element: 'water', weight: 3 },
  { stem: 'frost', element: 'water', school: 'evocation', weight: 3 },
  { stem: 'cryo', element: 'water', school: 'evocation', weight: 3 },
  { stem: 'glaci', element: 'water', school: 'evocation', weight: 3 },
  { stem: 'ice', exactWordOnly: true, element: 'water', school: 'evocation', weight: 3 },
  { stem: 'snow', element: 'water', weight: 2 },
  { stem: 'tide', element: 'water', weight: 2 },
  { stem: 'ocean', element: 'water', weight: 3 },
  { stem: 'marine', element: 'water', weight: 2 },
  { stem: 'mare', exactWordOnly: true, element: 'water', weight: 2 },
  { stem: 'rain', element: 'water', weight: 2 },
  { stem: 'mist', element: 'water', school: 'conjuration', weight: 2 },
  { stem: 'wave', element: 'water', weight: 2 },
  { stem: 'river', element: 'water', weight: 2 },
  { stem: 'flood', element: 'water', weight: 2 },
  { stem: 'luna', element: 'water', school: 'divination', weight: 2 },
  { stem: 'moon', element: 'water', school: 'divination', weight: 2 },
  { stem: 'acid', element: 'water', school: 'conjuration', weight: 2 },
  { stem: 'venom', element: 'water', school: 'necromancy', weight: 2 },
  { stem: 'poison', element: 'water', school: 'conjuration', weight: 2 },

  // Air, Wind, Storm, Astral, Lightning
  { stem: 'aero', element: 'air', weight: 3 },
  { stem: 'air', exactWordOnly: true, element: 'air', weight: 3 },
  { stem: 'wind', element: 'air', weight: 3 },
  { stem: 'gale', element: 'air', school: 'evocation', weight: 3 },
  { stem: 'zephyr', element: 'air', weight: 3 },
  { stem: 'storm', element: 'air', school: 'evocation', weight: 3 },
  { stem: 'tempest', element: 'air', school: 'evocation', weight: 3 },
  { stem: 'thunder', element: 'air', school: 'evocation', weight: 3 },
  { stem: 'lightning', element: 'air', school: 'evocation', weight: 3 },
  { stem: 'volt', element: 'air', school: 'evocation', weight: 2 },
  { stem: 'storm', element: 'air', weight: 2 },
  { stem: 'sky', exactWordOnly: true, element: 'air', weight: 2 },
  { stem: 'cloud', element: 'air', weight: 2 },
  { stem: 'breeze', element: 'air', weight: 2 },
  { stem: 'vent', exactWordOnly: true, element: 'air', weight: 2 },
  { stem: 'ventus', element: 'air', weight: 3 },
  { stem: 'aether', element: 'air', school: 'conjuration', weight: 2 },
  { stem: 'ether', element: 'air', school: 'conjuration', weight: 2 },
  { stem: 'astra', element: 'air', school: 'conjuration', weight: 2 },
  { stem: 'star', element: 'air', school: 'conjuration', weight: 2 },
  { stem: 'void', element: 'air', school: 'conjuration', weight: 2 },

  // Earth, Stone, Iron, Nature
  { stem: 'terra', element: 'earth', school: 'transmutation', weight: 3 },
  { stem: 'earth', element: 'earth', school: 'transmutation', weight: 3 },
  { stem: 'geo', element: 'earth', school: 'transmutation', weight: 3 },
  { stem: 'stone', element: 'earth', weight: 3 },
  { stem: 'rock', element: 'earth', weight: 3 },
  { stem: 'lith', element: 'earth', weight: 2 },
  { stem: 'iron', element: 'earth', school: 'abjuration', weight: 2 },
  { stem: 'steel', element: 'earth', school: 'abjuration', weight: 2 },
  { stem: 'sand', element: 'earth', weight: 2 },
  { stem: 'quake', element: 'earth', school: 'evocation', weight: 3 },
  { stem: 'granite', element: 'earth', weight: 3 },
  { stem: 'crystal', element: 'earth', weight: 2 },
  { stem: 'obsidian', element: 'earth', weight: 2 },
  { stem: 'mountain', element: 'earth', weight: 2 },
  { stem: 'thorn', element: 'earth', school: 'conjuration', weight: 2 },
  { stem: 'sylva', element: 'earth', school: 'transmutation', weight: 2 },
  { stem: 'root', exactWordOnly: true, element: 'earth', weight: 2 },
  { stem: 'oak', exactWordOnly: true, element: 'earth', weight: 2 },

  // Schools & Arcane Intents
  { stem: 'ward', school: 'abjuration', weight: 3 },
  { stem: 'shield', school: 'abjuration', weight: 3 },
  { stem: 'aegis', school: 'abjuration', weight: 3 },
  { stem: 'guard', school: 'abjuration', weight: 3 },
  { stem: 'protect', school: 'abjuration', weight: 3 },
  { stem: 'sanctu', school: 'abjuration', weight: 3 },
  { stem: 'barrier', school: 'abjuration', weight: 3 },
  { stem: 'bastion', school: 'abjuration', weight: 3 },
  { stem: 'counter', school: 'abjuration', weight: 2 },
  { stem: 'dispel', school: 'abjuration', weight: 3 },
  { stem: 'banish', school: 'abjuration', weight: 3 },
  { stem: 'shelter', school: 'abjuration', weight: 2 },

  { stem: 'summon', school: 'conjuration', weight: 3 },
  { stem: 'conjur', school: 'conjuration', weight: 3 },
  { stem: 'portal', school: 'conjuration', weight: 3 },
  { stem: 'gate', exactWordOnly: true, school: 'conjuration', weight: 3 },
  { stem: 'teleport', school: 'conjuration', weight: 3 },
  { stem: 'rift', exactWordOnly: true, school: 'conjuration', weight: 2 },
  { stem: 'step', exactWordOnly: true, school: 'conjuration', weight: 1 },

  { stem: 'scry', school: 'divination', weight: 3 },
  { stem: 'divin', school: 'divination', weight: 2 },
  { stem: 'oracle', school: 'divination', weight: 3 },
  { stem: 'sight', school: 'divination', weight: 2 },
  { stem: 'vision', school: 'divination', weight: 2 },
  { stem: 'prophe', school: 'divination', weight: 3 },
  { stem: 'chron', school: 'divination', weight: 2 },
  { stem: 'meridian', school: 'divination', weight: 2 },
  { stem: 'truth', school: 'divination', weight: 2 },

  { stem: 'bind', school: 'enchantment', weight: 3 },
  { stem: 'charm', school: 'enchantment', weight: 3 },
  { stem: 'seal', exactWordOnly: true, school: 'enchantment', weight: 2 },
  { stem: 'chain', school: 'enchantment', weight: 2 },
  { stem: 'fetter', school: 'enchantment', weight: 2 },
  { stem: 'oath', exactWordOnly: true, school: 'enchantment', weight: 2 },
  { stem: 'command', school: 'enchantment', weight: 2 },
  { stem: 'sleep', school: 'enchantment', weight: 2 },

  { stem: 'blast', school: 'evocation', weight: 3 },
  { stem: 'bolt', exactWordOnly: true, school: 'evocation', weight: 2 },
  { stem: 'strike', school: 'evocation', weight: 2 },
  { stem: 'smite', school: 'evocation', weight: 3 },
  { stem: 'nova', exactWordOnly: true, school: 'evocation', weight: 2 },
  { stem: 'wrath', school: 'evocation', weight: 2 },
  { stem: 'lance', school: 'evocation', weight: 2 },

  { stem: 'illus', school: 'illusion', weight: 3 },
  { stem: 'phantom', school: 'illusion', weight: 3 },
  { stem: 'mirage', school: 'illusion', weight: 3 },
  { stem: 'shadow', school: 'illusion', weight: 2 },
  { stem: 'umbra', school: 'illusion', weight: 2 },
  { stem: 'veil', school: 'illusion', weight: 2 },
  { stem: 'mirror', school: 'illusion', weight: 2 },

  { stem: 'necro', school: 'necromancy', weight: 3 },
  { stem: 'death', school: 'necromancy', weight: 3 },
  { stem: 'mort', school: 'necromancy', weight: 2 },
  { stem: 'grave', school: 'necromancy', weight: 2 },
  { stem: 'soul', school: 'necromancy', weight: 2 },
  { stem: 'spirit', school: 'necromancy', weight: 2 },
  { stem: 'skull', school: 'necromancy', weight: 2 },
  { stem: 'undeath', school: 'necromancy', weight: 3 },

  { stem: 'transmut', school: 'transmutation', weight: 3 },
  { stem: 'morph', school: 'transmutation', weight: 3 },
  { stem: 'mend', exactWordOnly: true, school: 'transmutation', weight: 2 },
  { stem: 'heal', element: 'water', school: 'transmutation', weight: 2 },
  { stem: 'cure', element: 'water', school: 'transmutation', weight: 2 },
  { stem: 'vital', element: 'water', school: 'transmutation', weight: 2 },
  { stem: 'vita', element: 'water', school: 'transmutation', weight: 2 },
  { stem: 'bloom', element: 'earth', school: 'transmutation', weight: 2 },
  { stem: 'time', exactWordOnly: true, school: 'transmutation', weight: 2 },
];

export interface DomainRuleProfile {
  allowedMotifs: SacredMotif[];
  allowedSides: number[];
  alchemyPool: AlchemySymbolId[];
  planetPool: PlanetId[];
  runePalettePool: RunePaletteMode[];
  preferStar: boolean;
  preferShatkona: boolean;
  preferDoubleRing?: boolean;
  preferInscribedCircle?: boolean;
  preferFlowerOfLife?: boolean;
  minStationCount?: 4 | 6 | 8 | 12 | 24;
}

const ELEMENT_ALCHEMY_POOL: Record<ElementType, AlchemySymbolId[]> = {
  fire: ['sulfur', 'gold', 'iron', 'crucible'],
  water: ['mercury', 'silver', 'salt', 'crucible'],
  air: ['mercury', 'tin', 'crucible', 'silver'],
  earth: ['salt', 'lead', 'copper', 'iron'],
};

const ELEMENT_PLANET_POOL: Record<ElementType, PlanetId[]> = {
  fire: ['sun', 'mars', 'jupiter', 'mercury'],
  water: ['moon', 'neptune', 'venus', 'saturn'],
  air: ['mercury', 'uranus', 'jupiter', 'sun'],
  earth: ['saturn', 'venus', 'mars', 'moon'],
};

export function buildDomainRuleProfile(classification: MagicClassification): DomainRuleProfile {
  const el = classification.primaryElement;
  const school = classification.school;
  const spellLevel = classification.spellLevel ?? 0;

  let allowedMotifs: SacredMotif[] = [
    'eldritch-mandala',
    'sri-yantra',
    'sacred-rosette',
    'astral-compass',
  ];
  let allowedSides: number[] = [3, 5, 6, 7, 8, 9, 10, 11, 12];
  let runePalettePool: RunePaletteMode[] = ['auto'];
  let preferStar = false;
  let preferShatkona = false;
  let preferDoubleRing: boolean | undefined;
  let preferInscribedCircle: boolean | undefined;
  let preferFlowerOfLife: boolean | undefined;

  switch (school) {
    case 'abjuration':
      allowedMotifs = ['sri-yantra', 'sacred-rosette'];
      allowedSides = [6, 8, 9, 10, 12];
      runePalettePool = ['auto', 'warding'];
      preferShatkona = true;
      preferDoubleRing = true;
      break;
    case 'evocation':
      allowedMotifs = ['eldritch-mandala', 'astral-compass'];
      allowedSides = [3, 5, 7, 9, 11];
      runePalettePool = ['auto', 'starbursts-syllabics'];
      preferStar = true;
      break;
    case 'conjuration':
      allowedMotifs = ['astral-compass', 'eldritch-mandala'];
      allowedSides = [7, 8, 9, 10, 11];
      runePalettePool = ['auto', 'astral'];
      preferInscribedCircle = true;
      break;
    case 'enchantment':
      allowedMotifs = ['sacred-rosette', 'sri-yantra'];
      allowedSides = [5, 6, 8, 10, 12];
      runePalettePool = ['auto', 'binding'];
      preferFlowerOfLife = true;
      break;
    case 'divination':
      allowedMotifs = ['astral-compass', 'sacred-rosette'];
      allowedSides = [5, 7, 8, 9, 11];
      runePalettePool = ['auto', 'nodes-polygons'];
      preferInscribedCircle = true;
      break;
    case 'illusion':
      allowedMotifs = ['sacred-rosette', 'astral-compass'];
      allowedSides = [5, 6, 7, 9, 12];
      runePalettePool = ['auto', 'nodes-polygons'];
      preferFlowerOfLife = true;
      break;
    case 'necromancy':
      allowedMotifs = ['eldritch-mandala', 'sri-yantra'];
      allowedSides = [3, 5, 6, 8, 12];
      runePalettePool = ['auto', 'containment', 'runic'];
      preferStar = true;
      break;
    case 'transmutation':
      allowedMotifs = ['sacred-rosette', 'sri-yantra'];
      allowedSides = [6, 7, 8, 10, 12];
      runePalettePool = ['auto', 'nodes-polygons'];
      preferFlowerOfLife = true;
      break;
  }

  let alchemyPool = [...ELEMENT_ALCHEMY_POOL[el]];
  let planetPool = [...ELEMENT_PLANET_POOL[el]];

  if (classification.secondaryElement && classification.secondaryElement !== el) {
    alchemyPool = [
      alchemyPool[0],
      ELEMENT_ALCHEMY_POOL[classification.secondaryElement][0],
      alchemyPool[1],
      ELEMENT_ALCHEMY_POOL[classification.secondaryElement][1],
    ];
    planetPool = [
      planetPool[0],
      ELEMENT_PLANET_POOL[classification.secondaryElement][0],
      planetPool[1],
      ELEMENT_PLANET_POOL[classification.secondaryElement][1],
      planetPool[2],
    ];
  }

  if (school === 'necromancy' && !alchemyPool.includes('lead')) {
    alchemyPool = ['lead', ...alchemyPool.slice(0, 3)];
    planetPool = ['saturn', ...planetPool.filter((p) => p !== 'saturn')];
  } else if (school === 'abjuration' && !alchemyPool.includes('salt')) {
    alchemyPool = ['salt', ...alchemyPool.slice(0, 3)];
  } else if (school === 'transmutation' && !alchemyPool.includes('crucible')) {
    alchemyPool = ['crucible', ...alchemyPool.slice(0, 3)];
  }

  let minStationCount: DomainRuleProfile['minStationCount'];
  if (classification.source === 'spellbook') {
    if (spellLevel >= 7) {
      minStationCount = 12;
      preferDoubleRing = true;
    } else if (spellLevel >= 4) {
      minStationCount = 8;
    }
  }

  return {
    allowedMotifs,
    allowedSides,
    alchemyPool: Array.from(new Set(alchemyPool)),
    planetPool: Array.from(new Set(planetPool)),
    runePalettePool,
    preferStar,
    preferShatkona,
    preferDoubleRing,
    preferInscribedCircle,
    preferFlowerOfLife,
    minStationCount,
  };
}

/**
 * Classify any base phrase (with modifier stripped) deterministically using:
 * 1. Exact or contained D&D 5e SRD spellbook lookup (unless dictionaryMode restricts to roots/phonetic)
 * 2. Weighted morphological root & negation keyword scoring (unless dictionaryMode === 'phonetic')
 * 3. Phonetic profile fallback
 */
export function classifyMagicPhrase(
  baseText: string,
  phoneticFallbackElement: ElementType,
  phoneticSecondaryElement?: ElementType,
  dictionaryMode: MagicDictionaryMode = 'auto'
): MagicClassification {
  const normalized = normalizeSpellLookupKey(baseText);
  if (!normalized || dictionaryMode === 'phonetic') {
    return {
      source: 'phonetic',
      dictionaryId: 'phonetic',
      primaryElement: phoneticFallbackElement,
      secondaryElement: phoneticSecondaryElement,
      matchedTerms: [],
      summary: `${phoneticFallbackElement[0].toUpperCase()}${phoneticFallbackElement.slice(1)} (Phonetic)`,
    };
  }

  // 1 & 2. D&D 5e SRD Spellbook lookup (strictly when launched from SRD Spellbook or /srd/ URL)
  if (dictionaryMode === 'srd') {
    const exactSpell = SRD_BY_KEY.get(normalized);
    if (exactSpell) {
      const lvlLabel = exactSpell.level === 0 ? 'Cantrip' : `Lvl ${exactSpell.level}`;
      return {
        source: 'spellbook',
        dictionaryId: 'srd',
        primaryElement: exactSpell.element,
        secondaryElement: exactSpell.secondaryElement,
        school: exactSpell.school,
        spellName: exactSpell.name,
        spellLevel: exactSpell.level,
        matchedTerms: [exactSpell.name],
        summary: `${exactSpell.name} · ${lvlLabel} ${MAGIC_SCHOOL_LABELS[exactSpell.school]}`,
      };
    }

    for (const { key, entry } of SRD_SORTED_BY_LENGTH) {
      if (key.length < 4) continue;
      const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?:^|\\s)${escaped}(?:$|\\s)`, 'i');
      if (regex.test(normalized)) {
        const lvlLabel = entry.level === 0 ? 'Cantrip' : `Lvl ${entry.level}`;
        return {
          source: 'spellbook',
          dictionaryId: 'srd',
          primaryElement: entry.element,
          secondaryElement: entry.secondaryElement,
          school: entry.school,
          spellName: entry.name,
          spellLevel: entry.level,
          matchedTerms: [entry.name],
          summary: `${entry.name} · ${lvlLabel} ${MAGIC_SCHOOL_LABELS[entry.school]}`,
        };
      }
    }
  }

  // 3. Weighted morpheme + negation scan
  const words = normalized.split(' ').filter(Boolean);
  const hasNegation = words.some((w) => NEGATION_WORDS.has(w));
  const elemScores: Record<ElementType, number> = {
    fire: 0,
    water: 0,
    air: 0,
    earth: 0,
  };
  const schoolScores: Partial<Record<MagicSchool, number>> = {};
  const matchedTerms: string[] = [];

  for (const word of words) {
    for (const rule of MORPHEME_RULES) {
      const hit = rule.exactWordOnly ? word === rule.stem : word.includes(rule.stem);
      if (!hit) continue;
      const w = rule.weight ?? 2;
      if (!matchedTerms.includes(rule.stem)) {
        matchedTerms.push(rule.stem);
      }
      if (rule.element) {
        if (hasNegation && rule.element === 'fire') {
          elemScores.water += w;
          schoolScores.abjuration = (schoolScores.abjuration ?? 0) + w;
        } else {
          elemScores[rule.element] += w;
        }
      }
      if (rule.school) {
        schoolScores[rule.school] = (schoolScores[rule.school] ?? 0) + w;
      }
    }
  }

  const sortedElements = (Object.entries(elemScores) as Array<[ElementType, number]>).sort(
    (a, b) => b[1] - a[1]
  );
  const sortedSchools = (Object.entries(schoolScores) as Array<[MagicSchool, number]>).sort(
    (a, b) => b[1] - a[1]
  );

  const hasElemMatch = sortedElements[0][1] > 0;
  const hasSchoolMatch = sortedSchools.length > 0 && sortedSchools[0][1] > 0;

  if (hasElemMatch || hasSchoolMatch) {
    const primaryElement = hasElemMatch ? sortedElements[0][0] : phoneticFallbackElement;
    const secondaryElement =
      sortedElements[1][1] > 0
        ? sortedElements[1][0]
        : phoneticSecondaryElement && phoneticSecondaryElement !== primaryElement
        ? phoneticSecondaryElement
        : undefined;
    const school = hasSchoolMatch ? sortedSchools[0][0] : undefined;

    const parts: string[] = [];
    if (school) parts.push(MAGIC_SCHOOL_LABELS[school]);
    const elCap = `${primaryElement[0].toUpperCase()}${primaryElement.slice(1)}`;
    parts.push(
      secondaryElement
        ? `${elCap}/${secondaryElement[0].toUpperCase()}${secondaryElement.slice(1)}`
        : elCap
    );

    return {
      source: 'keywords',
      dictionaryId: 'roots',
      primaryElement,
      secondaryElement,
      school,
      matchedTerms,
      summary: `${parts.join(' · ')} (${matchedTerms.slice(0, 3).join(', ')})`,
    };
  }

  // 4. Phonetic fallback
  return {
    source: 'phonetic',
    dictionaryId: 'phonetic',
    primaryElement: phoneticFallbackElement,
    secondaryElement: phoneticSecondaryElement,
    matchedTerms: [],
    summary: `${phoneticFallbackElement[0].toUpperCase()}${phoneticFallbackElement.slice(1)} (Phonetic)`,
  };
}
