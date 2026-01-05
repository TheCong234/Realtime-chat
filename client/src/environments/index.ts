export const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
export const IMAGE_DOMAIN = process.env.NEXT_PUBLIC_IMAGE_DOMAIN || "";
// HUB_URL is derived from API_URL if NEXT_PUBLIC_HUB_URL is not set
export const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL || `${API_URL}/hubs/chat`;
