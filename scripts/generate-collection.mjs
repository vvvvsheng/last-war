import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const supply = 2140;
const imageDir = path.join(root, "assets", "collection", "images");
const metadataDir = path.join(root, "assets", "collection", "metadata");
const manifestPath = path.join(root, "assets", "collection", "manifest.js");
const rarityReportPath = path.join(root, "assets", "collection", "rarity-report.json");

const rarityBands = [
  { tier: "Mythic", min: 112 },
  { tier: "Legendary", min: 102 },
  { tier: "Epic", min: 94 },
  { tier: "Rare", min: 86 },
  { tier: "Uncommon", min: 80 },
  { tier: "Survivor", min: 0 },
];

const rarityProtocol = {
  species: {
    multiplier: 1.0,
    values: {
      rat: { label: "Rat Dominion", count: 1080 },
      roach: { label: "Roach Syndicate", count: 1060 },
    },
  },
  role: {
    multiplier: 1.35,
    values: {
      "Banner Keeper": { count: 74 },
      "Gas Priest": { count: 58 },
      "Ash Miner": { count: 168 },
      "Signal Heretic": { count: 62 },
      "Warlord of Dust": { count: 28 },
      "Vault Diver": { count: 54 },
      "Oracle of Rust": { count: 42 },
      "Neon Scavenger": { count: 156 },
      "Relic Courier": { count: 118 },
      "Ash General": { count: 34 },
      "Archive Smuggler": { count: 66 },
      "Temple Breaker": { count: 48 },
    },
  },
  headgear: {
    multiplier: 1.2,
    values: {
      "spike-crown": { label: "Spike Crown", count: 44 },
      "gas-veil": { label: "Gas Veil", count: 62 },
      "miner-cap": { label: "Miner Cap", count: 180 },
      "coil-halo": { label: "Coil Halo", count: 38 },
      "bone-crown": { label: "Bone Crown", count: 26 },
      "salvage-hood": { label: "Salvage Hood", count: 72 },
      "oracle-wrap": { label: "Oracle Wrap", count: 56 },
      "street-visor": { label: "Street Visor", count: 128 },
      "mail-hood": { label: "Mail Hood", count: 104 },
      "steel-helmet": { label: "Steel Helmet", count: 52 },
      "scribe-cloth": { label: "Scribe Cloth", count: 88 },
      "temple-rig": { label: "Temple Rig", count: 34 },
    },
  },
  weapon: {
    multiplier: 1.1,
    values: {
      "骨旗杆": { label: "Bone Banner", count: 40 },
      "石锤": { label: "Stone Hammer", count: 90 },
      "锈扳手": { label: "Rust Wrench", count: 142 },
      "木棍": { label: "Club", count: 184 },
      "骨矛": { label: "Bone Spear", count: 48 },
      "焊枪枪托": { label: "Salvage Torch Stock", count: 64 },
      "石斧": { label: "Stone Axe", count: 76 },
      "钢管": { label: "Steel Pipe", count: 172 },
      "短棍": { label: "Short Baton", count: 136 },
      "旗杆长矛": { label: "Banner Lance", count: 34 },
      "木杖": { label: "Wood Staff", count: 126 },
      "碎石锤": { label: "Breaker Hammer", count: 58 },
    },
  },
  backdrop: {
    multiplier: 1.15,
    values: {
      "自由女神残骸": { label: "Statue of Liberty Ruin", count: 28 },
      "地铁坍塌口": { label: "Collapsed Metro Gate", count: 120 },
      "比特币矿坑": { label: "Bitcoin Pit", count: 76 },
      "破碎征兵广告": { label: "Broken Draft Billboard", count: 66 },
      "长城残段": { label: "Broken Great Wall", count: 30 },
      "金字塔风沙": { label: "Pyramid Storm", count: 34 },
      "坦克坟场": { label: "Tank Graveyard", count: 62 },
      "霓虹废墟": { label: "Neon Ruin", count: 170 },
      "坠毁飞机": { label: "Crashed Aircraft", count: 84 },
      "核反应堆遗址": { label: "Reactor Wreck", count: 36 },
      "图书馆焦土": { label: "Burned Library", count: 54 },
      "废土神庙": { label: "Wasteland Temple", count: 24 },
    },
  },
  bitcoinForm: {
    multiplier: 1.4,
    values: {
      "瞳孔币环": { label: "Ocular Halo", count: 40 },
      "胸前祭币": { label: "Ritual Medallion", count: 86 },
      "肩部纹章": { label: "Shoulder Sigil", count: 138 },
      "背后神环": { label: "Rear Halo", count: 22 },
      "王冠碎片": { label: "Crown Fragment", count: 26 },
      "腹甲刻印": { label: "Shell Engraving", count: 70 },
      "耳侧铭牌": { label: "Ear Plate", count: 94 },
      "尾端吊币": { label: "Tail Coin", count: 126 },
      "胸前吊坠": { label: "Cold Wallet Pendant", count: 116 },
      "眼部植入": { label: "Ocular Implant", count: 32 },
      "背后圣币": { label: "Saint Coin", count: 34 },
      "甲壳烙印": { label: "Carapace Brand", count: 48 },
    },
  },
  aura: {
    multiplier: 0.85,
    values: {
      acid: { label: "Acid Bloom", count: 92 },
      toxic: { label: "Toxic Vapor", count: 104 },
      ember: { label: "Ember Dust", count: 146 },
      violet: { label: "Signal Violet", count: 38 },
      sand: { label: "Sand Wake", count: 60 },
      sun: { label: "Solar Haze", count: 74 },
      cyan: { label: "Cyan Static", count: 54 },
      neon: { label: "Neon Spill", count: 160 },
      mist: { label: "Archive Mist", count: 120 },
      smog: { label: "Reactor Smog", count: 42 },
      archive: { label: "Archive Dust", count: 84 },
      shrine: { label: "Shrine Glow", count: 46 },
    },
  },
};

const items = [
  {
    id: "001",
    name: "Last War #001",
    faction: "Rat Dominion",
    role: "Banner Keeper",
    species: "rat",
    weapon: "骨旗杆",
    backdrop: "自由女神残骸",
    bitcoinForm: "瞳孔币环",
    description: "The first banner keeper cuts copper from the corpse of Liberty and reforges bitcoin into a sacred war seal.",
    palette: ["#101a10", "#27441f", "#d2ff58", "#f1b64c", "#f46f34"],
    headgear: "spike-crown",
    aura: "acid",
  },
  {
    id: "002",
    name: "Last War #002",
    faction: "Roach Syndicate",
    role: "Gas Priest",
    species: "roach",
    weapon: "石锤",
    backdrop: "地铁坍塌口",
    bitcoinForm: "胸前祭币",
    description: "He preaches from the deepest metro ruin and swears the last bitcoin will resurrect inside a black-market shrine.",
    palette: ["#090d0a", "#24361c", "#7dfa6f", "#c6d45a", "#536e34"],
    headgear: "gas-veil",
    aura: "toxic",
  },
  {
    id: "003",
    name: "Last War #003",
    faction: "Rat Dominion",
    role: "Ash Miner",
    species: "rat",
    weapon: "锈扳手",
    backdrop: "比特币矿坑",
    bitcoinForm: "肩部纹章",
    description: "The miners break dead rigs into armor and keep digging through ash for a faith that no longer behaves like value.",
    palette: ["#100d0a", "#372114", "#ffcf40", "#e87c4a", "#935125"],
    headgear: "miner-cap",
    aura: "ember",
  },
  {
    id: "004",
    name: "Last War #004",
    faction: "Roach Syndicate",
    role: "Signal Heretic",
    species: "roach",
    weapon: "木棍",
    backdrop: "破碎征兵广告",
    bitcoinForm: "背后神环",
    description: "Old recruitment boards still flicker in the dark, so he rewrites them into anti-war scripture and wears the signal on his back.",
    palette: ["#0f0a12", "#28183a", "#d975ff", "#8bff73", "#ffd966"],
    headgear: "coil-halo",
    aura: "violet",
  },
  {
    id: "005",
    name: "Last War #005",
    faction: "Rat Dominion",
    role: "Warlord of Dust",
    species: "rat",
    weapon: "骨矛",
    backdrop: "长城残段",
    bitcoinForm: "王冠碎片",
    description: "He claims the broken Great Wall as a throne and stitches his crown from spent shells, dead coins, and bone.",
    palette: ["#120f0e", "#412922", "#f19d57", "#efe3af", "#f05f36"],
    headgear: "bone-crown",
    aura: "sand",
  },
  {
    id: "006",
    name: "Last War #006",
    faction: "Roach Syndicate",
    role: "Vault Diver",
    species: "roach",
    weapon: "焊枪枪托",
    backdrop: "金字塔风沙",
    bitcoinForm: "腹甲刻印",
    description: "Legend says cold wallets still sleep beneath the pyramids, and that rumor turned him into the most dangerous diver in the wastes.",
    palette: ["#12110a", "#504423", "#e0c35d", "#8af763", "#d56d30"],
    headgear: "salvage-hood",
    aura: "sun",
  },
  {
    id: "007",
    name: "Last War #007",
    faction: "Rat Dominion",
    role: "Oracle of Rust",
    species: "rat",
    weapon: "石斧",
    backdrop: "坦克坟场",
    bitcoinForm: "耳侧铭牌",
    description: "She reads future weather and faction collapse in the grooves of rusted tank tracks, and every prophecy arrives like a siren.",
    palette: ["#0c1010", "#233434", "#6ef7f5", "#ebc74b", "#b8603f"],
    headgear: "oracle-wrap",
    aura: "cyan",
  },
  {
    id: "008",
    name: "Last War #008",
    faction: "Roach Syndicate",
    role: "Neon Scavenger",
    species: "roach",
    weapon: "钢管",
    backdrop: "霓虹废墟",
    bitcoinForm: "尾端吊币",
    description: "He hunts for anything that still glows in the dark city, even if all that survives is a blinking trade screen and a rumor of liquidity.",
    palette: ["#0b0d12", "#12263c", "#54bcff", "#85ffbd", "#f7cb4d"],
    headgear: "street-visor",
    aura: "neon",
  },
  {
    id: "009",
    name: "Last War #009",
    faction: "Rat Dominion",
    role: "Relic Courier",
    species: "rat",
    weapon: "短棍",
    backdrop: "坠毁飞机",
    bitcoinForm: "胸前吊坠",
    description: "He threads cold-wallet fragments from a crashed aircraft into a pendant and carries them toward anyone willing to trade in peace stories.",
    palette: ["#111312", "#1e3135", "#8ef4d2", "#f8d875", "#f67f40"],
    headgear: "mail-hood",
    aura: "mist",
  },
  {
    id: "010",
    name: "Last War #010",
    faction: "Roach Syndicate",
    role: "Ash General",
    species: "roach",
    weapon: "旗杆长矛",
    backdrop: "核反应堆遗址",
    bitcoinForm: "眼部植入",
    description: "The reactor carved holy fractures into his shell, and he believes the war can only end through the last surviving signal.",
    palette: ["#100f12", "#2a242c", "#d7ff57", "#96db5c", "#ff8d49"],
    headgear: "steel-helmet",
    aura: "smog",
  },
  {
    id: "011",
    name: "Last War #011",
    faction: "Rat Dominion",
    role: "Archive Smuggler",
    species: "rat",
    weapon: "木杖",
    backdrop: "图书馆焦土",
    bitcoinForm: "背后圣币",
    description: "Every burned history becomes dust in his pockets, and wherever he walks, a new version of memory starts again.",
    palette: ["#100d09", "#372717", "#e8b164", "#f4efcc", "#8ef06f"],
    headgear: "scribe-cloth",
    aura: "archive",
  },
  {
    id: "012",
    name: "Last War #012",
    faction: "Roach Syndicate",
    role: "Temple Breaker",
    species: "roach",
    weapon: "碎石锤",
    backdrop: "废土神庙",
    bitcoinForm: "甲壳烙印",
    description: "He breaks the pillars of old shrines to prove that every idol eventually kneels before hunger and fallout.",
    palette: ["#110f0a", "#2f2415", "#f0d967", "#6dff77", "#f77237"],
    headgear: "temple-rig",
    aura: "shrine",
  },
];

function getTraitRule(category, value) {
  const rule = rarityProtocol[category];
  const entry = rule?.values?.[value];

  if (!rule || !entry) {
    throw new Error(`Missing rarity configuration for ${category}:${value}`);
  }

  return { ...entry, multiplier: rule.multiplier };
}

function rarityTierFor(score) {
  return rarityBands.find((band) => score >= band.min)?.tier ?? "Survivor";
}

function rarityBreakdown(item) {
  const traits = [
    { category: "species", label: "Species", value: item.species },
    { category: "role", label: "Role", value: item.role },
    { category: "headgear", label: "Headgear", value: item.headgear },
    { category: "weapon", label: "Weapon", value: item.weapon },
    { category: "backdrop", label: "Backdrop", value: item.backdrop },
    { category: "bitcoinForm", label: "Bitcoin Form", value: item.bitcoinForm },
    { category: "aura", label: "Aura", value: item.aura },
  ];

  return traits.map((trait) => {
    const rule = getTraitRule(trait.category, trait.value);
    const contribution = Number((Math.log2(supply / rule.count + 1) * 2.75 * rule.multiplier).toFixed(2));
    return {
      trait_type: trait.label,
      value: rule.label ?? trait.value,
      occurrence: rule.count,
      multiplier: rule.multiplier,
      contribution,
    };
  });
}

function backdropSvg(backdrop, primary, secondary) {
  switch (backdrop) {
    case "自由女神残骸":
      return `<g opacity="0.26"><path d="M885 360L945 470L897 492L835 381Z" fill="${secondary}"/><path d="M805 840L950 420L1015 448L900 870Z" fill="${primary}"/><path d="M850 350L940 326L914 270L866 298Z" fill="${secondary}"/></g>`;
    case "地铁坍塌口":
      return `<g opacity="0.24"><rect x="760" y="250" width="260" height="480" rx="28" fill="${primary}"/><path d="M725 742L920 520L1040 742Z" fill="${secondary}"/></g>`;
    case "比特币矿坑":
      return `<g opacity="0.22"><path d="M720 760L850 300L980 760Z" fill="${secondary}"/><rect x="803" y="300" width="92" height="500" rx="30" fill="${primary}"/></g>`;
    case "破碎征兵广告":
      return `<g opacity="0.22"><rect x="760" y="240" width="280" height="220" rx="22" fill="${primary}"/><path d="M760 430L1040 300V460L760 470Z" fill="${secondary}"/></g>`;
    case "长城残段":
      return `<g opacity="0.26"><path d="M680 745C800 565 910 660 1080 470V770H680Z" fill="${primary}"/><rect x="840" y="440" width="70" height="120" fill="${secondary}"/></g>`;
    case "金字塔风沙":
      return `<g opacity="0.22"><path d="M760 780L905 310L1045 780Z" fill="${primary}"/><path d="M720 840C780 780 960 760 1080 820V920H720Z" fill="${secondary}"/></g>`;
    case "坦克坟场":
      return `<g opacity="0.24"><rect x="742" y="612" width="236" height="94" rx="34" fill="${primary}"/><rect x="882" y="568" width="176" height="28" rx="14" fill="${secondary}"/><circle cx="798" cy="728" r="48" fill="${secondary}"/><circle cx="926" cy="728" r="48" fill="${secondary}"/></g>`;
    case "霓虹废墟":
      return `<g opacity="0.22"><rect x="790" y="280" width="84" height="490" fill="${primary}"/><rect x="920" y="198" width="124" height="580" fill="${secondary}"/><rect x="864" y="612" width="190" height="24" fill="${primary}"/></g>`;
    case "坠毁飞机":
      return `<g opacity="0.24"><path d="M700 640L1045 510L988 612L1100 660L1068 735L928 690L820 812L768 782L826 690L710 710Z" fill="${primary}"/></g>`;
    case "核反应堆遗址":
      return `<g opacity="0.22"><path d="M780 770C780 560 865 380 930 380C995 380 1080 560 1080 770Z" fill="${primary}"/><path d="M820 420H1042L982 308H876Z" fill="${secondary}"/></g>`;
    case "图书馆焦土":
      return `<g opacity="0.22"><rect x="744" y="330" width="290" height="410" rx="26" fill="${primary}"/><path d="M792 420H982V462H792ZM792 500H982V542H792ZM792 580H982V622H792Z" fill="${secondary}"/></g>`;
    default:
      return `<g opacity="0.22"><path d="M760 780L905 340L1050 780Z" fill="${primary}"/></g>`;
  }
}

function headgearSvg(kind, accent, dark) {
  switch (kind) {
    case "spike-crown":
      return `<path d="M410 250L452 170L496 260L550 166L585 260L645 180L670 288H390Z" fill="${accent}" stroke="${dark}" stroke-width="12"/>`;
    case "gas-veil":
      return `<g><rect x="430" y="220" width="220" height="86" rx="30" fill="${dark}" stroke="${accent}" stroke-width="10"/><circle cx="480" cy="306" r="24" fill="${accent}"/><circle cx="598" cy="306" r="24" fill="${accent}"/></g>`;
    case "miner-cap":
      return `<g><path d="M392 245C440 175 620 175 668 245V310H392Z" fill="${accent}" stroke="${dark}" stroke-width="12"/><circle cx="530" cy="246" r="30" fill="#f8f1bf"/></g>`;
    case "coil-halo":
      return `<g fill="none" stroke="${accent}" stroke-width="14"><circle cx="530" cy="228" r="110"/><circle cx="530" cy="228" r="82"/></g>`;
    case "bone-crown":
      return `<path d="M392 280L450 184L505 268L562 190L612 276L668 226L676 310H386Z" fill="#efe2b5" stroke="${dark}" stroke-width="10"/>`;
    case "salvage-hood":
      return `<path d="M372 310C396 190 662 190 688 310L662 396H398Z" fill="${dark}" stroke="${accent}" stroke-width="10"/>`;
    case "oracle-wrap":
      return `<path d="M390 260C432 198 618 198 666 260L634 330H420Z" fill="${accent}" stroke="${dark}" stroke-width="10"/>`;
    case "street-visor":
      return `<g><rect x="406" y="236" width="250" height="64" rx="24" fill="${accent}" opacity="0.7"/><path d="M406 270H656" stroke="${dark}" stroke-width="10"/></g>`;
    case "mail-hood":
      return `<path d="M388 300C418 190 642 190 672 300L645 388H415Z" fill="${accent}" stroke="${dark}" stroke-width="10"/>`;
    case "steel-helmet":
      return `<path d="M390 248C422 174 636 174 670 248L646 318H414Z" fill="${dark}" stroke="${accent}" stroke-width="10"/>`;
    case "scribe-cloth":
      return `<path d="M408 230H652L622 350H438Z" fill="#d4bd8a" stroke="${dark}" stroke-width="10"/>`;
    default:
      return `<path d="M390 260C425 190 635 190 670 260L646 322H414Z" fill="${accent}" stroke="${dark}" stroke-width="10"/>`;
  }
}

function weaponSvg(weapon, accent, highlight, x = 790, y = 620) {
  switch (weapon) {
    case "骨旗杆":
      return `<g transform="translate(${x} ${y})"><rect x="-8" y="-170" width="16" height="290" rx="8" fill="${accent}"/><path d="M8 -152L160 -118L62 -42L8 -60Z" fill="${highlight}"/></g>`;
    case "石锤":
      return `<g transform="translate(${x} ${y}) rotate(-18)"><rect x="-8" y="-150" width="16" height="260" rx="8" fill="${accent}"/><rect x="-54" y="-162" width="108" height="56" rx="14" fill="${highlight}"/></g>`;
    case "锈扳手":
      return `<g transform="translate(${x} ${y}) rotate(-16)"><path d="M-8 -170H8V110H-8Z" fill="${accent}"/><path d="M-58 -194C-12 -226 54 -196 56 -146L18 -132C12 -160 -6 -174 -28 -170L-44 -142L-80 -154Z" fill="${highlight}"/></g>`;
    case "木棍":
    case "短棍":
    case "木杖":
      return `<rect x="${x - 8}" y="${y - 180}" width="16" height="290" rx="8" fill="${accent}"/>`;
    case "骨矛":
    case "旗杆长矛":
      return `<g transform="translate(${x} ${y})"><rect x="-7" y="-190" width="14" height="300" rx="7" fill="${accent}"/><path d="M0 -250L36 -182H-36Z" fill="${highlight}"/></g>`;
    case "焊枪枪托":
      return `<g transform="translate(${x} ${y}) rotate(-16)"><rect x="-10" y="-170" width="20" height="280" rx="8" fill="${accent}"/><path d="M-10 -120H70L92 -80L50 -40H12Z" fill="${highlight}"/></g>`;
    case "石斧":
      return `<g transform="translate(${x} ${y}) rotate(-18)"><rect x="-8" y="-160" width="16" height="270" rx="8" fill="${accent}"/><path d="M-70 -146C-8 -196 44 -186 76 -130C44 -96 -10 -84 -70 -104Z" fill="${highlight}"/></g>`;
    case "钢管":
      return `<rect x="${x - 10}" y="${y - 190}" width="20" height="300" rx="10" fill="${highlight}"/>`;
    case "碎石锤":
      return `<g transform="translate(${x} ${y}) rotate(-20)"><rect x="-8" y="-160" width="16" height="270" rx="8" fill="${accent}"/><path d="M-60 -170L62 -144L30 -92L-72 -110Z" fill="${highlight}"/></g>`;
    default:
      return `<rect x="${x - 8}" y="${y - 180}" width="16" height="290" rx="8" fill="${accent}"/>`;
  }
}

function bitcoinMark(form, accent, bright) {
  switch (form) {
    case "瞳孔币环":
    case "眼部植入":
      return `<g><circle cx="486" cy="392" r="40" fill="${bright}"/><path d="M480 366V418M496 366V418M462 378H508C522 378 530 386 530 398C530 410 522 418 506 418H462M462 378H502C516 378 524 370 524 358C524 346 514 338 498 338H462" stroke="#111" stroke-width="12" stroke-linecap="round"/></g>`;
    case "胸前祭币":
    case "胸前吊坠":
      return `<g><circle cx="530" cy="660" r="66" fill="${bright}" opacity="0.95"/><path d="M524 622V696M542 622V696M494 640H552C566 640 574 648 574 660C574 672 566 680 552 680H494M494 640H546C560 640 568 632 568 620C568 608 558 600 544 600H494" stroke="#111" stroke-width="16" stroke-linecap="round"/></g>`;
    case "背后神环":
    case "背后圣币":
      return `<g opacity="0.88"><circle cx="530" cy="340" r="150" fill="none" stroke="${bright}" stroke-width="24"/><path d="M520 264V416M546 264V416M468 294H562C590 294 606 310 606 334C606 358 590 374 562 374H468M468 294H552C580 294 594 278 594 254C594 230 578 214 550 214H468" stroke="${bright}" stroke-width="18" stroke-linecap="round"/></g>`;
    case "王冠碎片":
      return `<g opacity="0.9"><circle cx="610" cy="274" r="42" fill="${bright}"/><path d="M605 248V298M620 248V298M584 258H632C642 258 650 266 650 276C650 286 642 294 632 294H584M584 258H626C636 258 644 250 644 240C644 230 636 222 626 222H584" stroke="#111" stroke-width="10" stroke-linecap="round"/></g>`;
    case "腹甲刻印":
    case "甲壳烙印":
      return `<g opacity="0.85"><circle cx="530" cy="688" r="40" fill="${bright}"/><path d="M524 664V710M540 664V710M502 676H548C560 676 566 682 566 690C566 700 560 706 546 706H502M502 676H542C554 676 560 670 560 660C560 650 554 644 542 644H502" stroke="#111" stroke-width="12" stroke-linecap="round"/></g>`;
    case "肩部纹章":
    case "耳侧铭牌":
    case "尾端吊币":
      return `<g opacity="0.9"><circle cx="380" cy="556" r="34" fill="${bright}"/><path d="M374 536V578M388 536V578M356 544H398C408 544 414 550 414 558C414 568 408 574 398 574H356M356 544H392C402 544 408 538 408 528C408 518 402 512 392 512H356" stroke="#111" stroke-width="10" stroke-linecap="round"/></g>`;
    default:
      return `<g opacity="0.8"><circle cx="530" cy="660" r="54" fill="${bright}"/></g>`;
  }
}

function auraSvg(kind, accent) {
  switch (kind) {
    case "acid":
    case "toxic":
      return `<g opacity="0.55" fill="${accent}"><circle cx="280" cy="236" r="12"/><circle cx="760" cy="290" r="10"/><circle cx="920" cy="164" r="8"/><circle cx="860" cy="920" r="16"/></g>`;
    case "violet":
    case "neon":
      return `<g opacity="0.5" stroke="${accent}" stroke-width="8" fill="none"><path d="M210 924C320 820 450 820 550 924"/><path d="M628 180C732 230 812 216 940 152"/></g>`;
    case "sand":
    case "sun":
      return `<g opacity="0.45" fill="${accent}"><path d="M120 900C280 820 410 846 520 920V1020H120Z"/><circle cx="936" cy="214" r="30"/></g>`;
    case "cyan":
    case "mist":
      return `<g opacity="0.38" fill="${accent}"><circle cx="230" cy="280" r="24"/><circle cx="950" cy="250" r="18"/><circle cx="140" cy="800" r="16"/></g>`;
    default:
      return `<g opacity="0.45" fill="${accent}"><circle cx="200" cy="180" r="16"/><circle cx="980" cy="228" r="12"/></g>`;
  }
}

function characterSvg(item, colors) {
  const [, , accent, bright, hot] = colors;
  const dark = "#121212";
  const bodyMain = item.species === "rat" ? hot : bright;
  const bodyShade = item.species === "rat" ? accent : hot;
  const soft = item.species === "rat" ? "#ffd9cc" : accent;

  if (item.species === "rat") {
    return `
      <g>
        <circle cx="406" cy="352" r="82" fill="${bodyMain}" stroke="${dark}" stroke-width="14"/>
        <circle cx="654" cy="352" r="82" fill="${bodyMain}" stroke="${dark}" stroke-width="14"/>
        <path d="M444 630C356 594 332 500 374 410C416 324 520 286 620 320C720 356 786 466 752 578C718 692 574 746 444 630Z" fill="${bodyMain}" stroke="${dark}" stroke-width="16"/>
        <ellipse cx="532" cy="430" rx="176" ry="146" fill="${bodyShade}" opacity="0.72"/>
        <path d="M426 678C464 636 594 636 638 678V818H426Z" fill="${accent}" opacity="0.9" stroke="${dark}" stroke-width="12"/>
        <ellipse cx="476" cy="438" rx="34" ry="56" fill="#fff"/>
        <ellipse cx="582" cy="438" rx="34" ry="56" fill="#fff"/>
        <circle cx="476" cy="434" r="14" fill="${dark}"/>
        <circle cx="582" cy="434" r="14" fill="${dark}"/>
        <ellipse cx="530" cy="540" rx="62" ry="46" fill="${soft}" stroke="${dark}" stroke-width="10"/>
        <path d="M470 540H590" stroke="${dark}" stroke-width="10" stroke-linecap="round"/>
        <path d="M340 554C278 614 252 702 264 790" stroke="${dark}" stroke-width="16" fill="none" stroke-linecap="round"/>
        <path d="M722 550C784 608 814 698 800 790" stroke="${dark}" stroke-width="16" fill="none" stroke-linecap="round"/>
        <path d="M386 724C322 780 318 878 382 954" stroke="${soft}" stroke-width="18" stroke-linecap="round"/>
        <path d="M676 724C742 778 744 874 680 950" stroke="${soft}" stroke-width="18" stroke-linecap="round"/>
        <circle cx="286" cy="790" r="24" fill="${soft}" stroke="${dark}" stroke-width="10"/>
        <circle cx="786" cy="790" r="24" fill="${soft}" stroke="${dark}" stroke-width="10"/>
      </g>
    `;
  }

  return `
    <g>
      <ellipse cx="530" cy="420" rx="166" ry="154" fill="${bodyMain}" stroke="${dark}" stroke-width="16"/>
      <path d="M368 418C368 286 450 214 530 214C610 214 692 286 692 418V636H368Z" fill="${bodyShade}" opacity="0.86"/>
      <path d="M430 670C466 628 594 628 632 670V836H430Z" fill="${accent}" opacity="0.86" stroke="${dark}" stroke-width="12"/>
      <ellipse cx="474" cy="428" rx="34" ry="56" fill="#fff"/>
      <ellipse cx="586" cy="428" rx="34" ry="56" fill="#fff"/>
      <circle cx="474" cy="424" r="14" fill="${dark}"/>
      <circle cx="586" cy="424" r="14" fill="${dark}"/>
      <path d="M454 560C490 528 570 528 606 560L574 612H486Z" fill="${dark}"/>
      <path d="M448 246C424 178 356 150 310 104" stroke="${soft}" stroke-width="18" fill="none" stroke-linecap="round"/>
      <path d="M612 246C636 178 704 150 750 104" stroke="${soft}" stroke-width="18" fill="none" stroke-linecap="round"/>
      <path d="M360 594C298 646 268 726 280 814" stroke="${dark}" stroke-width="16" fill="none" stroke-linecap="round"/>
      <path d="M698 594C760 646 792 726 780 814" stroke="${dark}" stroke-width="16" fill="none" stroke-linecap="round"/>
      <path d="M470 700C432 788 430 872 470 948" stroke="${dark}" stroke-width="16" fill="none" stroke-linecap="round"/>
      <path d="M590 700C628 788 630 872 590 948" stroke="${dark}" stroke-width="16" fill="none" stroke-linecap="round"/>
      <circle cx="270" cy="814" r="24" fill="${soft}" stroke="${dark}" stroke-width="10"/>
      <circle cx="788" cy="814" r="24" fill="${soft}" stroke="${dark}" stroke-width="10"/>
    </g>
  `;
}

function buildSvg(item) {
  const [bg, mid, accent, bright, hot] = item.palette;
  const outline = "#101010";
  const btc = bitcoinMark(item.bitcoinForm, accent, bright);
  const body = characterSvg(item, item.palette);
  const backdrop = backdropSvg(item.backdrop, mid, hot);
  const headgear = headgearSvg(item.headgear, accent, outline);
  const aura = auraSvg(item.aura, accent);
  const weapon = weaponSvg(item.weapon, hot, bright);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="1200" viewBox="0 0 1200 1200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-${item.id}" x1="160" y1="120" x2="1040" y2="1040" gradientUnits="userSpaceOnUse">
      <stop stop-color="${bg}"/>
      <stop offset="1" stop-color="${mid}"/>
    </linearGradient>
    <radialGradient id="glow-${item.id}" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(530 416) rotate(90) scale(420 360)">
      <stop stop-color="${accent}" stop-opacity="0.48"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft-${item.id}" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="18"/>
    </filter>
  </defs>

  <rect width="1200" height="1200" rx="56" fill="url(#bg-${item.id})"/>
  <path d="M0 972L190 924L288 1036L0 1200V972Z" fill="${hot}" opacity="0.14"/>
  <path d="M1120 0L1200 0V310L1028 220Z" fill="${bright}" opacity="0.1"/>
  <circle cx="534" cy="420" r="354" fill="url(#glow-${item.id})"/>
  ${aura}
  ${backdrop}
  <g opacity="0.18">
    <path d="M54 944H1146" stroke="${bright}" stroke-width="16" stroke-linecap="round" stroke-dasharray="22 28"/>
    <path d="M0 1142H1200" stroke="${hot}" stroke-width="24"/>
  </g>
  <g filter="url(#soft-${item.id})" opacity="0.22">
    <ellipse cx="560" cy="980" rx="274" ry="70" fill="#000"/>
  </g>
  <g>${headgear}</g>
  <g>${body}</g>
  <g>${weapon}</g>
  <g>${btc}</g>
  <g opacity="0.9">
    <rect x="74" y="72" width="292" height="92" rx="24" fill="rgba(7, 7, 7, 0.42)"/>
    <text x="104" y="126" fill="${bright}" font-size="52" font-family="Arial, sans-serif" font-weight="700">LAST WAR #${item.id}</text>
  </g>
  <g opacity="0.88">
    <rect x="76" y="1028" width="430" height="88" rx="22" fill="rgba(7, 7, 7, 0.46)"/>
    <text x="104" y="1084" fill="${accent}" font-size="34" font-family="Arial, sans-serif" font-weight="700">${item.role.toUpperCase()}</text>
  </g>
</svg>`;
}

async function writeCollection() {
  await fs.mkdir(imageDir, { recursive: true });
  await fs.mkdir(metadataDir, { recursive: true });

  const scoredItems = items.map((item) => {
    const breakdown = rarityBreakdown(item);
    const rarityScore = Number(
      breakdown.reduce((total, trait) => total + trait.contribution, 0).toFixed(2),
    );

    return {
      ...item,
      rarityBreakdown: breakdown,
      rarityScore,
      rarityTier: rarityTierFor(rarityScore),
      rarityHighlights: breakdown
        .slice()
        .sort((a, b) => b.contribution - a.contribution)
        .slice(0, 2)
        .map((trait) => `${trait.trait_type}: ${trait.value}`),
    };
  });

  const rankedItems = scoredItems
    .slice()
    .sort((a, b) => b.rarityScore - a.rarityScore)
    .map((item, index) => ({ ...item, rarityRank: index + 1 }));

  const manifest = [];

  for (const item of rankedItems) {
    const filename = `last-war-${item.id}.svg`;
    const imagePath = path.join(imageDir, filename);
    const metadataPath = path.join(metadataDir, `last-war-${item.id}.json`);
    const imageRel = `./assets/collection/images/${filename}`;
    const metadata = {
      name: item.name,
      description: item.description,
      image: imageRel,
      external_url: "https://github.com/your-name/last-war",
      attributes: [
        { trait_type: "Faction", value: item.faction },
        { trait_type: "Role", value: item.role },
        { trait_type: "Species", value: item.species },
        { trait_type: "Headgear", value: getTraitRule("headgear", item.headgear).label },
        { trait_type: "Weapon", value: getTraitRule("weapon", item.weapon).label },
        { trait_type: "Backdrop", value: getTraitRule("backdrop", item.backdrop).label },
        { trait_type: "Bitcoin Form", value: getTraitRule("bitcoinForm", item.bitcoinForm).label },
        { trait_type: "Aura", value: getTraitRule("aura", item.aura).label },
        { display_type: "number", trait_type: "Rarity Score", value: item.rarityScore },
        { trait_type: "Rarity Tier", value: item.rarityTier },
        { display_type: "number", trait_type: "Genesis Rank", value: item.rarityRank },
      ],
      rarity_breakdown: item.rarityBreakdown,
    };

    await fs.writeFile(imagePath, buildSvg(item), "utf8");
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2), "utf8");

    manifest.push({
      id: item.id,
      name: item.name,
      faction: item.faction,
      role: item.role,
      weapon: getTraitRule("weapon", item.weapon).label,
      backdrop: getTraitRule("backdrop", item.backdrop).label,
      bitcoinForm: getTraitRule("bitcoinForm", item.bitcoinForm).label,
      description: item.description,
      image: imageRel,
      rarityScore: item.rarityScore,
      rarityTier: item.rarityTier,
      rarityRank: item.rarityRank,
      rarityHighlights: item.rarityHighlights,
    });
  }

  const rarityReport = {
    collection: "Last War",
    supply,
    rarityBands,
    traitCategories: Object.entries(rarityProtocol).map(([key, value]) => ({
      category: key,
      multiplier: value.multiplier,
      values: Object.entries(value.values).map(([name, entry]) => ({
        name,
        label: entry.label ?? name,
        count: entry.count,
      })),
    })),
    topRanked: manifest.slice(0, 5),
  };

  const manifestSource = `window.LAST_WAR_COLLECTION = ${JSON.stringify(manifest, null, 2)};\n`;
  await fs.writeFile(manifestPath, manifestSource, "utf8");
  await fs.writeFile(rarityReportPath, JSON.stringify(rarityReport, null, 2), "utf8");
}

writeCollection().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
