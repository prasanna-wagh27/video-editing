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
  ['hook', 0], ['founder', 3], ['logo', 5], ['book', 6], ['home', 7], ['scale', 8], ['paid', 9], ['shark', 10], ['revenue', 12], ['funding', 13],
  ['notonly', 15], ['kab', 16], ['sdeal', 19], ['math', 21], ['people', 22], ['pct', 24], ['pickups', 26], ['kg', 27], ['total', 28],
  ['margin', 29], ['profit', 30], ['extra', 32], ['already', 33], ['have', 34], ['noapp', 35], ['first', 36], ['cta', 38], ['send', 39],
];
export const OUTRO_AT = Math.round((END + 0.45) * 100) / 100;
export const SCENES = SC.map(([k, i], n) => [k, n === 0 ? 0 : CUT[i], n + 1 < SC.length ? CUT[SC[n + 1][1]] : OUTRO_AT]).concat([['outro', OUTRO_AT, OUTRO_AT + 2.4]]);
export const HOOK_END = CUT[3];

// named cues shared by visuals and SFX
export const K = {
  koti: w(1, 0), khari: w(2, 0),
  mukul: w(3, 'मुकुल'), app: w(4, 'ॲपवर'), su: w(5, 0),
  book: w(6, 'बुक'), ghari: w(7, 'घरी'), kata: w(8, 'काट्यावर'), vajan: w(8, 'वजन'), paise: w(9, 'पैसे'), khat: w(9, 'खात्यात'),
  shark: w(10, 0), lakh: w(11, 0), ulad: w(12, 'उलाढाल'), r155: w(12, '१५.५'), y2026: w(13, '२०२६'), r22: w(14, '२२'), fund: w(14, 'फंडिंग'),
  delhi: w(15, 'दिल्लीत'), nahi: w(15, 'नाही'), bhopal: w(16, 0), kab: w(16, 'The'), tata: w(17, 'टाटा'), r10: w(18, '१०'),
  pune: w(19, 'पुण्याचं'), sdeal: w(19, 'Scrapdeal'), r2: w(20, 0),
  shahar: w(21, 'शहराचं'), ganit: w(21, 'गणित'), p50: w(22, 0), h10: w(23, '१०'), pct5: w(24, '५%'), mahina: w(25, 0), pick500: w(26, '५००'),
  kg20: w(27, '२०'), kg10k: w(28, '१०,०००'), rs68: w(29, '६'), margin: w(29, 'मार्जिन'), r6080: w(31, 0),
  shops: w(32, 'दुकानं'), office: w(32, 'ऑफिस'), soc: w(32, 'सोसायट्या'),
  already: w(33, 'आधीच'), cust: w(34, 0), maal: w(34, 'माल'), noapp: w(35, 'नाहीये'),
  pahila: w(36, 'पहिला'), digital: w(37, 0), comment: w(38, 0), bhangar: w(38, 'भंगार'), demo: w(39, 'डेमो'), plan: w(40, 'प्लॅन'),
};

const S = [
  [K.koti - 0.05, 'pop'], [K.khari, 'stamp', -4],
  [K.mukul - 0.1, 'swish'], [K.app - 0.2, 'whoosh'], [K.su - 0.1, 'pop_hi'], [K.su + 0.05, 'sparkle', -4],
  [C(6) + 0.2, 'tick'], [C(6) + 0.4, 'tick'], [K.book, 'pop'], [K.book + 0.3, 'ding', -3],
  [K.ghari - 0.1, 'pop_lo'], [C(8) + 0.25, 'thud'], [K.kata, 'type', -3], [K.paise, 'cash'],
  [K.shark - 0.1, 'swish'], [K.lakh - 0.05, 'stamp'], [K.r155 + 0.2, 'riser', -3], [K.y2026 - 0.05, 'pop_hi'], [K.r22, 'boom', -5], [K.r22 + 0.1, 'sparkle', -4],
  [K.delhi - 0.1, 'pop'], [K.nahi - 0.05, 'pop_hi'], [K.nahi + 0.15, 'pop_hi'], [K.kab - 0.1, 'pop'], [K.tata - 0.3, 'whoosh'], [K.r10, 'coin'],
  [K.sdeal - 0.1, 'pop'], [K.r2, 'coin'], [K.shahar - 0.1, 'pop_lo'], [K.ganit, 'pop_hi'],
  [K.p50, 'type', -4], [K.h10, 'pop'], [K.pct5, 'sparkle', -4], [K.pick500, 'type', -4], [C(27) + 0.25, 'thud'], [K.kg20, 'tick'],
  [K.kg10k + 0.5, 'riser', -4], [K.rs68, 'coin'], [K.r6080, 'cash'], [K.r6080 + 0.3, 'sparkle', -4],
  [K.shops - 0.05, 'pop'], [K.office - 0.05, 'pop'], [K.soc - 0.05, 'pop'],
  [K.already, 'ding', -4], [K.cust, 'tick'], [K.maal, 'tick'], [K.noapp - 0.05, 'error', -2], [K.pahila, 'sparkle'],
  [C(38) + 0.15, 'type', -4], [K.bhangar + 0.25, 'pop'], [K.demo, 'pop_hi'], [K.plan, 'pop_hi'], [OUTRO_AT + 0.05, 'whoosh'],
];
export const SFX = S.concat(SCENES.slice(1, -1).map(([, a]) => [Math.max(0, a - 0.1), 'swish', -6])).sort((a, b) => a[0] - b[0]);
