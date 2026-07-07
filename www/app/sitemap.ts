import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://poplarlabs.xyz', priority: 1 },
    { url: 'https://poplarlabs.xyz/vision', priority: 0.8 },
    { url: 'https://poplarlabs.xyz/start', priority: 0.9 },
  ];
}
