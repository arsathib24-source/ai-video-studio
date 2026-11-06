import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { generateFreeSceneImage } from './free-visuals';

/**
 * Downloads a video from a remote URL to local disk cache,
 * returns empty string on failure (e.g. 403) instead of throwing.
 */
async function downloadVideoToCache(videoUrl: string, cacheKey: string): Promise<string> {
  const stockDir = path.join(process.cwd(), 'public', 'generated', 'videos', 'stock');
  if (!fs.existsSync(stockDir)) {
    fs.mkdirSync(stockDir, { recursive: true });
  }

  const filename = `stock_${cacheKey}.mp4`;
  const filePath = path.join(stockDir, filename);

  if (fs.existsSync(filePath) && fs.statSync(filePath).size > 10000) {
    return filePath;
  }

  try {
    console.log(`[StockVideo] Attempting to download clip from: ${videoUrl}...`);
    const res = await fetch(videoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': '*/*',
      },
    });

    if (res.ok) {
      const buffer = Buffer.from(await res.arrayBuffer());
      if (buffer.length > 5000) {
        fs.writeFileSync(filePath, buffer);
        return filePath;
      }
    }
    console.warn(`[StockVideo] Download failed with status ${res.status}`);
  } catch (err) {
    console.warn('[StockVideo] Download error:', err);
  }

  return '';
}

/**
 * Fetch a stock video for a scene:
 * 1. If Pexels API key is available, searches Pexels Videos API
 * 2. If no Pexels key or download returns 403, seamlessly returns a 9:16 FLUX AI visual path
 * Guaranteeing that a 403 error is NEVER thrown to the user!
 */
export async function getStockVideoForScene({
  prompt,
  sceneNumber = 1,
  pexelsApiKey,
  aspectRatio = '9:16',
}: {
  prompt: string;
  sceneNumber?: number;
  pexelsApiKey?: string;
  aspectRatio?: '9:16' | '16:9';
}): Promise<string> {
  const key = pexelsApiKey || process.env.PEXELS_API_KEY;

  // 1. If Pexels API Key is provided, search Pexels API
  if (key) {
    try {
      const cleanQuery = prompt
        .replace(/cinematic|8k|photorealistic|ultra|high quality/gi, '')
        .trim()
        .slice(0, 50);

      const searchUrl = `https://api.pexels.com/videos/search?query=${encodeURIComponent(cleanQuery)}&orientation=portrait&per_page=5`;
      const res = await fetch(searchUrl, {
        headers: { Authorization: key },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.videos && data.videos.length > 0) {
          const video = data.videos[0];
          const videoFile = video.video_files.find((f: any) => f.width && f.height && f.height > f.width) || video.video_files[0];
          if (videoFile?.link) {
            const hash = crypto.createHash('md5').update(videoFile.link).digest('hex').slice(0, 10);
            const downloaded = await downloadVideoToCache(videoFile.link, `pexels_${hash}`);
            if (downloaded) return downloaded;
          }
        }
      }
    } catch (err) {
      console.warn('[Pexels] API search failed, falling back to AI visuals:', err);
    }
  }

  // 2. High-speed, 100% reliable FLUX visual fallback
  // This NEVER gives 403 and generates a gorgeous photorealistic visual for the scene
  console.log(`[StockVideo] Generating high-resolution AI visual for: "${prompt.slice(0, 40)}..."`);
  const imagePath = await generateFreeSceneImage(prompt, aspectRatio);
  return imagePath;
}
