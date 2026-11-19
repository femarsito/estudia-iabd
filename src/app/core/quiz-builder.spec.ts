import { ChoiceQ, Question, QuestionState, Unit } from './models';
import { buildQuiz, shuffleOptions } from './quiz-builder';

/** Generador pseudoaleatorio fijo para que los tests sean repetibles. */
const seeded = (seed = 42) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

const choice = (n: number, unitId = 'saa-ud01', extra: Partial<ChoiceQ> = {}): ChoiceQ => ({
  id: `${unitId}-q${String(n).padStart(3, '0')}`,
  type: 'choice',
  prompt: `P${n}`,
  options: ['a', 'b', 'c', 'd'],
  answer: 2,
  explanation: 'e',
  source: 's',
  difficulty: 1,
  ...extra,
});

const unitWith = (n: number, id = 'saa-ud01'): Unit => ({
  id,
  moduleId: 'saa',
  number: 1,
  title: 't',
  lessons: [{ id: `${id}-l01`, kind: 'practice', title: 'p', section: '1', questionIds: [`${id}-q003`, `${id}-q001`] }],
  questions: Array.from({ length: n }, (_, i) => choice(i + 1, id)),
});

const ctx = (units: Unit[], extra = {}) => ({ units, states: new Map<string, QuestionState>(), today: '2026-11-19', rng: seeded(), ...extra });

describe('buildQuiz', () => {
  it('practice devuelve las preguntas de la lección en su orden', () => {
    const qs = buildQuiz('practice', ctx([unitWith(5)], { lessonId: 'saa-ud01-l01' }));
    expect(qs.map((q) => q.id)).toEqual(['saa-ud01-q003', 'saa-ud01-q001']);
  });

  it('exam saca 10 preguntas distintas de la unidad', () => {
    const qs = buildQuiz('exam', ctx([unitWith(30)]));
    expect(qs.length).toBe(10);
    expect(new Set(qs.map((q) => q.id)).size).toBe(10);
  });

  it('sim usa todas si hay menos de 25', () => {
    expect(buildQuiz('sim', ctx([unitWith(12)])).length).toBe(12);
  });

  it('sim saca 25 de varias unidades', () => {
    expect(buildQuiz('sim', ctx([unitWith(20), unitWith(20, 'saa-ud02')])).length).toBe(25);
  });

  it('review respeta el máximo de 15', () => {
    const units = [unitWith(30)];
    const states = new Map<string, QuestionState>(
      units[0].questions.map((q) => [q.id, { box: 1, due: '2026-11-18', lastAt: 0, lastOk: false }]),
    );
    expect(buildQuiz('review', ctx(units, { states })).length).toBe(15);
  });
});

describe('shuffleOptions', () => {
  it('mantiene correcta la opción buena', () => {
    const q = choice(1, 'saa-ud01', { options: ['w', 'x', 'buena', 'z'], answer: 2 });
    for (let s = 1; s < 20; s++) {
      const sh = shuffleOptions(q, seeded(s));
      expect(sh.options[sh.answer]).toBe('buena');
      expect([...sh.options].sort()).toEqual(['buena', 'w', 'x', 'z']);
    }
  });

  it('no baraja si hay «Ninguna es correcta»', () => {
    const q = choice(1, 'saa-ud01', { options: ['a', 'b', 'c', 'Ninguna es correcta.'], answer: 3 });
    expect(shuffleOptions(q, seeded())).toEqual(q);
  });

  it('buildQuiz baraja las opciones sin cambiar cuál es la buena', () => {
    const qs = buildQuiz('exam', ctx([unitWith(30)])) as ChoiceQ[];
    expect(qs.every((q) => q.options[q.answer] === 'c')).toBe(true);
    expect(qs.some((q) => q.answer !== 2)).toBe(true);
  });

  it('las preguntas que no son de test pasan tal cual', () => {
    const tf: Question = { id: 'saa-ud01-q099', type: 'truefalse', prompt: 'p', answer: true, explanation: 'e', source: 's', difficulty: 1 };
    const unit = { ...unitWith(0), questions: [tf], lessons: [{ id: 'saa-ud01-l01', kind: 'practice' as const, title: 'p', section: '1', questionIds: [tf.id] }] };
    expect(buildQuiz('practice', ctx([unit], { lessonId: 'saa-ud01-l01' }))).toEqual([tf]);
  });
});
