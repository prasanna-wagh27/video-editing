// Scene list + cue times + sound effects. Times come from timing.mjs (Whisper-aligned words of script_hi.txt).
// w(line, k): start (s) of word k of script_hi line `line` (0-based). CUT[i]: cut before line i.
import {CUT, END, WT} from './timing.mjs';

export const w = (i, k = 0) => WT[i][Math.min(k, WT[i].length - 1)][1];

// [scene, first script line]
const SC = [
  ['hook', 0], ['register', 2], ['missing', 4], ['ton', 7], ['papers', 8], ['pass', 12], ['check', 15], ['stock', 18], ['udhari', 22],
  ['soft', 24], ['s1', 28], ['s2', 32], ['s3', 36], ['s4', 40], ['s5', 44], ['s6', 48], ['dash', 53], ['plants', 57], ['cta', 61],
];
export const OUTRO_LEN = 3.2;
export const OUTRO_AT = Math.round((END + 0.45) * 100) / 100;
export const TOTAL_S = OUTRO_AT + OUTRO_LEN;
export const SCENES = SC.map(([k, i], n) => [k, n === 0 ? 0 : CUT[i], n + 1 < SC.length ? CUT[SC[n + 1][1]] : OUTRO_AT]).concat([['outro', OUTRO_AT, TOTAL_S]]);

export const K = {
  vajta: w(0, 1), crusher: w(0, 4), sat: w(1, 0), nighale: w(1, 4),
  register: w(2, 1), nond: w(2, 2), phakt: w(3, 0), paach: w(3, 1),
  urle: w(4, 1), don: w(4, 2), lakh: w(5, 1), kuthe: w(6, 2),
  pratyek: w(7, 0), ton18: w(7, 3),
  kata: w(8, 0), reg9: w(9, 0), diary: w(10, 2), hisheb: w(11, 0), julat: w(11, 2),
  trip: w(12, 2), royalty: w(13, 0), transit: w(13, 2), pasmadhye: w(14, 0), gadit: w(14, 3),
  checking: w(15, 0), pakdle: w(15, 1), japt: w(16, 3), danda: w(17, 1),
  stock: w(18, 0), mm10: w(19, 0), mm20: w(19, 2), sand: w(19, 4), dhig: w(20, 0), banle: w(20, 2), vikle: w(20, 5), kona: w(21, 0),
  contr: w(22, 2), udhari: w(23, 0), adkleli: w(23, 2),
  vichar: w(24, 0), software: w(25, 2), crusher26: w(26, 3), dispatch: w(26, 5), sambhal: w(26, 6), steps6: w(27, 2),
  s1: w(28, 0), katyavar: w(29, 1), vajan: w(30, 0), save: w(30, 3), number: w(31, 1), photo: w(31, 3),
  s2: w(32, 0), click: w(33, 1), pavti: w(33, 2), chalan: w(34, 0), bill: w(34, 2), tayar: w(35, 2),
  s3: w(36, 0), gate: w(37, 0), qr: w(37, 1), pavtishivay: w(38, 0), ekhi: w(38, 1), bahar: w(39, 0), nahi39: w(39, 3),
  s4: w(40, 0), live: w(41, 0), konatya: w(42, 0), shillak: w(42, 4), screen: w(43, 1),
  s5: w(44, 0), phone: w(45, 1), location: w(45, 2), site: w(46, 1), otp: w(46, 2), confirm: w(47, 1),
  s6: w(48, 0), rate: w(49, 2), limit: w(50, 0), whatsapp: w(51, 1), reminder: w(52, 0),
  dash: w(53, 0), trips: w(54, 2), ton55: w(55, 1), paisa: w(56, 3),
  crusher57: w(57, 0), msand: w(57, 2), screening: w(58, 1), jithe: w(59, 0), system: w(60, 1),
  custom: w(62, 0), outgrid: w(63, 2), dm: w(63, 5), follow: w(64, 4),
};

const S = [
  [0.05, 'pop_lo', -6], [K.vajta, 'tick'], [K.sat, 'whoosh', -4],
  [K.nond, 'type', -5], [K.paach, 'stamp', -3],
  [K.don, 'error', -4], [K.lakh, 'cash', -3], [K.kuthe, 'pop_hi'],
  [K.pratyek, 'thud', -3], [K.ton18, 'pop'],
  [K.kata, 'pop'], [K.reg9, 'pop'], [K.diary, 'pop'], [K.julat, 'error', -3],
  [K.royalty, 'pop'], [K.gadit, 'error', -4],
  [K.checking, 'riser', -6], [K.japt, 'stamp', -2], [K.danda, 'boom', -6],
  [K.mm10, 'pop'], [K.mm20, 'pop'], [K.sand, 'pop'], [K.kona, 'pop_lo'],
  [K.contr, 'whoosh', -5], [K.udhari, 'coin', -3],
  [K.vichar, 'sparkle', -4], [K.software, 'whoosh', -3], [K.crusher26, 'pop'], [K.dispatch, 'pop'], [K.steps6, 'pop_hi'],
  [K.s1, 'pop_hi'], [K.katyavar, 'thud', -3], [K.vajan, 'tick'], [K.save, 'ding', -4], [K.photo, 'stamp', -6],
  [K.s2, 'pop_hi'], [K.click, 'tick'], [K.pavti, 'pop'], [K.chalan, 'pop'], [K.bill, 'pop'], [K.tayar, 'ding', -3],
  [K.s3, 'pop_hi'], [K.qr, 'type', -5], [K.qr + 0.5, 'ding', -4], [K.ekhi, 'error', -4],
  [K.s4, 'pop_hi'], [K.live, 'sparkle', -5], [K.screen, 'pop'],
  [K.s5, 'pop_hi'], [K.location, 'whoosh', -5], [K.otp, 'type', -5], [K.confirm, 'ding', -3],
  [K.s6, 'pop_hi'], [K.rate, 'pop'], [K.limit, 'pop'], [K.reminder, 'ding', -3],
  [K.dash, 'whoosh', -4], [K.trips, 'tick'], [K.ton55, 'tick'], [K.paisa, 'cash', -3],
  [K.crusher57, 'pop'], [K.msand, 'pop'], [K.screening, 'pop'], [K.system, 'sparkle', -3],
  [K.custom, 'pop'], [K.dm, 'tick'], [K.follow, 'pop_hi'],
  [OUTRO_AT + 0.05, 'whoosh'],
];
export const SFX = S.concat(SCENES.slice(1, -1).map(([, a]) => [Math.max(0, a - 0.1), 'swish', -7])).sort((a, b) => a[0] - b[0]);
