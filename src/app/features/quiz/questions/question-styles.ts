/** Estilos comunes a los tres tipos de pregunta: opciones como fichas que se marcan con un agujero perforado. */
export const QUESTION_STYLES = `
  :host { display: grid; gap: var(--s4); }
  .prompt { font-size: clamp(21px, 5.2vw, 26px); font-weight: 700; font-stretch: 92%; line-height: 1.25; }
  .prompt .blank { display: inline-block; min-width: 3.5em; border-bottom: 3px solid var(--board); }
  pre { margin: 0; padding: var(--s3) var(--s4); background: #121418; color: #eef0f5; border-radius: var(--radius); overflow-x: auto; font-size: 14px; line-height: 1.5; }
  .opts { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--s2); }
  .opt {
    width: 100%; min-height: 52px; display: grid; grid-template-columns: 22px 1fr auto; align-items: center; gap: var(--s3);
    padding: var(--s3) var(--s4); text-align: left; font: inherit; font-size: 17px; color: var(--ink);
    background: var(--leaf-solid); border: 0; border-radius: var(--radius-btn);
    box-shadow: inset 0 0 0 2px var(--rule); cursor: pointer; transition: box-shadow var(--hinge);
  }
  .opt:hover:not(:disabled) { box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--board) 60%, transparent); }
  .opt .hole { width: 18px; height: 18px; border-radius: 50%; box-shadow: inset 0 0 0 2px var(--rule); }
  .opt[aria-pressed='true'] { box-shadow: inset 0 0 0 3px var(--board); }
  .opt[aria-pressed='true'] .hole { background: var(--board); box-shadow: inset 0 1px 2px rgb(0 0 0 / 0.4); }
  .opt.ok { box-shadow: inset 0 0 0 3px var(--ok); background: var(--ok-wash); }
  .opt.ok .hole { background: var(--ok); }
  .opt.ko { box-shadow: inset 0 0 0 3px var(--ko); background: var(--ko-wash); }
  .opt.ko .hole { background: var(--ko); }
  .opt:disabled { cursor: default; }
  .opt app-icon { --icon-size: 20px; }
  .opt.ok app-icon { color: var(--ok); }
  .opt.ko app-icon { color: var(--ko); }
  .check { margin-top: var(--s2); }
`;
