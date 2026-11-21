import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Iconos propios: rejilla de 24, trazo 2, extremos redondos. */
const PATHS = {
  home: 'M4 11 12 4l8 7M6 9.5V20h12V9.5M10 20v-5h4v5',
  binder: 'M6 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6zM6 3v18M9 7h1M9 12h1M9 17h1M19 7h2M19 11h2',
  chart: 'M4 20h16M7 16v-4M12 16V8M17 16v-7',
  gear: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 3v2M12 19v2M4.2 7.5l1.7 1M18.1 15.5l1.7 1M4.2 16.5l1.7-1M18.1 8.5l1.7-1',
  flame: 'M12 21c-3.9 0-6.5-2.6-6.5-6.1 0-3.4 2.6-5.4 3.8-8.4.6 1.8 1.4 2.8 2.6 3.5.3-2.6 1.6-4.6 3.4-6 .3 3.6 3.2 5.7 3.2 10.4 0 3.8-2.6 6.6-6.5 6.6z',
  star: 'M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z',
  read: 'M4 5.5c2.7-1 5.3-1 8 .5 2.7-1.5 5.3-1.5 8-.5V19c-2.7-1-5.3-1-8 .5-2.7-1.5-5.3-1.5-8-.5zM12 6v13.5',
  practice: 'M5 19l1-4L15.5 5.5a2.1 2.1 0 0 1 3 3L9 18zM13.5 7.5l3 3',
  pc: 'M3 5h18v11H3zM8 20h8M12 16v4',
  exam: 'M7 3h10v18H7zM10 8h4M10 12h4M10 16h2',
  check: 'M5 12.5l4.5 4.5L19 7',
  cross: 'M6 6l12 12M18 6 6 18',
  flag: 'M6 21V4M6 4h11l-2 4 2 4H6',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  back: 'M19 12H5M11 6l-6 6 6 6',
  up: 'M12 19V5M6 11l6-6 6 6',
  down: 'M12 5v14M6 13l6 6 6-6',
  copy: 'M9 9h11v11H9zM5 15H4V4h11v1',
  repeat: 'M4 11a8 8 0 0 1 14-4.5L20 9M20 4v5h-5M20 13a8 8 0 0 1-14 4.5L4 15M4 20v-5h5',
  clock: 'M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z',
  lock: 'M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z',
} as const;

export type IconName = keyof typeof PATHS;

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', class: 'icon' },
  styles: `
    :host { display: inline-flex; flex: none; }
    svg { width: var(--icon-size, 22px); height: var(--icon-size, 22px); }
  `,
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round"><path [attr.d]="d()" /></svg>`,
})
export class Icon {
  readonly name = input.required<IconName>();
  protected readonly d = computed(() => PATHS[this.name()]);
}
