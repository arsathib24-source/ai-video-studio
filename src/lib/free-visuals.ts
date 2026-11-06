import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * Generates high quality 9:16 vertical AI image for a scene prompt
 * Using Pollinations FLUX / SDXL (100% Free, NO API Key Required)
 */
export async function generateFreeSceneImage(prompt: string, aspectRatio: '9:16' | '16:9' = '9:16'): Promise<string> {
  const publicDir = path.join(process.cwd(), 'public', 'generated', 'images');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const hash = crypto.createHash('md5').update(`${prompt}_${aspectRatio}`).digest('hex');
  const filename = `scene_img_${hash}.jpg`;
  const filePath = path.join(publicDir, filename);

  if (fs.existsSync(filePath)) {
    return filePath;
  }

  const width = aspectRatio === '9:16' ? 720 : 1280;
  const height = aspectRatio === '9:16' ? 1280 : 720;

  // Pollinations Free FLUX API endpoint
  const encodedPrompt = encodeURIComponent(
    `${prompt}, cinematic 8k photorealistic, hyper-detailed, masterpiece, highly aesthetic`
  );
  const seed = Math.floor(Math.random() * 1000000);
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=flux&nologo=true&seed=${seed}`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    if (res.ok) {
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      return filePath;
    }
  } catch (err) {
    console.warn('[FreeVisuals] Failed to fetch AI image, falling back:', err);
  }

  return '';
}
