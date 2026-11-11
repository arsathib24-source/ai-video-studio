import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient } from '@/lib/gemini';
import { generateSpeech } from '@/lib/tts';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      action = 'chat', // 'chat' | 'audio_overview'
      documentContent,
      question,
      language = 'Bengali',
      geminiKey,
    } = body;

    if (!documentContent || typeof documentContent !== 'string' || !documentContent.trim()) {
      return NextResponse.json({ error: 'Document content or notes are required.' }, { status: 400 });
    }

    const genAI = getGeminiClient(geminiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' });

    // Action 1: Ask Question about the Document (NotebookLM style)
    if (action === 'chat') {
      if (!question) {
        return NextResponse.json({ error: 'Question is required.' }, { status: 400 });
      }

      const prompt = `You are an expert research analyst and NotebookLM AI assistant.
Based strictly on the following source document, answer the user's question clearly, objectively and thoroughly.
Include key bullet points and cite specific facts mentioned in the document.
Language of response: ${language}.

Source Document:
"""
${documentContent.slice(0, 30000)}
"""

User Question: "${question}"`;

      const result = await model.generateContent(prompt);
      return NextResponse.json({
        success: true,
        answer: result.response.text(),
      });
    }

    // Action 2: Generate Two-Host Audio Overview / Podcast Discussion (NotebookLM Clone)
    if (action === 'audio_overview') {
      const scriptPrompt = `You are the executive producer of Google NotebookLM Audio Overview.
Create an engaging, dynamic 2-host podcast discussion between Host 1 (Male) and Host 2 (Female) discussing the key insights, surprises, and main takeaways of this document.
Tone: Conversational, energetic, natural, intellectual yet accessible.
Language of dialogue: ${language}.
Length: Approximately 4 to 6 back-and-forth turns.

Source Document:
"""
${documentContent.slice(0, 20000)}
"""

Return strictly a valid JSON object matching this schema (do NOT include markdown code blocks or backticks, just raw JSON):
{
  "podcastTitle": "Engaging Podcast Episode Title",
  "turns": [
    { "speaker": "Host 1", "gender": "Male", "text": "spoken line" },
    { "speaker": "Host 2", "gender": "Female", "text": "spoken response" }
  ]
}`;

      const scriptRes = await model.generateContent(scriptPrompt);
      const cleaned = scriptRes.response.text().trim()
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```$/i, '')
        .trim();

      const podcastScript = JSON.parse(cleaned);

      // Synthesize each turn into audio
      const host1Voice = language === 'Bengali' ? 'bn-BD-PradeepNeural' : 'en-US-ChristopherNeural';
      const host2Voice = language === 'Bengali' ? 'bn-BD-NabanitaNeural' : 'en-US-JennyNeural';

      const audioTurns: any[] = [];
      for (const turn of podcastScript.turns) {
        const v = turn.gender === 'Female' ? host2Voice : host1Voice;
        const speech = await generateSpeech({ text: turn.text, voice: v });
        audioTurns.push({
          speaker: turn.speaker,
          text: turn.text,
          audioUrl: speech.audioUrl,
          duration: speech.duration,
        });
      }

      return NextResponse.json({
        success: true,
        podcastTitle: podcastScript.podcastTitle,
        turns: audioTurns,
      });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch (error: any) {
    console.error('[API/notebook] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'NotebookLM processing failed.' },
      { status: 500 }
    );
  }
}
