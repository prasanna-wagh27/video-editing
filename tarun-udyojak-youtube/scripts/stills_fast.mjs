// Bundle once, render many QA stills, tile them into contact sheets.
// usage (from tarun-udyojak-youtube/): node scripts/stills_fast.mjs videos/<name> <Composition> <sec> [sec...]
//   -> videos/<name>/stills/f_<sec>.jpg and stills/sheet_<n>.jpg (3x3 per sheet, 640 px tiles, time stamped)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {execSync} from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const [dir, comp, ...secs] = process.argv.slice(2);
const browser = execSync('bash ../outgrid-reels/scripts/find_browser.sh').toString().trim();
const out = path.resolve(dir, 'stills');
fs.mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve(dir, 'video.jsx'), publicDir: path.resolve(dir, 'public')});
const inputProps = {withAudio: false};
const composition = await selectComposition({serveUrl, id: comp, inputProps, browserExecutable: browser});
const files = [];
for (const s of secs) {
  const f = path.join(out, `f_${s}.jpg`);
  await renderStill({serveUrl, composition, frame: Math.min(composition.durationInFrames - 1, Math.round(Number(s) * 30)), output: f, inputProps, imageFormat: 'jpeg', jpegQuality: 85, browserExecutable: browser, overwrite: true});
  files.push([s, f]);
  process.stdout.write(`${s} `);
}
for (let k = 0; k < files.length; k += 9) {
  const g = files.slice(k, k + 9);
  const ins = g.map(([, f]) => `-i ${f}`).join(' ');
  const cells = g.map(([s], i) => `[${i}]scale=640:-1,drawtext=text='${s}s':x=10:y=10:fontsize=28:fontcolor=yellow:box=1:boxcolor=black@0.6[v${i}]`).join(';');
  const layout = g.map((_, i) => `${(i % 3) * 640}_${Math.floor(i / 3) * 360}`).join('|');
  const sheet = path.join(out, `sheet_${k / 9}.jpg`);
  const tail = g.length > 1 ? `;${g.map((_, i) => `[v${i}]`).join('')}xstack=inputs=${g.length}:layout=${layout}:fill=black` : '';
  execSync(`ffmpeg -hide_banner -loglevel error -y ${ins} -filter_complex "${cells}${tail}" -frames:v 1 ${sheet}`);
  console.log('\n' + sheet);
}
