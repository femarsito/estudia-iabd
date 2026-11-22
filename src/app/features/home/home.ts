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
    .brand { font-weight: 800; font-stretch: 115%; font-size: 22px; letter-spacing: -0.01em; }
    .stats { display: flex; gap: var(--s4); font-weight: 800; font-size: 19px; }
    .stats span { display: inline-flex; align-items: center; gap: 6px; }
    /* Carpeta abierta: en pantallas anchas, la lección a la izquierda y lo que viene a la derecha. */
    .spread { display: grid; gap: var(--s4); align-items: start; }
    @media (min-width: 1100px) { .spread { grid-template-columns: minmax(0, 3fr) minmax(0, 2fr); } }
    .side { display: grid; gap: var(--s4); }
    .leaf { display: grid; gap: var(--s4); }
    h1 { font-size: clamp(34px, 9vw, 56px); }
    h2 { font-size: 22px; }
    .where { color: var(--ink-soft); font-size: 16px; display: flex; align-items: center; gap: var(--s2); }
    .goal { display: grid; gap: var(--s2); }
    .goal-bar { display: grid; grid-auto-flow: column; gap: 4px; }
    .goal-bar i { height: 10px; border-radius: 2px; background: var(--rule); }
    .goal-bar i.on { background: var(--board); }
    .goal p { font-size: 15px; color: var(--ink-soft); }
    .review {
      display: flex; justify-content: space-between; align-items: center; gap: var(--s4); min-height: 64px;
      padding: var(--s4) var(--s5); border-radius: var(--radius); background: var(--leaf-solid); color: var(--ink);
      text-decoration: none; box-shadow: var(--shadow-leaf);
    }
    .review strong { font-size: 20px; font-stretch: 85%; }
    .review small { display: block; color: var(--ink-soft); font-size: 14px; font-weight: 500; }
    .review .count { display: inline-flex; align-items: center; gap: 6px; font-weight: 800; font-size: 22px; }
    .review.empty .count { color: var(--ok); }
    .done h1 { font-size: 36px; }
    .after { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--s3); }
    .after li { display: grid; grid-template-columns: 22px 1fr; gap: var(--s3); align-items: start; }
    .after li strong { display: block; font-stretch: 90%; font-size: 17px; line-height: 1.25; }
    .after li small { color: var(--ink-soft); font-size: 14px; }
    .after app-icon { --icon-size: 20px; color: var(--ink-soft); margin-top: 2px; }
  `,
  template: `
    <header>
      <span class="brand">Estudia IABD</span>
      <span class="stats">
        <span title="Días seguidos cumpliendo la meta"><app-icon name="flame" /> {{ store.streak() }}<span class="sr-only"> días de racha</span></span>
        <span title="Puntos"><app-icon name="star" /> {{ store.xp() }}<span class="sr-only"> puntos</span></span>
      </span>
    </header>

    <div class="spread">
      @if (!store.index()) {
        <section class="leaf"><p>Cargando tus apuntes…</p></section>
      } @else if (!store.index()!.modules.length) {
        <section class="leaf"><h1>Sin contenido</h1><p class="where">No se ha podido cargar el temario. Abre la app una vez con conexión.</p></section>
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
        </section>
      } @else {
        <section class="leaf done">
          <h1>Lo tienes todo al día</h1>
          <p class="where">Has terminado todas las lecciones disponibles. Repasa o haz un simulacro desde Módulos.</p>
        </section>
      }

      <div class="side">
        @if (store.reviewIds().length) {
          <a class="review" routerLink="/quiz/review/hoy">
            <span><strong>Repaso de hoy</strong><small>Lo que fallaste y toca ver otra vez</small></span>
            <span class="count"><app-icon name="repeat" /> {{ store.reviewIds().length }}</span>
          </a>
        } @else {
          <div class="review empty">
            <span><strong>Repaso de hoy</strong><small>Nada que repasar hoy. Lo que falles volverá aquí.</small></span>
            <span class="count"><app-icon name="check" /></span>
          </div>
        }
        @if (next(); as n) {
          @if (n.after.length) {
            <section class="leaf" aria-labelledby="after-title">
              <h2 id="after-title">Después en esta unidad</h2>
              <ul class="after">
                @for (l of n.after; track l.id) {
                  <li><app-icon [name]="icon[l.kind]" /><span><strong>{{ l.title }}</strong><small>{{ verb[l.kind] }}</small></span></li>
                }
              </ul>
            </section>
          }
        }
      </div>
    </div>
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
