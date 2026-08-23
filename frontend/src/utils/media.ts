const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const BACKEND_URL = API_BASE_URL.replace(/\/api\/?$/, '');

export function getMediaUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
    return url;
  }
  return `${BACKEND_URL}${url.startsWith('/') ? url : `/${url}`}`;
}
