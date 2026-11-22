import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StudyStore } from '../../core/study.store';

/** Los cinco separadores apilados: cartulina a todo color con su pestaña escalonada en el borde de arriba. */
@Component({
  selector: 'app-modules',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    h1 { color: var(--on-board); font-size: 40px; margin-bottom: var(--s6); }
    ul { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--s5); }
    a.sep {
      position: relative; display: grid; grid-template-columns: 1fr auto; align-items: end; gap: var(--s4);
      min-height: 96px; padding: var(--s5) var(--s5) var(--s4);
      border-radius: 0 var(--radius) var(--radius) var(--radius);
      color: #fff; text-decoration: none; box-shadow: var(--shadow-leaf);
      transition: transform var(--hinge);
    }
    a.sep::before {
      content: attr(data-code); position: absolute; bottom: 100%; left: calc(var(--i) * 17%);
      width: 18%; min-width: 64px; height: 26px; display: grid; place-items: center;
      background: inherit; border-radius: 8px 8px 0 0;
      font-weight: 800; font-stretch: 85%; font-size: 14px; letter-spacing: 0.06em;
    }
    a.sep:hover { transform: translateY(-2px); }
    a.sep.ink { color: #121418; }
    a.sep.current { box-shadow: var(--shadow-leaf), inset 0 0 0 3px rgb(255 255 255 / 0.55); }
    a.sep.ink.current { box-shadow: var(--shadow-leaf), inset 0 0 0 3px rgb(18 20 24 / 0.35); }
    /* La pestaña del separador activo lleva el mismo canto: sin él, sobre su propio color parece una etiqueta suelta. */
    a.sep.current::before { box-shadow: inset 3px 3px 0 rgb(255 255 255 / 0.55), inset -3px 0 0 rgb(255 255 255 / 0.55); }
    .name { font-weight: 800; font-stretch: 85%; font-size: 22px; line-height: 1.15; }
    .name small { display: block; font-weight: 500; font-stretch: 100%; font-size: 14px; opacity: 0.88; margin-top: var(--s1); }
    .pct { font-weight: 800; font-size: 24px; font-stretch: 80%; }
  `,
  template: `
    <h1>Módulos</h1>
    <ul>
      @for (m of modules(); track m.id; let i = $index) {
        <li>
          <a class="sep" [routerLink]="['/modulo', m.id]" [attr.data-code]="m.code" [style.--i]="i"
             [style.background]="'var(--mod-' + m.id + ')'" [class.ink]="m.id === 'pia' || m.id === 'bda'"
             [class.current]="m.id === board()">
            <span class="name">{{ m.name }}<small>{{ m.code }} · {{ m.loaded }} de {{ m.units.length }} unidades disponibles</small></span>
            <span class="pct" [attr.aria-label]="'Dominio ' + m.mastery + ' por ciento'">{{ m.mastery }} %</span>
          </a>
        </li>
      }
    </ul>
  `,
})
export class Modules {
  private readonly store = inject(StudyStore);
  protected readonly board = this.store.board;
  protected readonly modules = computed(() =>
    (this.store.index()?.modules ?? []).map((m) => ({
      ...m,
      loaded: m.units.filter((u) => u.file).length,
      mastery: this.store.moduleMastery(m.id),
    })),
  );
}
