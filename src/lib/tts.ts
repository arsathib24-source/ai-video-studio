import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { AVAILABLE_VOICES, TTSVoice } from './voices';

export { AVAILABLE_VOICES, type TTSVoice };

/**
 * Generate speech audio file from text using Edge Neural Voice API
 */
export async function generateSpeech({
  text,
  voice = 'bn-BD-PradeepNeural',
  rate = '+0%',
  pitch = '+0Hz',
}: {
  text: string;
  voice?: string;
  rate?: string;
  pitch?: string;
}): Promise<{ audioPath: string; audioUrl: string; duration: number }> {
  const publicAudioDir = path.join(process.cwd(), 'public', 'generated', 'audio');
  if (!fs.existsSync(publicAudioDir)) {
    fs.mkdirSync(publicAudioDir, { recursive: true });
  }

  const hash = crypto.createHash('md5').update(`${text}_${voice}_${rate}`).digest('hex');
  const filename = `speech_${hash}.mp3`;
  const filePath = path.join(publicAudioDir, filename);
  const audioUrl = `/generated/audio/${filename}`;

  // If already generated, return cached
  if (fs.existsSync(filePath)) {
    const wordCount = text.trim().split(/\s+/).length;
    const estimatedDuration = Math.max(2, Math.round((wordCount / 2.5) * 10) / 10);
    return { audioPath: filePath, audioUrl, duration: estimatedDuration };
  }

  // Generate SSML payload
  const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'>
    <voice name='${voice}'>
      <prosody pitch='${pitch}' rate='${rate}'>
        ${escapeXml(text)}
      </prosody>
    </voice>
  </speak>`;

  const endpoint = `https://speech.platform.bing.com/consumer/speech/synthesize/readahead/edge/v1`;
  const connectionId = crypto.randomUUID().replace(/-/g, '');

  try {
    // Call Edge TTS service
    const response = await fetch(`${endpoint}?trustedclienttoken=6A5AA1D4EAFF4E9FB37E23D68491D6F4&ConnectionId=${connectionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/ssml+xml',
        'X-RequestId': connectionId,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
        'X-Search-ClientId': connectionId,
        'X-Search-AppId': '0DE282A0143E4A7E885B23500F071E60',
      },
      body: ssml,
    });

    if (response.ok) {
      const buffer = Buffer.from(await response.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
    } else {
      // Fallback: Create placeholder or alternative TTS
      await createFallbackSpeech(text, filePath);
    }
  } catch (err) {
    console.warn('Direct edge synth failed, using fallback synthesizer...', err);
    await createFallbackSpeech(text, filePath);
  }

  // Estimate duration (approx 2.5 - 3 words per second)
  const wordCount = text.trim().split(/\s+/).length;
  const estimatedDuration = Math.max(2, Math.round((wordCount / 2.5) * 10) / 10);

  return {
    audioPath: filePath,
    audioUrl,
    duration: estimatedDuration,
  };
}

async function createFallbackSpeech(text: string, outputPath: string) {
  // Use public TTS service as fallback
  const encoded = encodeURIComponent(text.substring(0, 200));
  const fallbackUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=bn&client=tw-ob`;
  try {
    const res = await fetch(fallbackUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });
    if (res.ok) {
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(outputPath, buf);
      return;
    }
  } catch (e) {
    console.error('Fallback TTS failed', e);
  }
  
  // Write minimal silent MP3 if network fails
  const silentBuffer = Buffer.alloc(1024);
  fs.writeFileSync(outputPath, silentBuffer);
}

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
