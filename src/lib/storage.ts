import { supabase } from "@/integrations/supabase/client";

const cache = new Map<string, string>();

/** Returns a long-lived signed URL for a private bucket object. */
export async function getSignedUrl(
  bucket: string,
  path: string | null | undefined,
  expiresIn = 60 * 60 * 24 * 7, // 7 days
): Promise<string | null> {
  if (!path) return null;
  const key = `${bucket}/${path}`;
  if (cache.has(key)) return cache.get(key)!;
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
  if (error || !data?.signedUrl) return null;
  cache.set(key, data.signedUrl);
  return data.signedUrl;
}

export async function attachImageUrls<T extends { image_url?: string | null }>(
  bucket: string,
  rows: T[],
): Promise<(T & { image_signed?: string | null })[]> {
  return Promise.all(
    rows.map(async (r) => ({ ...r, image_signed: await getSignedUrl(bucket, r.image_url) })),
  );
}
