import './build.mjs';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { deflateRawSync } from 'node:zlib';
import { root, walk } from './files.mjs';
const table = Uint32Array.from({ length: 256 }, (_, n) => {
  for (let i = 0; i < 8; i++) n = n & 1 ? 0xedb88320 ^ (n >>> 1) : n >>> 1;
  return n >>> 0;
});
function crc32(data) { let n = 0xffffffff; for (const b of data) n = table[(n ^ b) & 255] ^ (n >>> 8); return (n ^ 0xffffffff) >>> 0; }
const output = path.join(root, 'releases'), dir = path.join(root, 'dist');
fs.mkdirSync(output, { recursive: true });
const version = JSON.parse(fs.readFileSync(path.join(root, 'package.json'))).version;
if (!/^[\d]+\.[\d]+\.[\d]+(?:-[\w.-]+)?$/.test(version)) throw new Error('Invalid version');
const name = `abstract-brawl-web-v${version}.zip`, local = [], central = [];
let offset = 0;
const files = walk(dir);
if (files.length > 65535) throw new Error('Too many files for standard ZIP');
for (const file of files) {
  const filename = Buffer.from(path.relative(dir, file).split(path.sep).join('/'));
  const data = fs.readFileSync(file), zipped = deflateRawSync(data, { level: 6 }), crc = crc32(data);
  if (Math.max(data.length, zipped.length, offset) >= 0xffffffff) throw new Error('ZIP64 is not supported');
  const header = Buffer.alloc(30);
  header.writeUInt32LE(0x04034b50); header.writeUInt16LE(20, 4); header.writeUInt16LE(0x800, 6); header.writeUInt16LE(8, 8);
  header.writeUInt16LE(33, 12); header.writeUInt32LE(crc, 14); header.writeUInt32LE(zipped.length, 18); header.writeUInt32LE(data.length, 22); header.writeUInt16LE(filename.length, 26);
  local.push(header, filename, zipped);
  const entry = Buffer.alloc(46);
  entry.writeUInt32LE(0x02014b50); entry.writeUInt16LE(20, 4); entry.writeUInt16LE(20, 6); entry.writeUInt16LE(0x800, 8); entry.writeUInt16LE(8, 10);
  entry.writeUInt16LE(33, 14); entry.writeUInt32LE(crc, 16); entry.writeUInt32LE(zipped.length, 20); entry.writeUInt32LE(data.length, 24); entry.writeUInt16LE(filename.length, 28); entry.writeUInt32LE(offset, 42);
  central.push(entry, filename); offset += header.length + filename.length + zipped.length;
}
const size = central.reduce((n, b) => n + b.length, 0);
if (offset + size + 22 >= 0xffffffff) throw new Error('Archive exceeds standard ZIP limit');
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50); end.writeUInt16LE(files.length, 8); end.writeUInt16LE(files.length, 10); end.writeUInt32LE(size, 12); end.writeUInt32LE(offset, 16);
const zip = Buffer.concat([...local, ...central, end]);
fs.writeFileSync(path.join(output, name), zip);
const hash = crypto.createHash('sha256').update(zip).digest('hex');
fs.writeFileSync(path.join(output, name + '.sha256'), `${hash}  ${name}\n`);
console.log(`Created releases/${name}: ${zip.length} bytes, ${files.length} files. SHA-256 ${hash}`);
