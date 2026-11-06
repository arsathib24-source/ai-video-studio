import { NextRequest, NextResponse } from 'next/server';
import { generateShortsScript } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, language = 'Bengali', targetDuration = 30, tone = 'Viral & Informative', apiKey } = body;

    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return NextResponse.json({ error: 'Topic is required to generate script.' }, { status: 400 });
    }

    const script = await generateShortsScript({
      topic: topic.trim(),
      language,
      targetDuration: Number(targetDuration) || 30,
      tone,
      customApiKey: apiKey,
    });

    return NextResponse.json({ success: true, script });
  } catch (error: any) {
    console.error('[API/shorts-script] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate shorts script.' },
      { status: 500 }
    );
  }
}
