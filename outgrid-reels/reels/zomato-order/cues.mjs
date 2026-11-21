// Scene list + sound-effect cues. Times come from timing.mjs (Whisper-aligned words of script_hi.txt).
// w(line, k): start (s) of word k (index or substring) of script_hi line `line` (0-based). C(i): cut before line i.
import {LT, CUT, END, WT} from './timing.mjs';

export const w = (i, k = 0) => {
  if (typeof k === 'number') return WT[i][Math.min(k, WT[i].length - 1)][1];
  const hit = WT[i].find(([x]) => x.includes(k));
  if (!hit) throw new Error(`word "${k}" not in line ${i}: ${WT[i].map((x) => x[0]).join(' ')}`);
  return hit[1];
};
export const L = (i) => LT[i];
export const C = (i) => CUT[i];

// [scene, first script line]
const SC = [
  ['hook', 0], ['first', 3], ['comm', 4], ['amt', 6], ['bill', 8], ['y2023', 11], ['ads', 12], ['cod', 15], ['total', 17],
  ['cost', 19], ['lakh', 21], ['eq', 22], ['city', 23], ['dm', 25],
];
export const OUTRO_AT = Math.round((END + 0.45) * 100) / 100;
export const SCENES = SC.map(([k, i], n) => [k, n === 0 ? 0 : CUT[i], n + 1 < SC.length ? CUT[SC[n + 1][1]] : OUTRO_AT]).concat([['outro', OUTRO_AT, OUTRO_AT + 3.4]]);

// named cues shared by visuals and SFX
export const K = {
  r300: w(0, '₹300'), order: w(0, 'order'), kiti: w(1, 0), paise1: w(1, 'पैसे'), dhakka: w(2, 'धक्का'),
  pahila: w(3, 0), rest: w(3, 'restaurant'),
  prat: w(4, 'प्रत्येक'), rest2: w(4, 'restaurant'), p20: w(5, '20'), p30: w(5, '30%'), comm: w(5, 'commission'),
  r300b: w(6, '₹300'), r60: w(7, '₹60'), r90: w(7, '₹90'),
  dusra: w(8, 0), tumcha: w(8, 'तुमच्याकडून'), bill: w(9, 'Bill'), pfee: w(9, 'Platform'), r15: w(10, '₹15'), y2023: w(11, '2023'), r2: w(11, '₹2'),
  tisra: w(12, 0), jahirat: w(12, 'जाहिरातीतून'), var: w(13, 'वर'), restos: w(13, 'restaurants'), paise3: w(14, 'पैसे'),
  cash: w(15, 'cash'), fee2: w(16, 'fee'),
  zk: w(17, 'Zomato'), r75: w(18, '₹75'), r100: w(18, '₹100'),
  rider: w(19, 'rider'), offers: w(20, 'offers'), appc: w(20, 'app'), kharch: w(20, 'खर्च'),
  roj: w(21, 'रोज'), lakho: w(21, 'लाखो'), chhota: w(22, 'छोटा'), lakho2: w(22, 4), karodo: w(22, 'करोडो'),
  shahar: w(23, 'शहरासाठी'), swata: w(24, 'स्वतःचं'), outgrid: w(25, 'Outgrid'), dm: w(25, 'DM'),
};

const S = [
  [K.order - 0.05, 'tick'], [K.order + 0.1, 'pop'], [K.kiti, 'whoosh'], [K.paise1, 'coin'], [K.dhakka - 0.05, 'boom', -4],
  [K.pahila - 0.05, 'pop_hi'], [K.rest, 'pop'],
  [K.prat, 'pop_lo'], [K.p20, 'tick'], [K.p30, 'tick'], [K.comm, 'stamp', -3],
  [K.r300b, 'pop'], [K.r60, 'coin'], [K.r90, 'cash'],
  [K.dusra - 0.05, 'pop_hi'], [K.bill, 'whoosh'], [K.pfee, 'pop'], [K.r15, 'ding', -3], [K.y2023, 'pop_lo'], [K.r2, 'type', -4], [K.r2 + 0.5, 'riser', -4],
  [K.tisra - 0.05, 'pop_hi'], [K.var, 'pop'], [K.paise3, 'coin'], [K.paise3 + 0.2, 'coin'],
  [K.cash, 'tick'], [K.fee2 - 0.05, 'error', -3],
  [K.zk, 'whoosh'], [K.r75, 'cash'], [K.r100 + 0.1, 'sparkle', -3],
  [K.rider, 'swish'], [K.offers, 'swish'], [K.appc, 'swish'],
  [K.lakho - 0.05, 'riser', -3], [K.chhota, 'coin'], [K.lakho2, 'pop'], [K.karodo, 'cash'], [K.karodo + 0.15, 'sparkle', -3],
  [K.shahar - 0.1, 'pop_lo'], [K.swata, 'pop_hi'], [K.swata + 0.1, 'sparkle', -4],
  [C(25) + 0.15, 'type', -4], [K.dm + 0.2, 'pop'], [OUTRO_AT + 0.05, 'whoosh'],
];
export const SFX = S.concat(SCENES.slice(1, -1).map(([, a]) => [Math.max(0, a - 0.1), 'swish', -6])).sort((a, b) => a[0] - b[0]);
