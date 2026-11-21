import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { ChoiceQ, TrueFalseQ } from '../../../core/models';
import { RichTextPipe } from '../../../shared/rich-text';
import { Icon } from '../../../shared/icon';
import { QUESTION_STYLES } from './question-styles';
import { Answer, startTimer } from './answer';

/** Test, verdadero o falso, código y hueco: todas son elegir una opción. */
@Component({
  selector: 'app-choice-question',
  imports: [RichTextPipe, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: QUESTION_STYLES,
  template: `
    <div class="prompt rich" [innerHTML]="promptHtml()"></div>
    @if (question().code) { <pre><code>{{ question().code }}</code></pre> }
    <ul class="opts" role="list">
      @for (o of options(); track $index) {
        <li>
          <button type="button" class="opt" [attr.aria-pressed]="selected() === $index" [disabled]="checked()"
                  [class.ok]="showMarks() && $index === correct()" [class.ko]="showMarks() && $index === selected() && $index !== correct()"
                  (click)="selected.set($index)">
            <span class="hole" aria-hidden="true"></span>
            <span class="rich" [innerHTML]="o | richText"></span>
            @if (showMarks() && $index === correct()) { <app-icon name="check" /><span class="sr-only">Correcta</span> }
            @if (showMarks() && $index === selected() && $index !== correct()) { <app-icon name="cross" /><span class="sr-only">Tu respuesta, incorrecta</span> }
          </button>
        </li>
      }
    </ul>
    @if (!checked()) {
      <button type="button" class="btn btn--block check" data-action="check" [disabled]="selected() === null" (click)="check()">Comprobar</button>
    }
  `,
})
export class ChoiceQuestion {
  readonly question = input.required<ChoiceQ | TrueFalseQ>();
  /** En exámenes y simulacros no se enseña si has acertado hasta el final. */
  readonly reveal = input(true);
  readonly answered = output<Answer>();

  protected readonly selected = signal<number | null>(null);
  protected readonly checked = signal(false);
  private readonly elapsed = startTimer();
  private readonly rich = new RichTextPipe();

  protected readonly options = computed(() => {
    const q = this.question();
    return q.type === 'truefalse' ? ['Verdadero', 'Falso'] : q.options;
  });
  protected readonly correct = computed(() => {
    const q = this.question();
    return q.type === 'truefalse' ? (q.answer ? 0 : 1) : q.answer;
  });
  protected readonly showMarks = computed(() => this.checked() && this.reveal());
  protected readonly promptHtml = computed(() =>
    this.rich.transform(this.question().prompt).replace(/_{3,}/g, '<span class="blank" aria-label="hueco"></span>'),
  );

  protected check(): void {
    this.checked.set(true);
    this.answered.emit({ ok: this.selected() === this.correct(), ms: this.elapsed() });
  }
}
