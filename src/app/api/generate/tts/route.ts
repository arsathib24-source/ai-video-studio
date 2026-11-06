import { NextRequest, NextResponse } from 'next/server';
import { generateSpeech, AVAILABLE_VOICES } from '@/lib/tts';

export async function GET() {
  return NextResponse.json({ voices: AVAILABLE_VOICES });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, voice = 'bn-BD-PradeepNeural', rate = '+0%', pitch = '+0Hz' } = body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ error: 'Text is required for TTS generation.' }, { status: 400 });
    }

    const result = await generateSpeech({
      text: text.trim(),
      voice,
      rate,
      pitch,
    });

    return NextResponse.json({
      success: true,
      audioUrl: result.audioUrl,
      duration: result.duration,
      voice,
    });
  } catch (error: any) {
    console.error('[API/tts] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to synthesize speech audio.' },
      { status: 500 }
    );
  }
}
