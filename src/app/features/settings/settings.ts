import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { StudyStore } from '../../core/study.store';
import { Settings as SettingsModel } from '../../core/models';
import { localDay } from '../../core/dates';

const APP_VERSION = '0.1.0';

@Component({
  selector: 'app-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host { display: block; max-width: 760px; }
    h1 { color: var(--on-board); font-size: 40px; margin-bottom: var(--s5); }
    .leaf { display: grid; gap: var(--s6); }
    h2 { font-size: 22px; margin-bottom: var(--s3); }
    fieldset { border: 0; margin: 0; padding: 0; }
    legend { font-size: 22px; font-weight: 800; font-stretch: 82%; margin-bottom: var(--s3); }
    .seg { display: flex; gap: var(--s2); flex-wrap: wrap; }
    .seg label { position: relative; }
    .seg input { position: absolute; opacity: 0; }
    .seg span { display: inline-flex; align-items: center; min-height: 48px; padding: 0 var(--s4); border-radius: var(--radius-btn); box-shadow: inset 0 0 0 2px var(--rule); font-weight: 700; cursor: pointer; }
    .seg input:checked + span { box-shadow: inset 0 0 0 3px var(--board); background: color-mix(in srgb, var(--board) 12%, transparent); }
    .seg input:focus-visible + span { outline: 3px solid var(--ink); outline-offset: 2px; }
    .row { display: flex; gap: var(--s3); flex-wrap: wrap; align-items: center; }
    .msg { margin-top: var(--s2); font-weight: 600; }
    .msg.ko { color: var(--ko); }
    .danger { padding-top: var(--s5); border-top: 1px solid var(--rule); }
    .credits { font-size: 15px; color: var(--ink-soft); display: grid; gap: var(--s2); }
  `,
  template: `
    <h1>Ajustes</h1>
    <section class="leaf hinge">
      <fieldset>
        <legend>Meta diaria</legend>
        <div class="seg">
          @for (g of goals; track g) {
            <label><input type="radio" name="goal" [checked]="settings().goalMinutes === g" (change)="set({ goalMinutes: g })" /><span>{{ g }} min</span></label>
          }
        </div>
      </fieldset>

      <fieldset>
        <legend>Tema</legend>
        <div class="seg">
          @for (t of themes; track t.value) {
            <label><input type="radio" name="theme" [checked]="settings().theme === t.value" (change)="set({ theme: t.value })" /><span>{{ t.label }}</span></label>
          }
        </div>
      </fieldset>

      <div>
        <h2>Tu progreso</h2>
        <p class="meta">Se guarda solo en este dispositivo. Exporta una copia para pasarla al móvil o al PC: al importarla se suma a lo que ya tengas y no se pierde nada.</p>
        <div class="row" style="margin-top: var(--s3)">
          <button class="btn" type="button" (click)="exportProgress()">Exportar progreso</button>
          <label class="btn btn--ghost">
            Importar progreso
            <input class="sr-only" type="file" accept="application/json,.json" (change)="importProgress($event)" />
          </label>
        </div>
        @if (message(); as m) { <p class="msg" [class.ko]="m.ko" role="status">{{ m.text }}</p> }
      </div>

      <div class="credits">
        <h2>Créditos</h2>
        <p>Los resúmenes y las preguntas salen de los apuntes del Curso de Especialización en Inteligencia Artificial y Big Data. Materiales desarrollados inicialmente por el Ministerio de Educación, Cultura y Deporte y actualizados por el profesorado de la Junta de Andalucía bajo licencia Creative Commons BY-NC-SA.</p>
        <p><a href="https://www.juntadeandalucia.es/educacion/gestionafp/documentacion/aviso_legal/aviso_legal_mjda/index.html" target="_blank" rel="noopener">Aviso legal de la Junta</a> · Contenido derivado bajo CC BY-NC-SA 4.0 · Código con licencia MIT</p>
        <p>Estudia IABD {{ version }}</p>
      </div>
    </section>
  `,
})
export class Settings {
  private readonly store = inject(StudyStore);
  protected readonly settings = () => this.store.progress.progress().settings;
  protected readonly goals: SettingsModel['goalMinutes'][] = [5, 10, 15];
  protected readonly themes: { value: SettingsModel['theme']; label: string }[] = [
    { value: 'system', label: 'Sistema' },
    { value: 'light', label: 'Claro' },
    { value: 'dark', label: 'Oscuro' },
  ];
  protected readonly version = APP_VERSION;
  protected readonly message = signal<{ text: string; ko: boolean } | null>(null);

  protected set(s: Partial<SettingsModel>): void {
    this.store.progress.updateSettings(s);
  }

  protected exportProgress(): void {
    const url = URL.createObjectURL(this.store.progress.exportFile());
    const a = document.createElement('a');
    a.href = url;
    a.download = `estudia-iabd-progreso-${localDay(Date.now())}.json`;
    a.click();
    // Safari cancela la descarga si se revoca la URL en el mismo instante.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    this.message.set({ text: 'Copia descargada.', ko: false });
  }

  protected async importProgress(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    const before = this.store.progress.progress().answers.length;
    let text: string;
    try {
      text = await file.text();
    } catch {
      this.message.set({ text: 'No se ha podido leer el archivo. No se ha cambiado nada.', ko: true });
      return;
    }
    const result = this.store.progress.importText(text);
    const added = this.store.progress.progress().answers.length - before;
    this.message.set(
      result === 'ok'
        ? { text: `Progreso importado: ${added} respuestas nuevas.`, ko: false }
        : { text: 'Ese archivo no es una copia de Estudia IABD. No se ha cambiado nada.', ko: true },
    );
  }
}
