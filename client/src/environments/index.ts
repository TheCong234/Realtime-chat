export const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
export const IMAGE_DOMAIN = API_URL;
// HUB_URL is derived from API_URL if NEXT_PUBLIC_HUB_URL is not set
export const HUB_URL = `${API_URL}/hubs/chat`;
