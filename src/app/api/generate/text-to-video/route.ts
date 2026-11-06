import { NextRequest, NextResponse } from 'next/server';
import { generateVideoWithFal } from '@/lib/fal';
import { generateWithReplicate } from '@/lib/replicate';
import { enhanceVideoPrompt } from '@/lib/gemini';
import { extendVideoDuration, createVideoFromImageOrClip } from '@/lib/ffmpeg';
import { getStockVideoForScene } from '@/lib/stock-videos';
import { generateFreeSceneImage } from '@/lib/free-visuals';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { prompt, model = 'free_stock', aspectRatio = '16:9', duration = 5, enhancePrompt = false, provider = 'fal', apiKey, geminiKey } = body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
    }

    let finalPrompt = prompt.trim();
    if (enhancePrompt) {
      finalPrompt = await enhanceVideoPrompt(finalPrompt, geminiKey);
    }

    let videoUrl = '';

    // 1. Free Engine (Stock & FLUX AI Motion - 100% Free, No 403, No Paid Key)
    if (model === 'free_stock' || model === 'free_flux') {
      let visualPath = await getStockVideoForScene({
        prompt: finalPrompt,
        aspectRatio: aspectRatio as any,
      });

      if (!visualPath) {
        visualPath = await generateFreeSceneImage(finalPrompt, aspectRatio === '9:16' ? '9:16' : '16:9');
      }

      videoUrl = await createVideoFromImageOrClip({
        imageOrVideoPath: visualPath,
        duration: Number(duration) || 5,
        aspectRatio: aspectRatio as any,
      });
    }
    // 3. Replicate Model
    else if (provider === 'replicate' || model === 'cogvideox') {
      videoUrl = await generateWithReplicate({
        prompt: finalPrompt,
        model: 'cogvideox',
        apiKey,
      });
    }
    // 4. Fal.ai Models (Minimax, Kling, Luma)
    else {
      const result = await generateVideoWithFal({
        prompt: finalPrompt,
        model: model as any,
        aspectRatio: aspectRatio as any,
        duration: Math.min(10, duration), // API takes max 10s directly
        apiKey,
      });
      videoUrl = result.videoUrl;
    }

    // If requested duration is greater than 10s and not already handled
    if (videoUrl && Number(duration) > 10 && !videoUrl.startsWith('/generated/videos/clip_')) {
      videoUrl = await extendVideoDuration(videoUrl, Number(duration));
    }

    return NextResponse.json({
      success: true,
      videoUrl,
      enhancedPrompt: finalPrompt !== prompt ? finalPrompt : undefined,
    });
  } catch (error: any) {
    console.error('[API/text-to-video] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Video generation failed.' },
      { status: 500 }
    );
  }
}
