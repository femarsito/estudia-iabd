import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StudyStore } from '../../core/study.store';

/** Los cinco separadores apilados: cada uno es un enlace a su módulo. */
@Component({
  selector: 'app-modules',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    h1 { color: var(--on-board); font-size: 40px; margin-bottom: var(--s5); }
    ul { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--s2); }
    a {
      display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: var(--s4);
      min-height: 84px; padding: var(--s4) var(--s5); border-radius: var(--radius);
      color: #fff; text-decoration: none; box-shadow: var(--shadow-leaf);
      transition: transform var(--hinge);
    }
    a:hover { transform: translateX(4px); }
    a.ink { color: #121418; }
    .code { font-weight: 800; font-stretch: 80%; font-size: 34px; }
    .name { font-weight: 700; font-size: 17px; line-height: 1.2; }
    .name small { display: block; font-weight: 500; font-size: 14px; opacity: 0.85; margin-top: 2px; }
    .pct { font-weight: 800; font-size: 22px; }
  `,
  template: `
    <h1>Módulos</h1>
    <ul>
      @for (m of modules(); track m.id) {
        <li>
          <a [routerLink]="['/modulo', m.id]" [style.background]="'var(--mod-' + m.id + ')'" [class.ink]="m.id === 'pia' || m.id === 'bda'">
            <span class="code">{{ m.code }}</span>
            <span class="name">{{ m.name }}<small>{{ m.loaded }} de {{ m.units.length }} unidades disponibles</small></span>
            <span class="pct" [attr.aria-label]="'Dominio ' + m.mastery + ' por ciento'">{{ m.mastery }} %</span>
          </a>
        </li>
      }
    </ul>
  `,
})
export class Modules {
  private readonly store = inject(StudyStore);
  protected readonly modules = computed(() =>
    (this.store.index()?.modules ?? []).map((m) => ({
      ...m,
      loaded: m.units.filter((u) => u.file).length,
      mastery: this.store.moduleMastery(m.id),
    })),
  );
}
