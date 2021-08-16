import { useEffect } from 'react';

export function useWindowEvent(event: any, handler: any, passive = false) {
  useEffect(() => {
    window.addEventListener(event, handler, passive);
    return function cleanup() {
      window.removeEventListener(event, handler, passive);
    };
  });
}

export function useDocumentEvent(event: any, handler: any, passive = false) {
  useEffect(() => {
    document.addEventListener(event, handler, passive);
    return function cleanup() {
      document.removeEventListener(event, handler, passive);
    };
  });
}
