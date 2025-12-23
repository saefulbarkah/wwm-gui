export interface Buff {
  key: string; // Menyimpan nama kunci asli (misal: ENHANCE)
  id: number;
  desc: string;
}

export const CUSTOM_BUFFS: Buff[] = [
  { key: "ENHANCE", id: 70045, desc: "Enhance" },
  { key: "DAMAGE_UP", id: 30302, desc: "Increase Damage" },
  { key: "DEFENSE_UP", id: 30303, desc: "Increase Defense" },
  { key: "INVINCIBLE", id: 30372, desc: "Reduce True Damage 90%" },
  { key: "DUMB_ENEMIES", id: 380013, desc: "Enemies ignore to attack" },
  { key: "BLOCK_SHIELD", id: 30366, desc: "Immune to 3 hits" },
  { key: "IMMUNE_CONTROL", id: 30005, desc: "Immune to Control" },
  { key: "RESURRECT_VIP", id: 70138, desc: "Resurrect Lv3 (VIP)" },
  { key: "SUPER_VIP2", id: 109041, desc: "SUPER 2 ?? (VIP)" },
];
