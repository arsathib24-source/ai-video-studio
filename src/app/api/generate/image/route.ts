import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { uploadToVercelBlob } from '@/lib/blob-storage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      prompt,
      style = 'Photorealistic',
      aspectRatio = '1:1',
      model = 'flux',
    } = body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
    }

    let width = 1024;
    let height = 1024;

    if (aspectRatio === '16:9') {
      width = 1280;
      height = 720;
    } else if (aspectRatio === '9:16') {
      width = 720;
      height = 1280;
    } else if (aspectRatio === '4:3') {
      width = 1024;
      height = 768;
    }

    // Enhance prompt with selected style
    let styledPrompt = prompt.trim();
    if (style === 'Photorealistic') {
      styledPrompt += ', photorealistic, 8k resolution, raw photo, realistic lighting, highly detailed textures';
    } else if (style === 'Cinematic') {
      styledPrompt += ', cinematic lighting, anamorphic lens, 35mm photograph, dramatic color grading, masterpiece';
    } else if (style === 'Anime') {
      styledPrompt += ', beautiful anime aesthetic, Makoto Shinkai style, vibrant colors, clean linework';
    } else if (style === '3D Render') {
      styledPrompt += ', 3D computer graphics render, Unreal Engine 5, octane render, volumetric lighting, ray tracing';
    } else if (style === 'Cyberpunk') {
      styledPrompt += ', cyberpunk neon aesthetic, glowing holographic signs, rainy reflections, futuristic details';
    }

    const seed = Math.floor(Math.random() * 10000000);
    const encodedPrompt = encodeURIComponent(styledPrompt);
    const pollUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=${model}&nologo=true&seed=${seed}`;

    console.log(`[ImageGen] Fetching FLUX image: "${styledPrompt.slice(0, 50)}..."`);
    const res = await fetch(pollUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    if (!res.ok) {
      throw new Error(`Failed to generate image: ${res.status}`);
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    const hash = crypto.createHash('md5').update(`${styledPrompt}_${seed}`).digest('hex');
    const filename = `img_${hash}.jpg`;

    // 1. Try Vercel Blob cloud storage first
    const cloudUrl = await uploadToVercelBlob(filename, buffer, 'image/jpeg');
    if (cloudUrl) {
      return NextResponse.json({
        success: true,
        imageUrl: cloudUrl,
        prompt: styledPrompt,
      });
    }

    // 2. Local fallback if running locally
    try {
      const outputDir = path.join(process.cwd(), 'public', 'generated', 'images');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      const filePath = path.join(outputDir, filename);
      fs.writeFileSync(filePath, buffer);

      return NextResponse.json({
        success: true,
        imageUrl: `/generated/images/${filename}`,
        prompt: styledPrompt,
      });
    } catch {
      // 3. Fallback to direct pollinations URL
      return NextResponse.json({
        success: true,
        imageUrl: pollUrl,
        prompt: styledPrompt,
      });
    }
  } catch (error: any) {
    console.error('[API/generate/image] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Image generation failed.' },
      { status: 500 }
    );
  }
}
