import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { OrderQ } from '../../../core/models';
import { Icon } from '../../../shared/icon';
import { QUESTION_STYLES } from './question-styles';
import { Answer, startTimer } from './answer';

/** Ordenar pasos con botones de subir y bajar: va igual con el dedo y con el teclado. */
@Component({
  selector: 'app-order-question',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    QUESTION_STYLES,
    `
      li { display: grid; grid-template-columns: 30px 1fr auto auto; align-items: center; gap: var(--s2);
           padding: var(--s2) var(--s2) var(--s2) var(--s3); border-radius: var(--radius-btn); background: var(--leaf-solid); box-shadow: inset 0 0 0 2px var(--rule); }
      li.ok { box-shadow: inset 0 0 0 3px var(--ok); background: var(--ok-wash); }
      li.ko { box-shadow: inset 0 0 0 3px var(--ko); background: var(--ko-wash); }
      .n { font-weight: 800; font-size: 18px; color: var(--ink-soft); }
      .move { width: 44px; height: 44px; display: grid; place-items: center; border: 0; border-radius: 8px; background: transparent; color: var(--ink); cursor: pointer; }
      .move:hover:not(:disabled) { background: color-mix(in srgb, var(--board) 14%, transparent); }
      .move:disabled { opacity: 0.25; cursor: default; }
    `,
  ],
  template: `
    <p class="prompt">{{ question().prompt }}</p>
    <ol class="opts">
      @for (s of order(); track s; let i = $index, first = $first, last = $last) {
        <li [attr.data-step]="s" [class.ok]="checked() && s === question().steps[i]" [class.ko]="checked() && s !== question().steps[i]">
          <span class="n">{{ i + 1 }}</span>
          <span>{{ s }}</span>
          <button type="button" class="move" data-action="up" [disabled]="first || checked()" (click)="move(i, -1)" [attr.aria-label]="'Subir: ' + s"><app-icon name="up" /></button>
          <button type="button" class="move" data-action="down" [disabled]="last || checked()" (click)="move(i, 1)" [attr.aria-label]="'Bajar: ' + s"><app-icon name="down" /></button>
        </li>
      }
    </ol>
    @if (!checked()) {
      <button type="button" class="btn btn--block check" data-action="check" (click)="check()">Comprobar</button>
    }
  `,
})
export class OrderQuestion {
  readonly question = input.required<OrderQ>();
  readonly answered = output<Answer>();

  protected readonly order = signal<string[]>([]);
  protected readonly checked = signal(false);
  private readonly elapsed = startTimer();

  ngOnInit(): void {
    const steps = this.question().steps;
    // Se baraja hasta que no coincida con el orden bueno: si no, la pregunta se responde sola.
    let shuffled = [...steps];
    while (shuffled.every((s, i) => s === steps[i])) shuffled = [...steps].sort(() => Math.random() - 0.5);
    this.order.set(shuffled);
  }

  protected move(i: number, dir: -1 | 1): void {
    const next = [...this.order()];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    this.order.set(next);
  }

  protected check(): void {
    this.checked.set(true);
    this.answered.emit({ ok: this.order().every((s, i) => s === this.question().steps[i]), ms: this.elapsed() });
  }
}
