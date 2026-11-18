import { AnswerRecord, Progress } from './models';

export function emptyProgress(): Progress {
  return { version: 1, answers: [], lessonsDone: {}, flags: {}, settings: { goalMinutes: 10, theme: 'system' } };
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

const isAnswer = (a: unknown): a is AnswerRecord =>
  isRecord(a) &&
  typeof a['q'] === 'string' &&
  typeof a['ok'] === 'boolean' &&
  typeof a['at'] === 'number' &&
  typeof a['ms'] === 'number';

const isNumberMap = (v: unknown) => isRecord(v) && Object.values(v).every((n) => typeof n === 'number');

const isFlagMap = (v: unknown) => isRecord(v) && Object.values(v).every((f) => isRecord(f) && typeof f['at'] === 'number');

const isSettings = (s: unknown) =>
  isRecord(s) && [5, 10, 15].includes(s['goalMinutes'] as number) && ['system', 'light', 'dark'].includes(s['theme'] as string);

/** Lee un progreso guardado o importado; null si no es válido. */
export function parseProgress(text: string): Progress | null {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return null;
  }
  const valid =
    isRecord(data) &&
    data['version'] === 1 &&
    Array.isArray(data['answers']) &&
    data['answers'].every(isAnswer) &&
    isNumberMap(data['lessonsDone']) &&
    isFlagMap(data['flags']) &&
    isSettings(data['settings']);
  return valid ? (data as unknown as Progress) : null;
}

export function serializeProgress(p: Progress): string {
  return JSON.stringify(p);
}

/** Une dos progresos sin perder nada; los ajustes son los de `a`. */
export function mergeProgress(a: Progress, b: Progress): Progress {
  const answers = new Map<string, AnswerRecord>();
  for (const r of [...a.answers, ...b.answers]) answers.set(`${r.q}|${r.at}`, r);

  const lessonsDone = { ...a.lessonsDone };
  for (const [id, at] of Object.entries(b.lessonsDone)) lessonsDone[id] = Math.min(at, lessonsDone[id] ?? at);

  const flags = { ...a.flags };
  for (const [id, f] of Object.entries(b.flags)) if (!flags[id] || f.at > flags[id].at) flags[id] = f;

  return { version: 1, answers: [...answers.values()].sort((x, y) => x.at - y.at), lessonsDone, flags, settings: a.settings };
}
