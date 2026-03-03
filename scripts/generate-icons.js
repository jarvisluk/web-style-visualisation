import fs from 'fs';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgPath = path.resolve(__dirname, '../public/icon.svg');
const outDir = path.resolve(__dirname, '../public');

async function generate() {
  const svg = fs.readFileSync(svgPath);
  
  // apple-touch-icon: 180x180 (iOS recommends solid background, we flatten it with white just in case, though the icon itself has #E2E8F0 bg)
  await sharp(svg)
    .resize(180, 180)
    .png()
    .toFile(path.join(outDir, 'apple-touch-icon.png'));

  // Android/Chrome manifest icons
  await sharp(svg)
    .resize(192, 192)
    .png()
    .toFile(path.join(outDir, 'icon-192.png'));

  await sharp(svg)
    .resize(512, 512)
    .png()
    .toFile(path.join(outDir, 'icon-512.png'));
    
  console.log("✅ Icons generated successfully in public directory:");
  console.log("  - public/apple-touch-icon.png (180x180)");
  console.log("  - public/icon-192.png (192x192)");
  console.log("  - public/icon-512.png (512x512)");
}

generate().catch(console.error);
