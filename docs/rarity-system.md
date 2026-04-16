# Last War Rarity System

## Collection architecture

- Total supply: `2140`
- Faction split: `Rat Dominion 1080` / `Roach Syndicate 1060`
- Current genesis preview: `12` ranked works
- Rarity output: score, tier, rank, and weighted trait breakdown

## Weighted trait layers

1. Species
2. Role
3. Headgear
4. Weapon
5. Backdrop
6. Bitcoin Form
7. Aura

Each layer has an occurrence count inside the full `2140` supply. Lower occurrence counts create higher rarity contribution.

## Scoring formula

For each trait:

`trait_score = log2((2140 / occurrence_count) + 1) * 2.75 * layer_multiplier`

The final rarity score is the sum of all weighted trait scores.

## Layer multipliers

- Species: `1.0`
- Role: `1.35`
- Headgear: `1.2`
- Weapon: `1.1`
- Backdrop: `1.15`
- Bitcoin Form: `1.4`
- Aura: `0.85`

## Rarity tiers

- `Mythic`: `>= 112`
- `Legendary`: `102 - 111.99`
- `Epic`: `94 - 101.99`
- `Rare`: `86 - 93.99`
- `Uncommon`: `80 - 85.99`
- `Survivor`: `< 80`

## Expansion guidance

- Keep faction balance near the 1080 / 1060 split.
- Reserve the lowest occurrence counts for signature story carriers: warlords, priests, generals, prophets, and halo-bitcoin archetypes.
- Use backdrops to control cinematic scarcity. Destroyed global landmarks should remain rarer than urban rubble.
- Keep one-of-one relic classes separate from the standard generator path so the main supply stays mathematically clean.
- If you add new categories, give them explicit multipliers instead of silently folding them into visual randomness.

## Files that drive rarity

- `scripts/generate-collection.mjs`
- `assets/collection/manifest.js`
- `assets/collection/rarity-report.json`
