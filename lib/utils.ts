import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getS3PublicUrl(url: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('s3://')) {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://209.38.221.61:3005/api';
    return `${BASE_URL}/audio-bible/audio-url?s3path=${url}`;
  }
  return url;
}
