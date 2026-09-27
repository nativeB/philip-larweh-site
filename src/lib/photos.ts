import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*.jpg', { eager: true });

/** Look up an optimisable image by its filename in src/assets/photos. Fails the build if missing. */
export function photo(name: string): ImageMetadata {
  const hit = files[`../assets/photos/${name}`];
  if (!hit) throw new Error(`Photo not found in src/assets/photos: ${name}`);
  return hit.default;
}
