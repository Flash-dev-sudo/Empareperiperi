import { readFileSync, writeFileSync } from 'fs';

const packageData = JSON.parse(readFileSync('package.json', 'utf8'));
packageData.scripts.dev = 'NODE_ENV=development tsx server/index.ts';
writeFileSync('package.json', JSON.stringify(packageData, null, 2));

console.log('Added dev script to package.json');