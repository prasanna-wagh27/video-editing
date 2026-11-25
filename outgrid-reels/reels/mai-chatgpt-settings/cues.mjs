// Scene list + sound-effect cues from timing.mjs (Whisper-aligned words of script_hi.txt).
import {LT, CUT, END, WT} from './timing.mjs';

export const w = (i, k = 0) => WT[i][Math.min(k, WT[i].length - 1)][1];
export const C = (i) => CUT[i];

const SC = [['hook', 0], ['bad', 2], ['three', 4], ['s1', 6], ['intern', 14], ['forget', 17], ['s2', 20], ['priv', 29], ['s3', 33], ['safe', 37], ['recap', 42], ['follow', 45]];
export const OUTRO_LEN = 3.2;
export const OUTRO_AT = Math.round((END + 0.45) * 100) / 100;
export const TOTAL_S = OUTRO_AT + OUTRO_LEN;
export const SCENES = SC.map(([k, i], n) => [k, n === 0 ? 0 : CUT[i], n + 1 < SC.length ? CUT[SC[n + 1][1]] : OUTRO_AT]).concat([['outro', OUTRO_AT, TOTAL_S]]);
const st = (k) => SCENES.find((x) => x[0] === k)[1];

export const K = {
  gpt0: w(0, 2), chuk: w(1, 0), paddhat1: w(1, 1),
  mhanun: w(2, 0), uttar3: w(3, 2), nahi3: w(3, 4),
  tumhi4: w(4, 0), teen: w(5, 3), settings5: w(5, 4),
  s1: st('s1'), pers: w(6, 2), custom: w(7, 1), sanga: w(8, 3),
  kaam: w(9, 1), marathi: w(10, 2), english: w(11, 1), kasa: w(12, 2), set: w(13, 2),
  intern: w(14, 3), nahi14: w(14, 4), smart: w(15, 2), asst: w(16, 0),
  aata: w(17, 0), sangitla: w(18, 3), udya: w(19, 1), visrun: w(19, 4),
  s2: st('s2'), memory: w(21, 0), on: w(21, 2), yamule: w(22, 0), aavad: w(22, 2), paddhat: w(23, 0), goshti: w(24, 0), lakshat: w(25, 1),
  navin: w(26, 0), pahilya: w(27, 1), nahi28: w(28, 3),
  mahatva: w(29, 2), kamachya: w(31, 0), personal: w(31, 2), share: w(32, 0), barobar: w(32, 2),
  s3: st('s3'), data: w(33, 1), improve: w(34, 1), everyone: w(35, 1), band: w(36, 0),
  chats: w(37, 3), openai: w(38, 0), training: w(38, 2), nahit: w(39, 2), history: w(40, 2), safe: w(41, 2),
  teen2: w(42, 2), bagha: w(43, 1), nimma: w(44, 0), vachvata: w(44, 3),
  tips: w(45, 2), mai: w(46, 0), follow: w(47, 1),
};

const S = [
  [0.03, 'pop_lo', -6], [K.chuk, 'error', -4], [K.gpt0, 'pop'],
  [K.mhanun + 0.3, 'type', -7], [K.nahi3, 'error', -5],
  [K.teen, 'pop'], [K.teen + 0.15, 'pop'], [K.teen + 0.3, 'pop_hi'],
  [K.s1 + 0.15, 'tick'], [Math.max(K.pers + 0.1, K.s1 + 0.9), 'tick'], [K.custom, 'tick'],
  [K.kaam, 'type', -6], [K.marathi, 'type', -6], [K.kasa, 'type', -6], [K.set - 0.45, 'tick'], [K.set + 0.05, 'ding', -5],
  [K.intern, 'pop'], [K.nahi14, 'error', -5], [K.smart, 'sparkle', -3],
  [K.sangitla, 'pop'], [K.udya, 'swish'], [K.visrun, 'error', -5],
  [K.s2 + 0.3, 'tick'], [K.on, 'tick'], [K.on + 0.05, 'pop_hi', -3], [K.yamule, 'tick'], [K.aavad, 'pop'], [K.paddhat, 'pop'], [K.goshti, 'pop'], [K.lakshat, 'ding', -4],
  [K.navin, 'swish'], [K.navin + 0.6, 'type', -7], [K.pahilya, 'error', -6],
  [K.mahatva, 'stamp', -4], [K.kamachya, 'whoosh', -5], [K.personal, 'whoosh', -5], [K.barobar, 'pop'],
  [K.s3 + 0.3, 'tick'], [K.data, 'tick'], [K.improve, 'tick'], [K.band, 'tick'], [K.band + 0.05, 'pop_hi', -3],
  [K.chats, 'swish'], [K.nahit, 'stamp', -4], [K.history, 'pop'], [K.safe, 'ding', -4],
  [K.teen2, 'pop'], [K.teen2 + 0.2, 'pop'], [K.teen2 + 0.4, 'pop'], [K.nimma, 'sparkle', -3],
  [K.mai, 'pop'], [K.follow, 'pop_hi'], [K.follow + 0.15, 'ding', -4], [OUTRO_AT + 0.05, 'whoosh'],
];
export const SFX = S.concat(SCENES.slice(1, -1).map(([, a]) => [Math.max(0, a - 0.1), 'swish', -7])).sort((a, b) => a[0] - b[0]);
