/**
 * Combines and formats IPFS URLs that might come in split format
 * @param imageUrl - Can be a string or array of strings representing IPFS path parts
 * @returns Formatted gateway URL
 */
export const formatIpfsUrl = (imageUrl: string | string[]): string => {
  // If imageUrl is an array, join the parts
  const fullPath = Array.isArray(imageUrl) ? imageUrl.join('') : imageUrl;

  // Remove 'ipfs://' if present
  const cleanPath = fullPath.replace('ipfs://', '');

  // List of IPFS gateways to try
  const IPFS_GATEWAYS = [
    'https://ipfs.io/ipfs/',
    'https://gateway.ipfs.io/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/',
  ];

  // Use the first gateway (you could implement fallback logic if needed)
  return `${IPFS_GATEWAYS[0]}${cleanPath}`;
};

/**
 * Gets a working image URL from various possible formats
 * @param image - Image URL or IPFS data
 * @returns Formatted image URL
 */
export const getImageUrl = (image: string | string[] | null): string => {
  if (!image) {
    return '/images/placeholder.png'; // Your default image path
  }

  // Handle array format
  if (Array.isArray(image)) {
    return formatIpfsUrl(image);
  }

  // Handle IPFS protocol
  if (image.startsWith('ipfs://')) {
    return formatIpfsUrl(image);
  }

  // Return as-is if it's already a valid HTTP(S) URL
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }

  // Assume it's an IPFS hash if none of the above
  return formatIpfsUrl(image);
}; 