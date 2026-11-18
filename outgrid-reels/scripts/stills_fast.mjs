// Many QA stills with ONE bundle (qa_stills.sh re-bundles per frame; this is much faster for long videos).
// usage (from outgrid-reels/): node scripts/stills_fast.mjs reels/<name> <outdir> <scale> f1 f2 ...   -> <outdir>/f_<n>.png
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';

const [dir, out, scale, ...frames] = process.argv.slice(2);
const browserExecutable = fs.readFileSync('.browser', 'utf8').trim();
fs.mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve(dir, 'reel.jsx'), publicDir: path.resolve(dir, 'public')});
const composition = await selectComposition({serveUrl, id: process.env.COMP || 'Reel', inputProps: {}, browserExecutable});
for (const f of frames) {
  await renderStill({serveUrl, composition, frame: Math.min(Number(f), composition.durationInFrames - 1), output: path.join(out, `f_${f}.png`), scale: Number(scale), browserExecutable, inputProps: {}});
  process.stdout.write('.');
}
console.log(` ${frames.length} stills -> ${out}`);
