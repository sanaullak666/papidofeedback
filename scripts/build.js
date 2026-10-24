import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('📦 [Vercel Build] Building Papido frontend...');
execSync('cd client && npm install && npm run build', { stdio: 'inherit' });

const srcDist = path.resolve('client', 'dist');
const targetDist = path.resolve('dist');

if (fs.existsSync(srcDist)) {
  if (fs.existsSync(targetDist)) {
    fs.rmSync(targetDist, { recursive: true, force: true });
  }
  fs.cpSync(srcDist, targetDist, { recursive: true });
  console.log('✅ [Vercel Build] Client build successfully prepared in /dist for Vercel deployment!');
} else {
  console.error('❌ [Vercel Build] client/dist not found.');
  process.exit(1);
}
