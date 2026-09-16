import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).flatMap(entry => {
    const p = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) throw new Error('Symbolic links are not packaged: ' + p);
    return entry.isDirectory() ? walk(p) : [p];
  });
}
export function runtimeFiles() {
  const top = fs.readdirSync(root).filter(name => /\.(html|css|js)$/.test(name));
  return [...top, ...['assets', 'raster', 'stages', 'chess-scenes'].flatMap(dir => walk(path.join(root, dir)).map(p => path.relative(root, p)))].sort();
}
