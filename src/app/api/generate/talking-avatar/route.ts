import { NextRequest, NextResponse } from 'next/server';
import { generateTalkingAvatarFal } from '@/lib/fal';
import { generateWithReplicate } from '@/lib/replicate';
import { generateSpeech } from '@/lib/tts';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { imageUrl, videoUrl, audioUrl, text, voice = 'bn-BD-PradeepNeural', provider = 'fal', apiKey } = body;

    if (!imageUrl && !videoUrl) {
      return NextResponse.json({ error: 'Image or Video face input is required.' }, { status: 400 });
    }

    // If text was provided instead of direct audio URL, synthesize audio first
    if (!audioUrl && text) {
      const speechRes = await generateSpeech({ text, voice });
      audioUrl = speechRes.audioUrl;
    }

    if (!audioUrl) {
      return NextResponse.json({ error: 'Audio input or text script is required for speech lip-sync.' }, { status: 400 });
    }

    let finalVideoUrl = '';

    if (provider === 'replicate') {
      finalVideoUrl = await generateWithReplicate({
        imageUrl,
        prompt: audioUrl,
        model: 'sadtalker',
        apiKey,
      });
    } else {
      // Default: Fal.ai LatentSync
      finalVideoUrl = await generateTalkingAvatarFal({
        imageUrl,
        videoUrl,
        audioUrl,
        apiKey,
      });
    }

    return NextResponse.json({
      success: true,
      videoUrl: finalVideoUrl,
    });
  } catch (error: any) {
    console.error('[API/talking-avatar] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Talking avatar generation failed.' },
      { status: 500 }
    );
  }
}
