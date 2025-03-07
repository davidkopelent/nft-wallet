export function getImageUrl(src: any): string {
  // Check if src is a string
  if (!src || typeof src !== 'string') return '/placeholder.png';
  
  // Handle IPFS URLs
  if (src.startsWith('ipfs://')) {
    // Convert IPFS URL to HTTP URL using a gateway
    const ipfsHash = src.replace('ipfs://', '');
    return `https://ipfs.io/ipfs/${ipfsHash}`;
  }
  
  // Return HTTP/HTTPS URLs as is
  if (src.startsWith('http')) {
    return src;
  }
  
  // Fallback
  return '/placeholder.png';
} 