import { AnswerRecord, QuestionState } from './models';
import { addDays, localDay } from './dates';
import { computeStates, reviewQueue } from './leitner';

const day = (d: number, h = 10) => new Date(2026, 10, d, h).getTime();
const ans = (q: string, ok: boolean, at: number): AnswerRecord => ({ q, ok, at, ms: 5000 });

describe('computeStates', () => {
  it('un fallo devuelve la pregunta a la caja 1 con repaso al día siguiente', () => {
    const states = computeStates(
      [ans('a', true, day(1)), ans('a', true, day(2)), ans('a', false, day(3))],
      new Set(['a']),
    );
    expect(states.get('a')).toEqual({ box: 1, due: addDays(localDay(day(3)), 1), lastAt: day(3), lastOk: false });
  });

  it('cinco aciertos dejan la pregunta en la caja 5 y no pasa de ahí', () => {
    const answers = [1, 2, 3, 4, 5, 6].map((d) => ans('a', true, day(d)));
    const st = computeStates(answers, new Set(['a'])).get('a')!;
    expect(st.box).toBe(5);
    expect(st.due).toBe(addDays(localDay(day(6)), 16));
  });

  it('ignora preguntas que ya no existen en el contenido', () => {
    const states = computeStates([ans('borrada', true, day(1))], new Set(['a']));
    expect(states.has('borrada')).toBe(false);
  });

  it('da lo mismo con las respuestas desordenadas', () => {
    const ordered = [ans('a', true, day(1)), ans('a', false, day(2)), ans('a', true, day(3))];
    const shuffled = [ordered[2], ordered[0], ordered[1]];
    expect(computeStates(shuffled, new Set(['a']))).toEqual(computeStates(ordered, new Set(['a'])));
  });
});

describe('reviewQueue', () => {
  const st = (box: QuestionState['box'], due: string, lastOk: boolean): QuestionState => ({ box, due, lastAt: 0, lastOk });

  it('devuelve como mucho 15 y primero las falladas', () => {
    const states = new Map<string, QuestionState>();
    for (let i = 0; i < 18; i++) states.set(`ok${i}`, st(3, '2026-11-10', true));
    states.set('ko1', st(1, '2026-11-17', false));
    states.set('ko2', st(1, '2026-11-18', false));
    const queue = reviewQueue(states, '2026-11-18');
    expect(queue.length).toBe(15);
    expect(queue.slice(0, 2).sort()).toEqual(['ko1', 'ko2']);
  });

  it('no incluye las que vencen mañana', () => {
    const states = new Map([['a', st(2, '2026-11-19', true)]]);
    expect(reviewQueue(states, '2026-11-18')).toEqual([]);
  });
});
