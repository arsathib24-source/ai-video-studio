import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    falConfigured: !!process.env.FAL_KEY,
    replicateConfigured: !!process.env.REPLICATE_API_TOKEN,
  });
}
