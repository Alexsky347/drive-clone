import { useState, useCallback } from 'react';

export interface UseViewPort {
  count: number;
  increment: () => void;
}

export function useViewPort(): UseViewPort {
  const [count, setCount] = useState(0);
  const increment = useCallback(() => setCount((x) => x + 1), []);
  return { count, increment };
}
