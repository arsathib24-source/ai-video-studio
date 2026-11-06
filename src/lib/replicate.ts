export interface ReplicateVideoOptions {
  prompt?: string;
  imageUrl?: string;
  model?: 'svd' | 'sadtalker' | 'cogvideox';
  apiKey?: string;
}

/**
 * Replicate client for Stable Video Diffusion & SadTalker
 */
export async function generateWithReplicate(options: ReplicateVideoOptions): Promise<string> {
  const token = options.apiKey || process.env.REPLICATE_API_TOKEN;
  if (!token) {
    throw new Error('Replicate API Token is missing. Set REPLICATE_API_TOKEN in settings or .env.local.');
  }

  // Model version IDs on Replicate
  let version = '';
  let input: Record<string, any> = {};

  if (options.model === 'sadtalker') {
    // SadTalker talking head
    version = 'c694a0046522851410427ec56111357662c1e4d3db24f6176a9134a4ab5a6912';
    input = {
      source_image: options.imageUrl,
      driven_audio: options.prompt, // audio url
      still: true,
      preprocess: 'full',
    };
  } else if (options.imageUrl) {
    // Stable Video Diffusion (Image-to-Video)
    version = '3f0457e4619da8151802e93e64625bb5519268d87c57345e54ad77b8cf4bfa7f';
    input = {
      input_image: options.imageUrl,
      sizing_strategy: 'maintain_aspect_ratio',
      motion_bucket_id: 127,
      fps: 6,
    };
  } else {
    // CogVideoX
    version = 'c7e8e45a2fb6bcad816a7f0e0c0617ef101888fbcaec70e625a66a87754d9c79';
    input = {
      prompt: options.prompt,
    };
  }

  // Create prediction
  const createRes = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ version, input }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Replicate failed to create prediction: ${err}`);
  }

  let prediction = await createRes.json();
  const pollUrl = prediction.urls.get;

  // Poll
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    const checkRes = await fetch(pollUrl, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!checkRes.ok) continue;

    prediction = await checkRes.json();
    if (prediction.status === 'succeeded') {
      const output = prediction.output;
      return Array.isArray(output) ? output[0] : output;
    }
    if (prediction.status === 'failed') {
      throw new Error(`Replicate model failed: ${prediction.error}`);
    }
  }

  throw new Error('Replicate prediction timed out.');
}
