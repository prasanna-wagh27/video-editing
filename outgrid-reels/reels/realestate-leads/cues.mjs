// Scene list + sound-effect cues. Times come from timing.mjs (Whisper-aligned words of script_hi.txt).
// w(line, k): start (s) of word k (index) of script_hi line `line` (0-based). C(i): cut before line i.
import {LT, CUT, END, WT} from './timing.mjs';

export const w = (i, k = 0) => WT[i][Math.min(k, WT[i].length - 1)][1];
export const L = (i) => LT[i];
export const C = (i) => CUT[i];

// [scene, first script line]
const SC = [
  ['hook', 0], ['src', 2], ['busy', 5], ['late', 7], ['dash', 10], ['wa', 13], ['remind', 15], ['visits', 17], ['broch', 20], ['ai', 22], ['cta', 26],
];
export const OUTRO_AT = Math.round((END + 0.45) * 100) / 100;
export const OUTRO_LEN = 3.4;
export const SCENES = SC.map(([k, i], n) => [k, n === 0 ? 0 : CUT[i], n + 1 < SC.length ? CUT[SC[n + 1][1]] : OUTRO_AT]).concat([['outro', OUTRO_AT, OUTRO_AT + OUTRO_LEN]]);

// named cues shared by visuals and SFX
export const K = {
  missed: w(0, 4), client: w(1, 3), gela: w(1, 4),
  a99: w(2, 0), housing: w(2, 1), mb: w(2, 2), fb: w(2, 3),
  leads: w(3, 0), yetat: w(3, 2), vegvegly: w(4, 2), phone: w(4, 3),
  site: w(5, 1), staff: w(6, 0), bizi: w(6, 1),
  donteen: w(7, 0), reply: w(7, 2), buyer: w(8, 1), dusrya: w(8, 3), fix: w(9, 1),
  aata: w(10, 0), intel: w(11, 0), lead12: w(12, 1), dash: w(12, 3),
  lagech: w(13, 0), wa: w(13, 3), auto: w(14, 0), jato: w(14, 2),
  velevar: w(15, 2), follow: w(15, 3), reminder: w(16, 0),
  zali: w(17, 4), baki: w(18, 1), ekach: w(19, 1), screen: w(19, 2),
  broch: w(20, 2), pathavla: w(21, 2),
  ai: w(22, 2), navin: w(23, 1), five: w(24, 0), call: w(24, 3), req: w(25, 1), details: w(25, 3),
  office: w(26, 3), system: w(27, 1), baghaych: w(28, 1), khali: w(29, 1), LEAD: w(29, 2), comment: w(29, 3),
};

const S = [
  [0.05, 'tick', -6], [K.missed - 0.05, 'error', -3], [K.client, 'swish'], [K.gela, 'thud', -3],
  [K.a99, 'pop'], [K.housing, 'pop'], [K.mb, 'pop'], [K.fb, 'pop'], [K.leads, 'whoosh', -3], [K.vegvegly, 'swish'], [K.phone, 'ding', -4],
  [K.site, 'pop_lo'], [K.bizi, 'error', -5],
  [K.donteen, 'tick', -2], [K.reply, 'pop'], [K.dusrya, 'swish'], [K.fix, 'stamp', -3],
  [K.intel, 'riser', -4], [K.intel + 0.6, 'sparkle', -4], [K.dash, 'whoosh'],
  [K.wa, 'pop'], [K.auto, 'ding', -3],
  [K.follow, 'pop_lo'], [K.reminder, 'ding', -3],
  [K.zali, 'pop_hi'], [K.baki, 'tick'], [K.screen, 'whoosh', -3],
  [K.broch, 'pop'], [K.pathavla, 'swish'], [K.pathavla + 0.5, 'ding', -4],
  [K.ai, 'sparkle', -3], [K.five, 'tick'], [K.call, 'pop_lo'], [K.req, 'type', -5], [K.details, 'pop'],
  [K.LEAD, 'type', -4], [K.comment, 'pop'], [OUTRO_AT + 0.05, 'whoosh'],
];
export const SFX = S.concat(SCENES.slice(1, -1).map(([, a]) => [Math.max(0, a - 0.1), 'swish', -6])).sort((a, b) => a[0] - b[0]);
