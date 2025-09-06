import { useState, useEffect } from 'react';

/**
 * A simple media query hook to detect screen size changes.
 * @param {string} query - The media query string to watch.
 * @returns {boolean} - True if the media query matches, false otherwise.
 */
export const useMediaQuery = (query) => {
  // It's important to check for window existence for SSR compatibility
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);

    // Safari < 14 requires the deprecated addListener/removeListener
    media.addEventListener ? media.addEventListener('change', listener) : media.addListener(listener);

    return () => {
      media.removeEventListener ? media.removeEventListener('change', listener) : media.removeListener(listener);
    };
  }, [query]);

  return matches;
};

