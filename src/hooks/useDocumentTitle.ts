// Sets the browser tab title for each page.
import { useEffect } from 'react';

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | FitNova AI`;
  }, [title]);
}
