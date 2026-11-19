import { ChoiceQ, Question, QuestionState, Unit } from './models';
import { reviewQueue } from './leitner';

export type QuizMode = 'practice' | 'exam' | 'sim' | 'review';

export interface QuizContext {
  units: Unit[];
  lessonId?: string;
  states: Map<string, QuestionState>;
  today: string;
  rng: () => number;
}

export const EXAM_SIZE = 10;
export const SIM_SIZE = 25;

/** «Todas…» o «Ninguna…» se refieren a las demás opciones: si se barajan pierden sentido. */
const FIXED_OPTION = /^(todas|ninguna)\b/i;

function shuffle<T>(items: T[], rng: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function shuffleOptions(q: ChoiceQ, rng: () => number): ChoiceQ {
  if (q.options.some((o) => FIXED_OPTION.test(o))) return q;
  const order = shuffle(q.options.map((_, i) => i), rng);
  return { ...q, options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) };
}

function pickQuestions(mode: QuizMode, ctx: QuizContext): Question[] {
  const all = ctx.units.flatMap((u) => u.questions);
  const byId = new Map(all.map((q) => [q.id, q]));
  const fromIds = (ids: string[]) => ids.map((id) => byId.get(id)).filter((q): q is Question => !!q);
  switch (mode) {
    case 'practice': {
      const lesson = ctx.units.flatMap((u) => u.lessons).find((l) => l.id === ctx.lessonId);
      return fromIds(lesson?.questionIds ?? []);
    }
    case 'exam':
      return shuffle(all, ctx.rng).slice(0, EXAM_SIZE);
    case 'sim':
      return shuffle(all, ctx.rng).slice(0, SIM_SIZE);
    case 'review':
      return fromIds(reviewQueue(ctx.states, ctx.today));
  }
}

export function buildQuiz(mode: QuizMode, ctx: QuizContext): Question[] {
  return pickQuestions(mode, ctx).map((q) => (q.type === 'choice' ? shuffleOptions(q, ctx.rng) : q));
}
