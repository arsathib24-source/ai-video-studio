import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

// Try configuring ffmpeg and ffprobe paths automatically
try {
  const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
  const ffprobeInstaller = require('@ffprobe-installer/ffprobe');
  if (ffmpegInstaller?.path) {
    ffmpeg.setFfmpegPath(ffmpegInstaller.path);
  }
  if (ffprobeInstaller?.path) {
    ffmpeg.setFfprobePath(ffprobeInstaller.path);
  }
} catch (e) {
  // Will use system path if available
}

export interface RenderScene {
  imageUrl?: string;
  videoUrl?: string;
  audioPath: string;
  subtitleText: string;
  durationSeconds: number;
}

export interface RenderOptions {
  scenes: RenderScene[];
  aspectRatio: '9:16' | '16:9';
  outputFilename?: string;
  bgmAudioPath?: string;
  bgmVolume?: number; // 0.1 - 0.3
}

/**
 * Extends or loops a video clip to a longer target duration (e.g. 15s, 30s, 60s)
 */
export async function extendVideoDuration(inputVideoUrl: string, targetDuration: number): Promise<string> {
  const outputDir = path.join(process.cwd(), 'public', 'generated', 'videos');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filename = `extended_${Date.now()}.mp4`;
  const outputPath = path.join(outputDir, filename);

  return new Promise((resolve) => {
    ffmpeg(inputVideoUrl)
      .inputOptions(['-stream_loop', '-1'])
      .outputOptions([
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-t', `${targetDuration}`,
        '-movflags', '+faststart',
      ])
      .output(outputPath)
      .on('end', () => resolve(`/generated/videos/${filename}`))
      .on('error', (err) => {
        console.warn('[FFmpeg] Extend duration error, returning original:', err);
        resolve(inputVideoUrl);
      })
      .run();
  });
}

/**
 * Creates an MP4 video clip from an image or video file of specific duration and aspect ratio
 */
export async function createVideoFromImageOrClip({
  imageOrVideoPath,
  duration,
  aspectRatio = '16:9',
}: {
  imageOrVideoPath: string;
  duration: number;
  aspectRatio: '16:9' | '9:16' | '1:1';
}): Promise<string> {
  const outputDir = path.join(process.cwd(), 'public', 'generated', 'videos');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filename = `clip_${Date.now()}.mp4`;
  const finalOutputPath = path.join(outputDir, filename);

  const targetWidth = aspectRatio === '9:16' ? 1080 : aspectRatio === '1:1' ? 1080 : 1920;
  const targetHeight = aspectRatio === '9:16' ? 1920 : aspectRatio === '1:1' ? 1080 : 1080;

  const isVideo = imageOrVideoPath.endsWith('.mp4') || imageOrVideoPath.endsWith('.webm');

  return new Promise((resolve, reject) => {
    let cmd = ffmpeg();
    if (isVideo) {
      cmd = cmd.input(imageOrVideoPath).inputOptions(['-stream_loop', '-1']);
    } else {
      cmd = cmd.input(imageOrVideoPath).loop(duration);
    }

    cmd
      .videoFilters([
        `scale=${targetWidth}:${targetHeight}:force_original_aspect_ratio=increase`,
        `crop=${targetWidth}:${targetHeight}`,
        `fps=30`,
      ])
      .outputOptions([
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-t', `${duration}`,
        '-movflags', '+faststart',
      ])
      .output(finalOutputPath)
      .on('end', () => resolve(`/generated/videos/${filename}`))
      .on('error', (err) => {
        console.error('[FFmpeg] Error creating video from clip:', err);
        reject(err);
      })
      .run();
  });
}

/**
 * Renders multiple scenes into a unified video with audio and vertical 9:16 formatting
 */
export async function renderFullVideo(options: RenderOptions): Promise<{ outputPath: string; outputUrl: string }> {
  const outputDir = path.join(process.cwd(), 'public', 'generated', 'videos');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filename = options.outputFilename || `video_${Date.now()}.mp4`;
  const finalOutputPath = path.join(outputDir, filename);
  const tempDir = path.join(outputDir, `temp_${Date.now()}`);
  fs.mkdirSync(tempDir, { recursive: true });

  const sceneVideoPaths: string[] = [];
  const targetWidth = options.aspectRatio === '9:16' ? 1080 : 1920;
  const targetHeight = options.aspectRatio === '9:16' ? 1920 : 1080;

  try {
    // Step 1: Render each scene into an MP4 clip with audio
    for (let i = 0; i < options.scenes.length; i++) {
      const scene = options.scenes[i];
      const sceneOutput = path.join(tempDir, `scene_${i}.mp4`);

      await renderSingleScene({
        scene,
        targetWidth,
        targetHeight,
        outputPath: sceneOutput,
      });

      sceneVideoPaths.push(sceneOutput);
    }

    // Step 2: Concatenate all scene clips
    const listFilePath = path.join(tempDir, 'concat_list.txt');
    const listContent = sceneVideoPaths
      .map((p) => `file '${p.replace(/\\/g, '/')}'`)
      .join('\n');
    fs.writeFileSync(listFilePath, listContent, 'utf8');

    // Concat scenes into final output
    await new Promise<void>((resolve, reject) => {
      ffmpeg()
        .input(listFilePath)
        .inputOptions(['-f', 'concat', '-safe', '0'])
        .outputOptions([
          '-c:v', 'libx264',
          '-pix_fmt', 'yuv420p',
          '-c:a', 'aac',
          '-b:a', '192k',
          '-movflags', '+faststart',
        ])
        .output(finalOutputPath)
        .on('end', () => resolve())
        .on('error', (err) => {
          console.error('[FFmpeg] Concat error:', err);
          reject(err);
        })
        .run();
    });

    // Cleanup temp directory
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (_) {}

    return {
      outputPath: finalOutputPath,
      outputUrl: `/generated/videos/${filename}`,
    };
  } catch (err) {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (_) {}
    throw err;
  }
}

/**
 * Render a single scene (Image/Video + Audio -> 9:16 Vertical Video)
 */
async function renderSingleScene({
  scene,
  targetWidth,
  targetHeight,
  outputPath,
}: {
  scene: RenderScene;
  targetWidth: number;
  targetHeight: number;
  outputPath: string;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    let command = ffmpeg();

    // If we have a video file
    if (scene.videoUrl && fs.existsSync(scene.videoUrl)) {
      command = command
        .input(scene.videoUrl)
        .inputOptions(['-stream_loop', '-1']);
    } else if (scene.imageUrl) {
      command = command
        .input(scene.imageUrl)
        .loop(scene.durationSeconds);
    } else {
      // Default placeholder background: Dark gradient
      command = command
        .input(`color=c=#0f172a:s=${targetWidth}x${targetHeight}:d=${scene.durationSeconds}`)
        .inputFormat('lavfi');
    }

    // Add speech voiceover audio if exists
    const hasAudio = scene.audioPath && fs.existsSync(scene.audioPath);
    if (hasAudio) {
      command = command.input(scene.audioPath);
    }

    // Video filters: scale, crop to fill 9:16 or 16:9 perfectly, ensure consistent 30fps
    const videoFilters = [
      `scale=${targetWidth}:${targetHeight}:force_original_aspect_ratio=increase`,
      `crop=${targetWidth}:${targetHeight}`,
      `fps=30`,
    ];

    command
      .videoFilters(videoFilters)
      .outputOptions([
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-t', `${scene.durationSeconds}`,
        '-movflags', '+faststart',
      ]);

    if (hasAudio) {
      // Map video from input 0, and voiceover audio from input 1
      command.outputOptions([
        '-map', '0:v:0',
        '-map', '1:a:0',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-shortest',
      ]);
    } else {
      command.outputOptions([
        '-f', 'lavfi',
        '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100',
        '-shortest',
      ]);
    }

    command
      .output(outputPath)
      .on('end', () => resolve())
      .on('error', (err) => {
        console.error('[FFmpeg] Scene render error:', err);
        reject(err);
      })
      .run();
  });
}
