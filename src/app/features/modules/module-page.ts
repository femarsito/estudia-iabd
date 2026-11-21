import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { StudyStore } from '../../core/study.store';
import { ModuleId } from '../../core/models';
import { Icon } from '../../shared/icon';

@Component({
  selector: 'app-module-page',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .head { color: var(--on-board); margin-bottom: var(--s5); }
    .head h1 { font-size: clamp(34px, 8vw, 48px); }
    .head p { color: var(--on-board-soft); margin-top: var(--s2); }
    .leaf { display: grid; gap: 0; padding-top: var(--s3); padding-bottom: var(--s3); }
    ol { list-style: none; margin: 0; padding: 0; }
    li + li { border-top: 1px solid var(--rule); }
    .unit { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: var(--s3); padding: var(--s4) 0; text-decoration: none; color: inherit; }
    .unit strong { display: block; font-size: 19px; font-stretch: 88%; line-height: 1.2; }
    .unit span { color: var(--ink-soft); font-size: 15px; }
    .soon { opacity: 0.6; }
    .bar { width: 84px; height: 8px; border-radius: 4px; background: var(--rule); overflow: hidden; }
    .bar i { display: block; height: 100%; background: var(--board); }
    .sim { margin-top: var(--s4); }
  `,
  template: `
    @if (module(); as m) {
      <div class="head">
        <h1>{{ m.name }}</h1>
        <p>{{ m.code }} · {{ m.units.length }} unidades publicadas hasta ahora</p>
      </div>
      <section class="leaf hinge" aria-label="Unidades">
        <ol>
          @for (u of units(); track u.id) {
            <li>
              @if (u.file) {
                <a class="unit" [routerLink]="['/unidad', u.id]">
                  <span><strong>{{ u.number }}. {{ u.title }}</strong><span>Dominio {{ u.mastery }} %</span></span>
                  <span class="bar" aria-hidden="true"><i [style.width.%]="u.mastery"></i></span>
                </a>
              } @else {
                <div class="unit soon">
                  <span><strong>{{ u.number }}. {{ u.title }}</strong><span>Próximamente</span></span>
                  <app-icon name="lock" />
                </div>
              }
            </li>
          }
        </ol>
      </section>
      @if (hasContent()) {
        <a class="btn btn--block sim" [routerLink]="['/quiz', 'sim', m.id]"><app-icon name="exam" /> Simulacro del módulo</a>
      }
    }
  `,
})
export class ModulePage {
  readonly moduleId = input.required<string>();
  private readonly store = inject(StudyStore);
  private readonly title = inject(Title);

  protected readonly module = computed(() => this.store.module(this.moduleId()));
  protected readonly units = computed(() =>
    (this.module()?.units ?? []).map((u) => ({ ...u, mastery: this.store.unitMastery(u.id) })),
  );
  protected readonly hasContent = computed(() => this.units().some((u) => u.file));

  constructor() {
    effect(() => {
      const m = this.module();
      if (!m) return;
      this.store.board.set(m.id as ModuleId);
      this.title.setTitle(`${m.code} · Estudia IABD`);
    });
  }
}
