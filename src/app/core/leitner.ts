import { AnswerRecord, QuestionState } from './models';
import { addDays, localDay } from './dates';

/** Días hasta el siguiente repaso según la caja (índice = caja - 1). */
export const INTERVALS = [1, 2, 4, 8, 16];

/** Recorre el registro de respuestas en orden y calcula la caja de cada pregunta que siga existiendo. */
export function computeStates(answers: AnswerRecord[], validIds: Set<string>): Map<string, QuestionState> {
  const states = new Map<string, QuestionState>();
  const sorted = answers.filter((a) => validIds.has(a.q)).sort((a, b) => a.at - b.at);
  for (const a of sorted) {
    const prev = states.get(a.q)?.box ?? 0;
    const box = (a.ok ? Math.min(5, prev + 1) : 1) as QuestionState['box'];
    states.set(a.q, { box, due: addDays(localDay(a.at), INTERVALS[box - 1]), lastAt: a.at, lastOk: a.ok });
  }
  return states;
}

/** Preguntas que tocan hoy: primero las falladas y después las que vencieron antes. */
export function reviewQueue(states: Map<string, QuestionState>, today: string, max = 15): string[] {
  return [...states]
    .filter(([, s]) => s.due <= today)
    .sort(([, a], [, b]) => Number(a.lastOk) - Number(b.lastOk) || a.due.localeCompare(b.due))
    .slice(0, max)
    .map(([id]) => id);
}
