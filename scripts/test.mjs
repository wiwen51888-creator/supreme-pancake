import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { root } from './files.mjs';
const tests = fs.readdirSync(path.join(root, 'tests')).filter(x => x.endsWith('.test.cjs')).sort();
for (const test of tests) {
  const result = spawnSync(process.execPath, [path.join(root, 'tests', test)], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
}
console.log(`All ${tests.length} regression suites passed.`);
