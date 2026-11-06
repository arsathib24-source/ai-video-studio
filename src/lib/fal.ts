export interface FalVideoOptions {
  prompt: string;
  imageUrl?: string;
  model?: 'minimax' | 'kling' | 'luma' | 'svd' | 'fast-animatediff';
  aspectRatio?: '16:9' | '9:16' | '1:1';
  duration?: number;
  apiKey?: string;
}

export interface FalAvatarOptions {
  videoUrl?: string;
  imageUrl: string;
  audioUrl: string;
  apiKey?: string;
}

/**
 * Universal video generation via Fal.ai API
 */
export async function generateVideoWithFal(options: FalVideoOptions): Promise<{ videoUrl: string; requestId?: string }> {
  const apiKey = options.apiKey || process.env.FAL_KEY;
  if (!apiKey) {
    throw new Error('Fal.ai API key is missing. Please set FAL_KEY in settings or .env.local.');
  }

  // Model endpoints mapping
  let endpoint = 'fal-ai/minimax-video/image-to-video';
  let payload: Record<string, any> = {};

  if (options.imageUrl) {
    // Image-to-Video
    if (options.model === 'kling') {
      endpoint = 'fal-ai/kling-video/v1/standard/image-to-video';
      payload = {
        prompt: options.prompt || 'High quality cinematic animation, smooth subtle motion',
        image_url: options.imageUrl,
        duration: '5',
      };
    } else if (options.model === 'luma') {
      endpoint = 'fal-ai/luma-dream-machine/image-to-video';
      payload = {
        prompt: options.prompt,
        image_url: options.imageUrl,
      };
    } else {
      // Default: Minimax Hailuo i2v
      endpoint = 'fal-ai/minimax-video/image-to-video';
      payload = {
        prompt: options.prompt || 'smooth realistic motion, 4k ultra detailed cinematic',
        image_url: options.imageUrl,
      };
    }
  } else {
    // Text-to-Video
    if (options.model === 'kling') {
      endpoint = 'fal-ai/kling-video/v1/standard/text-to-video';
      payload = {
        prompt: options.prompt,
        aspect_ratio: options.aspectRatio === '9:16' ? '9:16' : '16:9',
        duration: '5',
      };
    } else if (options.model === 'luma') {
      endpoint = 'fal-ai/luma-dream-machine';
      payload = {
        prompt: options.prompt,
        aspect_ratio: options.aspectRatio === '9:16' ? '9:16' : '16:9',
      };
    } else {
      // Minimax / Hailuo Video 01
      endpoint = 'fal-ai/minimax-video';
      payload = {
        prompt: options.prompt,
        prompt_optimizer: true,
      };
    }
  }

  console.log(`[Fal.ai] Calling ${endpoint}...`);

  // Submit queue request to Fal.ai
  const submitRes = await fetch(`https://queue.fal.run/${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Key ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!submitRes.ok) {
    const errText = await submitRes.text();
    console.error('[Fal.ai] Submit error:', errText);
    throw new Error(`Fal.ai submission failed (${submitRes.status}): ${errText}`);
  }

  const submitData = await submitRes.json();
  const requestId = submitData.request_id;
  const statusUrl = submitData.status_url || `https://queue.fal.run/${endpoint}/requests/${requestId}/status`;
  const responseUrl = submitData.response_url || `https://queue.fal.run/${endpoint}/requests/${requestId}`;

  console.log(`[Fal.ai] Job queued. Request ID: ${requestId}`);

  // Poll for completion (up to 3 minutes)
  const maxAttempts = 60;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const checkRes = await fetch(statusUrl, {
      headers: { 'Authorization': `Key ${apiKey}` },
    });

    if (!checkRes.ok) continue;

    const statusData = await checkRes.json();
    console.log(`[Fal.ai] Status: ${statusData.status} (attempt ${attempt + 1})`);

    if (statusData.status === 'COMPLETED') {
      const resultRes = await fetch(responseUrl, {
        headers: { 'Authorization': `Key ${apiKey}` },
      });
      const resultData = await resultRes.json();
      
      const videoUrl = resultData.video?.url || resultData.video_url || resultData.output?.url;
      if (!videoUrl) {
        throw new Error('Fal.ai completed but returned no video URL.');
      }
      return { videoUrl, requestId };
    }

    if (statusData.status === 'FAILED') {
      throw new Error(`Fal.ai generation failed: ${JSON.stringify(statusData.error || 'Unknown error')}`);
    }
  }

  throw new Error('Video generation timed out on Fal.ai. Please try again.');
}

/**
 * Generates Talking Avatar / Lip-Sync with Fal.ai (e.g. LatentSync)
 */
export async function generateTalkingAvatarFal(options: FalAvatarOptions): Promise<string> {
  const apiKey = options.apiKey || process.env.FAL_KEY;
  if (!apiKey) {
    throw new Error('Fal.ai API key is required for Talking Avatar.');
  }

  const endpoint = 'fal-ai/latentsync';
  const payload = {
    video_url: options.videoUrl || options.imageUrl,
    audio_url: options.audioUrl,
  };

  const submitRes = await fetch(`https://queue.fal.run/${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Key ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!submitRes.ok) {
    const err = await submitRes.text();
    throw new Error(`Fal.ai Avatar sync failed: ${err}`);
  }

  const { status_url, response_url } = await submitRes.json();

  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    const statusRes = await fetch(status_url, { headers: { 'Authorization': `Key ${apiKey}` } });
    if (!statusRes.ok) continue;
    const st = await statusRes.json();
    if (st.status === 'COMPLETED') {
      const fin = await (await fetch(response_url, { headers: { 'Authorization': `Key ${apiKey}` } })).json();
      return fin.video?.url || fin.output?.url;
    }
    if (st.status === 'FAILED') {
      throw new Error('Avatar generation failed on Fal.ai');
    }
  }

  throw new Error('Talking avatar request timed out.');
}
