// Scene list, chapters and sound-effect cues. Times come from timing.mjs (Whisper-aligned words of script_hi.txt).
// w(line, k): start (s) of word k (index or substring) of script_hi line `line` (0-based).
import {LT, CUT, END, WT} from './timing.mjs';

export const w = (i, k = 0) => {
  if (typeof k === 'number') return WT[i][Math.min(k, WT[i].length - 1)][1];
  const hit = WT[i].find(([x]) => x.includes(k));
  if (!hit) throw new Error(`word "${k}" not in line ${i}: ${WT[i].map((x) => x[0]).join(' ')}`);
  return hit[1];
};
export const L = (i) => LT[i];
export const C = (i) => CUT[i];

const SC = [
  ['hook', 0], ['ask', 3], ['land', 6], ['room', 8], ['title', 10],
  ['how', 12], ['straw', 14], ['spawn', 16], ['bags', 18], ['climate', 20], ['noland', 22],
  ['types', 24], ['button', 25], ['buttonUse', 27], ['oyster', 30], ['milky', 34], ['choose', 36],
  ['pune', 39], ['contacts', 41], ['questions', 44], ['five', 48], ['fifty', 51], ['produce', 53],
  ['calc', 54], ['roomCost', 56], ['equip', 58], ['small', 64], ['big', 66], ['cycle', 69], ['separate', 73],
  ['bags3100', 75], ['yield', 77], ['sales', 79], ['cost', 83], ['diff', 86], ['notProfit', 88], ['depends', 93],
  ['problem', 95], ['made300', 98], ['buy150', 101], ['leftover', 103], ['fresh', 104], ['cheap', 106], ['custFirst', 108],
  ['more', 109], ['products', 111], ['dry', 114], ['powder', 118], ['brand', 119], ['license', 121],
  ['running', 123], ['growth', 127], ['expand', 128], ['aggregate', 131], ['supply', 133],
  ['three', 135], ['sold', 142], ['startSmall', 146],
  ['question', 149], ['comment', 154], ['subscribe', 155], ['next', 157],
];
export const OUTRO_AT = Math.round((END + 0.45) * 100) / 100;
export const SCENES = SC.map(([k, i], n) => [k, n === 0 ? 0 : CUT[i], n + 1 < SC.length ? CUT[SC[n + 1][1]] : OUTRO_AT]).concat([['outro', OUTRO_AT, OUTRO_AT + 3]]);
export const HOOK_END = CUT[3];
export const CHAPTERS = [
  [CUT[12], 'शेती कशी होते'], [CUT[24], 'मशरूमचे प्रकार'], [CUT[39], 'मागणी शोधा'], [CUT[54], 'गुंतवणूक'], [CUT[75], 'कमाईचा हिशोब'],
  [CUT[95], 'खरी अडचण'], [CUT[109], 'जास्त कमाई'], [CUT[123], 'व्यवसाय वाढवा'], [CUT[135], '३ महत्त्वाच्या गोष्टी'], [CUT[149], 'तुमचा प्रश्न'],
];

// named cue times shared by visuals (reel.jsx) and sound effects (SFX below)
export const K = {
  // hook
  lakh: w(0, 'लाखो'), hoy: w(2, 0), invest: w(3, 'गुंतवणूक'), how: w(4, 'कसा'),
  acre: w(6, 'एकरभर'), no: w(7, 'नाही'), smallRoom: w(8, 'छोट्या'), title: w(10, 'मशरूम'), titleB: w(11, 0),
  // chapter 1
  howQ: w(13, 'कशी'), straw1: w(14, 'धान्याचा'), straw2: w(15, 'गव्हाचा'), process: w(16, 'प्रक्रिया'), spawn: w(17, 'स्पॉन'),
  bags: w(18, 'बॅग्स'), clean: w(19, 'स्वच्छ'), temp: w(20, 'तापमान'), moist: w(20, 'ओलावा'), weeks: w(21, 'आठवड्यांत'), ready: w(21, 'तयार'),
  noLand: w(22, 'शेतजमिनीशिवायही'), prod: w(23, 'उत्पादन'),
  // chapter 2
  three: w(24, 'तीन'), button: w(25, 'बटन'), market: w(26, 'बाजारात'), superm: w(26, 'सुपरमार्केटमध्ये'), white: w(26, 'पांढरे'),
  hotel: w(27, 0), pizza: w(28, 'पिझ्झा'), resto: w(28, 'रेस्टॉरंट्समध्ये'), bigUse: w(29, 'मोठ्या'),
  oyster: w(30, 'ऑयस्टर'), smallStart: w(31, 'कमी'), good: w(32, 'चांगला'), oyStraw: w(33, 'भुसा'),
  milky: w(34, 'मिल्की'), hot: w(35, 'उष्ण'), which: w(36, 'कोणता'), demand: w(37, 'मागणी'), facility: w(38, 'सुविधांवर'), decide: w(38, 'ठरवा'),
  // chapter 3
  pune: w(39, 'पुण्यात'), cResto: w(41, 'रेस्टॉरंट्स'), cHotel: w(42, 0), cCafe: w(43, 'कॅफे'), cVeg: w(43, 'भाजी'), contact: w(43, 'संपर्क'),
  q1: w(44, 'किती'), q2: w(45, 'किती'), q3: w(46, 'कोणत्या'), five: w(49, 'पाच'), ten: w(49, '१०'), fifty: w(51, '५०'), potential: w(52, 'संभाव्य'),
  byDemand: w(53, 'मागणीनुसार'), startProd: w(53, 'उत्पादन'),
  // chapter 4
  calc: w(55, 'हिशोब'), haveRoom: w(56, 'खोली'), less: w(57, 'कमी'),
  rack: w(58, 0), humid: w(59, 0), spray: w(60, 0), eSpawn: w(61, 0), eStraw: w(62, 0), eBags: w(63, 0), eOther: w(63, 'इतर'),
  s50: w(64, '५०'), s150: w(65, 'दीड'), bigSetup: w(66, 'मोठा'), tempCtl: w(66, 'तापमान'), b3: w(67, 'तीन'), b8: w(68, 'आठ'),
  cycle: w(69, 'चक्रासाठी'), cSpawn: w(69, 'स्पॉन'), cStraw: w(70, 0), cPower: w(71, 0), cPack: w(72, 'पॅकिंग'), cLabour: w(72, 'मजुरीचा'),
  startInv: w(73, 'सुरुवातीची'), daily: w(73, 'रोजचा'), apart: w(74, 'वेगळे'),
  // chapter 5
  year: w(75, 'वर्षभरात'), n3100: w(76, 0), g950: w(77, '९५०'), kg2950: w(78, '२,९५०'), price180: w(80, '१८०'), sale: w(81, 'विक्री'), r531: w(82, 0),
  r40: w(83, '४०'), cost3100: w(84, 'खर्च'), r124: w(85, 0), diff: w(86, 'फरक'), r407: w(87, '४'),
  notFinal: w(88, 'अंतिम'), mLabour: w(89, 0), mPower: w(90, 0), mPack: w(91, 0), mTrans: w(92, 0), mOther: w(92, 'इतर'),
  realProfit: w(93, 'प्रत्यक्ष'), costDep: w(94, 'खर्चावर'), rateDep: w(94, 'दरावर'),
  // chapter 6
  biggest: w(96, 'अडचण'), notProd: w(96, 'उत्पादन'), sales: w(97, 'विक्री'), k300: w(100, '३००'), buyers: w(101, 'ग्राहक'), k150: w(102, '१५०'),
  left150: w(103, 'उरलेल्या'), what: w(103, 'काय'), fresh: w(104, 'ताजे'), soon: w(105, 'लवकर'), cheap: w(106, 'कमी'), lessProfit: w(107, 'कमी'),
  custUp: w(108, 'ग्राहक'), prodUp: w(108, 'उत्पादन'),
  // chapter 7
  more: w(110, 'पैसे'), dry: w(111, 'ड्राय'), powder: w(112, 'पावडर'), pickle: w(112, 'पिकल'), dryFresh: w(115, 'ताजे'), sun: w(115, 'सुकवून'), pack: w(115, 'पॅकिंग'),
  store: w(116, 'साठवण'), sell: w(116, 'विक्री'), powderUse: w(118, 'खाद्यपदार्थांमध्ये'), brand: w(120, 'फूड'), lic1: w(121, 'प्रक्रिया'), lic2: w(122, 'पॅकेजिंग'), lic3: w(122, 'लायसन्स'),
  // chapter 8
  regular: w(125, 'नियमित'), steady: w(126, 'सातत्य'), grow: w(127, 'हळूहळू'), moreResto: w(128, 'रेस्टॉरंट्सना'), superm2: w(129, 'सुपरमार्केटशी'), ownBrand: w(130, 'ब्रँड'),
  farmers: w(131, 'शेतकऱ्यांकडून'), underBrand: w(132, 'ब्रँडखाली'), smallFarm: w(133, 'छोट्या'), company: w(134, 'सप्लाय'),
  // chapter 9 + end
  things: w(135, 'तीन'), first: w(136, 0), quality: w(137, 'गुणवत्ता'), second: w(138, 0), third: w(140, 0), account: w(141, 'हिशोब'),
  readyM: w(142, 'तयार'), notSuccess: w(143, 'नाही'), rightPrice: w(144, 'योग्य'), profit: w(145, 'नफा'),
  startS: w(146, 'छोट्या'), oneCycle: w(147, 'चक्र'), thenInv: w(148, 'गुंतवणूक'),
  question: w(149, 'प्रश्न'), twoLakh: w(150, 'दोन'), optA: w(151, 'फार्म'), optB: w(152, 'शेतकऱ्यांकडून'), optB2: w(153, 'ब्रँड'),
  comment: w(154, 0), subscribe: w(156, 'सबस्क्राइब'), next: w(157, 'पुढच्या'),
};

// [sec, sound, gain dB]. A whoosh is added at every scene cut (in sfx export below).
const S = [
  [0.05, 'pop_lo', -2], [K.lakh, 'coin', -1], [K.lakh + 0.35, 'coin', -4], [K.hoy, 'boom', 1], [K.hoy, 'stamp', -2],
  [K.invest, 'pop'], [K.how, 'pop'], [K.acre, 'thud', -2], [K.no - 0.45, 'error', -2], [K.smallRoom, 'ding', -3],
  [K.title, 'riser', -3], [K.title, 'boom'], [K.title + 0.1, 'sparkle', -4],
  [K.howQ, 'pop_hi', -3], [K.straw1, 'thud', -3], [K.straw2, 'thud', -3], [K.process, 'swish'], [K.spawn, 'pop'], [K.spawn + 0.2, 'type', -6],
  [K.bags, 'pop', -2], [K.bags + 0.25, 'pop', -4], [K.bags + 0.5, 'pop', -6], [K.clean, 'sparkle', -3], [K.temp, 'pop'], [K.moist, 'pop'], [K.ready, 'ding', -2],
  [K.noLand, 'error', -6], [K.prod, 'ding', -3],
  [K.three, 'pop_lo'], [K.three + 0.15, 'pop_lo'], [K.three + 0.3, 'pop_lo'], [K.button, 'pop'], [K.superm, 'swish'], [K.hotel, 'pop'], [K.pizza, 'pop'], [K.resto, 'pop'], [K.bigUse, 'coin', -3],
  [K.oyster, 'pop'], [K.smallStart, 'ding', -4], [K.oyStraw, 'swish'], [K.milky, 'pop'], [K.hot, 'swish'], [K.demand, 'pop_hi', -3], [K.facility, 'pop_hi', -3], [K.decide, 'ding', -3],
  [K.pune, 'thud', -1], [K.cResto, 'pop'], [K.cHotel, 'pop'], [K.cCafe, 'pop'], [K.cVeg, 'pop'], [K.contact, 'ding', -4],
  [K.q1, 'type', -4], [K.q2, 'type', -4], [K.q3, 'type', -4], [K.five, 'pop'], [K.five + 0.1, 'pop', -2], [K.five + 0.2, 'pop', -3], [K.five + 0.3, 'pop', -4], [K.five + 0.4, 'pop', -5],
  [K.ten, 'tick'], [K.fifty, 'cash', -2], [K.byDemand, 'swish'], [K.startProd, 'ding', -4],
  [K.calc, 'riser', -4], [K.calc, 'thud', -3], [K.haveRoom, 'ding', -4], [K.less, 'swish'],
  [K.rack, 'pop'], [K.humid, 'pop'], [K.spray, 'pop'], [K.eSpawn, 'pop'], [K.eStraw, 'pop'], [K.eBags, 'pop'], [K.eOther, 'pop'],
  [K.s50, 'tick'], [K.s150, 'coin', -2], [K.bigSetup, 'thud', -3], [K.b8, 'coin', -2], [K.cycle, 'swish'],
  [K.cSpawn, 'pop'], [K.cStraw, 'pop'], [K.cPower, 'pop'], [K.cPack, 'pop'], [K.cLabour, 'pop'], [K.startInv, 'coin', -4], [K.daily, 'coin', -4], [K.apart, 'swish'],
  [K.n3100, 'riser', -5], [K.n3100, 'ding', -4], [K.g950, 'pop'], [K.kg2950, 'thud', -2], [K.price180, 'tick'], [K.r531, 'cash'], [K.r40, 'tick'], [K.r124, 'stamp', -4],
  [K.diff, 'swish'], [K.r407, 'cash'], [K.notFinal, 'stamp', -1], [K.mLabour, 'pop_lo', -2], [K.mPower, 'pop_lo', -2], [K.mPack, 'pop_lo', -2], [K.mTrans, 'pop_lo', -2], [K.mOther, 'pop_lo', -2],
  [K.costDep, 'tick'], [K.rateDep, 'tick'],
  [K.notProd, 'pop_lo'], [K.sales, 'error', -1], [K.k300, 'thud', -2], [K.buyers, 'swish'], [K.k150, 'coin', -3], [K.left150, 'error', -3], [K.fresh, 'tick'], [K.soon, 'tick'],
  [K.cheap, 'pop_lo'], [K.lessProfit, 'error', -4], [K.custUp, 'ding', -4], [K.prodUp, 'ding', -4],
  [K.more, 'coin', -3], [K.dry, 'pop'], [K.powder, 'pop'], [K.pickle, 'pop'], [K.sun, 'swish'], [K.pack, 'pop'], [K.store, 'ding', -5], [K.powderUse, 'pop'],
  [K.brand, 'sparkle', -3], [K.lic1, 'tick'], [K.lic2, 'tick'], [K.lic3, 'stamp', -3],
  [K.regular, 'pop'], [K.steady, 'pop'], [K.grow, 'riser', -6], [K.moreResto, 'pop'], [K.superm2, 'pop'], [K.ownBrand, 'sparkle', -4], [K.farmers, 'swish'], [K.underBrand, 'pop'],
  [K.company, 'boom', -2], [K.company, 'sparkle', -4],
  [K.first, 'pop'], [K.second, 'pop'], [K.third, 'pop'], [K.notSuccess, 'error', -4], [K.rightPrice, 'ding', -3], [K.profit, 'cash', -2],
  [K.startS, 'pop'], [K.oneCycle, 'pop'], [K.thenInv, 'ding', -3],
  [K.twoLakh, 'coin', -2], [K.optA, 'pop'], [K.optB, 'pop'], [K.comment, 'type', -4], [K.subscribe, 'pop'], [K.subscribe + 0.45, 'ding', -3],
  [OUTRO_AT, 'riser', -5], [OUTRO_AT + 0.05, 'boom', -2], [OUTRO_AT + 0.2, 'sparkle', -4],
];
export const SFX = S.concat(SCENES.slice(1).map(([, a]) => [Math.max(0, a - 0.12), 'whoosh', -3])).sort((a, b) => a[0] - b[0]);
