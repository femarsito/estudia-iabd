import { RichTextPipe } from './rich-text';

describe('RichTextPipe', () => {
  const pipe = new RichTextPipe();

  it('convierte la negrita y escapa el HTML', () => {
    const html = pipe.transform('**a** <b>');
    expect(html).toContain('<strong>a</strong>');
    expect(html).toContain('&lt;b&gt;');
  });

  it('convierte el código entre comillas invertidas', () => {
    expect(pipe.transform('usa `fit()` antes')).toContain('<code>fit()</code>');
  });

  it('convierte líneas con guion en una lista', () => {
    const html = pipe.transform('- uno\n- dos');
    expect(html.match(/<li>/g)?.length).toBe(2);
    expect(html).toContain('<ul>');
  });

  it('separa párrafos', () => {
    expect(pipe.transform('uno\n\ndos').match(/<p>/g)?.length).toBe(2);
  });
});
