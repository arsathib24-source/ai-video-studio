import { NextRequest, NextResponse } from 'next/server';
import { generateVideoWithFal } from '@/lib/fal';
import { generateWithReplicate } from '@/lib/replicate';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageUrl, prompt = 'Smooth realistic cinematic motion', model = 'minimax', provider = 'fal', apiKey } = body;

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL or base64 image is required.' }, { status: 400 });
    }

    let videoUrl = '';

    if (provider === 'replicate') {
      videoUrl = await generateWithReplicate({
        imageUrl,
        model: 'svd',
        apiKey,
      });
    } else {
      const result = await generateVideoWithFal({
        prompt,
        imageUrl,
        model: model as any,
        apiKey,
      });
      videoUrl = result.videoUrl;
    }

    return NextResponse.json({
      success: true,
      videoUrl,
    });
  } catch (error: any) {
    console.error('[API/image-to-video] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Image to video generation failed.' },
      { status: 500 }
    );
  }
}
