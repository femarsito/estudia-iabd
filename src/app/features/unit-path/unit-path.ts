import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { StudyStore } from '../../core/study.store';
import { Icon } from '../../shared/icon';
import { LESSON_ICON, LESSON_VERB, lessonLink } from '../../shared/lesson-meta';

/** El camino de la unidad: las hojas en orden, la actual marcada y el examen al final. */
@Component({
  selector: 'app-unit-path',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .head { color: var(--on-board); margin-bottom: var(--s5); }
    .head a { color: var(--on-board-soft); display: inline-flex; align-items: center; gap: 6px; font-size: 15px; text-decoration: none; margin-bottom: var(--s3); }
    .head h1 { font-size: clamp(30px, 7.5vw, 44px); }
    .head p { color: var(--on-board-soft); margin-top: var(--s2); }
    ol { list-style: none; margin: 0; padding: 0; position: relative; }
    ol::before { content: ''; position: absolute; left: 21px; top: 22px; bottom: 22px; width: 2px; background: var(--rule); }
    a.step { position: relative; display: grid; grid-template-columns: 44px 1fr; gap: var(--s3); align-items: center; padding: var(--s2) 0; color: inherit; text-decoration: none; }
    .dot {
      width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center;
      background: var(--leaf-solid); color: var(--ink-soft); box-shadow: inset 0 0 0 2px var(--rule);
    }
    .done .dot { background: var(--board); color: var(--on-board); box-shadow: none; }
    .current .dot { box-shadow: inset 0 0 0 3px var(--board); color: var(--ink); }
    .current strong { font-size: 21px; }
    strong { display: block; font-stretch: 88%; font-size: 18px; line-height: 1.2; }
    small { color: var(--ink-soft); font-size: 14px; }
    .exam { margin-top: var(--s4); }
  `,
  template: `
    @if (unit(); as u) {
      <div class="head">
        @if (moduleCode(); as code) {
          <a [routerLink]="['/modulo', u.moduleId]"><app-icon name="back" /> {{ code }}</a>
        }
        <h1>{{ u.title }}</h1>
        <p>Unidad {{ u.number }} · {{ u.questions.length }} preguntas · dominio {{ mastery() }} %</p>
      </div>
      <section class="leaf hinge" aria-label="Lecciones">
        <ol>
          @for (l of steps(); track l.id) {
            <li>
              <a class="step" [class.done]="l.done" [class.current]="l.current" [routerLink]="l.link" [attr.aria-current]="l.current ? 'step' : null">
                <span class="dot">
                  @if (l.done) { <app-icon name="check" /> } @else { <app-icon [name]="icon[l.kind]" /> }
                </span>
                <span><strong>{{ l.title }}</strong><small>{{ verb[l.kind] }}{{ l.done ? ' · hecha' : '' }}</small></span>
              </a>
            </li>
          }
        </ol>
        <a class="btn btn--block exam" [routerLink]="['/quiz', 'exam', u.id]"><app-icon name="exam" /> Examen de la unidad (10)</a>
      </section>
    } @else if (store.index()) {
      <section class="leaf"><p>Esta unidad todavía no está disponible.</p></section>
    }
  `,
})
export class UnitPath {
  readonly unitId = input.required<string>();
  protected readonly store = inject(StudyStore);
  private readonly title = inject(Title);
  protected readonly icon = LESSON_ICON;
  protected readonly verb = LESSON_VERB;

  protected readonly unit = computed(() => this.store.units().get(this.unitId()));
  protected readonly moduleCode = computed(() => this.store.moduleOfUnit(this.unitId())?.code);
  protected readonly mastery = computed(() => this.store.unitMastery(this.unitId()));
  protected readonly steps = computed(() => {
    const lessons = this.unit()?.lessons ?? [];
    const firstPending = lessons.findIndex((l) => !this.store.isDone(l.id));
    return lessons.map((l, i) => ({ ...l, done: this.store.isDone(l.id), current: i === firstPending, link: lessonLink(l) }));
  });

  constructor() {
    effect(() => {
      const u = this.unit();
      if (!u) return;
      this.store.board.set(u.moduleId);
      this.title.setTitle(`${u.title} · Estudia IABD`);
    });
  }
}
