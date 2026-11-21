import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StudyStore } from '../../core/study.store';
import { addDays, localDay } from '../../core/dates';
import { minutesByDay } from '../../core/stats';
import { Icon } from '../../shared/icon';

const DAYS = 14;
const WEAK_WINDOW_DAYS = 30;

@Component({
  selector: 'app-progress-page',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    h1 { color: var(--on-board); font-size: 40px; margin-bottom: var(--s5); }
    .leaf { display: grid; gap: var(--s6); }
    h2 { font-size: 22px; margin-bottom: var(--s3); }
    .mods { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--s3); }
    .mod { display: grid; grid-template-columns: 48px 1fr 48px; gap: var(--s3); align-items: center; font-weight: 700; }
    .track { height: 10px; border-radius: 5px; background: var(--rule); overflow: hidden; }
    .track i { display: block; height: 100%; border-radius: 0 4px 4px 0; }
    .pct { text-align: right; }
    .chart { display: grid; grid-template-columns: repeat(14, 1fr); gap: 2px; align-items: end; height: 120px; border-bottom: 1px solid var(--rule); }
    .chart span { display: block; border-radius: 4px 4px 0 0; background: color-mix(in srgb, var(--board) 78%, var(--ink)); min-height: 2px; }
    .chart span.goal { background: var(--board); }
    .axis { display: flex; justify-content: space-between; font-size: 13px; color: var(--ink-soft); margin-top: var(--s1); }
    .weak, .badges { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--s2); }
    .weak li { display: flex; justify-content: space-between; gap: var(--s3); }
    .badges { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
    .badge { display: flex; gap: var(--s2); align-items: center; padding: var(--s3); border-radius: var(--radius); box-shadow: inset 0 0 0 2px var(--rule); color: var(--ink-soft); }
    .badge.on { color: var(--ink); box-shadow: inset 0 0 0 2px var(--board); font-weight: 700; }
    .empty { color: var(--ink-soft); }
  `,
  template: `
    <h1>Progreso</h1>
    <section class="leaf hinge">
      <div>
        <h2>Dominio por módulo</h2>
        <ul class="mods">
          @for (m of modules(); track m.id) {
            <li class="mod">
              <a [routerLink]="['/modulo', m.id]">{{ m.code }}</a>
              <span class="track" role="meter" [attr.aria-valuenow]="m.mastery" aria-valuemin="0" aria-valuemax="100" [attr.aria-label]="m.name">
                <i [style.width.%]="m.mastery" [style.background]="'var(--mod-' + m.id + ')'"></i>
              </span>
              <span class="pct">{{ m.mastery }} %</span>
            </li>
          }
        </ul>
      </div>

      <div>
        <h2>Minutos de los últimos 14 días</h2>
        <div class="chart" aria-hidden="true">
          @for (d of days(); track d.day) {
            <span [style.height.%]="(100 * d.min) / maxMin()" [class.goal]="d.min >= store.goal()" [title]="d.label + ': ' + d.min + ' min'"></span>
          }
        </div>
        <div class="axis" aria-hidden="true"><span>{{ days()[0].label }}</span><span>Hoy</span></div>
        <table class="sr-only">
          <caption>Minutos estudiados por día</caption>
          <tr><th>Día</th><th>Minutos</th></tr>
          @for (d of days(); track d.day) { <tr><td>{{ d.label }}</td><td>{{ d.min }}</td></tr> }
        </table>
      </div>

      <div>
        <h2>Lo que más fallas</h2>
        @if (weak().length) {
          <ul class="weak">
            @for (w of weak(); track w.source) { <li><span>{{ w.source }}</span><strong>{{ w.misses }} fallos</strong></li> }
          </ul>
        } @else {
          <p class="empty">Nada todavía en los últimos 30 días.</p>
        }
      </div>

      <div>
        <h2>Logros</h2>
        <ul class="badges">
          @for (b of badges(); track b.label) {
            <li class="badge" [class.on]="b.on"><app-icon [name]="b.on ? 'check' : 'lock'" /> {{ b.label }}</li>
          }
        </ul>
      </div>

      @if (flags().length) {
        <div>
          <h2>Preguntas que marcaste como mal</h2>
          <ul class="weak">
            @for (f of flags(); track f.id) { <li><span>{{ f.prompt }}</span><small>{{ f.id }}</small></li> }
          </ul>
          <p class="empty">Exporta tu progreso desde Ajustes y pásaselo a Claude para que las revise.</p>
        </div>
      }
    </section>
  `,
})
export class ProgressPage {
  protected readonly store = inject(StudyStore);

  protected readonly modules = computed(() =>
    (this.store.index()?.modules ?? []).map((m) => ({ ...m, mastery: this.store.moduleMastery(m.id) })),
  );

  protected readonly days = computed(() => {
    const byDay = minutesByDay(this.store.progress.progress().answers);
    const today = localDay(Date.now());
    return Array.from({ length: DAYS }, (_, i) => {
      const day = addDays(today, i - DAYS + 1);
      return { day, label: day.slice(8) + '/' + day.slice(5, 7), min: Math.round(byDay.get(day) ?? 0) };
    });
  });
  protected readonly maxMin = computed(() => Math.max(this.store.goal(), ...this.days().map((d) => d.min)));

  protected readonly weak = computed(() => {
    const since = Date.now() - WEAK_WINDOW_DAYS * 86_400_000;
    const misses = new Map<string, number>();
    for (const a of this.store.progress.progress().answers) {
      const source = !a.ok && a.at >= since ? this.store.question(a.q)?.source : undefined;
      if (source) misses.set(source, (misses.get(source) ?? 0) + 1);
    }
    return [...misses].map(([source, n]) => ({ source, misses: n })).sort((a, b) => b.misses - a.misses).slice(0, 5);
  });

  protected readonly badges = computed(() => {
    const p = this.store.progress.progress();
    const units = [...this.store.units().keys()];
    return [
      { label: 'Primera lección', on: Object.keys(p.lessonsDone).length > 0 },
      { label: 'Racha de 7 días', on: this.store.streak() >= 7 },
      { label: 'Unidad dominada', on: units.some((u) => this.store.unitMastery(u) >= 80) },
    ];
  });

  protected readonly flags = computed(() =>
    Object.keys(this.store.progress.progress().flags).map((id) => ({ id, prompt: this.store.question(id)?.prompt ?? id })),
  );
}
