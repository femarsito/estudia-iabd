import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StudyStore } from '../../core/study.store';
import { Icon } from '../../shared/icon';
import { RichTextPipe } from '../../shared/rich-text';

@Component({
  selector: 'app-result',
  imports: [RouterLink, Icon, RichTextPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host { display: block; max-width: 760px; }
    .leaf { display: grid; gap: var(--s5); }
    .score { display: flex; align-items: baseline; gap: var(--s3); flex-wrap: wrap; }
    .score strong { font-size: clamp(56px, 16vw, 88px); font-weight: 800; font-stretch: 75%; line-height: 0.9; }
    .score span { font-size: 20px; color: var(--ink-soft); }
    .stamp {
      justify-self: start; padding: var(--s2) var(--s4); border-radius: 8px; font-weight: 800; font-stretch: 80%; font-size: 22px; letter-spacing: 0.04em;
      color: var(--ok); box-shadow: inset 0 0 0 3px var(--ok); transform: rotate(-3deg); animation: stamp 180ms steps(3, jump-none) both;
    }
    .stamp.ko { color: var(--ko); box-shadow: inset 0 0 0 3px var(--ko); }
    @keyframes stamp { 0% { transform: rotate(-3deg) scale(1.5); opacity: 0; } 100% { transform: rotate(-3deg) scale(1); opacity: 1; } }
    .facts { display: flex; gap: var(--s5); flex-wrap: wrap; font-weight: 700; }
    .facts span { display: inline-flex; gap: 6px; align-items: center; }
    h2 { font-size: 24px; }
    ul { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--s4); }
    li { display: grid; gap: var(--s1); padding-bottom: var(--s4); border-bottom: 1px solid var(--rule); }
    li strong { font-size: 17px; }
    li small { color: var(--ink-soft); }
    .actions { display: grid; gap: var(--s2); }
  `,
  template: `
    @if (result(); as r) {
      <section class="leaf hinge">
        <div class="score">
          @if (grade() !== null) {
            <strong>{{ grade() }}</strong><span>sobre 10 · {{ correct() }} de {{ r.total }} bien</span>
          } @else {
            <strong>{{ correct() }}/{{ r.total }}</strong><span>bien</span>
          }
        </div>
        @if (grade() !== null) {
          <span class="stamp" [class.ko]="grade()! < 5">{{ grade()! >= 5 ? 'APROBADO' : 'A REPASAR' }}</span>
        }
        <p class="facts">
          <span><app-icon name="star" /> +{{ r.xpGained }} puntos</span>
          <span><app-icon name="flame" /> {{ store.streak() }} días de racha</span>
        </p>

        @if (wrong().length) {
          <h2>Para repasar</h2>
          <ul>
            @for (q of wrong(); track q.id) {
              <li>
                <strong>{{ q.prompt }}</strong>
                <div class="rich" [innerHTML]="q.explanation | richText"></div>
                <small>{{ q.source }}</small>
              </li>
            }
          </ul>
          <p class="meta">Volverán en tu repaso de mañana.</p>
        } @else if (unanswered() === 0) {
          <p>Todo bien. Estas preguntas no volverán hasta dentro de unos días.</p>
        }
        @if (unanswered() > 0) {
          <p class="meta">Se acabó el tiempo con {{ unanswered() }} preguntas sin contestar.</p>
        }

        <div class="actions">
          <a class="btn btn--block" [routerLink]="r.backTo">Continuar <app-icon name="arrow" /></a>
          <a class="btn btn--ghost btn--block" routerLink="/">Inicio</a>
        </div>
      </section>
    } @else {
      <section class="leaf"><p>No hay ningún resultado reciente.</p><a class="btn" routerLink="/">Inicio</a></section>
    }
  `,
})
export class Result {
  protected readonly store = inject(StudyStore);
  protected readonly result = this.store.lastResult;
  protected readonly correct = computed(() => this.result()?.answers.filter((a) => a.ok).length ?? 0);
  protected readonly grade = computed(() => {
    const r = this.result();
    if (!r || (r.mode !== 'exam' && r.mode !== 'sim')) return null;
    return Math.round((this.correct() / r.total) * 100) / 10;
  });
  protected readonly unanswered = computed(() => {
    const r = this.result();
    return r ? r.total - r.answers.length : 0;
  });
  protected readonly wrong = computed(() =>
    (this.result()?.answers ?? [])
      .filter((a) => !a.ok)
      .map((a) => this.store.question(a.questionId))
      .filter((q) => !!q),
  );
}
