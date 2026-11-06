import { NextRequest, NextResponse } from 'next/server';
import { renderFullVideo, RenderScene } from '@/lib/ffmpeg';
import { generateSpeech } from '@/lib/tts';
import { generateFreeSceneImage } from '@/lib/free-visuals';
import { getStockVideoForScene } from '@/lib/stock-videos';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      scenes,
      voice = 'bn-BD-PradeepNeural',
      aspectRatio = '9:16',
      visualMode = 'stock_video', // 'stock_video' | 'ai_image'
      pexelsApiKey,
    } = body;

    if (!Array.isArray(scenes) || scenes.length === 0) {
      return NextResponse.json({ error: 'At least one scene is required.' }, { status: 400 });
    }

    const processedScenes: RenderScene[] = [];

    // Synthesize audio & visuals (Real Stock Videos or AI FLUX images) for each scene
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      let audioPath = scene.audioPath;
      let duration = scene.durationSeconds || 5;
      let imageUrl = scene.imageUrl;
      let videoUrl = scene.videoUrl;

      // 1. Generate Voiceover Audio if not present
      if (!audioPath && scene.voiceover) {
        const speech = await generateSpeech({ text: scene.voiceover, voice });
        audioPath = speech.audioPath;
        duration = Math.max(duration, speech.duration);
      }

      // 2. Automatically generate Visuals if not provided
      if (!imageUrl && !videoUrl) {
        const queryText = scene.visualPrompt || scene.voiceover || 'nature landscape';

        if (visualMode === 'stock_video') {
          // Fetch Real Stock Video footage (Pexels / Royalty-free 9:16 vertical clips)
          try {
            videoUrl = await getStockVideoForScene({
              prompt: queryText,
              sceneNumber: i + 1,
              pexelsApiKey,
            });
          } catch (e) {
            console.warn('[RenderShort] Stock video fetch failed, falling back to AI image:', e);
            imageUrl = await generateFreeSceneImage(queryText, aspectRatio);
          }
        } else {
          // FLUX AI 9:16 vertical image
          imageUrl = await generateFreeSceneImage(queryText, aspectRatio);
        }
      }

      processedScenes.push({
        imageUrl,
        videoUrl,
        audioPath,
        subtitleText: scene.voiceover || '',
        durationSeconds: duration,
      });
    }

    // Render full video with FFmpeg
    const result = await renderFullVideo({
      scenes: processedScenes,
      aspectRatio,
    });

    return NextResponse.json({
      success: true,
      videoUrl: result.outputUrl,
    });
  } catch (error: any) {
    console.error('[API/render-short] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to render short video.' },
      { status: 500 }
    );
  }
}
