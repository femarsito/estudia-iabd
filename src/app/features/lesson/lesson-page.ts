import { ChangeDetectionStrategy, Component, computed, effect, inject, input, linkedSignal, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { StudyStore } from '../../core/study.store';
import { Icon } from '../../shared/icon';
import { RichTextPipe } from '../../shared/rich-text';
import { lessonLink } from '../../shared/lesson-meta';

/** Lecciones «Lee» (tarjetas) y «En el PC» (pasos). Las prácticas van por el test. */
@Component({
  selector: 'app-lesson-page',
  imports: [RouterLink, Icon, RichTextPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .top { display: flex; align-items: center; gap: var(--s3); color: var(--on-board); margin-bottom: var(--s4); }
    .top a { color: inherit; display: inline-flex; padding: var(--s2); margin-left: calc(-1 * var(--s2)); }
    .progress { flex: 1; display: grid; grid-auto-flow: column; gap: 4px; }
    .progress i { height: 6px; border-radius: 3px; background: color-mix(in srgb, var(--on-board) 30%, transparent); }
    .progress i.on { background: var(--on-board); }
    .leaf { min-height: 56dvh; display: flex; flex-direction: column; gap: var(--s4); }
    h1 { font-size: clamp(26px, 6.5vw, 36px); }
    .card-body { font-family: var(--font-read); font-size: 19px; line-height: 1.6; max-width: 62ch; }
    .map { display: block; border-radius: var(--radius); overflow: hidden; box-shadow: inset 0 0 0 1px var(--rule); }
    .map img { display: block; width: 100%; height: auto; }
    .credit { font-size: 13px; color: var(--ink-soft); }
    .actions { margin-top: auto; display: flex; gap: var(--s3); }
    .actions .btn { flex: 1; }
    .pc-note { display: flex; gap: var(--s3); align-items: center; padding: var(--s3) var(--s4); border-radius: var(--radius); background: color-mix(in srgb, var(--board) 14%, transparent); font-weight: 700; }
    ol.steps { margin: 0; padding: 0; list-style: none; counter-reset: step; display: grid; gap: var(--s5); }
    ol.steps li { counter-increment: step; display: grid; gap: var(--s2); }
    .where { font-size: 13px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink-soft); }
    .where::before { content: counter(step) '. '; }
    pre { margin: 0; padding: var(--s3) var(--s4); background: #121418; color: #eef0f5; border-radius: var(--radius); overflow-x: auto; font-size: 14px; line-height: 1.5; }
    .code { position: relative; }
    .copy { position: absolute; top: 6px; right: 6px; min-height: 36px; padding: 0 var(--s3); font-size: 14px; background: #2a2e37; color: #fff; border: 0; border-radius: 6px; display: inline-flex; gap: 6px; align-items: center; cursor: pointer; }
    .expected { font-size: 15px; color: var(--ink-soft); }
    .expected strong { color: var(--ink); }
  `,
  template: `
    @if (lesson(); as l) {
      <div class="top">
        <a [routerLink]="['/unidad', unitId()]" aria-label="Volver a la unidad"><app-icon name="back" /></a>
        @if (l.kind === 'read') {
          <div class="progress" aria-hidden="true">
            @for (c of l.cards; track $index) { <i [class.on]="$index <= page()"></i> }
          </div>
        }
      </div>

      @if (l.kind === 'read' && card(); as c) {
        <article class="leaf hinge" [attr.aria-label]="'Tarjeta ' + (page() + 1) + ' de ' + l.cards!.length">
          <h1>{{ c.title || l.title }}</h1>
          @if (page() === 0 && conceptMap(); as map) {
            <a class="map" [href]="'content/' + map.src" target="_blank" rel="noopener">
              <img [src]="'content/' + map.src" alt="Mapa conceptual de la unidad (se abre en grande)" loading="lazy" />
            </a>
            <p class="credit">{{ map.credit }}</p>
          }
          <div class="card-body rich" [innerHTML]="c.body | richText"></div>
          <div class="actions">
            @if (page() > 0) { <button class="btn btn--ghost" type="button" (click)="page.set(page() - 1)"><app-icon name="back" /> Atrás</button> }
            @if (page() < l.cards!.length - 1) {
              <button class="btn" type="button" (click)="page.set(page() + 1)">Siguiente <app-icon name="arrow" /></button>
            } @else {
              <button class="btn" type="button" (click)="finish()">Hecho <app-icon name="check" /></button>
            }
          </div>
        </article>
      }

      @if (l.kind === 'pc') {
        <article class="leaf hinge">
          <h1>{{ l.title }}</h1>
          <p class="pc-note"><app-icon name="pc" /> Esto se hace en el ordenador.</p>
          <ol class="steps">
            @for (s of l.steps; track $index) {
              <li>
                <span class="where">{{ s.where }}</span>
                <div class="rich" [innerHTML]="s.text | richText"></div>
                @if (s.code) {
                  <div class="code">
                    <pre><code>{{ s.code }}</code></pre>
                    <button class="copy" type="button" (click)="copy(s.code, $index)">
                      <app-icon name="copy" /> {{ copied() === $index ? 'Copiado' : 'Copiar' }}
                    </button>
                  </div>
                }
                @if (s.expected) { <p class="expected"><strong>Debería salir:</strong> {{ s.expected }}</p> }
              </li>
            }
          </ol>
          <div class="actions">
            <button class="btn" type="button" (click)="finish()">Hecho <app-icon name="check" /></button>
          </div>
        </article>
      }
    } @else if (store.index()) {
      <section class="leaf"><p>No se puede cargar esta lección. Si estás sin conexión, ábrela una vez con internet.</p></section>
    }
  `,
})
export class LessonPage {
  readonly lessonId = input.required<string>();
  protected readonly store = inject(StudyStore);
  private readonly router = inject(Router);
  private readonly title = inject(Title);

  // Al pasar a la siguiente lección se reutiliza el componente: la tarjeta vuelve a la primera.
  protected readonly page = linkedSignal({ source: this.lessonId, computation: () => 0 });
  protected readonly copied = signal<number | null>(null);
  protected readonly lesson = computed(() => this.store.lesson(this.lessonId()));
  protected readonly unitId = computed(() => this.store.unitOfLesson(this.lessonId())?.id ?? '');
  protected readonly card = computed(() => this.lesson()?.cards?.[this.page()]);
  protected readonly conceptMap = computed(() => {
    const unit = this.store.unitOfLesson(this.lessonId());
    return unit?.lessons[0]?.id === this.lessonId() ? unit.conceptMap : undefined;
  });

  constructor() {
    effect(() => {
      const unit = this.store.unitOfLesson(this.lessonId());
      if (unit) this.store.board.set(unit.moduleId);
      const l = this.lesson();
      if (l) this.title.setTitle(`${l.title} · Estudia IABD`);
    });
  }

  protected async copy(code: string, i: number): Promise<void> {
    try {
      await navigator.clipboard.writeText(code);
      this.copied.set(i);
    } catch {
      // Sin permiso de portapapeles: el código sigue visible para copiarlo a mano.
      this.copied.set(null);
    }
  }

  protected finish(): void {
    this.store.progress.completeLesson(this.lessonId());
    const next = this.store.lessonAfter(this.lessonId());
    this.router.navigate(next ? lessonLink(next) : ['/unidad', this.unitId()]);
  }
}
