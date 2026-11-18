import { AnswerRecord, Progress, QuestionState } from './models';
import { addDays, localDay } from './dates';

const MAX_MS_PER_ANSWER = 120_000;

export function xp(p: Progress): number {
  return p.answers.filter((a) => a.ok).length * 10 + Object.keys(p.lessonsDone).length * 20;
}

export function minutesByDay(answers: AnswerRecord[]): Map<string, number> {
  const byDay = new Map<string, number>();
  for (const a of answers) {
    const day = localDay(a.at);
    byDay.set(day, (byDay.get(day) ?? 0) + Math.min(a.ms, MAX_MS_PER_ANSWER) / 60_000);
  }
  return byDay;
}

/** Días seguidos con la meta cumplida, acabando hoy (o ayer si hoy aún no se ha llegado). */
export function streak(answers: AnswerRecord[], goalMinutes: number, today: string): number {
  const byDay = minutesByDay(answers);
  const met = (day: string) => (byDay.get(day) ?? 0) >= goalMinutes;
  let day = met(today) ? today : addDays(today, -1);
  let count = 0;
  while (met(day)) {
    count++;
    day = addDays(day, -1);
  }
  return count;
}

/** Porcentaje (0-100) de las preguntas en las cajas 4 o 5. */
export function mastery(states: Map<string, QuestionState>, questionIds: string[]): number {
  if (questionIds.length === 0) return 0;
  const high = questionIds.filter((id) => (states.get(id)?.box ?? 0) >= 4).length;
  return Math.round((high / questionIds.length) * 100);
}
