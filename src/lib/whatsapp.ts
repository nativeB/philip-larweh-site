import site from '../data/site.json';

/** Build a wa.me link with a pre-filled, URL-encoded message. */
export function waLink(message: string = site.whatsappMessages.general): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const telLink = `tel:${site.phone}`;
