import fs from 'node:fs';
import path from 'node:path';
import { root, runtimeFiles, walk } from './files.mjs';
const output = path.resolve(root, 'dist');
if (path.dirname(output) !== root || path.basename(output) !== 'dist') throw new Error('Invalid build directory');
if (fs.lstatSync(output, { throwIfNoEntry: false })?.isSymbolicLink()) throw new Error('Build directory must not be a link');
// Only the explicitly generated dist directory is refreshed.
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
const files = [...runtimeFiles(), 'LICENSE', 'ASSET_NOTICE.md', ...walk(path.join(root, 'docs')).map(p => path.relative(root, p))];
for (const name of files) {
  const dest = path.join(output, name);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(path.join(root, name), dest);
}
console.log(`Built dist/ with ${files.length} files. Entry: dist/index.html`);
