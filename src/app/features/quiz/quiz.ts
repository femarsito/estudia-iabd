import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { StudyStore } from '../../core/study.store';
import { ChoiceQ, MatchQ, OrderQ, Question, TrueFalseQ, Unit } from '../../core/models';
import { QuizMode, buildQuiz } from '../../core/quiz-builder';
import { localDay } from '../../core/dates';
import { Icon } from '../../shared/icon';
import { RichTextPipe } from '../../shared/rich-text';
import { ChoiceQuestion } from './questions/choice-question';
import { MatchQuestion } from './questions/match-question';
import { OrderQuestion } from './questions/order-question';
import { Answer } from './questions/answer';

const SIM_MINUTES = 30;
const TITLES: Record<QuizMode, string> = { practice: 'Practica', exam: 'Examen de la unidad', sim: 'Simulacro', review: 'Repaso de hoy' };

@Component({
  selector: 'app-quiz',
  imports: [RouterLink, Icon, RichTextPipe, ChoiceQuestion, MatchQuestion, OrderQuestion],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .top { display: flex; align-items: center; gap: var(--s3); color: var(--on-board); margin-bottom: var(--s4); }
    .top a { color: inherit; display: inline-flex; padding: var(--s2); margin-left: calc(-1 * var(--s2)); }
    .bar { flex: 1; height: 8px; border-radius: 4px; background: color-mix(in srgb, var(--on-board) 28%, transparent); overflow: hidden; }
    .bar i { display: block; height: 100%; background: var(--on-board); transition: width var(--hinge); }
    .count, .timer { font-weight: 800; font-size: 16px; display: inline-flex; gap: 4px; align-items: center; }
    .leaf { display: grid; gap: var(--s4); }
    .slip { padding: var(--s3) var(--s4); border-radius: var(--radius); display: grid; gap: var(--s1); }
    .slip.ok { background: var(--ok-wash); box-shadow: inset 0 0 0 2px var(--ok); }
    .slip.ko { background: var(--ko-wash); box-shadow: inset 0 0 0 2px var(--ko); }
    .slip strong { display: inline-flex; gap: 6px; align-items: center; font-size: 18px; }
    .slip.ok strong app-icon { color: var(--ok); }
    .slip.ko strong app-icon { color: var(--ko); }
    .foot { display: flex; justify-content: space-between; align-items: center; gap: var(--s3); flex-wrap: wrap; font-size: 14px; color: var(--ink-soft); border-top: 1px solid var(--rule); padding-top: var(--s3); }
    .flag { display: inline-flex; gap: 6px; align-items: center; min-height: 44px; border: 0; background: transparent; color: var(--ink-soft); font: inherit; cursor: pointer; padding: 0 var(--s2); }
    .flag:hover { color: var(--ink); }
    .intro h1 { font-size: 36px; }
    label.toggle { display: flex; gap: var(--s3); align-items: center; min-height: 44px; font-weight: 600; }
    label.toggle input { width: 22px; height: 22px; accent-color: var(--board); }
  `,
  template: `
    <div class="top">
      <a [routerLink]="backTo()" aria-label="Salir del test"><app-icon name="cross" /></a>
      <div class="bar" role="progressbar" [attr.aria-valuenow]="i()" [attr.aria-valuemax]="questions().length" aria-label="Avance">
        <i [style.width.%]="questions().length ? (100 * i()) / questions().length : 0"></i>
      </div>
      @if (deadline()) { <span class="timer"><app-icon name="clock" /> {{ remaining() }}</span> }
      <span class="count">{{ Math.min(i() + 1, questions().length) }}/{{ questions().length }}</span>
    </div>

    @if (mode() === 'sim' && !started()) {
      <section class="leaf intro hinge">
        <h1>Simulacro</h1>
        <p>{{ questions().length }} preguntas al azar de todas las unidades del módulo. La nota y las explicaciones salen al final.</p>
        <label class="toggle"><input type="checkbox" [checked]="timed()" (change)="timed.set(!timed())" /> Con tiempo ({{ SIM_MINUTES }} minutos)</label>
        <button class="btn btn--block" type="button" (click)="start()">Empezar</button>
      </section>
    } @else if (current()) {
      @for (q of [current()!]; track q.id) {
      <section class="leaf hinge" [attr.aria-label]="'Pregunta ' + (i() + 1)">
        @switch (q.type) {
          @case ('match') { <app-match-question [question]="asMatch(q)" [reveal]="reveal()" (answered)="onAnswer($event)" /> }
          @case ('order') { <app-order-question [question]="asOrder(q)" [reveal]="reveal()" (answered)="onAnswer($event)" /> }
          @default { <app-choice-question [question]="asChoice(q)" [reveal]="reveal()" (answered)="onAnswer($event)" /> }
        }

        @if (last(); as a) {
          @if (reveal()) {
            <div class="slip" [class.ok]="a.ok" [class.ko]="!a.ok" role="status">
              <strong><app-icon [name]="a.ok ? 'check' : 'cross'" /> {{ a.ok ? 'Bien' : 'No es esa' }}</strong>
              <div class="rich" [innerHTML]="q.explanation | richText"></div>
            </div>
          }
          <button class="btn btn--block" type="button" (click)="advance()">
            {{ i() + 1 < questions().length ? 'Siguiente' : 'Ver resultado' }} <app-icon name="arrow" />
          </button>
        }

        <div class="foot">
          <span>{{ q.source }}</span>
          <button class="flag" type="button" (click)="flag(q.id)" [disabled]="flagged().has(q.id)">
            <app-icon name="flag" /> {{ flagged().has(q.id) ? 'Apuntada para revisar' : 'Esta pregunta está mal' }}
          </button>
        </div>
      </section>
      }
    } @else if (store.index() && !questions().length) {
      <section class="leaf"><p>No hay preguntas para esto todavía.</p><a class="btn" [routerLink]="backTo()">Volver</a></section>
    }
  `,
})
export class Quiz {
  readonly mode = input.required<QuizMode>();
  readonly id = input.required<string>();
  protected readonly store = inject(StudyStore);
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  protected readonly Math = Math;
  protected readonly SIM_MINUTES = SIM_MINUTES;

  protected readonly questions = signal<Question[]>([]);
  protected readonly i = signal(0);
  protected readonly last = signal<Answer | null>(null);
  protected readonly results = signal<{ questionId: string; ok: boolean }[]>([]);
  protected readonly flagged = signal(new Set<string>());
  protected readonly started = signal(false);
  protected readonly timed = signal(false);
  protected readonly deadline = signal<number | null>(null);
  private readonly now = signal(Date.now());
  private finished = false;

  protected readonly current = computed(() => this.questions()[this.i()]);
  protected readonly reveal = computed(() => this.mode() === 'practice' || this.mode() === 'review');
  protected readonly remaining = computed(() => {
    const left = Math.max(0, (this.deadline() ?? 0) - this.now());
    const s = Math.floor(left / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  });
  protected readonly backTo = computed(() => {
    const id = this.id();
    switch (this.mode()) {
      case 'practice': return ['/unidad', this.store.unitOfLesson(id)?.id ?? ''];
      case 'exam': return ['/unidad', id];
      case 'sim': return ['/modulo', id];
      default: return ['/'];
    }
  });

  constructor() {
    effect(() => {
      if (!this.store.index() || this.questions().length) return;
      const units = this.unitsFor();
      this.questions.set(
        buildQuiz(this.mode(), { units, lessonId: this.id(), states: this.store.states(), today: localDay(Date.now()), rng: Math.random }),
      );
      if (units[0]) this.store.board.set(units[0].moduleId);
      this.started.set(this.mode() !== 'sim');
      this.title.setTitle(`${TITLES[this.mode()]} · Estudia IABD`);
    });
    effect(() => {
      if (this.deadline() && this.now() >= this.deadline()!) this.finish();
    });
    const tick = setInterval(() => this.deadline() && this.now.set(Date.now()), 1000);
    inject(DestroyRef).onDestroy(() => clearInterval(tick));
  }

  private unitsFor(): Unit[] {
    const all = [...this.store.units().values()];
    switch (this.mode()) {
      case 'practice': return all.filter((u) => u.id === this.store.unitOfLesson(this.id())?.id);
      case 'exam': return all.filter((u) => u.id === this.id());
      case 'sim': return all.filter((u) => u.moduleId === this.id());
      default: return all;
    }
  }

  protected asChoice = (q: Question) => q as ChoiceQ | TrueFalseQ;
  protected asMatch = (q: Question) => q as MatchQ;
  protected asOrder = (q: Question) => q as OrderQ;

  protected start(): void {
    if (this.timed()) this.deadline.set(Date.now() + SIM_MINUTES * 60_000);
    this.started.set(true);
  }

  protected onAnswer(a: Answer): void {
    const q = this.current();
    if (!q) return;
    this.store.progress.recordAnswer(q.id, a.ok, a.ms);
    this.results.update((r) => [...r, { questionId: q.id, ok: a.ok }]);
    this.last.set(a);
  }

  protected advance(): void {
    this.last.set(null);
    if (this.i() + 1 < this.questions().length) this.i.update((n) => n + 1);
    else this.finish();
  }

  protected flag(id: string): void {
    this.store.progress.flagQuestion(id);
    this.flagged.update((s) => new Set(s).add(id));
  }

  private finish(): void {
    if (this.finished) return;
    this.finished = true;
    const results = this.results();
    let xpGained = results.filter((r) => r.ok).length * 10;
    if (this.mode() === 'practice' && !this.store.isDone(this.id())) {
      this.store.progress.completeLesson(this.id());
      xpGained += 20;
    }
    this.store.lastResult.set({ mode: this.mode(), backTo: this.backTo().join('/').replace('//', '/'), answers: results, xpGained, total: this.questions().length });
    this.router.navigate(['/resultado']);
  }
}
