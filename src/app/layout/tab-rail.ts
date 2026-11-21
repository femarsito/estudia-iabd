import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StudyStore } from '../core/study.store';

/** Las pestañas de los separadores en el canto: una por módulo, más alta cuantas más unidades tiene. */
@Component({
  selector: 'app-tab-rail',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host { display: flex; flex-direction: column; gap: 4px; }
    a {
      display: flex; align-items: center; justify-content: center;
      writing-mode: vertical-rl; transform: rotate(180deg);
      width: 34px; min-height: 64px; padding: 10px 0;
      border-radius: 8px 0 0 8px; /* girada 180°: queda redondeada por fuera */
      font-weight: 800; font-stretch: 85%; font-size: 14px; letter-spacing: 0.06em;
      text-decoration: none; color: #fff;
      box-shadow: inset 3px 0 0 rgb(0 0 0 / 0.12);
      transition: width var(--hinge);
    }
    a.ink { color: #121418; }
    a[aria-current='page'] { width: 44px; font-size: 16px; box-shadow: inset 3px 0 0 rgb(255 255 255 / 0.45), 2px 2px 8px rgb(0 0 0 / 0.2); }
  `,
  template: `
    @for (m of modules(); track m.id) {
      <a [routerLink]="['/modulo', m.id]" [style.background]="'var(--mod-' + m.id + ')'"
         [class.ink]="m.id === 'pia' || m.id === 'bda'"
         [style.min-height.px]="48 + m.units.length * 24"
         [attr.aria-current]="m.id === store.board() ? 'page' : null"
         [attr.aria-label]="m.name">{{ m.code }}</a>
    }
  `,
})
export class TabRail {
  protected readonly store = inject(StudyStore);
  protected readonly modules = computed(() => this.store.index()?.modules ?? []);
}
