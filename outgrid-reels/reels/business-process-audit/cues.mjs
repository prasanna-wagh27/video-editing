// Scene list + cue times + sound effects. Times come from timing.mjs (Whisper-aligned words of script_hi.txt).
// w(line, k): start (s) of word k of script_hi line `line` (0-based). CUT[i]: cut before line i.
import {CUT, END, WT} from './timing.mjs';

export const w = (i, k = 0) => WT[i][Math.min(k, WT[i].length - 1)][1];

// [scene, first script line]
const SC = [['hook', 0], ['leak', 2], ['s1', 4], ['s2', 8], ['forget', 13], ['stuck', 16], ['loss', 19], ['fit', 23], ['system', 26], ['cta', 28], ['call', 31, true]];
// a scene whose line follows without a VO pause cuts just before its first word
const cutAt = ([, i, tight]) => (tight ? Math.round((WT[i][0][1] - 0.12) * 100) / 100 : CUT[i]);
export const OUTRO_LEN = 3.2;
export const OUTRO_AT = Math.round((END + 0.45) * 100) / 100;
export const TOTAL_S = OUTRO_AT + OUTRO_LEN;
export const SCENES = SC.map((e, n) => [e[0], n === 0 ? 0 : cutAt(e), n + 1 < SC.length ? cutAt(SC[n + 1]) : OUTRO_AT]).concat([['outro', OUTRO_AT, TOTAL_S]]);

export const K = {
  bizness: w(0, 2), teen: w(1, 1), chalat: w(1, 2), mahinyala: w(2, 3), paise: w(3, 0), gamav: w(3, 1),
  s1: w(4, 0), staff5: w(5, 1), hajeri: w(5, 2), orders6: w(6, 2), whatsapp: w(7, 1), yetat: w(7, 3),
  s2: w(8, 0), stock: w(9, 0), payments: w(9, 1), hishob: w(9, 3), char: w(10, 1), vegla: w(10, 2), excel: w(11, 0), register: w(11, 3), ughda: w(12, 0),
  s3: w(13, 1), staff14: w(14, 1), followup: w(14, 2), visarto: w(15, 1), aalele: w(16, 1), clients: w(16, 2), udhari: w(17, 1), adkun: w(18, 0),
  lahan: w(19, 1), problems: w(19, 2), shevti: w(20, 2), nafa: w(21, 2), vel: w(22, 1), vaya: w(22, 3),
  tumchya: w(23, 1), das: w(24, 0), jast: w(24, 2), staff24: w(24, 3), orders25: w(25, 2),
  gondhal: w(26, 2), system: w(27, 0), aanaycha: w(27, 1),
  comment: w(28, 1), audit: w(29, 0), liha: w(29, 1),
  min15: w(30, 1), flow: w(31, 2), baghun: w(31, 3), nemka: w(32, 1), upay: w(32, 2), shodhu: w(32, 3),
};

const S = [
  [0.05, 'pop_lo', -6], [K.bizness, 'pop'], [K.teen, 'pop'], [K.teen + 0.15, 'pop'], [K.teen + 0.3, 'pop_hi'],
  [K.mahinyala, 'tick'], [K.paise, 'coin', -3], [K.gamav, 'error', -4],
  [K.s1, 'pop_hi'], [K.hajeri - 0.25, 'tick', -4], [K.hajeri, 'tick', -4], [K.hajeri + 0.25, 'tick', -4], [K.orders6, 'tick', -4], [K.orders6 + 0.3, 'tick', -4], [K.orders6 + 0.6, 'tick', -4], [K.whatsapp, 'pop'], [K.whatsapp + 0.15, 'pop'], [K.whatsapp + 0.3, 'pop_hi'],
  [K.s2, 'pop_hi'], [K.stock, 'pop'], [K.payments, 'pop'], [K.hishob, 'pop'], [K.vegla, 'pop'], [K.excel, 'pop'], [K.register, 'thud', -4], [K.ughda, 'error', -5],
  [K.s3, 'pop_hi'], [K.followup, 'tick'], [K.visarto, 'error', -3],
  [K.clients, 'pop'], [K.udhari, 'coin', -3], [K.adkun, 'stamp', -3],
  [K.lahan, 'pop_lo'], [K.shevti, 'tick'], [K.nafa, 'whoosh', -5], [K.vel, 'whoosh', -5], [K.vaya, 'boom', -7],
  [K.das, 'pop'], [K.staff24, 'pop_hi'], [K.orders25, 'thud', -4],
  [K.gondhal, 'error', -4], [K.system, 'sparkle', -3], [K.aanaycha, 'ding', -4],
  [K.comment, 'pop'], [K.audit, 'type', -4], [K.liha + 0.3, 'ding', -3],
  [K.min15, 'tick'], [K.flow, 'whoosh', -5], [K.nemka, 'pop'], [K.upay, 'ding', -3],
  [OUTRO_AT + 0.05, 'whoosh'],
];
export const SFX = S.concat(SCENES.slice(1, -1).map(([, a]) => [Math.max(0, a - 0.1), 'swish', -7])).sort((a, b) => a[0] - b[0]);
