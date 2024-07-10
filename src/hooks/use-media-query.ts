import { useEffect, useState } from 'react';

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const listener = (evt: MediaQueryListEvent) => setMatches(evt.matches);

    const result = window.matchMedia(query);
    result.addEventListener('change', listener);
    setMatches(result.matches);

    return () => result.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

export function useIsDesktop() {
  return useMediaQuery('(min-width: 768px)');
}
