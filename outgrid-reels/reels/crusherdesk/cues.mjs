// Scene list + cue times + sound effects. Times come from timing.mjs (Whisper-aligned words of script_hi.txt).
// w(line, k): start (s) of word k of script_hi line `line` (0-based). CUT[i]: cut before line i.
import {CUT, END, WT} from './timing.mjs';

export const w = (i, k = 0) => WT[i][Math.min(k, WT[i].length - 1)][1];

// [scene, first script line, tight?] tight = the line follows without a VO pause: cut just before its first word
const SC = [['hook', 0], ['who', 3], ['evening', 5], ['mismatch', 9], ['loss', 11], ['intro', 15], ['gate', 17], ['offline', 21], ['mobile', 23], ['cta', 29]];
const cutAt = ([, i, tight]) => (tight ? Math.round((WT[i][0][1] - 0.12) * 100) / 100 : CUT[i]);
export const OUTRO_LEN = 3.2;
export const OUTRO_AT = Math.round((END + 0.45) * 100) / 100;
export const TOTAL_S = OUTRO_AT + OUTRO_LEN;
export const SCENES = SC.map((e, n) => [e[0], n === 0 ? 0 : cutAt(e), n + 1 < SC.length ? cutAt(SC[n + 1]) : OUTRO_AT]).concat([['outro', OUTRO_AT, TOTAL_S]]);

export const K = {
  driver: w(0, 0), n12: w(0, 2), sup: w(1, 0), n11: w(1, 2), cust: w(2, 0), n10: w(2, 2),
  aata: w(3, 0), paise: w(3, 1), aikun: w(4, 0), ghenar: w(4, 1),
  roj: w(5, 0), sandhya: w(5, 1), register: w(6, 0), whatsapp: w(7, 0), scroll: w(7, 1), phone: w(8, 0), vichara: w(8, 2),
  shevti: w(9, 1), hishob: w(10, 0), julat: w(10, 1),
  ek: w(11, 2), chukli: w(11, 4), mahina: w(12, 1), shevti12: w(12, 2), kiti: w(13, 0), gele: w(13, 2), vichar: w(14, 1), ka: w(14, 3),
  banavla: w(15, 2), desk: w(16, 0),
  gate: w(17, 0), pratyek: w(17, 1), gadichi: w(17, 2), ekdach: w(18, 0), entry: w(18, 1),
  gadi: w(19, 0), maal: w(19, 2), bras: w(20, 0), customer: w(20, 2),
  net: w(21, 0), nasla: w(21, 1), entry22: w(22, 0), chalu: w(22, 1),
  kuthehi: w(23, 2), mobile: w(24, 0), aaj: w(25, 0), trips: w(25, 2), bras26: w(26, 1), rokh: w(27, 1), baki: w(28, 2),
  demo: w(29, 0), dm: w(30, 1), number: w(31, 3), wa: w(32, 0),
};

const S = [
  [0.05, 'pop_lo', -6], [K.n12, 'pop'], [K.n11, 'pop'], [K.n10, 'pop'], [K.paise, 'cash', -4], [K.ghenar, 'error', -4],
  [K.sandhya, 'tick'], [K.register, 'pop'], [K.whatsapp, 'pop'], [K.scroll, 'type', -7], [K.phone, 'pop'], [K.vichara, 'tick', -5],
  [K.hishob, 'pop'], [K.julat, 'stamp', -3],
  [K.ek, 'whoosh', -5], [K.shevti12, 'type', -7], [K.kiti, 'cash', -3], [K.ka, 'pop_hi'],
  [K.banavla, 'riser', -7], [K.desk, 'sparkle', -3],
  [K.gate, 'thud', -4], [K.ekdach, 'pop_hi'], [K.gadi, 'type', -6], [K.maal, 'type', -6], [K.bras, 'type', -6], [K.customer, 'type', -6], [K.customer + 0.3, 'ding', -4],
  [K.net, 'error', -6], [K.chalu, 'ding', -4],
  [K.mobile, 'whoosh', -5], [K.trips, 'pop'], [K.bras26, 'pop'], [K.rokh, 'cash', -4], [K.baki, 'pop'],
  [K.dm, 'pop_hi'], [K.wa, 'pop_hi'],
  [OUTRO_AT + 0.05, 'whoosh'],
];
export const SFX = S.concat(SCENES.slice(1, -1).map(([, a]) => [Math.max(0, a - 0.1), 'swish', -7])).sort((a, b) => a[0] - b[0]);
