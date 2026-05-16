import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcPath = path.join(__dirname, 'public', 'tiger-nation-logo.jpg');
const portraitPath = path.join(__dirname, 'public', 'tiger-nation-logo-portrait.jpg');
const landscapePath = path.join(__dirname, 'public', 'tiger-nation-logo-landscape.jpg');

try {
  fs.copyFileSync(srcPath, portraitPath);
  console.log('Created portrait asset: public/tiger-nation-logo-portrait.jpg');

  fs.copyFileSync(srcPath, landscapePath);
  console.log('Created landscape asset: public/tiger-nation-logo-landscape.jpg');
} catch (err) {
  console.error('Error creating logo assets:', err);
}
