import { Pipe, PipeTransform } from '@angular/core';

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Escapa primero y después marca **negrita** y `código`, así nunca entra HTML del contenido. */
const inline = (s: string) =>
  escape(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');

/** Agrupa las líneas seguidas con «- » en una lista y el resto en párrafos. */
function block(text: string): string {
  const groups: { list: boolean; lines: string[] }[] = [];
  for (const line of text.split('\n')) {
    const list = line.startsWith('- ');
    const last = groups.at(-1);
    if (last?.list === list) last.lines.push(line);
    else groups.push({ list, lines: [line] });
  }
  return groups
    .map((g) =>
      g.list
        ? `<ul>${g.lines.map((l) => `<li>${inline(l.slice(2))}</li>`).join('')}</ul>`
        : `<p>${g.lines.map(inline).join('<br>')}</p>`,
    )
    .join('');
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
