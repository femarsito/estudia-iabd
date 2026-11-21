import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StudyStore } from '../../core/study.store';
import { Icon } from '../../shared/icon';
import { LESSON_ICON, LESSON_VERB, lessonLink } from '../../shared/lesson-meta';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    header { display: flex; justify-content: space-between; align-items: center; color: var(--on-board); margin-bottom: var(--s5); }
    .brand { font-weight: 800; font-stretch: 80%; font-size: 24px; letter-spacing: -0.01em; }
    .stats { display: flex; gap: var(--s4); font-weight: 800; font-size: 19px; }
    .stats span { display: inline-flex; align-items: center; gap: 6px; }
    .leaf { display: grid; gap: var(--s4); }
    h1 { font-size: clamp(34px, 9vw, 52px); }
    .where { color: var(--ink-soft); font-size: 16px; display: flex; align-items: center; gap: var(--s2); }
    .goal { display: grid; gap: var(--s2); }
    .goal-bar { display: grid; grid-auto-flow: column; gap: 4px; }
    .goal-bar i { height: 10px; border-radius: 2px; background: var(--rule); }
    .goal-bar i.on { background: var(--board); }
    .goal p { font-size: 15px; color: var(--ink-soft); }
    .review {
      margin-top: var(--s4); display: flex; justify-content: space-between; align-items: center; gap: var(--s4);
      padding: var(--s4) var(--s5); border-radius: var(--radius); background: var(--leaf-solid); color: var(--ink);
      text-decoration: none; box-shadow: var(--shadow-leaf);
    }
    .review strong { font-size: 20px; font-stretch: 85%; }
    .review .count { display: inline-flex; align-items: center; gap: 6px; font-weight: 800; font-size: 22px; }
    .alert { margin-bottom: var(--s4); padding: var(--s3) var(--s4); border-radius: var(--radius); background: var(--ko-wash); color: var(--ink); }
    .done h1 { font-size: 36px; }
    .after { list-style: none; margin: 0; padding: var(--s3) 0 0; border-top: 1px solid var(--rule); display: grid; gap: var(--s2); }
    .after li { display: flex; gap: var(--s3); align-items: center; color: var(--ink-soft); font-size: 16px; }
    .after li app-icon { --icon-size: 18px; }
  `,
  template: `
    <header>
      <span class="brand">Estudia IABD</span>
      <span class="stats">
        <span title="Días seguidos cumpliendo la meta"><app-icon name="flame" /> {{ store.streak() }}<span class="sr-only"> días de racha</span></span>
        <span title="Puntos"><app-icon name="star" /> {{ store.xp() }}<span class="sr-only"> puntos</span></span>
      </span>
    </header>

    @if (store.progress.loadError(); as error) {
      <p class="alert" role="alert">{{ error }}</p>
    }

    @if (!store.index()) {
      <section class="leaf"><p>Cargando tus apuntes…</p></section>
    } @else if (next(); as n) {
      <section class="leaf hinge" aria-labelledby="next-title">
        <h1 id="next-title">{{ n.lesson.title }}</h1>
        <p class="where"><app-icon [name]="icon[n.lesson.kind]" /> {{ verb[n.lesson.kind] }} · {{ n.moduleCode }} · Unidad {{ n.unitNumber }}</p>
        <div class="goal">
          <div class="goal-bar" aria-hidden="true">
            @for (seg of goalSegments(); track $index) { <i [class.on]="seg"></i> }
          </div>
          <p>Hoy llevas {{ store.todayMinutes() }} de {{ store.goal() }} minutos</p>
        </div>
        <a class="btn btn--block" [routerLink]="n.link">Seguir <app-icon name="arrow" /></a>
        @if (n.after.length) {
          <ul class="after" aria-label="Después">
            @for (l of n.after; track l.id) { <li><app-icon [name]="icon[l.kind]" /><span class="sr-only">{{ verb[l.kind] }}: </span>{{ l.title }}</li> }
          </ul>
        }
      </section>
    } @else {
      <section class="leaf done">
        <h1>Lo tienes todo al día</h1>
        <p class="where">Has terminado todas las lecciones disponibles. Repasa o haz un simulacro desde Módulos.</p>
      </section>
    }

    @if (store.reviewIds().length) {
      <a class="review" routerLink="/quiz/review/hoy">
        <strong>Repaso de hoy</strong>
        <span class="count"><app-icon name="repeat" /> {{ store.reviewIds().length }}</span>
      </a>
    }
  `,
})
export class Home {
  protected readonly store = inject(StudyStore);
  protected readonly icon = LESSON_ICON;
  protected readonly verb = LESSON_VERB;

  protected readonly next = computed(() => {
    const ref = this.store.next();
    const lesson = ref && this.store.lesson(ref.lessonId);
    const mod = ref && this.store.moduleOfUnit(ref.unitId);
    const unit = ref && this.store.units().get(ref.unitId);
    if (!lesson || !mod || !unit) return null;
    const at = unit.lessons.indexOf(lesson);
    const after = unit.lessons.slice(at + 1, at + 4);
    return { lesson, after, moduleCode: mod.code, moduleId: mod.id, unitNumber: unit.number, link: lessonLink(lesson) };
  });

  protected readonly goalSegments = computed(() => {
    const goal = this.store.goal();
    const done = Math.min(this.store.todayMinutes(), goal);
    return Array.from({ length: goal }, (_, i) => i < done);
  });

  constructor() {
    effect(() => {
      const n = this.next();
      if (n) this.store.board.set(n.moduleId);
    });
  }
}
