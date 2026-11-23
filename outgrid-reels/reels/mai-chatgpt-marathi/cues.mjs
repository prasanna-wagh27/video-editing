// Scene list + sound-effect cues from timing.mjs (Whisper-aligned words of script_hi.txt).
import {LT, CUT, END, WT} from './timing.mjs';

export const w = (i, k = 0) => WT[i][Math.min(k, WT[i].length - 1)][1];
export const C = (i) => CUT[i];

const SC = [['pocket', 0], ['gpt', 3], ['step1', 5], ['step2', 6], ['step3', 8], ['answer', 11], ['nofear', 12], ['topics', 14], ['share', 16], ['follow', 18], ['comment', 20]];
export const OUTRO_LEN = 3.2;
export const OUTRO_AT = Math.round((END + 0.4) * 100) / 100;
export const TOTAL_S = OUTRO_AT + OUTRO_LEN;
export const SCENES = SC.map(([k, i], n) => [k, n === 0 ? 0 : CUT[i], n + 1 < SC.length ? CUT[SC[n + 1][1]] : OUTRO_AT]).concat([['outro', OUTRO_AT, TOTAL_S]]);

export const K = {
  khisa: w(0, 1), manus: w(0, 4), chovis: w(1, 1), marathi1: w(1, 4), ek: w(2, 1), rupaya: w(2, 2), nahi2: w(2, 4),
  hoy: w(3, 0), gpt: w(3, 3), marathi4: w(4, 1),
  phakt: w(5, 0), gptapp: w(5, 1), ughda: w(5, 3),
  khali: w(6, 0), ujvi: w(6, 1), voice: w(7, 0), button: w(7, 1), click: w(7, 2),
  bola: w(8, 1), q0: w(9, 0), diwali: w(9, 2), offer: w(9, 3), kalpana: w(10, 0), sanga: w(10, 1),
  bagha: w(11, 0), kshanat: w(11, 1), uttar: w(11, 3),
  typing: w(12, 1), nahi12: w(12, 3), english: w(13, 0), nahi13: w(13, 2),
  sheti: w(14, 0), arogya: w(14, 1), vyavsay: w(14, 2), abhyas: w(15, 1), kahihi: w(15, 2),
  aaibaba: w(16, 3), mitra: w(17, 1), pathva: w(17, 3),
  ai18: w(18, 3), follow: w(19, 0),
  comment: w(20, 1), AI: w(20, 2), liha: w(20, 3), free: w(21, 3), pdf: w(21, 5), lagech: w(22, 0),
};

const S = [
  [0.05, 'pop_lo', -6], [K.manus, 'pop'], [K.chovis, 'tick'], [K.marathi1, 'pop_hi'], [K.rupaya, 'coin'], [K.nahi2, 'stamp', -4],
  [K.gpt, 'sparkle', -3], [K.marathi4, 'pop'],
  [K.gptapp, 'pop'], [K.ughda, 'tick'],
  [K.ujvi, 'swish', -4], [K.click, 'tick'], [K.click + 0.05, 'pop_hi'],
  [K.bola, 'riser', -6], [K.q0, 'type', -6],
  [K.kshanat, 'ding', -3], [K.uttar, 'pop'],
  [K.typing, 'error', -5], [K.english, 'error', -5],
  [K.sheti, 'pop'], [K.arogya, 'pop'], [K.vyavsay, 'pop'], [K.abhyas, 'pop'], [K.kahihi, 'sparkle', -4],
  [K.aaibaba, 'swish'], [K.mitra, 'swish'], [K.pathva, 'whoosh', -3],
  [K.follow, 'pop_hi'], [K.follow + 0.15, 'ding', -4],
  [K.AI, 'type', -5], [K.liha, 'pop'], [K.pdf, 'cash', -3], [OUTRO_AT + 0.05, 'whoosh'],
];
export const SFX = S.concat(SCENES.slice(1, -1).map(([, a]) => [Math.max(0, a - 0.1), 'swish', -7])).sort((a, b) => a[0] - b[0]);
