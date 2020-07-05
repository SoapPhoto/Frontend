import {
  useRef, useEffect,
} from 'react';

let timer: number | undefined;

export function useHashChange(handler: () => void) {
  const hash = useRef('');
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);
  useEffect(
    () => {
      timer = window.setInterval(() => {
        if (hash.current !== window.location.hash) {
          hash.current = window.location.hash;
          if (savedHandler.current) {
            savedHandler.current();
          }
        }
      }, 150);
      return () => clearInterval(timer);
    },
    [],
  );
}
