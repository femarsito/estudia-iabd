import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { ContentService } from './content.service';
import { ProgressService } from './progress.service';
import { ContentIndex, Lesson, ModuleId, ModuleInfo, Question, Unit } from './models';
import { computeStates, reviewQueue } from './leitner';
import { mastery, minutesByDay, streak, xp } from './stats';
import { localDay } from './dates';
import { nextLesson } from './next-step';
import { QuizMode } from './quiz-builder';

export interface QuizResult {
  mode: QuizMode;
  backTo: string;
  answers: { questionId: string; ok: boolean }[];
  xpGained: number;
  total: number;
}

/** Une contenido y progreso para las pantallas: todo lo que se ve se calcula aquí. */
@Injectable({ providedIn: 'root' })
export class StudyStore {
  private readonly content = inject(ContentService);
  readonly progress = inject(ProgressService);

  readonly index = signal<ContentIndex | null>(null);
  readonly units = signal(new Map<string, Unit>());
  /** Módulo cuyo separador se ve de fondo. */
  readonly board = signal<ModuleId>('saa');
  readonly lastResult = signal<QuizResult | null>(null);
  /** Fecha local de hoy; avanza sola aunque la app se quede abierta de un día para otro. */
  readonly today = signal(localDay(Date.now()));

  readonly questionIds = computed(() => new Set([...this.units().values()].flatMap((u) => u.questions.map((q) => q.id))));
  readonly states = computed(() => computeStates(this.progress.progress().answers, this.questionIds()));
  readonly xp = computed(() => xp(this.progress.progress()));
  readonly goal = computed(() => this.progress.progress().settings.goalMinutes);
  readonly streak = computed(() => streak(this.progress.progress().answers, this.goal(), this.today()));
  readonly todayMinutes = computed(() => Math.floor(minutesByDay(this.progress.progress().answers).get(this.today()) ?? 0));
  readonly reviewIds = computed(() => reviewQueue(this.states(), this.today()));
  readonly next = computed(() => {
    const index = this.index();
    return index ? nextLesson(index, this.units(), this.progress.progress().lessonsDone) : null;
  });

  constructor() {
    const tick = () => this.today.set(localDay(Date.now()));
    const timer = setInterval(tick, 60_000);
    document.addEventListener('visibilitychange', tick);
    inject(DestroyRef).onDestroy(() => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', tick);
    });
  }

  async load(): Promise<void> {
    const index = await this.content.index();
    const loaded = await this.content.loadedUnits();
    this.units.set(new Map(loaded.map((u) => [u.id, u])));
    this.index.set(index);
  }

  module(id: string): ModuleInfo | undefined {
    return this.index()?.modules.find((m) => m.id === id);
  }

  moduleOfUnit(unitId: string): ModuleInfo | undefined {
    return this.index()?.modules.find((m) => m.units.some((u) => u.id === unitId));
  }

  /** Los ids de lección llevan delante el de su unidad: saa-ud01-l03 → saa-ud01. */
  unitOfLesson(lessonId: string): Unit | undefined {
    return this.units().get(lessonId.replace(/-l\d+$/, ''));
  }

  question(questionId: string): Question | undefined {
    return this.units().get(questionId.replace(/-q\d+$/, ''))?.questions.find((q) => q.id === questionId);
  }

  lesson(lessonId: string): Lesson | undefined {
    return this.unitOfLesson(lessonId)?.lessons.find((l) => l.id === lessonId);
  }

  unitMastery(unitId: string): number {
    const unit = this.units().get(unitId);
    return unit ? mastery(this.states(), unit.questions.map((q) => q.id)) : 0;
  }

  moduleMastery(moduleId: string): number {
    const ids = [...this.units().values()].filter((u) => u.moduleId === moduleId).flatMap((u) => u.questions.map((q) => q.id));
    return mastery(this.states(), ids);
  }

  isDone(lessonId: string): boolean {
    return !!this.progress.progress().lessonsDone[lessonId];
  }

  /** La lección siguiente dentro de la misma unidad, o null al acabar la unidad. */
  lessonAfter(lessonId: string): Lesson | null {
    const lessons = this.unitOfLesson(lessonId)?.lessons ?? [];
    return lessons[lessons.findIndex((l) => l.id === lessonId) + 1] ?? null;
  }
}
