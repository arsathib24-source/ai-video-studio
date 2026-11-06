import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      messages,
      model = 'gemini-2.0-flash',
      geminiKey,
      openaiKey,
      claudeKey,
      deepseekKey,
    } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required.' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1].content;

    // 1. Google Gemini Models
    if (model.startsWith('gemini')) {
      const apiKey = geminiKey || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return NextResponse.json(
          { error: 'Google Gemini API Key is required. Please set it in Settings.' },
          { status: 400 }
        );
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const candidateModels = [
        model,
        'gemini-1.5-flash-latest',
        'gemini-1.5-flash-8b',
        'gemini-2.0-flash',
        'gemini-pro',
      ];

      for (const mName of candidateModels) {
        try {
          const geminiModel = genAI.getGenerativeModel({ model: mName });
          const history = messages.slice(0, -1).map((m: ChatMessage) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          }));

          const chat = geminiModel.startChat({ history });
          const result = await chat.sendMessage(lastMessage);
          const reply = result.response.text();

          return NextResponse.json({
            success: true,
            model: mName,
            reply,
          });
        } catch (err: any) {
          console.warn(`[Chat] Gemini model ${mName} failed:`, err?.message);
        }
      }

      throw new Error('All Gemini model candidates failed with this API key.');
    }

    // 2. OpenAI (ChatGPT - GPT-4o / GPT-4o-mini / o1)
    if (model.startsWith('gpt') || model.startsWith('o1')) {
      const apiKey = openaiKey || process.env.OPENAI_API_KEY;
      if (!apiKey) {
        return NextResponse.json(
          { error: 'OpenAI API Key is required for ChatGPT models.' },
          { status: 400 }
        );
      }

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`OpenAI API Error: ${err}`);
      }

      const data = await res.json();
      return NextResponse.json({
        success: true,
        model,
        reply: data.choices[0].message.content,
      });
    }

    // 3. DeepSeek (DeepSeek-V3 / DeepSeek-R1)
    if (model.startsWith('deepseek')) {
      const apiKey = deepseekKey || process.env.DEEPSEEK_API_KEY;
      if (!apiKey) {
        return NextResponse.json(
          { error: 'DeepSeek API Key is required for DeepSeek models.' },
          { status: 400 }
        );
      }

      const res = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model === 'deepseek-r1' ? 'deepseek-reasoner' : 'deepseek-chat',
          messages,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`DeepSeek API Error: ${err}`);
      }

      const data = await res.json();
      return NextResponse.json({
        success: true,
        model,
        reply: data.choices[0].message.content,
        reasoningContent: data.choices[0].message.reasoning_content,
      });
    }

    // 4. Anthropic Claude (Claude 3.5 Sonnet / Haiku)
    if (model.startsWith('claude')) {
      const apiKey = claudeKey || process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        return NextResponse.json(
          { error: 'Anthropic Claude API Key is required for Claude models.' },
          { status: 400 }
        );
      }

      const systemMessage = messages.find((m: ChatMessage) => m.role === 'system')?.content;
      const userAndAssistantMessages = messages.filter((m: ChatMessage) => m.role !== 'system');

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model === 'claude-3-5-sonnet' ? 'claude-3-5-sonnet-20241022' : 'claude-3-haiku-20240307',
          max_tokens: 4096,
          system: systemMessage,
          messages: userAndAssistantMessages,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Anthropic API Error: ${err}`);
      }

      const data = await res.json();
      return NextResponse.json({
        success: true,
        model,
        reply: data.content[0].text,
      });
    }

    return NextResponse.json({ error: 'Unsupported model selection.' }, { status: 400 });
  } catch (error: any) {
    console.error('[API/chat] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Chat generation failed.' },
      { status: 500 }
    );
  }
}
