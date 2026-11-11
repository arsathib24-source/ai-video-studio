import { put } from '@vercel/blob';

/**
 * Uploads a buffer or string to Vercel Blob storage.
 * If BLOB_READ_WRITE_TOKEN is available, returns the permanent public CDN URL.
 * Otherwise returns null.
 */
export async function uploadToVercelBlob(
  filename: string,
  data: Buffer | Blob | string,
  contentType: string = 'application/octet-stream'
): Promise<string | null> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return null;
  }

  try {
    const blob = await put(filename, data, {
      access: 'public',
      token,
      contentType,
    });
    return blob.url;
  } catch (err) {
    console.warn('[VercelBlob] Cloud upload error, falling back:', err);
    return null;
  }
}
