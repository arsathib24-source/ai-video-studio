const fs = require('fs');
const path = require('path');

const thumbDir = path.join(process.cwd(), 'public', 'thumbnails');
if (!fs.existsSync(thumbDir)) {
  fs.mkdirSync(thumbDir, { recursive: true });
}

const items = [
  {
    file: 'style_realistic.jpg',
    prompt: 'A peaceful rural village in green nature, traditional house, morning sunlight, ultra realistic photography, 8k',
    w: 300,
    h: 220
  },
  {
    file: 'style_3d.jpg',
    prompt: 'Cute 3D Pixar Disney style cheerful young boy avatar character, 3d render, octane render, smooth lighting',
    w: 300,
    h: 220
  },
  {
    file: 'style_cartoon.jpg',
    prompt: 'Charming colorful 2D cartoon boy smiling, studio ghibli style, clean vibrant comic illustration',
    w: 300,
    h: 220
  },
  {
    file: 'style_anime.jpg',
    prompt: 'Beautiful anime girl with long purple hair, violet eyes, stylish jacket, modern anime aesthetic, makoto shinkai',
    w: 300,
    h: 220
  },
  {
    file: 'recent_village.jpg',
    prompt: 'A peaceful rural Bangladeshi village, morning sunlight, green nature, wooden house, cinematic realistic',
    w: 400,
    h: 300
  },
  {
    file: 'recent_mosque.jpg',
    prompt: 'Magnificent grand mosque with domes and tall minarets at sunset, golden evening glow, reflection, 8k',
    w: 400,
    h: 300
  },
  {
    file: 'recent_lake.jpg',
    prompt: 'Pristine mountain alpine lake, pine trees reflection, morning fog, crystal clear turquoise water, 8k photo',
    w: 400,
    h: 300
  },
  {
    file: 'robot_mascot.jpg',
    prompt: 'Cute friendly futuristic white 3D AI robot mascot sitting with a laptop, glowing blue eyes and headset, glowing tech circles around, 3d octane render, dark futuristic background',
    w: 500,
    h: 500
  }
];

async function downloadAll() {
  for (const item of items) {
    const dest = path.join(thumbDir, item.file);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      console.log(`Already exists: ${item.file}`);
      continue;
    }
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(item.prompt)}?width=${item.w}&height=${item.h}&model=flux&nologo=true`;
    console.log(`Downloading ${item.file}...`);
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(dest, buf);
        console.log(`Saved ${item.file} (${buf.length} bytes)`);
      } else {
        console.warn(`Failed ${item.file}: HTTP ${res.status}`);
      }
    } catch (e) {
      console.warn(`Error downloading ${item.file}:`, e.message);
    }
  }
}

downloadAll();
