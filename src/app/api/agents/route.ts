import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      agentType = 'content_creator', // 'content_creator' | 'researcher' | 'coder'
      objective,
      language = 'Bengali',
      geminiKey,
    } = body;

    if (!objective || typeof objective !== 'string' || !objective.trim()) {
      return NextResponse.json({ error: 'Agent objective / task prompt is required.' }, { status: 400 });
    }

    const genAI = getGeminiClient(geminiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

    let systemInstruction = '';
    if (agentType === 'content_creator') {
      systemInstruction = `You are an elite Autonomous Content Creation Agent.
When given an objective, plan and produce:
1. Executive Content Summary & Strategy
2. Complete Viral Article / Post (in ${language})
3. Eye-catching Visual / Image Prompt for AI Image Generator (in English)
4. Video Shorts Script & Hook (in ${language})
5. SEO Tags & Social Media Distribution Plan`;
    } else if (agentType === 'researcher') {
      systemInstruction = `You are an Advanced Autonomous Research Agent.
When given a topic or question:
1. Break down the core questions and investigative thesis
2. Synthesize deep factual analysis across history, science, and current trends (in ${language})
3. Present balanced perspectives, pros & cons, and statistical evidence
4. Provide structured strategic recommendations and conclusions`;
    } else {
      systemInstruction = `You are a Senior Full-Stack AI Software Architect & Engineer.
When given an application or feature requirement:
1. System Architecture & Component Breakdown
2. Database Schema / Data Models
3. Complete, production-ready, beautifully structured Code Implementation
4. Setup & Deployment Instructions`;
    }

    const prompt = `${systemInstruction}

Objective / Task:
"""
${objective.trim()}
"""

Produce an exceptional, comprehensive, and perfectly formatted Markdown response with clear headers, bullet points, and code blocks where applicable.`;

    const result = await model.generateContent(prompt);
    return NextResponse.json({
      success: true,
      agentType,
      output: result.response.text(),
    });
  } catch (error: any) {
    console.error('[API/agents] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Agent execution failed.' },
      { status: 500 }
    );
  }
}
