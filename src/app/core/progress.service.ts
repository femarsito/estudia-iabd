import { Injectable, signal } from '@angular/core';
import { Progress, QuestionState, Settings } from './models';
import { emptyProgress, mergeProgress, parseProgress, serializeProgress } from './progress-codec';
import { computeStates } from './leitner';

export const STORAGE_KEY = 'estudia-iabd:progress';

const BROKEN_DATA_MSG =
  'Tu progreso guardado estaba dañado y se ha empezado de cero. Hay una copia del dato roto por si se puede recuperar.';
const NO_SPACE_MSG = 'No queda espacio para guardar el progreso en este dispositivo. Exporta una copia desde Ajustes.';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  readonly loadError = signal<string | null>(null);
  readonly progress = signal<Progress>(this.load());

  recordAnswer(q: string, ok: boolean, ms: number): void {
    this.update((p) => ({ ...p, answers: [...p.answers, { q, ok, at: Date.now(), ms }] }));
  }

  completeLesson(lessonId: string): void {
    if (this.progress().lessonsDone[lessonId]) return;
    this.update((p) => ({ ...p, lessonsDone: { ...p.lessonsDone, [lessonId]: Date.now() } }));
  }

  flagQuestion(q: string, note?: string): void {
    this.update((p) => ({ ...p, flags: { ...p.flags, [q]: { at: Date.now(), note } } }));
  }

  updateSettings(s: Partial<Settings>): void {
    this.update((p) => ({ ...p, settings: { ...p.settings, ...s } }));
  }

  exportFile(): Blob {
    return new Blob([serializeProgress(this.progress())], { type: 'application/json' });
  }

  importText(text: string): 'ok' | 'invalid' {
    const incoming = parseProgress(text);
    if (!incoming) return 'invalid';
    this.update((p) => mergeProgress(p, incoming));
    return 'ok';
  }

  states(validIds: Set<string>): Map<string, QuestionState> {
    return computeStates(this.progress().answers, validIds);
  }

  private update(fn: (p: Progress) => Progress): void {
    const next = fn(this.progress());
    this.progress.set(next);
    try {
      localStorage.setItem(STORAGE_KEY, serializeProgress(next));
    } catch {
      // Sin espacio o almacenamiento bloqueado: se sigue en memoria y se avisa.
      this.loadError.set(NO_SPACE_MSG);
    }
  }

  private load(): Progress {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return emptyProgress();
    const parsed = parseProgress(raw);
    if (parsed) return parsed;
    try {
      localStorage.setItem(`${STORAGE_KEY}:roto:${new Date().toISOString()}`, raw);
      this.loadError.set(BROKEN_DATA_MSG);
    } catch {
      // Sin espacio ni para la copia: el dato roto sigue en su clave hasta el próximo guardado.
      this.loadError.set(NO_SPACE_MSG);
    }
    return emptyProgress();
  }
}
