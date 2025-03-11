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

  return `https://ipfs.io/ipfs/${cleanPath}`;
};

/**
 * Gets a working image URL from various possible formats
 * @param image - Image URL or IPFS data
 * @returns Formatted image URL
 */
export const getImageUrl = (image: string | string[] | null): string => {
  if (!image) {
    return '/images/placeholder.png';
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