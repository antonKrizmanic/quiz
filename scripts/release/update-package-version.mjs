import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const [version] = process.argv.slice(2);

if (!version) {
  console.error('Missing version argument.');
  process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const packageJsonPath = path.join(root, 'package.json');

const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

if (packageJson.version === version) {
  console.log(`package.json already at version ${version}, skipping update.`);
  process.exit(0);
}

packageJson.version = version;
writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`, 'utf8');
console.log(`Updated package.json version to ${version}.`);
