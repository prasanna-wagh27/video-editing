// Scene list + sound-effect cues. Times come from timing.mjs (Whisper-aligned words of script_hi.txt).
// w(line, k): start (s) of word k (index) of script_hi line `line` (0-based). C(i): cut before line i.
import {LT, CUT, END, WT} from './timing.mjs';

export const w = (i, k = 0) => WT[i][Math.min(k, WT[i].length - 1)][1];
export const C = (i) => CUT[i];

// [scene, first script line]
const SC = [
  ['hook', 0], ['typical', 3], ['google', 9], ['build', 15], ['gpt', 19], ['ask', 23], ['struct', 26], ['book', 30], ['wa', 33], ['noshow', 35], ['machine', 39], ['cta', 43],
];
export const OUTRO_LEN = 3.6;
export const OUTRO_AT = Math.round((END + 0.4) * 100) / 100;
export const TOTAL_S = OUTRO_AT + OUTRO_LEN;
export const NUM_AT = Math.round((TOTAL_S - 6.8) * 100) / 100; // WhatsApp number on screen for the last ~6.8 s
export const SCENES = SC.map(([k, i], n) => [k, n === 0 ? 0 : CUT[i], n + 1 < SC.length ? CUT[SC[n + 1][1]] : OUTRO_AT]).concat([['outro', OUTRO_AT, TOTAL_S]]);

export const K = {
  web: w(0, 4), mahiti: w(2, 1), nasti: w(2, 3),
  doc: w(5, 0), time: w(5, 2), addr: w(5, 3), bas: w(6, 1), padun: w(7, 3), kaam: w(8, 0), nahi8: w(8, 1),
  pahila: w(9, 0), google: w(9, 3), dentist: w(11, 1), kinva: w(11, 4), best: w(12, 0), pune: w(12, 4), search: w(13, 0), top: w(14, 3),
  pratyek: w(15, 1), treat: w(15, 2), vegla: w(15, 3), page: w(15, 4), fast: w(16, 0), load: w(16, 1), gbp: w(17, 1), connect: w(18, 0),
  dusra: w(19, 0), kami: w(19, 4), gpt: w(20, 0), gugalvar: w(21, 2), vichar: w(22, 1),
  q1: w(23, 0), q1e: w(23, 4), q2: w(24, 0), ai: w(25, 2), opinion: w(25, 4),
  faq: w(26, 3), treat2: w(27, 0), review: w(27, 3), struct: w(28, 1), gpt29: w(29, 1), recommend: w(29, 4),
  tisra: w(30, 1), mahatva: w(30, 3), appt: w(31, 0), booking: w(31, 1), slot: w(32, 2), book: w(32, 3),
  lagech: w(33, 0), wa: w(33, 1), confirm: w(33, 2), reminder: w(34, 3),
  visar: w(35, 2), noshow: w(36, 0), kami36: w(36, 1), recep: w(37, 1), phone: w(37, 2), bhar: w(37, 3), kami38: w(38, 1),
  vcard: w(39, 3), nahi39: w(39, 5), barobar: w(40, 1), h24: w(41, 2), sales: w(42, 0), machine: w(42, 1),
  system: w(43, 3), number: w(44, 2), whatsapp: w(45, 0),
};

const S = [
  [0.05, 'pop_lo', -6], [K.web, 'whoosh', -3], [K.mahiti, 'pop'], [K.nasti, 'error', -4], [K.nasti + 0.3, 'pop_hi'],
  [K.doc, 'pop'], [K.time, 'pop'], [K.addr, 'pop'], [K.padun, 'thud', -2], [K.kaam, 'error', -4],
  [K.pahila, 'pop_hi'], [K.dentist, 'type', -5], [K.best, 'type', -5], [K.search, 'tick'], [K.top - 0.05, 'riser', -5], [K.top + 0.2, 'ding', -3],
  [K.pratyek, 'pop'], [K.treat, 'pop'], [K.page, 'pop'], [K.fast, 'swish'], [K.load, 'ding', -5], [K.gbp, 'pop'], [K.connect, 'stamp', -4],
  [K.dusra, 'pop_hi'], [K.gpt, 'sparkle', -3], [K.gugalvar, 'whoosh', -4],
  [K.q1, 'type', -6], [K.q2, 'type', -6], [K.ai, 'sparkle', -5],
  [K.faq, 'thud', -3], [K.treat2, 'thud', -3], [K.review, 'thud', -3], [K.recommend, 'ding', -2],
  [K.tisra, 'pop_hi'], [K.appt, 'whoosh', -4], [K.slot, 'tick'], [K.book, 'pop'], [K.book + 0.15, 'ding', -4],
  [K.wa, 'pop'], [K.reminder, 'ding', -3],
  [K.kami36, 'swish'], [K.recep, 'tick', -4], [K.kami38, 'pop'],
  [K.vcard, 'pop'], [K.nahi39, 'whoosh'], [K.h24, 'tick'], [K.sales, 'cash'], [K.machine, 'sparkle', -4],
  [NUM_AT, 'pop'], [OUTRO_AT + 0.05, 'whoosh'],
];
export const SFX = S.concat(SCENES.slice(1, -1).map(([, a]) => [Math.max(0, a - 0.1), 'swish', -7])).sort((a, b) => a[0] - b[0]);
