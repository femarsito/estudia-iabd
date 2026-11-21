import { ChangeDetectionStrategy, Component, DOCUMENT, effect, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { StudyStore } from './core/study.store';
import { applyTheme } from './core/theme';
import { Icon, IconName } from './shared/icon';
import { TabRail } from './layout/tab-rail';

const NAV: { path: string; label: string; icon: IconName }[] = [
  { path: '/', label: 'Inicio', icon: 'home' },
  { path: '/modulos', label: 'Módulos', icon: 'binder' },
  { path: '/progreso', label: 'Progreso', icon: 'chart' },
  { path: '/ajustes', label: 'Ajustes', icon: 'gear' },
];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Icon, TabRail],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host { display: block; min-height: 100dvh; }
    // La regla de pestañas va pegada al canto de la hoja, como en una carpeta de verdad.
    .frame {
      max-width: 780px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 6px;
      padding: var(--s4) 0 calc(var(--nav-h) + var(--s5) + env(safe-area-inset-bottom)) var(--s4);
    }
    main { min-width: 0; }
    app-tab-rail { position: sticky; top: 76px; align-self: start; margin-top: 60px; }
    nav {
      position: fixed; inset: auto 0 0 0; z-index: 3;
      display: grid; grid-template-columns: repeat(4, 1fr);
      height: calc(var(--nav-h) + env(safe-area-inset-bottom)); padding-bottom: env(safe-area-inset-bottom);
      background: #121418;
    }
    nav a {
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
      color: #9aa1ae; text-decoration: none; font-size: 12px; font-weight: 700; letter-spacing: 0.02em;
    }
    nav a.active { color: #fff; }
    nav a.active app-icon { color: var(--board); filter: brightness(1.35); }
    @media (min-width: 900px) {
      .frame { padding: var(--s6) var(--s6) var(--s6) calc(96px + var(--s6)); }
      nav { inset: 0 auto 0 0; width: 96px; height: auto; grid-template-columns: 1fr; grid-auto-rows: 84px; align-content: start; padding-top: var(--s5); }
      app-tab-rail { top: var(--s6); }
    }
  `,
  template: `
    <div class="frame">
      <main><router-outlet /></main>
      <app-tab-rail />
    </div>
    <nav aria-label="Principal">
      @for (item of nav; track item.path) {
        <a [routerLink]="item.path" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: item.path === '/' }"
           ariaCurrentWhenActive="page">
          <app-icon [name]="item.icon" />{{ item.label }}
        </a>
      }
    </nav>
  `,
})
export class App {
  protected readonly nav = NAV;
  private readonly store = inject(StudyStore);
  private readonly doc = inject(DOCUMENT);

  constructor() {
    this.store.load();
    effect(() => {
      const board = this.store.board();
      this.doc.documentElement.dataset['board'] = board;
      this.doc.documentElement.style.setProperty('--board', `var(--mod-${board})`);
      const color = getComputedStyle(this.doc.documentElement).getPropertyValue(`--mod-${board}`).trim();
      this.doc.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
    });
    effect(() => applyTheme(this.doc, this.store.progress.progress().settings.theme));
  }
}
