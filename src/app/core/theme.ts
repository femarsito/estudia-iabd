import { Settings } from './models';

/** «system» quita el atributo y manda prefers-color-scheme. */
export function applyTheme(doc: Document, theme: Settings['theme']): void {
  if (theme === 'system') delete doc.documentElement.dataset['theme'];
  else doc.documentElement.dataset['theme'] = theme;
}
