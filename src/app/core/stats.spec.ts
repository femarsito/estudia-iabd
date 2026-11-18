import { AnswerRecord, Progress, QuestionState } from './models';
import { mastery, minutesByDay, streak, xp } from './stats';

const at = (d: number, h = 10) => new Date(2026, 10, d, h).getTime();
const ans = (ok: boolean, d: number, ms = 60_000): AnswerRecord => ({ q: 'q', ok, at: at(d), ms });
const progress = (answers: AnswerRecord[], lessons: string[] = []): Progress => ({
  version: 1,
  answers,
  lessonsDone: Object.fromEntries(lessons.map((l) => [l, at(1)])),
  flags: {},
  settings: { goalMinutes: 10, theme: 'system' },
});
/** n respuestas de 2 minutos en el día d (2 min es el tope por respuesta). */
const minutes = (d: number, n: number) => Array.from({ length: n }, () => ans(true, d, 120_000));

describe('xp', () => {
  it('da 10 por acierto y 20 por lección terminada', () => {
    const p = progress([ans(true, 1), ans(true, 1), ans(true, 1), ans(false, 1)], ['l1', 'l2']);
    expect(xp(p)).toBe(70);
  });
});

describe('minutesByDay', () => {
  it('cuenta como mucho 2 minutos por respuesta', () => {
    expect(minutesByDay([ans(true, 3, 600_000)]).get('2026-11-03')).toBe(2);
  });
});

describe('streak', () => {
  const threeDays = [...minutes(15, 5), ...minutes(16, 5), ...minutes(17, 5)];

  it('no rompe la racha si hoy todavía no se ha cumplido la meta', () => {
    expect(streak([...threeDays, ...minutes(18, 2)], 10, '2026-11-18')).toBe(3);
  });

  it('cuenta hoy si ya se ha cumplido la meta', () => {
    expect(streak([...threeDays, ...minutes(18, 5)], 10, '2026-11-18')).toBe(4);
  });

  it('se corta en el primer día sin meta', () => {
    expect(streak([...minutes(15, 5), ...minutes(17, 5)], 10, '2026-11-18')).toBe(1);
  });

  it('es 0 sin respuestas', () => {
    expect(streak([], 10, '2026-11-18')).toBe(0);
  });

  it('una respuesta a las 23:59 y otra a las 00:01 cuentan en días distintos', () => {
    const late = { q: 'q', ok: true, at: new Date(2026, 10, 17, 23, 59).getTime(), ms: 120_000 };
    const early = { q: 'q', ok: true, at: new Date(2026, 10, 18, 0, 1).getTime(), ms: 120_000 };
    const byDay = minutesByDay([late, early]);
    expect(byDay.get('2026-11-17')).toBe(2);
    expect(byDay.get('2026-11-18')).toBe(2);
  });
});

describe('mastery', () => {
  it('es el porcentaje de preguntas en las cajas 4 y 5', () => {
    const st = (box: QuestionState['box']): QuestionState => ({ box, due: '2026-11-18', lastAt: 0, lastOk: true });
    const states = new Map([['a', st(4)], ['b', st(5)], ['c', st(2)]]);
    expect(mastery(states, ['a', 'b', 'c', 'd'])).toBe(50);
  });

  it('es 0 en una unidad sin preguntas', () => {
    expect(mastery(new Map(), [])).toBe(0);
  });
});
