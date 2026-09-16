import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';
import { root, runtimeFiles, walk } from './files.mjs';
const files = runtimeFiles();
const external = value => /^(?:[a-z][a-z\d+.-]*:|#|\/\/)/i.test(value);
function checkRef(from, value) {
  if (!value || external(value)) return;
  const clean = decodeURIComponent(value.split(/[?#]/)[0]);
  const target = path.resolve(path.dirname(from), clean);
  const relative = path.relative(root, target);
  if (relative.startsWith('..') || path.isAbsolute(relative) || !fs.statSync(target, { throwIfNoEntry: false })?.isFile()) {
    throw new Error(`Missing or unsafe reference: ${path.basename(from)} → ${value}`);
  }
}
let jsCount = 0;
for (const name of files) {
  const file = path.join(root, name);
  if (name.endsWith('.js')) {
    const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    if (result.status !== 0) throw new Error(result.stderr || 'Syntax check failed: ' + name);
    jsCount++;
  }
  if (name.endsWith('.html')) {
    const text = fs.readFileSync(file, 'utf8');
    for (const m of text.matchAll(/\b(?:src|href)=["']([^"']+)["']/g)) checkRef(file, m[1]);
  }
  if (name.endsWith('.css')) {
    for (const m of fs.readFileSync(file, 'utf8').matchAll(/url\(\s*["']?([^\s)"']+)/g)) checkRef(file, m[1]);
  }
}
const c = vm.createContext({}); c.window = c;
for (const name of ['assets', 'animations', 'meme-art', 'stages', 'board-themes']) vm.runInContext(fs.readFileSync(path.join(root, name + '.js'), 'utf8'), c);
const refs = new Set();
function collect(value) {
  if (typeof value === 'string' && /\.(png|webp|jpe?g|svg)$/.test(value)) refs.add(value);
  else if (value && typeof value === 'object') Object.values(value).forEach(collect);
}
for (const key of ['ASSETS', 'ANIMATIONS', 'MEME_ART', 'STAGES', 'ChessBoards']) collect(c[key]);
for (const ref of refs) checkRef(path.join(root, 'index.html'), ref);
const docs = ['README.md', 'CONTRIBUTING.md', 'ASSET_NOTICE.md'].map(name => path.join(root, name)).concat(walk(path.join(root, 'docs')));
for (const doc of docs) {
  for (const m of fs.readFileSync(doc, 'utf8').matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) checkRef(doc, m[1]);
}
console.log(`Checked ${jsCount} JavaScript files, ${refs.size} indexed images, all page/style references and ${docs.length} document links.`);
