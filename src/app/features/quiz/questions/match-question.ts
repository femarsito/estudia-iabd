import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { MatchQ } from '../../../core/models';
import { QUESTION_STYLES } from './question-styles';
import { Answer, startTimer } from './answer';

/** Relacionar: tocas un concepto y luego su pareja. Tocar una pareja ya hecha la deshace. */
@Component({
  selector: 'app-match-question',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    QUESTION_STYLES,
    `
      .cols { display: grid; grid-template-columns: 1fr 1fr; gap: var(--s2); align-items: start; }
      .cols .opts { grid-template-columns: 1fr; }
      .opt { grid-template-columns: 1fr auto; font-size: 16px; }
      .tag { min-width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; font-weight: 800; font-size: 14px; background: var(--board); color: var(--on-board); }
      .hint { color: var(--ink-soft); font-size: 15px; }
    `,
  ],
  template: `
    <p class="prompt">{{ question().prompt }}</p>
    <p class="hint">Toca un elemento de la izquierda y después su pareja de la derecha.</p>
    <div class="cols">
      <ul class="opts" role="list" aria-label="Conceptos">
        @for (l of left(); track l; let i = $index) {
          <li>
            <button type="button" class="opt" data-side="left" [attr.data-value]="l" [disabled]="checked()"
                    [attr.aria-pressed]="active() === l" [class.ok]="checked() && reveal() && isRight(l)" [class.ko]="checked() && reveal() && !isRight(l)"
                    (click)="pickLeft(l)">
              <span>{{ l }}</span>
              @if (pairs()[l] !== undefined) { <span class="tag">{{ i + 1 }}</span> }
            </button>
          </li>
        }
      </ul>
      <ul class="opts" role="list" aria-label="Parejas">
        @for (r of right; track r) {
          <li>
            <button type="button" class="opt" data-side="right" [attr.data-value]="r" [disabled]="checked()"
                    [attr.aria-pressed]="usedBy(r) !== null" (click)="pickRight(r)">
              <span>{{ r }}</span>
              @if (usedBy(r); as l) { <span class="tag">{{ left().indexOf(l) + 1 }}</span> }
            </button>
          </li>
        }
      </ul>
    </div>
    @if (!checked()) {
      <button type="button" class="btn btn--block check" data-action="check" [disabled]="!complete()" (click)="check()">Comprobar</button>
    }
  `,
})
export class MatchQuestion {
  readonly question = input.required<MatchQ>();
  /** En exámenes y simulacros no se enseña si has acertado hasta el final. */
  readonly reveal = input(true);
  readonly answered = output<Answer>();

  protected readonly left = computed(() => this.question().pairs.map(([l]) => l));
  protected right: string[] = [];
  protected readonly active = signal<string | null>(null);
  protected readonly pairs = signal<Record<string, string>>({});
  protected readonly checked = signal(false);
  protected readonly complete = computed(() => Object.keys(this.pairs()).length === this.left().length);
  private readonly elapsed = startTimer();

  ngOnInit(): void {
    this.right = this.question().pairs.map(([, r]) => r).sort(() => Math.random() - 0.5);
  }

  protected usedBy(r: string): string | null {
    return Object.entries(this.pairs()).find(([, v]) => v === r)?.[0] ?? null;
  }

  protected isRight(l: string): boolean {
    return this.question().pairs.some(([a, b]) => a === l && this.pairs()[l] === b);
  }

  protected pickLeft(l: string): void {
    if (this.pairs()[l] !== undefined) {
      const { [l]: _, ...rest } = this.pairs();
      this.pairs.set(rest);
    }
    this.active.set(l);
  }

  protected pickRight(r: string): void {
    const owner = this.usedBy(r);
    const l = this.active();
    const next = { ...this.pairs() };
    if (owner) delete next[owner];
    if (l) next[l] = r;
    this.pairs.set(next);
    this.active.set(null);
  }

  protected check(): void {
    this.checked.set(true);
    this.answered.emit({ ok: this.left().every((l) => this.isRight(l)), ms: this.elapsed() });
  }
}
