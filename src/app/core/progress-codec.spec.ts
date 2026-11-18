import { AnswerRecord, Progress } from './models';
import { emptyProgress, mergeProgress, parseProgress, serializeProgress } from './progress-codec';

const ans = (q: string, at: number): AnswerRecord => ({ q, ok: true, at, ms: 1000 });
const withAnswers = (answers: AnswerRecord[], lessonsDone: Record<string, number> = {}): Progress => ({
  ...emptyProgress(),
  answers,
  lessonsDone,
});

describe('parseProgress', () => {
  it('devuelve null si no es JSON', () => {
    expect(parseProgress('{')).toBeNull();
  });

  it('devuelve null con una versión desconocida', () => {
    expect(parseProgress('{"version":2}')).toBeNull();
  });

  it('devuelve null si una respuesta tiene tipos incorrectos', () => {
    const bad = { ...emptyProgress(), answers: [{ q: 1, ok: 'sí', at: 'ayer', ms: 0 }] };
    expect(parseProgress(JSON.stringify(bad))).toBeNull();
  });

  it('serializar y volver a parsear deja el progreso igual', () => {
    const p = withAnswers([ans('a', 1)], { l1: 5 });
    expect(parseProgress(serializeProgress(p))).toEqual(p);
  });
});

describe('mergeProgress', () => {
  it('fusionar un progreso consigo mismo no duplica respuestas', () => {
    const p = withAnswers([ans('a', 1), ans('b', 2)]);
    expect(mergeProgress(p, p).answers.length).toBe(2);
  });

  it('une las respuestas de dos dispositivos', () => {
    const a = withAnswers([ans('a', 1), ans('b', 2)]);
    const b = withAnswers([ans('b', 2), ans('c', 3)]);
    expect(mergeProgress(a, b).answers.length).toBe(3);
  });

  it('en las lecciones hechas se queda la fecha más antigua', () => {
    const a = withAnswers([], { l1: 10 });
    const b = withAnswers([], { l1: 5, l2: 7 });
    expect(mergeProgress(a, b).lessonsDone).toEqual({ l1: 5, l2: 7 });
  });

  it('en las marcas gana la más reciente y los ajustes son los del primero', () => {
    const a: Progress = { ...emptyProgress(), flags: { q1: { at: 1 } }, settings: { goalMinutes: 15, theme: 'dark' } };
    const b: Progress = { ...emptyProgress(), flags: { q1: { at: 9, note: 'mal' } } };
    const merged = mergeProgress(a, b);
    expect(merged.flags['q1']).toEqual({ at: 9, note: 'mal' });
    expect(merged.settings.goalMinutes).toBe(15);
  });
});
