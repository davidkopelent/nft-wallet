import { useEffect } from 'react';

interface UseModalProps {
  onClose: () => void;
}

export const useModal = ({ onClose }: UseModalProps) => {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    // Add no-scroll class to body
    document.body.classList.add('overflow-hidden');

    // Clean up function to remove the class when component unmounts
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  // Handler for backdrop clicks
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return { handleBackdropClick };
}; 