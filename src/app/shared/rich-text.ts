import { Pipe, PipeTransform } from '@angular/core';

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Escapa primero y después marca **negrita** y `código`, así nunca entra HTML del contenido. */
const inline = (s: string) =>
  escape(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');

function block(text: string): string {
  const lines = text.split('\n');
  if (lines.every((l) => l.startsWith('- '))) {
    return `<ul>${lines.map((l) => `<li>${inline(l.slice(2))}</li>`).join('')}</ul>`;
  }
  return `<p>${lines.map(inline).join('<br>')}</p>`;
}

/** Formato mínimo del contenido: **negrita**, `código`, listas con «- » y párrafos separados por línea en blanco. */
@Pipe({ name: 'richText' })
export class RichTextPipe implements PipeTransform {
  transform(text: string | undefined): string {
    return (text ?? '')
      .trim()
      .split(/\n\s*\n/)
      .map(block)
      .join('');
  }
}
